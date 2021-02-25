import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import MockDate from 'mockdate'
import fs from 'fs'

import { getNetsFromNetlogger, getCheckinsFromNetlogger } from './nets'

const activeNetsXml = fs.readFileSync('src/store/samples/ActiveNets.xml', 'ascii')
const nataCheckinsXml = fs.readFileSync('src/store/samples/NetCheckinsNATA.xml', 'ascii')

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Get Active Nets', () => {
  let now = new Date()

  beforeEach(() => {
    fetch.resetMocks()
    fetch.mockIf('/cors-proxy/http://www.netlogger.org/api/GetActiveNets.php', activeNetsXml)
    MockDate.set(now)
  })

  afterEach(() => {
    MockDate.reset()
  })

  test('Loads Active Nets and adds them to the store', async () => {
    const store = mockStore({ logs: {} })

    return store.dispatch(getNetsFromNetlogger()).then(() => {
      const [loadingAction, listAction, loadedAction] = store.getActions()

      expect(loadingAction.type).toBe('nets/setNetsMetadata')
      expect(loadingAction.payload).toEqual({ loading: true, error: undefined })

      expect(listAction.type).toBe('nets/setNetsList')
      expect(listAction.payload.nets.length).toBe(11)
      expect(listAction.payload.nets[2].serverName).toBe('NETLOGGER')
      expect(listAction.payload.nets[2].name).toBe('NATA 40m Net')
      expect(listAction.payload.nets[2].netControl).toBe('KI4YTV')

      expect(listAction.payload.nets[9].serverName).toBe('NETLOGGER3')
      expect(listAction.payload.nets[9].name).toBe('3905 40m SSB Early Net')
      expect(listAction.payload.nets[9].netControl).toBe('KR9G')

      expect(loadedAction.type).toBe('nets/setNetsMetadata')
      expect(loadedAction.payload).toEqual({
        loading: false,
        error: undefined,
        copyright: 'The NetLogger System 2021',
        generatedOn: '2021-02-18T23:35:32.000Z',
        timezone: 'UTC',
        retrievedOn: now.toISOString(),
      })
    })
  })
})

describe('Get Checkins', () => {
  let now = new Date()

  beforeEach(() => {
    fetch.resetMocks()
    fetch.mockIf(
      '/cors-proxy/http://www.netlogger.org/api/GetCheckins.php?ServerName=NETLOGGER&NetName=NATA+40m+Net',
      nataCheckinsXml
    )
    MockDate.set(now)
  })

  test('Loads Net Checkins and adds them to the store', async () => {
    const store = mockStore({ logs: {} })

    return store.dispatch(getCheckinsFromNetlogger({ name: 'NATA 40m Net', serverName: 'NETLOGGER' })).then(() => {
      const [loadingAction, listAction, loadedAction] = store.getActions()

      expect(loadingAction.type).toBe('nets/setNetsMetadata')
      expect(loadingAction.payload).toEqual({ loading: true, error: undefined })

      expect(listAction.type).toBe('nets/setCheckins')
      expect(listAction.payload.name).toBe('NATA 40m Net')
      expect(listAction.payload.checkins.length).toBe(63)
      expect(listAction.payload.checkins[2].callsign).toBe('AD0LV')
      expect(listAction.payload.checkins[2].state).toBe('CO')

      expect(listAction.payload.checkins[55].callsign).toBe('W9TLV')
      expect(listAction.payload.checkins[55].state).toBe('IL')

      expect(loadedAction.type).toBe('nets/setNetsMetadata')
      expect(loadedAction.payload).toEqual({
        loading: false,
        error: undefined,
      })
    })
  })
})
