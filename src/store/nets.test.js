import { getNetsFromNetlogger } from './nets'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import fs from 'fs'

const activeNetsXml = fs.readFileSync('src/store/samples/ActiveNets.xml', 'ascii')

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Get Active Nets', () => {
  beforeEach(() => {
    fetch.resetMocks()
    fetch.mockIf('http://www.netlogger.org/api/GetActiveNets.php', activeNetsXml)
  })
  test('Loads ADIF URIs and adds them to the store', async () => {
    const store = mockStore({ logs: {} })

    return store.dispatch(getNetsFromNetlogger()).then(() => {
      const action = store.getActions()[0]
      expect(action.type).toBe('nets/setNets')
      expect(action.payload.nets.length).toBe(11)
      expect(action.payload.nets[2].name).toBe('NATA 40m Net')
      expect(action.payload.nets[2].netControl).toBe('KI4YTV')
      expect(action.payload.nets[9].name).toBe('3905 40m SSB Early Net')
      expect(action.payload.nets[9].netControl).toBe('KR9G')
    })
  })
})
