import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import MockDate from 'mockdate'
import fs from 'fs'

import { getNetsFromNetlogger } from './nets'

const activeNetsXml = fs.readFileSync('src/store/samples/ActiveNets.xml', 'ascii')

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Get Active Nets', () => {
  let now = new Date()

  beforeEach(() => {
    fetch.resetMocks()
    fetch.mockIf('http://www.netlogger.org/api/GetActiveNets.php', activeNetsXml)
    MockDate.set(now)
  })

  afterEach(() => {
    MockDate.reset()
  })

  test('Loads ADIF URIs and adds them to the store', async () => {
    const store = mockStore({ logs: {} })

    return store.dispatch(getNetsFromNetlogger()).then(() => {
      const [loadingAction, listAction, loadedAction] = store.getActions()

      expect(loadingAction.type).toBe('nets/setNetsMetadata')
      expect(loadingAction.payload).toEqual({ loading: true, error: undefined })

      expect(listAction.type).toBe('nets/setNetsList')
      expect(listAction.payload.nets.length).toBe(11)
      expect(listAction.payload.nets[2].server).toBe('NETLOGGER')
      expect(listAction.payload.nets[2].name).toBe('NATA 40m Net')
      expect(listAction.payload.nets[2].netControl).toBe('KI4YTV')

      expect(listAction.payload.nets[9].server).toBe('NETLOGGER3')
      expect(listAction.payload.nets[9].name).toBe('3905 40m SSB Early Net')
      expect(listAction.payload.nets[9].netControl).toBe('KR9G')

      expect(loadedAction.type).toBe('nets/setNetsMetadata')
      expect(loadedAction.payload).toEqual({
        loading: false,
        error: undefined,
        copyright: 'The NetLogger System 2021',
        generatedOn: 'Thu 02/18/2021 23:35:32',
        timezone: 'UTC',
        retrievedOn: now,
      })
    })
  })
})
