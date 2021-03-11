import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { refreshNetData } from '../data/netlogger'

import './CheckinsLoader.css'

const RELOAD_INTERVAL = 5

/* ================================================================================================================== */
export default function CheckinsLoader({ net, operator }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshNetData(net.NetName))

    const interval = window.setInterval(() => {
      dispatch(refreshNetData(net.NetName))
    }, RELOAD_INTERVAL * 1000)

    return () => {
      interval && clearInterval(interval)
    }
  }, [dispatch, net.NetName]) // run once

  return (
    <div className="CheckinsLoader">
      <div>
        {net.isLoading ? (
          <button disabled={true}>Loading…</button>
        ) : (
          <button onClick={() => dispatch(refreshNetData(net.NetName))}>Refresh</button>
        )}
      </div>
    </div>
  )
}
