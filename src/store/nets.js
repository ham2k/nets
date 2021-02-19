import { createSlice } from '@reduxjs/toolkit'

export const netsSlice = createSlice({
  name: 'nets',

  initialState: {
    nets: [],
    meta: {},
  },

  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes

    setNetsMetadata: (state, { payload }) => {
      state.meta = { ...state.meta, payload }
    },

    setNetsList: (state, { payload: { nets } }) => {
      state.nets = nets
    },
  },
})

export const { setNetsList, setNetsMetadata } = netsSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
// export const selectCount = (state) => state.counter.value

// export default counterSlice.reducer

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const getNetsFromNetlogger = () => (dispatch) => {
  dispatch(setNetsMetadata({ loading: true, error: undefined }))

  return fetch('http://www.netlogger.org/api/GetActiveNets.php')
    .then((response) => {
      if (response.ok) {
        return response.text()
      } else {
        throw new TypeError('Bad response')
      }
    })
    .then((bodyText) => {
      let nets = []
      let meta = {}

      const xml = new window.DOMParser().parseFromString(bodyText, 'text/xml')
      meta.generatedOn = xml.getElementsByTagName('CreationDateUTC')[0]?.textContent
      meta.timezone = xml.getElementsByTagName('TimeZone')[0]?.textContent
      meta.copyright = xml.getElementsByTagName('Copyright')[0]?.textContent
      meta.retrievedOn = new Date()

      const xmlServers = xml.getElementsByTagName('Server')
      Array.prototype.slice.call(xmlServers).forEach((xmlServer) => {
        const serverName = xmlServer.getElementsByTagName('ServerName')[0]?.textContent
        const xmlNets = xmlServer.getElementsByTagName('Net')
        if (xmlNets.length > 0) {
          nets = nets.concat(
            Array.prototype.slice.call(xmlNets).map((xmlNet) => {
              let net = {}
              net.server = serverName
              net.name = xmlNet.getElementsByTagName('NetName')[0]?.textContent
              net.altName = xmlNet.getElementsByTagName('AltNetName')[0]?.textContent
              net.name = xmlNet.getElementsByTagName('NetName')[0]?.textContent
              net.frequency = xmlNet.getElementsByTagName('Frequency')[0]?.textContent
              net.logger = xmlNet.getElementsByTagName('Logger')[0]?.textContent
              net.netControl = xmlNet.getElementsByTagName('NetControl')[0]?.textContent
              net.date = xmlNet.getElementsByTagName('Date')[0]?.textContent
              net.mode = xmlNet.getElementsByTagName('Mode')[0]?.textContent
              net.band = xmlNet.getElementsByTagName('Band')[0]?.textContent
              net.subscriberCount = xmlNet.getElementsByTagName('SubscriberCount')[0]?.textContent
              return net
            })
          )
        }
      })
      dispatch(setNetsList({ nets }))
      dispatch(setNetsMetadata({ loading: false, error: undefined, ...meta }))
    })
    .catch((error) => {
      console.log('Error retrieving Active Nets from NetLogger', error)
      dispatch(setNetsMetadata({ loading: false, error: 'Unknown error' }))
    })
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectNets = (state) => state.nets.nets
export const selectNetsMetadata = (state) => state.nets.meta

export default netsSlice.reducer
