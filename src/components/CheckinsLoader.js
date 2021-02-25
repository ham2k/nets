import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { selectNetsMetadata, getCheckinsFromNetlogger } from '../store/nets'

import './CheckinsLoader.css'

const RELOAD_INTERVAL = 120

/* ================================================================================================================== */
export default function CheckinsLoader({ net }) {
  const meta = useSelector(selectNetsMetadata)

  const dispatch = useDispatch()

  useEffect(() => {
    console.log(`Loading checkins for ${net.name}`)
    dispatch(getCheckinsFromNetlogger(net))

    const interval = window.setInterval(() => {
      console.log(`Reloading checkins for ${net.name}`)
      dispatch(getCheckinsFromNetlogger(net))
    }, RELOAD_INTERVAL * 1000)

    return () => {
      interval && clearInterval(interval)
    }
  }, [dispatch, net]) // run once

  return (
    <div className="CheckinsLoader">
      <div>
        {meta.loading ? (
          <button disabled={true}>Loading…</button>
        ) : (
          <button onClick={() => dispatch(getCheckinsFromNetlogger(net))}>Refresh</button>
        )}
      </div>
    </div>
  )
}
