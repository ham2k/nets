import { setServerList, setServerInfo, addNets, addNetData, setMetadata } from './netloggerSlice'

const SERVER_LIST_URL = 'http://www.netlogger.org/downloads/ServerList.txt'
const NETLOGGER_PROTOCOL_VERSION = '2.3'
const NETLOGGER_APP_VERSION = 'v3.1.7x'

/* ================================================================================================================== */
export const getInitialData = () => (dispatch) => {
  const url = new URL(SERVER_LIST_URL)

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
  'Band',
  'Mode',
  'ImEnable',
  'DefaultInterval',
  'AltNetName',
  'EMPTY',
  'SubscriberCount',
]

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
      const netData = parseNetDatastream(bodyText, net)
      dispatch(addNetData({ NetName: netName, ...netData }))
    })
}

/* ================================================================================================================== */
function parseNetDatastream(bodyText, net) {
  const checkins = parseNetCheckins(bodyText)
  const monitors = parseNetMonitors(bodyText)
  const ims = parseNetIMs(bodyText)
  const newNetInfo = parseNetInfo(bodyText)
  return { checkins, monitors, ims, ...newNetInfo }
}

const CHECKIN_LIST_FIELDS = [
  'SerialNo',
  'Callsign',
  'City',
  'State',
  'Name',
  'Remarks',
  'QSLInfo',
  '_timestamp',
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

function parseNetInfo(bodyText) {
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
  }

  return net
}
