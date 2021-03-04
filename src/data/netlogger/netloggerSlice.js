import { createSlice } from '@reduxjs/toolkit'

export const netloggerSlice = createSlice({
  name: 'netlogger',

  initialState: {
    meta: {},
    serverList: null,
    serverInfo: null,
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
      state.serverInfo = {}
      state.nets = {}
      state.netCheckins = {}
      state.netIms = {}
      state.netMonitors = {}
      state.netExts = {}
    },

    setServerInfo: (state, { payload }) => {
      state.serverInfo[payload.ServerName] = payload
    },

    resetNets: (state) => {
      state.nets = {}
      state.netCheckins = {}
      state.netIms = {}
      state.netMonitors = {}
      state.netExts = {}
    },

    addNets: (state, { payload }) => {
      ;(payload || []).forEach((net) => {
        state.nets[net.NetName] = net
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

export const { setMeta, setServerList, setServerInfo, resetNets, addNets, setNetParts } = netloggerSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectMeta = (state) => state.netlogger.meta
export const selectNets = (state) => state.netlogger.nets
export const selectServers = (state) => Object.values(state.netlogger.serverInfo || {})
export const selectNet = (name) => (state) => state.netlogger.nets[name]
export const selectNetCheckins = (name) => (state) => state.netlogger.netCheckins[name]

export default netloggerSlice.reducer
