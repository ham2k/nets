import { createSlice } from '@reduxjs/toolkit'

export const netloggerSlice = createSlice({
  name: 'netlogger',

  initialState: {
    loading: false,
    serverList: null,
    nets: {},
    serverInfo: null,
  },

  reducers: {
    setServerList: (state, { payload }) => {
      state.serverList = payload
      state.serverInfo = {}
      state.nets = {}
    },

    setServerInfo: (state, { payload }) => {
      state.serverInfo[payload.ServerName] = payload
    },

    addNets: (state, { payload }) => {
      ;(payload || []).forEach((net) => {
        state.nets[net.NetName] = net
      })
    },

    setNetsList: (state, { payload: { nets } }) => {
      state.nets = {}
      nets.forEach((net) => (state.nets[net.name] = net))
    },

    addNetData: (state, { payload }) => {
      state.nets[payload.NetName] = { ...state.nets[payload.NetName], ...payload }
    },

    setNetsMetadata: (state, { payload }) => {
      state.meta = { ...state.meta, payload }
    },

    setCheckins: (state, { payload: { name, checkins } }) => {
      state.checkins[name] = checkins
    },

    setMiscAttributes: (state, { payload }) => {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key]
      })
    },
  },
})

export const {
  setServerList,
  setServerInfo,
  addNets,
  setNetsList,
  addNetData,
  setMiscAttributes,
  setCheckins,
} = netloggerSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectNets = (state) => state.netlogger.nets
export const selectServers = (state) => Object.values(state.netlogger.serverInfo || {})
export const selectNet = (name) => (state) => state.netlogger.nets[name]
export const selectNetCheckins = (name) => (state) => state.netlogger.nets[name]?.checkins
export const selectNetsMetadata = (state) => state.netlogger.meta

export default netloggerSlice.reducer
