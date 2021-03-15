import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { refreshNetData } from '../../data/netlogger'

const RELOAD_INTERVAL = 20

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
    <>
      {net.isLoading ? (
        <span>Loading…</span>
      ) : (
        <button onClick={() => dispatch(refreshNetData(net.slug))}>Refresh</button>
      )}
    </>
  )
}
