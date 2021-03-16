import { createSlice } from '@reduxjs/toolkit'

export const qrzSlice = createSlice({
  name: 'qrz',

  initialState: {
    meta: {},
  },

  reducers: {
    setMeta: (state, { payload }) => {
      state.meta = { ...state.meta, ...payload }
    },
  },
})

export const { setMeta } = qrzSlice.actions

export const metaSelector = () => (state) => state.netlogger.meta

export default qrzSlice.reducer
