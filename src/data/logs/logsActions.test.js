import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { loadADIF, loadADIFromUri } from './logsActions'

import setupLogSamples from './samples'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Loading ADIF Files', () => {
  beforeEach(() => {
    fetch.resetMocks()
    setupLogSamples()
  })

  test('Loads ADIF files', async () => {
    const adif = await loadADIF('https://qrz.com/example.adi')

    expect(adif.records[0].call).toBe('KK9A')
  })

  test('Loads ADIF URIs and adds them to the store', async () => {
    const store = mockStore({ logs: {} })

    return store.dispatch(loadADIFromUri({ uri: 'https://qrz.com/example.adi' })).then(() => {
      const actions = store.getActions()
      let action

      action = actions.shift()
      expect(action.type).toBe('logs/setMeta')
      expect(action.payload).toMatchObject({ loading: true })

      action = actions.shift()
      expect(action.type).toBe('logs/loadLog')
      expect(action.payload.name).toBe('Log for Station K0SWE using QRZLogbook')
      expect(action.payload.data.name).toBe('Log for Station K0SWE using QRZLogbook')
      expect(action.payload.data.source).toBe('https://qrz.com/example.adi')
      expect(action.payload.data.records[0].call).toBe('KK9A')

      expect(action.payload.data.lookup['qso/all-bands/all-modes'].callsigns).toStrictEqual({
        KK9A: 1,
        K9IJ: 1,
        WD9DUI: 1,
      })

      expect(action.payload.data.lookup['qsl/all-bands/all-modes'].callsigns).toStrictEqual({
        KK9A: 1,
        K9IJ: 1,
      })

      action = actions.shift()
      expect(action.type).toBe('logs/setMeta')
      expect(action.payload).toMatchObject({ loading: false })

      expect(actions.length).toBe(0)
    })
  })

  test('Loads ADIF URIs and adds them to the store with a name', async () => {
    const store = mockStore({ logs: {} })

    return store.dispatch(loadADIFromUri({ uri: 'https://qrz.com/example.adi', name: 'test log' })).then(() => {
      const actions = store.getActions()
      let action

      action = actions.shift()
      expect(action.type).toBe('logs/setMeta')
      expect(action.payload).toMatchObject({ loading: true })

      action = actions.shift()
      expect(action.type).toBe('logs/loadLog')
      expect(action.payload.name).toBe('test log')
      expect(action.payload.data.name).toBe('test log')
      expect(action.payload.data.source).toBe('https://qrz.com/example.adi')
      expect(action.payload.data.records[0].call).toBe('KK9A')

      action = actions.shift()
      expect(action.type).toBe('logs/setMeta')
      expect(action.payload).toMatchObject({ loading: false })

      expect(actions.length).toBe(0)
    })
  })

  test('Loads Netlogger logs', async () => {
    const store = mockStore({ logs: {} })

    return store.dispatch(loadADIFromUri({ uri: 'https://netlogger.org/example.adi' })).then(() => {
      const actions = store.getActions()
      let action

      action = actions.shift()
      expect(action.type).toBe('logs/setMeta')
      expect(action.payload).toMatchObject({ loading: true })

      action = actions.shift()
      expect(action.type).toBe('logs/loadLog')
      expect(action.payload.name).toBe('Log for Station W2ASD using NetLogger')
      expect(action.payload.data.name).toBe('Log for Station W2ASD using NetLogger')
      expect(action.payload.data.source).toBe('https://netlogger.org/example.adi')
      expect(action.payload.data.records[0].call).toBe('KD8NKY')

      expect(action.payload.data.lookup['qso/all-bands/all-modes'].callsigns).toMatchObject({
        KD8NKY: 1,
        AD0LV: 2,
        KC0CC: 2,
        N9AVJ: 1,
      })

      expect(action.payload.data.lookup['qso/40m/phone'].callsigns).toMatchObject({
        KD8NKY: 1,
        AD0LV: 2,
        KC0CC: 2,
        N9AVJ: 1,
      })

      action = actions.shift()
      expect(action.type).toBe('logs/setMeta')
      expect(action.payload).toMatchObject({ loading: false })

      expect(actions.length).toBe(0)
    })
  })
})
