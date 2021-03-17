import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'

import { metaSelector, getInitialData, activeNetsSelector, refreshNets } from '../../data/netlogger'

const RELOAD_INTERVAL = 60

/* ================================================================================================================== */
export default function NetsLoader() {
  const meta = useSelector(metaSelector())
  const nets = useSelector(activeNetsSelector())

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
    <section className="NetsLoader normal-content content-60 flex-row-baseline">
      {meta.isLoading ? (
        <h3>Refreshing…</h3>
      ) : (
        <>
          <h3>
            {nets.length || 0} Active nets as of{' '}
            {new Date(meta.lastUpdated).toLocaleTimeString([], { timeStyle: 'short' })}
          </h3>
          <button onClick={() => dispatch(refreshNets())} disabled={meta.isLoading}>
            <FontAwesomeIcon icon={faSyncAlt} />
          </button>
        </>
      )}
    </section>
  )
}
