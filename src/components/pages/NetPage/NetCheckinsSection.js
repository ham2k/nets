import React, { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { Accordion, AccordionDetails, AccordionSummary, Grid, makeStyles, Typography } from '@material-ui/core'
import GroupIcon from '@material-ui/icons/Group'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { netCheckinsSelector, netLocalSelector } from '../../../data/netlogger'
import { upcasedCallsignSelector, huntingSelector } from '../../../data/settings'
import { logSelector } from '../../../data/logs'

import CheckinsList from '../../checkins/CheckinsList'
import NetControls from './components/NetControls'

import baseStyles from '../../../styles/styles'

const useStyles = makeStyles((theme) => ({
  ...baseStyles(theme),
}))

export default function NetCheckinsSection({ net, className, style, expanded, onAccordionChange }) {
  const operatingRef = useRef()
  const operatorRef = useRef()

  const [currentView, setCurrentView] = useState('')
  const onViewChange = useCallback(
    (mode) => {
      if (mode === 'operating') {
        operatingRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (mode === 'operator') {
        operatorRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (mode === 'wanted') {
        if (currentView === 'wanted') setCurrentView('')
        else setCurrentView('wanted')
      } else {
        if (currentView === 'checkins') setCurrentView('')
        else setCurrentView('checkins')
      }
    },
    [currentView]
  )

  const classes = useStyles()

  const hunting = useSelector(huntingSelector())
  const checkins = useSelector(netCheckinsSelector(net.slug))
  const local = useSelector(netLocalSelector(net.slug))
  const operator = useSelector(upcasedCallsignSelector())
  const log = useSelector(logSelector())

  let filteredCheckins
  if (currentView === 'wanted') {
    filteredCheckins = (checkins || []).filter(
      (checkin) =>
        local?.callsignInfo?.[checkin.Callsign]?.wanted ||
        checkin.Callsign === operator ||
        checkin.operating ||
        checkin.statuses.netControl ||
        checkin.statuses.relay
    )
  } else {
    filteredCheckins = checkins || []
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={onAccordionChange}
      className={classNames(
        className,
        classes.sectionRoot,
        'h2k-full-bleed',
        'h2k-overflow-container',
        'h2k-scrollable-vert'
      )}
      style={style}
      square
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.sectionHeader}>
        <GroupIcon className={classes.sectionIcon} />
        <Grid container className={classes.info}>
          {net.isNew ? (
            <Typography variant="h2" style={{ flex: 1 }}>
              You have to save your new net before we can start checking in.
            </Typography>
          ) : (
            <NetControls
              className={classes.netControls}
              net={net}
              checkins={checkins}
              local={local}
              operator={operator}
              onViewChange={onViewChange}
              currentView={currentView}
            />
          )}
        </Grid>
      </AccordionSummary>

      <AccordionDetails className={`view-${currentView}`} style={{ xbackgroundColor: '#d9d9d9' }}>
        <CheckinsList
          className={classes.checkinsList}
          checkins={filteredCheckins}
          net={net}
          hunting={hunting}
          local={local}
          operator={operator}
          log={log}
          operatingRef={operatingRef}
          operatorRef={operatorRef}
        />
      </AccordionDetails>
    </Accordion>
  )
}
