import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { selectMeta, getInitialData, refreshNets } from '../data/netlogger'

import './NetsLoader.css'

const RELOAD_INTERVAL = 30

/* ================================================================================================================== */
export default function NetsLoader() {
  const meta = useSelector(selectMeta)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getInitialData())

    const interval = window.setInterval(() => {
      dispatch(refreshNets())
    }, RELOAD_INTERVAL * 1000)

    return () => {
      interval && clearInterval(interval)
    }
  }, [dispatch]) // run once

  return (
    <div className="NetsLoader">
      {meta.lastUpdated && (
        <span>Servers last updated: {new Date(meta.lastUpdated).toLocaleTimeString([], { timeStyle: 'short' })}</span>
      )}
      {meta.isLoading && <span>Loading…</span>}
    </div>
  )
}
