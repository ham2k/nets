import fs from 'fs'

const ServerList = fs.readFileSync('src/data/netlogger/samples/ServerList.txt', 'ascii')
const ServerInfo0 = fs.readFileSync('src/data/netlogger/samples/GetServerInfo-0.html', 'ascii')
const ServerInfo1 = fs.readFileSync('src/data/netlogger/samples/GetServerInfo-1.html', 'ascii')
const ServerInfo2 = fs.readFileSync('src/data/netlogger/samples/GetServerInfo-2.html', 'ascii')
const NetsInProgress0 = fs.readFileSync('src/data/netlogger/samples/GetNetsInProgress-Empty.html', 'ascii')
const NetsInProgress1 = fs.readFileSync('src/data/netlogger/samples/GetNetsInProgress.html', 'ascii')
const NetsInProgress2 = fs.readFileSync('src/data/netlogger/samples/GetNetsInProgress-Empty.html', 'ascii')
const GraveyardNet = fs.readFileSync('src/data/netlogger/samples/SubscribeToNet.html', 'ascii')

const MOCK_RESPONSES = {
  'ServerList.txt': ServerList,
  'www.netlogger.org/cgi-bin/NetLogger/GetServerInfo.pl': ServerInfo0,
  'www.netlogger1.org/cgi-bin/NetLogger/GetServerInfo.pl': ServerInfo1,
  'www.netlogger2.org/cgi-bin/NetLogger/GetServerInfo.pl': ServerInfo2,
  'www.netlogger.org/cgi-bin/NetLogger/GetNetsInProgress20.php': NetsInProgress0,
  'www.netlogger1.org/cgi-bin/NetLogger/GetNetsInProgress20.php': NetsInProgress1,
  'www.netlogger2.org/cgi-bin/NetLogger/GetNetsInProgress20.php': NetsInProgress2,
  'www.netlogger1.org/cgi-bin/NetLogger/SubscribeToNet.php?ProtocolVersion=2.3&NetName=Graveyard+Net': GraveyardNet,
}

export default function setupNetloggerSamples() {
  fetch.mockIf(/netlogger-proxy/, (req) => {
    const match = Object.keys(MOCK_RESPONSES).find((pattern) => req.url.indexOf(pattern) >= 0)
    if (match) {
      return Promise.resolve(MOCK_RESPONSES[match])
    } else {
      return Promise.resolve('')
    }
  })
}
