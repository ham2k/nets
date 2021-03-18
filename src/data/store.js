import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import netloggerReducer from '../data/netlogger'
import settingsReducer from '../data/settings'
import logsReducer from '../data/logs'
import qrzReducer from '../data/qrz'
import uiReducer from '../data/ui'

const rootReducer = combineReducers({
  netlogger: netloggerReducer,
  settings: settingsReducer,
  logs: logsReducer,
  qrz: qrzReducer,
  ui: uiReducer,
})

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
    immutableCheck: false,
  }),
})

export const testStore = configureStore({
  reducer: rootReducer,
})

export const persistor = persistStore(store)
