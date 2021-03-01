import { configureStore } from '@reduxjs/toolkit'
import netloggerReducer from '../data/netlogger'

export default configureStore({
  reducer: {
    netlogger: netloggerReducer,
  },
})
