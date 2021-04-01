import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { IconButton } from '@material-ui/core'
import ReplayIcon from '@material-ui/icons/Replay'

import { refreshNetData } from '../../data/netlogger'

const RELOAD_INTERVAL = 20

/* ================================================================================================================== */
export default function CheckinsLoader({ net, operator }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshNetData(net.slug))

    const interval = window.setInterval(() => {
      if (net.status === 'active') {
        dispatch(refreshNetData(net.slug))
      }
    }, RELOAD_INTERVAL * 1000)

    return () => {
      interval && clearInterval(interval)
    }
  }, [dispatch, net.slug, net.status]) // run once

  return (
    <IconButton onClick={() => dispatch(refreshNetData(net.slug))} disabled={net.isLoading}>
      <ReplayIcon />
    </IconButton>
  )
}
