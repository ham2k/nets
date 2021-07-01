import fs from 'fs'

const SSBResponse = fs.readFileSync('src/data/qrz/samples/SSB.form', 'ascii')

const MOCK_RESPONSES = {
  'https://logbook.qrz.com/api': SSBResponse,
}

export default function setupQrzSamples() {
  fetch.mockIf(/qrz-proxy/, (req) => {
    const match = Object.keys(MOCK_RESPONSES).find((pattern) => req.url.indexOf(pattern) >= 0)
    if (match) {
      return Promise.resolve(MOCK_RESPONSES[match])
    } else {
      return Promise.resolve('')
    }
  })
}
