import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { selectNetsMetadata, getInitialData, refreshNets } from '../data/netlogger'

import './NetsLoader.css'

const RELOAD_INTERVAL = 120

/* ================================================================================================================== */
export default function NetsLoader() {
  const meta = { loading: false } //useSelector(selectNetsMetadata)

  const dispatch = useDispatch()

  useEffect(() => {
    console.log('Loading nets')
    dispatch(getInitialData())

    const interval = window.setInterval(() => {
      console.log('Reloading nets')
      dispatch(refreshNets())
    }, RELOAD_INTERVAL * 1000)

    return () => {
      interval && clearInterval(interval)
    }
  }, [dispatch]) // run once

  return (
    <div className="NetsLoader">
      <div>
        {meta.loading ? (
          <button disabled={true}>Loading…</button>
        ) : (
          <button onClick={() => dispatch(refreshNets())}>Refresh</button>
        )}
      </div>
    </div>
  )
}
