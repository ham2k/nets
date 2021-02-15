import { configureStore } from '@reduxjs/toolkit'
import netsReducer from './nets'

export default configureStore({
  reducer: {
    nets: netsReducer,
  },
})
