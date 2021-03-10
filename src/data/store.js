import { configureStore } from '@reduxjs/toolkit'
import netloggerReducer from '../data/netlogger'
import settingsReducer from '../data/settings'

export default configureStore({
  reducer: {
    netlogger: netloggerReducer,
    settings: settingsReducer,
  },
})
