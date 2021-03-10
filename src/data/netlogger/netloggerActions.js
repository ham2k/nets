import { setMeta, setServerList, setServerInfo, addNets, setNetParts } from './netloggerSlice'

const SERVER_LIST_URL = 'http://www.netlogger.org/downloads/ServerList.txt'
const NETLOGGER_PROTOCOL_VERSION = '2.3'
const NETLOGGER_APP_VERSION = 'v3.1.7x'

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
        debugger
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
          net[field] = parts.shift()
        })

        if (net.Date) {
          const parts = net.Date.match(TWO_DIGIT_REGEX)
          net.Date = `${parts[0]}${parts[1]}-${parts[2]}-${parts[3]} ${parts[4]}:${parts[5]}:${parts[6]} UTC`
        }

        nets.push(net)
      }
    })
  }

  return nets
}

/* ================================================================================================================== */
export const getNetSubscription = (netName) => (dispatch, getState) => {
  const net = getState()?.netlogger?.nets?.[netName]
  if (!net) return

  dispatch(setNetParts({ NetName: netName, data: { isLoading: true } }))

  const url = new URL(`${net.ServerHost}/cgi-bin/NetLogger/SubscribeToNet.php`)
  url.searchParams.append('ProtocolVersion', NETLOGGER_PROTOCOL_VERSION)
  url.searchParams.append('NetName', netName)
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
      dispatch(setNetParts({ NetName: netName, data, checkins, ims, monitors, exts }))
    })
}

/* ================================================================================================================== */
export const refreshNetData = (netName) => (dispatch, getState) => {
  const net = getState()?.netlogger?.nets?.[netName]
  if (!net) return

  dispatch(setNetParts({ NetName: netName, data: { isLoading: true } }))

  const url = new URL(`${net.ServerHost}/cgi-bin/NetLogger/GetUpdates3.php`)
  url.searchParams.append('ProtocolVersion', NETLOGGER_PROTOCOL_VERSION)
  url.searchParams.append('NetName', netName)
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
      dispatch(setNetParts({ NetName: netName, data, checkins, ims, monitors, exts }))
    })
}

/* ================================================================================================================== */
function parseNetDatastream(bodyText, net) {
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
          net[name] = values.join('=')
        }
      }
    })

    if (net.Date) net.Date = `${net.Date} UTC`
  }

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
            checkin[field] = parts.shift()
          })

          checkin.statuses = {}
          checkin.Status.split(',').forEach((status) => (checkin.statuses[status] = true))

          if (checkin.Callsign) checkin.Callsign = checkin.Callsign.toUpperCase()
          if (checkin.Timestamp) checkin.Timestamp = `${checkin.Timestamp} UTC`

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
          NamePlusVersion: parts[0],
          IPAddress: parts[1],
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
          ID: parts[0],
          Name: parts[1],
          Flag: parts[2],
          Message: parts[3],
          Timestamp: parts[4],
          IPAddress: parts[5],
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
          Timestamp: parts[0],
          Unknown1: parts[1],
          Name: parts[2],
          Unknown2: parts[3],
          Unknown3: parts[4],
          ID: parts[5],
        }
        exts.push(ext)
      }
    })
  }

  return exts
}
