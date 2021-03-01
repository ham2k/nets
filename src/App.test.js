import React from 'react'
import { render, act } from '@testing-library/react'
import { Provider } from 'react-redux'

import store from './data/store'
import App from './App'

import setupNetloggerSamples from './data/netlogger/samples'

describe('App', () => {
  beforeEach(() => {
    fetch.resetMocks()
    setupNetloggerSamples()
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

    expect(app.getByText(/ARTS W4CN weekly 2m SSB net/i)).toBeInTheDocument()
  })
})
