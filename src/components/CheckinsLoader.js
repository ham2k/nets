import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { selectNetsMetadata, getNetSubscription } from '../data/netlogger'

import './CheckinsLoader.css'

const RELOAD_INTERVAL = 120

/* ================================================================================================================== */
export default function CheckinsLoader({ net, operator }) {
  const meta = { loading: false } //useSelector(selectNetsMetadata)

  const dispatch = useDispatch()

  useEffect(() => {
    console.log(`Loading checkins for ${net.NetName}`)
    dispatch(getNetSubscription(net.NetName))

    const interval = window.setInterval(() => {
      console.log(`Reloading checkins for ${net.NetName}`)
      dispatch(getNetSubscription(net.NetName))
    }, RELOAD_INTERVAL * 1000)

    return () => {
      interval && clearInterval(interval)
    }
  }, [dispatch, net.NetName]) // run once

  return (
    <div className="CheckinsLoader">
      <div>
        {meta.loading ? (
          <button disabled={true}>Loading…</button>
        ) : (
          <button onClick={() => dispatch(getNetSubscription(net.NetName))}>Refresh</button>
        )}
      </div>
    </div>
  )
}
