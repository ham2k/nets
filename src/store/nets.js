import { createSlice } from '@reduxjs/toolkit'

export const netsSlice = createSlice({
  name: 'nets',

  initialState: {
    netNames: [],
    nets: {},
    checkins: {},
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
      state.netNames = nets.map((net) => net.name)
      state.nets = {}
      nets.forEach((net) => (state.nets[net.name] = net))
    },

    setCheckins: (state, { payload: { name, checkins } }) => {
      state.checkins[name] = checkins
    },
  },
})

export const { setNetsList, setNetsMetadata, setCheckins } = netsSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectNets = (state) => state.nets.nets
export const selectNet = (name) => (state) => state.nets.nets[name]
export const selectNetCheckins = (name) => (state) => state.nets.checkins[name]
export const selectNetsMetadata = (state) => state.nets.meta

// export default counterSlice.reducer

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const getNetsFromNetlogger = () => (dispatch) => {
  dispatch(setNetsMetadata({ loading: true, error: undefined }))

  return fetch('/cors-proxy/http://www.netlogger.org/api/GetActiveNets.php')
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
      if (!meta.generatedOn) {
        dispatch(setNetsMetadata({ loading: false, error: 'Unexpected contents' }))
        return
      }

      meta.timezone = xml.getElementsByTagName('TimeZone')[0]?.textContent
      meta.generatedOn = new Date(Date.parse(`${meta.generatedOn} ${meta.timezone}`)).toISOString()
      meta.copyright = xml.getElementsByTagName('Copyright')[0]?.textContent
      meta.retrievedOn = new Date().toISOString()

      const xmlServers = xml.getElementsByTagName('Server')
      Array.prototype.slice.call(xmlServers).forEach((xmlServer) => {
        const serverName = xmlServer.getElementsByTagName('ServerName')[0]?.textContent
        const xmlNets = xmlServer.getElementsByTagName('Net')
        if (xmlNets.length > 0) {
          nets = nets.concat(
            Array.prototype.slice.call(xmlNets).map((xmlNet) => {
              let net = {}
              net.serverName = serverName
              net.name = xmlNet.getElementsByTagName('NetName')[0]?.textContent
              net.altName = xmlNet.getElementsByTagName('AltNetName')[0]?.textContent
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

export const getCheckinsFromNetlogger = (net) => (dispatch) => {
  dispatch(setNetsMetadata({ loading: true, error: undefined }))
  const { name, serverName } = net

  const url = new URL('http://www.netlogger.org/api/GetCheckins.php')
  url.searchParams.append('ServerName', serverName)
  url.searchParams.append('NetName', name)

  return fetch(`/cors-proxy/${url}`)
    .then((response) => {
      if (response.ok) {
        return response.text()
      } else {
        throw new TypeError('Bad response')
      }
    })
    .then((bodyText) => {
      const xml = new window.DOMParser().parseFromString(bodyText, 'text/xml')
      let generatedOn = xml.getElementsByTagName('CreationDateUTC')[0]?.textContent
      if (!generatedOn) {
        dispatch(setNetsMetadata({ loading: false, error: 'Unexpected contents' }))
        return
      }

      let timezone = xml.getElementsByTagName('TimeZone')[0]?.textContent
      generatedOn = new Date(Date.parse(`${generatedOn} ${timezone}`)).toISOString()
      // let retrievedOn = new Date().toISOString()

      const xmlCheckins = xml.getElementsByTagName('Checkin')
      let checkins = Array.prototype.slice.call(xmlCheckins).map((xmlCheckin) => {
        let checkin = {}
        checkin.serial = parseInt(xmlCheckin.getElementsByTagName('SerialNo')[0]?.textContent, 10)
        checkin.status = xmlCheckin.getElementsByTagName('Status')[0]?.textContent
        checkin.callsign = xmlCheckin.getElementsByTagName('Callsign')[0]?.textContent
        checkin.name = xmlCheckin.getElementsByTagName('FirstName')[0]?.textContent
        checkin.dxcc = parseInt(xmlCheckin.getElementsByTagName('DXCC')[0]?.textContent, 10)
        checkin.country = xmlCheckin.getElementsByTagName('Country')[0]?.textContent
        checkin.state = xmlCheckin.getElementsByTagName('State')[0]?.textContent
        checkin.county = xmlCheckin.getElementsByTagName('County')[0]?.textContent
        checkin.city = xmlCheckin.getElementsByTagName('CityCountry')[0]?.textContent
        checkin.zip = xmlCheckin.getElementsByTagName('Zip')[0]?.textContent
        checkin.street = xmlCheckin.getElementsByTagName('Street')[0]?.textContent
        checkin.remarks = xmlCheckin.getElementsByTagName('Remarks')[0]?.textContent
        checkin.qslInfo = xmlCheckin.getElementsByTagName('QSLInfo')[0]?.textContent
        checkin.preferredName = xmlCheckin.getElementsByTagName('PreferredName')[0]?.textContent
        checkin.grid = xmlCheckin.getElementsByTagName('Grid')[0]?.textContent
        checkin.memberId = xmlCheckin.getElementsByTagName('MemberID')[0]?.textContent
        return checkin
      })
      dispatch(setCheckins({ name, checkins }))
      dispatch(setNetsMetadata({ loading: false, error: undefined }))
    })
    .catch((error) => {
      console.log('Error retrieving Checkins from NetLogger', error)
      dispatch(setNetsMetadata({ loading: false, error: 'Unknown error' }))
    })
}

export default netsSlice.reducer
