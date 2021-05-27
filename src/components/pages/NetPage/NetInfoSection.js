import React from 'react'

import { Container, makeStyles, Paper, Typography } from '@material-ui/core'

import InfoIcon from '@material-ui/icons/Info'

import baseStyles from './styles'
import CheckinsLoader from '../../checkins/CheckinsLoader'

const useStyles = makeStyles((theme) => ({
  ...baseStyles(theme),

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

function ExpandedNetInfoSection({ net, className, onViewChange, currentView }) {
  const classes = useStyles()

  return (
    <Paper square elevation={3} className={classes.sectionHeaderOuter}>
      <Container className={classes.sectionHeader} maxWidth="md">
        <InfoIcon className={classes.sectionIcon} />

        <Typography variant="h2">
          {net.Band} • {net.Frequency} MHz {net.Mode}
          {' • '}
          <span>Started at {new Date(net.Date).toLocaleTimeString([], { timeStyle: 'short' })}</span>
        </Typography>

        <CheckinsLoader net={net} />
      </Container>
    </Paper>
  )
}

function CollapsedNetInfoSection({ net, className, onViewChange, currentView }) {
  const classes = useStyles()

  return (
    <Paper square elevation={2} className={classes.sectionHeaderOuter}>
      <Container className={classes.sectionHeader} maxWidth="md">
        <InfoIcon className={classes.sectionIcon} />

        <Typography component="div" color="textSecondary" className={classes.secondary}>
          {net.Band} • {net.Frequency} MHz {net.Mode}
          {' • '}
          <span>Started at {new Date(net.Date).toLocaleTimeString([], { timeStyle: 'short' })}</span>
        </Typography>

        <CheckinsLoader net={net} />
      </Container>
    </Paper>
  )
}

export default function NetInfoSection(props) {
  const { expanded } = props

  if (expanded) {
    return ExpandedNetInfoSection(props)
  } else {
    return CollapsedNetInfoSection(props)
  }
}
