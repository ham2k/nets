import { createSlice } from '@reduxjs/toolkit'

export const logsSlice = createSlice({
  name: 'logs',

  initialState: {
    log: {},
    meta: {},
  },

  reducers: {
    setMeta: (state, { payload }) => {
      state.meta = { ...state.meta, ...payload }
    },

    loadLog: (state, { type, payload: { name, data } }) => {
      state.log = data
    },
  },
})

export const { loadLog, setMeta } = logsSlice.actions

export const logSelector = () => (state) => state.logs.log
export const metaSelector = () => (state) => state.logs.meta

export default logsSlice.reducer
