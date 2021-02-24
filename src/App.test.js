import React from 'react'
import { render, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import fs from 'fs'

import store from './store'
import App from './App'

const activeNetsXml = fs.readFileSync('src/store/samples/ActiveNets.xml', 'ascii')

describe('App', () => {
  beforeEach(() => {
    fetch.resetMocks()
    fetch.mockIf('/cors-proxy/http://www.netlogger.org/api/GetActiveNets.php', activeNetsXml)
  })

  afterEach(() => {})

  test('Renders the app', async () => {
    let app
    await act(async () => {
      app = render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    })

    expect(app.getByText(/Ham2k/i)).toBeInTheDocument()

    expect(app.getByText(/NATA 40m Net/i)).toBeInTheDocument()
  })
})
