import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'settings',

  initialState: {
    callsign: null,
  },

  reducers: {
    setCallsign: (state, { payload }) => {
      state.callsign = payload
    },
  },
})

export const { setCallsign } = settingsSlice.actions

export const selectCallsign = () => (state) => state.settings.callsign
export const selectUpcasedCallsign = () => (state) => (state.settings.callsign || '').toUpperCase()

export default settingsSlice.reducer
