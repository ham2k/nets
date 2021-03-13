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
    netLocal: {},
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
          if (!payload.find((net) => net.slug === slug)) {
            delete state.nets[slug]
            if (state.netCheckins?.[slug]) delete state.netCheckins[slug]
            if (state.netIMs?.[slug]) delete state.netIMs[slug]
            if (state.netMonitors?.[slug]) delete state.netMonitors[slug]
            if (state.netExts?.[slug]) delete state.netExts[slug]
            if (state.netLocal?.[slug]) delete state.netLocal[slug]
          }
        }
      })

      /* Then add each new net back into the list */
      payload.forEach((net) => {
        state.nets[net.slug] = net
        state.netCheckins = state.netCheckins || {}
        state.netCheckins[net.slug] = state.netCheckins[net.slug] || []

        state.netIMs = state.netIMs || {}
        state.netIMs[net.slug] = state.netIMs[net.slug] || []

        state.netMonitors = state.netMonitors || {}
        state.netMonitors[net.slug] = state.netMonitors[net.slug] || []

        state.netExts = state.netExts || {}
        state.netExts[net.slug] = state.netExts[net.slug] || []

        state.netLocal = state.netLocal || {}
        state.netLocal[net.slug] = state.netLocal[net.slug] || {}
      })
    },

    setNetParts: (state, { payload: { slug, data, checkins, ims, monitors, exts, local } }) => {
      if (data) state.nets[slug] = { ...state.nets[slug], ...data }
      if (checkins) state.netCheckins[slug] = checkins
      if (ims) state.netIMs[slug] = ims
      if (monitors) state.netMonitors[slug] = monitors
      if (exts) state.netExts[slug] = exts
      if (local) state.netLocal[slug] = { ...state.netLocal[slug], ...local }
    },

    setNetLocalCallsignInfo: (state, { payload: { net, slug, info } }) => {
      slug = slug || net?.slug

      state.netLocal[slug] = state.netLocal[slug] || {}
      state.netLocal[slug].callsignInfo = { ...state.netLocal[slug].callsignInfo, ...info }
    },
  },
})

export const {
  setMeta,
  setServerList,
  setServerInfo,
  addNets,
  setNetParts,
  setNetLocalCallsignInfo,
} = netloggerSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const metaSelector = () => (state) => state.netlogger.meta
export const netsSelector = () => (state) => state.netlogger.nets
export const serversSelector = () => (state) => Object.values(state.netlogger.serverInfo || {})
export const netSelector = (slug) => (state) => state.netlogger.nets?.[slug]
export const netCheckinsSelector = (slug) => (state) => state.netlogger.netCheckins?.[slug]
export const netLocalSelector = (slug) => (state) => state.netlogger.netLocal?.[slug]
export const netLocalCallsignInfoSelector = (slug) => (state) => state.netlogger.netLocal?.[slug]?.callsignInfo

export default netloggerSlice.reducer
