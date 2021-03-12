import { createSlice } from '@reduxjs/toolkit'

export const netloggerSlice = createSlice({
  name: 'netlogger',

  initialState: {
    meta: {},
    serverList: null,
    serverInfo: {},
    nets: {},
    netCheckins: {},
    netIMs: {},
    netMonitors: {},
    netExts: {},
  },

  reducers: {
    setMeta: (state, { payload }) => {
      state.meta = { ...state.meta, ...payload }
    },

    setServerList: (state, { payload }) => {
      state.serverList = payload
    },

    setServerInfo: (state, { payload }) => {
      state.serverInfo[payload.ServerName] = payload
    },

    addNets: (state, { payload }) => {
      payload = payload || []

      /* First delete any existing nets from the same server */
      const serverName = payload[0]?.ServerName
      Object.keys(state.nets).forEach((slug) => {
        if (state.nets[slug]?.ServerName === serverName) {
          delete state.nets[slug]
        }
      })

      /* Then add each new net back into the list */
      payload.forEach((net) => {
        state.nets[net.slug] = net
      })
    },

    setNetParts: (state, { payload: { slug, data, checkins, ims, monitors, exts } }) => {
      if (data) state.nets[slug] = { ...state.nets[slug], ...data }
      if (checkins) state.netCheckins[slug] = checkins
      if (ims) state.netIMs[slug] = ims
      if (monitors) state.netMonitors[slug] = monitors
      if (exts) state.netExts[slug] = exts
    },
  },
})

export const { setMeta, setServerList, setServerInfo, addNets, setNetParts } = netloggerSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const metaSelector = () => (state) => state.netlogger.meta
export const netsSelector = () => (state) => state.netlogger.nets
export const serversSelector = () => (state) => Object.values(state.netlogger.serverInfo || {})
export const netSelector = (name) => (state) => state.netlogger.nets[name]
export const netCheckinsSelector = (name) => (state) => state.netlogger.netCheckins[name]

export default netloggerSlice.reducer
