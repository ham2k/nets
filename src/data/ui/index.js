import { createSlice } from '@reduxjs/toolkit'

export const uiSlice = createSlice({
  name: 'ui',

  initialState: {
    currentSlug: undefined,
  },

  reducers: {
    setUI: (state, { payload }) => {
      Object.keys(payload).forEach((key) => (state[key] = payload[key]))
    },
  },
})

export const { setUI } = uiSlice.actions

export const uiSelector = () => (state) => state.ui || {}

export default uiSlice.reducer
