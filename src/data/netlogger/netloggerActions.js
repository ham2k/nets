import { setMeta, setServerList, setServerInfo, addNets, setNetParts } from './netloggerSlice'
import capitalize from 'lodash/capitalize'
import words from 'lodash/words'
import slugify from 'slugify'

const SERVER_LIST_URL = 'http://www.netlogger.org/downloads/ServerList.txt'
const NETLOGGER_PROTOCOL_VERSION = '2.3'
const NETLOGGER_APP_VERSION = 'v3.1.7x'

const SLUGIFY_OPTIONS = { lower: true, strict: true }

const capitalizeWords = (str) => {
  return words(str || '')
    .map((word) => capitalize(word))
    .join(' ')
}

/* ================================================================================================================== */
export const getInitialData = () => (dispatch) => {
  const url = new URL(SERVER_LIST_URL)
  dispatch(setMeta({ errors: [] }))

  return fetch(`/cors-proxy/${url}`)
    .then((response) => {
      if (response.ok) {
        return response.text()
      } else {
        throw new TypeError('Bad response')
      }
    })
    .then((bodyText) => {
      const servers = parseServerList(bodyText)

      dispatch(setServerList(servers))
      servers.forEach((server) => dispatch(getServerInfo(server)))
    })
}

export const refreshNets = getInitialData

function parseServerList(bodyText) {
  // eslint-disable-next-line no-unused-vars
  const [preamble, data, postamble] = bodyText.split(/\[ServerList\]/m)
  const servers = []
  if (data) {
    data.split(/[\n\r]+/).forEach((line) => {
      const [serverHost, serverPort] = line.split(/\s*\|\s*/)

      if (serverHost && serverPort) {
        servers.push(`http://${serverHost}:${serverPort}`)
      }
    })
  }

  return servers
}

/* ================================================================================================================== */
export const getServerInfo = (serverHost) => (dispatch) => {
  const url = new URL(`${serverHost}/cgi-bin/NetLogger/GetServerInfo.pl`)

  return fetch(`/cors-proxy/${url}`)
    .then((response) => {
      if (response.ok) {
        return response.text()
      } else {
        throw new TypeError('Bad response')
      }
    })
    .then((bodyText) => {
      const serverInfo = parseServerInfo(bodyText)
      serverInfo.ServerHost = serverHost

      if (serverInfo.ServerName) {
        dispatch(setServerInfo(serverInfo))
        dispatch(getNetsList(serverInfo))
        dispatch(setMeta({ lastUpdated: Date.now() }))
      } else {
        console.error(`Incomplete server data for ${serverHost}`, serverInfo)
      }
    })
}

function parseServerInfo(bodyText) {
  // eslint-disable-next-line no-unused-vars
  const [preamble, data, postamble] = bodyText.split(/<!--\s*Server Info (?:Start|End)\s*-->/)
  const server = {}
  if (data) {
    const lines = data.split('|')
    lines.forEach((line) => {
      const [name, value] = line.split('=')
      server[name] = value
    })
  }
  return server
}

/* ================================================================================================================== */
export const getNetsList = (serverInfo) => (dispatch) => {
  const url = new URL(`${serverInfo.ServerHost}/cgi-bin/NetLogger/GetNetsInProgress20.php`)
  url.searchParams.append('ProtocolVersion', NETLOGGER_PROTOCOL_VERSION)

  return fetch(`/cors-proxy/${url}`)
    .then((response) => {
      if (response.ok) {
        return response.text()
      } else {
        throw new TypeError('Bad response')
      }
    })
    .then((bodyText) => {
      const nets = parseNetsList(bodyText, serverInfo)

      dispatch(addNets(nets))
    })
}

const NET_LIST_FIELDS = [
  'NetName',
  'Frequency',
  'Logger',
  'NetControl',
  'Date',
  'Mode',
  'Band',
  'ImEnable',
  'DefaultInterval',
  'AltNetName',
  'EMPTY',
  'SubscriberCount',
]

const TWO_DIGIT_REGEX = /(\d\d)/g

function parseNetsList(bodyText, serverInfo) {
  // eslint-disable-next-line no-unused-vars
  const [preamble, data, postamble] = bodyText.split(/<!--\s*NetLogger (?:Start|End) Data\s*-->/)
  const nets = []
  if (data) {
    const rows = data.split('|~')

    rows.forEach((row) => {
      if (row) {
        const parts = row.split('|')
        const net = {}
        net.ServerHost = serverInfo.ServerHost
        net.ServerName = serverInfo.ServerName

        NET_LIST_FIELDS.forEach((field) => {
          net[field] = parts.shift().trim()
        })

        if (net.Date) {
          const parts = net.Date.match(TWO_DIGIT_REGEX)
          net.Date = `${parts[0]}${parts[1]}-${parts[2]}-${parts[3]} ${parts[4]}:${parts[5]}:${parts[6]} UTC`
        }

        if (net.NetName) net.slug = slugify(net.NetName, SLUGIFY_OPTIONS)

        if (net.Frequency) {
          net.Frequency = net.Frequency.replace(/\s*mhz/gi, '')
        }

        net.status = 'active'

        nets.push(net)
      }
    })
  }

  return nets
}

/* ================================================================================================================== */
export const getNetSubscription = (slug) => (dispatch, getState) => {
  const net = getState()?.netlogger?.nets?.[slug]
  if (!net) return

  dispatch(setNetParts({ slug, data: { isLoading: true } }))

  const url = new URL(`${net.ServerHost}/cgi-bin/NetLogger/SubscribeToNet.php`)
  url.searchParams.append('ProtocolVersion', NETLOGGER_PROTOCOL_VERSION)
  url.searchParams.append('NetName', net.NetName)
  if (net.operator) {
    url.searchParams.append('Callsign', `${net.operator} - ${NETLOGGER_APP_VERSION}`)
  }
  url.searchParams.append('IMSerial', 0)
  url.searchParams.append('LastExtDataSerial', 0)

  return fetch(`/cors-proxy/${url}`)
    .then((response) => {
      if (response.ok) {
        return response.text()
      } else {
        throw new TypeError('Bad response')
      }
    })
    .then((bodyText) => {
      const { data, checkins, ims, monitors, exts } = parseNetDatastream(bodyText, net)
      data.isLoading = false
      dispatch(setNetParts({ slug, data, checkins, ims, monitors, exts }))
    })
}

/* ================================================================================================================== */
export const refreshNetData = (slug) => (dispatch, getState) => {
  const net = getState()?.netlogger?.nets?.[slug]
  if (!net) return

  dispatch(setNetParts({ slug, data: { isLoading: true } }))

  const url = new URL(`${net.ServerHost}/cgi-bin/NetLogger/GetUpdates3.php`)
  url.searchParams.append('ProtocolVersion', NETLOGGER_PROTOCOL_VERSION)
  url.searchParams.append('NetName', net.NetName)
  url.searchParams.append('IMSerial', 0)
  url.searchParams.append('LastExtDataSerial', 0)

  return fetch(`/cors-proxy/${url}`)
    .then((response) => {
      if (response.ok) {
        return response.text()
      } else {
        throw new TypeError('Bad response')
      }
    })
    .then((bodyText) => {
      const { data, checkins, ims, monitors, exts } = parseNetDatastream(bodyText, net)
      data.isLoading = false
      dispatch(setNetParts({ slug, data, checkins, ims, monitors, exts }))
    })
}

/* ================================================================================================================== */
function parseNetDatastream(bodyText, net) {
  if (bodyText.indexOf('*error - Can not get Updates for') >= 0) {
    return { data: { ...net, status: 'ended' } }
  }

  const data = parseNetData(bodyText)
  const checkins = parseNetCheckins(bodyText)
  const ims = parseNetIMs(bodyText)
  const monitors = parseNetMonitors(bodyText)
  const exts = parseNetExts(bodyText)
  return { data, checkins, ims, monitors, exts }
}

function parseNetData(bodyText) {
  // eslint-disable-next-line no-unused-vars
  const [preamble, data, postamble] = bodyText.split(/<!--\s*Net Info (?:Start|End)\s*-->/)
  const net = {}
  if (data) {
    const pairs = data.split('|')

    pairs.forEach((row) => {
      if (row) {
        const [name, ...values] = row.split('=')
        if (name) {
          net[name] = values.join('=').trim()
        }
      }
    })

    if (net.Date) net.Date = `${net.Date} UTC`
    if (net.NetName) net.slug = slugify(net.NetName, SLUGIFY_OPTIONS)
  }

  net.status = 'active'

  return net
}

const CHECKIN_LIST_FIELDS = [
  'SerialNo',
  'Callsign',
  'City',
  'State',
  'Name',
  'Remarks',
  'QSLInfo',
  'Timestamp',
  'County',
  'Grid',
  'Street',
  'Zip',
  'Status',
  'MemberID',
  'Country',
  'DXCC',
  'PreferredName',
]

export const CHECKIN_STATUS_LABELS = {
  '(nc)': 'Net Control',
  '(rel)': 'Relay',
  '(log)': 'Logger',
  '(vip)': 'VIP',
  '(op)': 'Operator',
  '(c/o)': 'Checked out',
  '(n/r)': 'Not Responding',
  '(u)': 'Unavailable',
  '(n/h)': 'Not heard',
  '(p)': 'Portable',
  '(m)': 'Mobile',
}
export const CHECKIN_STATUS_FLAGS = {
  '(nc)': 'netControl',
  '(rel)': 'relay',
  '(log)': 'logger',
  '(vip)': 'vip',
  '(op)': 'operator',
  '(c/o)': 'checkedOut',
  '(n/r)': 'notResponding',
  '(u)': 'unavailable',
  '(n/h)': 'notHeard',
  '(p)': 'portable',
  '(m)': 'mobile',
}

function parseNetCheckins(bodyText) {
  // eslint-disable-next-line no-unused-vars
  const [preamble, data, postamble] = bodyText.split(/<!--\s*NetLogger (?:Start|End) Data\s*-->/)
  const checkins = []
  let operatingSerial = undefined
  if (data) {
    const rows = data.split('|~')

    rows.forEach((row) => {
      if (row) {
        const parts = row.split('|')
        if (parts[0].startsWith('`')) {
          operatingSerial = parts[0].slice(1)
        } else {
          const checkin = {}

          CHECKIN_LIST_FIELDS.forEach((field) => {
            checkin[field] = parts.shift()?.trim()
          })

          checkin.statuses = {}
          checkin.Status.split(',').forEach((status) => {
            status = status.trim()
            if (CHECKIN_STATUS_FLAGS[status]) {
              checkin.statuses[CHECKIN_STATUS_FLAGS[status]] = true
            } else if (status) {
              checkin.statuses.other = checkin.statuses.other || []
              checkin.statuses.other.push(status)
            }
          })

          if (checkin.Callsign) checkin.Callsign = checkin.Callsign.toUpperCase()
          if (checkin.Timestamp) checkin.Timestamp = `${checkin.Timestamp} UTC`
          if (checkin.Name) checkin.Name = capitalizeWords(checkin.Name)
          if (checkin.PreferredName) checkin.PreferredName = capitalizeWords(checkin.PreferredName)
          if (checkin.State) checkin.State = checkin.State.trim()
          if (checkin.State)
            checkin.normalizedState = [checkin.State, checkin.Country || 'United States'].join(' ').toUpperCase()
          if (checkin.Country.toLowerCase() === 'united states') checkin.Country = 'USA'
          else checkin.Country = capitalizeWords(checkin.Country)
          if (checkin.County) checkin.County = capitalizeWords(checkin.County)
          if (checkin.City) checkin.City = capitalizeWords(checkin.City)
          if (checkin.Remarks === '(no club info)') checkin.Remarks = ''
          if (checkin.MemberID && !checkin.MemberID.startsWith('#')) checkin.MemberID = `#${checkin.MemberID}`

          checkins.push(checkin)
        }
      }
    })

    if (operatingSerial) {
      checkins.forEach((checkin) => {
        if (checkin.SerialNo === operatingSerial) {
          checkin.operating = true
        }
      })
    }
  }

  return checkins
}

function parseNetMonitors(bodyText) {
  // eslint-disable-next-line no-unused-vars
  const [preamble, data, postamble] = bodyText.split(/<!--\s*NetMonitors (?:Start|End)\s*-->/)
  const monitors = []
  if (data) {
    const rows = data.split('|~')

    rows.forEach((row) => {
      if (row) {
        const parts = row.split('|')
        const monitor = {
          NamePlusVersion: parts[0]?.trim(),
          IPAddress: parts[1]?.trim(),
        }
        monitors.push(monitor)
      }
    })
  }

  return monitors
}

function parseNetIMs(bodyText) {
  // eslint-disable-next-line no-unused-vars
  const [preamble, data, postamble] = bodyText.split(/<!--\s*IM (?:Start|End)\s*-->/)
  const ims = []
  if (data) {
    const rows = data.split(/[\n\r]+/)

    rows.forEach((row) => {
      if (row) {
        const parts = row.split('|')
        const im = {
          ID: parts[0]?.trim(),
          Name: parts[1]?.trim(),
          Flag: parts[2]?.trim(),
          Message: parts[3]?.trim(),
          Timestamp: parts[4]?.trim(),
          IPAddress: parts[5]?.trim(),
        }

        if (im.Timestamp) {
          const parts = im.Timestamp.match(TWO_DIGIT_REGEX)
          im.Timestamp = `${parts[0]}${parts[1]}-${parts[2]}-${parts[3]} ${parts[4]}:${parts[5]}:${parts[6]} UTC`
        }

        ims.push(im)
      }
    })
  }

  return ims
}

function parseNetExts(bodyText) {
  // eslint-disable-next-line no-unused-vars
  const [preamble, data, postamble] = bodyText.split(/<!--\s*Ext Data (?:Start|End)\s*-->/)
  const exts = []
  if (data) {
    const rows = data.split(/[\n\r]+/)
    rows.forEach((row) => {
      if (row) {
        const parts = row.split('|')
        const ext = {
          Timestamp: parts[0]?.trim(),
          Unknown1: parts[1]?.trim(),
          Name: parts[2]?.trim(),
          Unknown2: parts[3]?.trim(),
          Unknown3: parts[4]?.trim(),
          ID: parts[5]?.trim(),
        }
        exts.push(ext)
      }
    })
  }

  return exts
}

/* ================================================================================================================== */
export const postMessageToNet = (slug, name, message) => (dispatch, getState) => {
  const net = getState()?.netlogger?.nets?.[slug]

  if (!net) return

  const url = new URL(`${net.ServerHost}/cgi-bin/NetLogger/SendInstantMessage.php`)
  const body = new URLSearchParams()
  body.append('NetName', net.NetName)
  body.append('Callsign', name)
  body.append('IsNetControl', 'x')
  body.append('Message', message)

  return fetch(`/cors-proxy/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: body,
  })
    .then((response) => {
      if (response.ok) {
        return response.text()
      } else {
        throw new TypeError('Bad response')
      }
    })
    .then((bodyText) => {
      dispatch(refreshNetData(slug))
    })
}
