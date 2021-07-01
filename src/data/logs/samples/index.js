import fs from 'fs'

const QrzLog = fs.readFileSync('src/data/logs/samples/qrz.adi', 'ascii')
const NetloggerLog = fs.readFileSync('src/data/logs/samples/netlogger.adi', 'ascii')

const MOCK_RESPONSES = {
  'qrz.com/example.adi': QrzLog,
  'netlogger.org/example.adi': NetloggerLog,
}

export default function setupLogSamples() {
  fetch.mockIf(/netlogger-proxy/, (req) => {
    const match = Object.keys(MOCK_RESPONSES).find((pattern) => req.url.indexOf(pattern) >= 0)
    if (match) {
      return Promise.resolve(MOCK_RESPONSES[match])
    } else {
      return Promise.resolve('')
    }
  })
}
