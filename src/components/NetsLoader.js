import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { selectNetsMetadata, getNetsFromNetlogger } from '../store/nets'

import './NetsLoader.css'

const RELOAD_INTERVAL = 20

export default function NetsLoader() {
  const meta = useSelector(selectNetsMetadata)

  const dispatch = useDispatch()

  useEffect(() => {
    console.log('Loading nets')
    dispatch(getNetsFromNetlogger())

    const interval = window.setInterval(() => {
      console.log('Reloading nets')
      dispatch(getNetsFromNetlogger())
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
          <button onClick={() => dispatch(getNetsFromNetlogger())}>Refresh</button>
        )}
      </div>
    </div>
  )
}
