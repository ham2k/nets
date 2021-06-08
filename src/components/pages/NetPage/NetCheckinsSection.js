import React, { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { Accordion, AccordionDetails, AccordionSummary, Grid, makeStyles } from '@material-ui/core'
import GroupIcon from '@material-ui/icons/Group'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { netSelector, netCheckinsSelector, netLocalSelector } from '../../../data/netlogger'
import { upcasedCallsignSelector, huntingSelector } from '../../../data/settings'
import { logSelector } from '../../../data/logs'

import CheckinCard from '../../checkins/CheckinCard'
import NetControls from './components/NetControls'

import './Checkins.css'
import baseStyles from './styles'

const useStyles = makeStyles((theme) => ({
  ...baseStyles(theme),
}))

export default function NetCheckinsSection({ slug, className, style, expanded, onAccordionChange }) {
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
  const [openCheckin, setOpenCheckin] = useState()

  const hunting = useSelector(huntingSelector())
  const net = useSelector(netSelector(slug))
  const checkins = useSelector(netCheckinsSelector(slug))
  const local = useSelector(netLocalSelector(slug))
  const operator = useSelector(upcasedCallsignSelector())
  const log = useSelector(logSelector())

  const passthru = { net, checkins, operator, log, local, hunting }

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
          <NetControls
            className={classes.netControls}
            net={net}
            checkins={checkins}
            local={local}
            operator={operator}
            onViewChange={onViewChange}
            currentView={currentView}
          />
        </Grid>
      </AccordionSummary>

      <AccordionDetails className={`view-${currentView}`}>
        {filteredCheckins.map((checkin, index) => (
          <CheckinCard
            key={checkin.SerialNo}
            {...passthru}
            checkin={checkin}
            index={index}
            isOpen={openCheckin === checkin.SerialNo}
            onClick={() => setOpenCheckin(openCheckin === checkin.SerialNo ? null : checkin.SerialNo)}
            operatingRef={operatingRef}
            operatorRef={operatorRef}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  )
}
