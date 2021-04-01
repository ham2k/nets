import React from 'react'
import classNames from 'classnames'
import { Grid, makeStyles, Typography } from '@material-ui/core'

import GroupIcon from '@material-ui/icons/Group'

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
    },
  },
  icon: {
    flex: 0,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
    },
  },
  info: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  secondary: {
    textAlign: 'right',
    [theme.breakpoints.down('md')]: {
      textAlign: 'left',
    },
  },
}))

export default function NetHeader({ net, className, onViewChange, currentView }) {
  const classes = useStyles()

  return (
    <div className={classNames(className, classes.root)}>
      <div className={classes.icon}>
        <GroupIcon fontSize="large" className={classes.icon} />
      </div>
      <Grid container className={classes.info}>
        <Grid item xs={12} md={7}>
          <Typography component="h2" variant="h6" color="inherit" className={classes.title}>
            <span>{net.NetName}</span>
          </Typography>
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography component="div" color="textSecondary" className={classes.secondary}>
            {net.Band} • {net.Frequency} MHz {net.Mode}
            {' • '}
            <span>Started at {new Date(net.Date).toLocaleTimeString([], { timeStyle: 'short' })}</span>
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}
