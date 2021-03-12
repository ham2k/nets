import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { refreshNetData } from '../data/netlogger'

import './CheckinsLoader.css'

const RELOAD_INTERVAL = 5

/* ================================================================================================================== */
export default function CheckinsLoader({ net, operator }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshNetData(net.slug))

    const interval = window.setInterval(() => {
      dispatch(refreshNetData(net.slug))
    }, RELOAD_INTERVAL * 1000)

    return () => {
      interval && clearInterval(interval)
    }
  }, [dispatch, net.slug]) // run once

  return (
    <div className="CheckinsLoader">
      <div>
        {net.isLoading ? (
          <button disabled={true}>Loading…</button>
        ) : (
          <button onClick={() => dispatch(refreshNetData(net.slug))}>Refresh</button>
        )}
      </div>
    </div>
  )
}
