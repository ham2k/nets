import React, { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { metaSelector, getInitialData, activeNetsSelector, refreshNets } from '../../data/netlogger'
import { IconButton, Typography } from '@material-ui/core'
import ReplayIcon from '@material-ui/icons/Replay'

const RELOAD_INTERVAL = 60

/* ================================================================================================================== */
export default function NetsLoader({ className, style }) {
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

  const reloadHandler = useCallback(
    (ev) => {
      dispatch(refreshNets())
      ev.stopPropagation()
      ev.preventDefault()
    },
    [dispatch]
  )

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ...style }}>
      {meta.isLoading || !meta.lastUpdated ? (
        <Typography component="h2" color="inherit" noWrap>
          Refreshing…
        </Typography>
      ) : (
        <>
          <Typography component="h2" color="inherit" noWrap>
            {nets.length || 0} Active nets as of{' '}
            {new Date(meta.lastUpdated).toLocaleTimeString([], { timeStyle: 'short' })}
          </Typography>
          <IconButton onClick={reloadHandler} disabled={meta.isLoading}>
            <ReplayIcon />
          </IconButton>
        </>
      )}
    </div>
  )
}
