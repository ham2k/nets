import React from 'react'
import { render, act } from '@testing-library/react'
import { Provider } from 'react-redux'

import { testStore } from './data/store'
import App from './App'

import setupNetloggerSamples from './data/netlogger/samples'
import { MemoryRouter } from 'react-router-dom'

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
        <Provider store={testStore}>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </Provider>
      )
    })

    expect(app.getByRole('banner')).toHaveTextContent(/Ham2K Nets/i)

    expect(app.getByText(/ARTS W4CN weekly 2m SSB net/i)).toBeInTheDocument()
  })
})
