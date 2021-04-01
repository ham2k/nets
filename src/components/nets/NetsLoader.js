import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { metaSelector, getInitialData, activeNetsSelector, refreshNets } from '../../data/netlogger'
import { IconButton, makeStyles, Typography } from '@material-ui/core'
import ReplayIcon from '@material-ui/icons/Replay'
import classNames from 'classnames'

const RELOAD_INTERVAL = 60

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}))

/* ================================================================================================================== */
export default function NetsLoader({ className }) {
  const classes = useStyles()

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
    <div className={classNames(className, classes.root)}>
      {meta.isLoading ? (
        <Typography component="h3" variant="h6" color="inherit" noWrap className={classes.title}>
          Refreshing…
        </Typography>
      ) : (
        <>
          <Typography component="h3" variant="h6" color="inherit" noWrap className={classes.title}>
            {nets.length || 0} Active nets as of{' '}
            {new Date(meta.lastUpdated).toLocaleTimeString([], { timeStyle: 'short' })}
          </Typography>
          <IconButton onClick={() => dispatch(refreshNets())} disabled={meta.isLoading}>
            <ReplayIcon />
          </IconButton>
        </>
      )}
    </div>
  )
}
