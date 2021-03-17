import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { getLogbook } from './qrzActions'
import setupQrzSamples from './samples'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('QRZ API Calls', () => {
  beforeEach(() => {
    fetch.resetMocks()
    setupQrzSamples()
  })

  describe('Get a logbook', () => {
    test('Gets a logbook', (done) => {
      const store = mockStore({})

      store
        .dispatch(getLogbook({ key: '123' }))
        .then(() => {
          setImmediate(() => {
            const actions = store.getActions()

            let action

            action = actions.shift()
            expect(action.type).toBe('qrz/setMeta')
            expect(action.payload).toMatchObject({
              loading: true,
              errors: [],
            })

            action = actions.shift()
            expect(action.type).toBe('logs/loadLog')
            expect(action.payload.data.records[0]).toMatchObject({
              call: 'K2CNN',
            })
            expect(action.payload.data.records[1]).toMatchObject({
              call: 'OL90ROH',
            })

            expect(action.payload.data.records[325]).toMatchObject({
              call: 'ND8F',
            })

            action = actions.shift()
            expect(action.type).toBe('qrz/setMeta')
            expect(action.payload).toMatchObject({
              loading: false,
              errors: [],
            })

            expect(actions).toEqual([])

            done()
          })
        })
        .catch((error) => {
          done(error)
        })
    })
  })
})
