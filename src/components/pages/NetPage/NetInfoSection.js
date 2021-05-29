import React from 'react'
import classNames from 'classnames'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import CheckinsLoader from '../../checkins/CheckinsLoader'

import baseStyles from './styles'

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

export default function NetInfoSection({ net, className, style, onViewChange, currentView }) {
  const classes = useStyles()

  return (
    <Accordion className={classNames(className, classes.sectionRoot)} style={style} square>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.sectionHeader}>
        <InfoIcon className={classes.sectionIcon} />

        <Typography variant="h2">
          {net.Band} • {net.Frequency} MHz {net.Mode}
          {' • '}
          <span>Started at {new Date(net.Date).toLocaleTimeString([], { timeStyle: 'short' })}</span>
        </Typography>

        <CheckinsLoader net={net} />
      </AccordionSummary>

      <AccordionDetails>
        <h1>Details go here</h1>
      </AccordionDetails>
    </Accordion>
  )
}
