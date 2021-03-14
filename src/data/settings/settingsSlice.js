import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'settings',

  initialState: {
    callsign: null,
    name: null,
    hunting: { states: true, callsigns: true },
  },

  reducers: {
    setCallsign: (state, { payload }) => {
      state.callsign = payload
    },

    setName: (state, { payload }) => {
      state.name = payload
    },

    setHunting: (state, { payload }) => {
      state.hunting = { ...state.hunting, ...payload }
    },
  },
})

export const { setCallsign, setName, setHunting } = settingsSlice.actions

export const callsignSelector = () => (state) => state.settings.callsign || ''
export const upcasedCallsignSelector = () => (state) => (state.settings.callsign || '').toUpperCase()
export const nameSelector = () => (state) => state.settings.name || ''
export const huntingSelector = () => (state) => state.settings.hunting || { states: true, callsigns: true }

export default settingsSlice.reducer
