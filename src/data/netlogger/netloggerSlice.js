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
      ;(payload || []).forEach((net) => {
        state.nets[net.NetName] = { ...state.nets[net.NetName], ...net }
      })
    },

    setNetParts: (state, { payload: { NetName, data, checkins, ims, monitors, exts } }) => {
      if (data) state.nets[NetName] = { ...state.nets[NetName], ...data }
      if (checkins) state.netCheckins[NetName] = checkins
      if (ims) state.netIMs[NetName] = ims
      if (monitors) state.netMonitors[NetName] = monitors
      if (exts) state.netExts[NetName] = exts
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
