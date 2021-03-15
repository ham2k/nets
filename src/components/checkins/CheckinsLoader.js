import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'

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
    <button onClick={() => dispatch(refreshNetData(net.slug))} disabled={net.isLoading}>
      <FontAwesomeIcon icon={faSyncAlt} />
    </button>
  )
}
