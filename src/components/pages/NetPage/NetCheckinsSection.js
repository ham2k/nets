import React, { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { Container, Grid, makeStyles, Paper } from '@material-ui/core'
import GroupIcon from '@material-ui/icons/Group'
import { netSelector, netCheckinsSelector, netLocalSelector } from '../../../data/netlogger'
import { upcasedCallsignSelector, huntingSelector } from '../../../data/settings'
import { logSelector } from '../../../data/logs'

import CheckinCard from '../../checkins/CheckinCard'

import './Checkins.css'
import NetControls from './components/NetControls'

import baseStyles from './styles'

const useStyles = makeStyles((theme) => ({
  ...baseStyles(theme),

  root: {
    overflowY: 'auto',
  },
}))

function CollapsedNetCheckinsSection({ slug, className, currentView, onViewChange, operatingRef, operatorRef }) {
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
    <div className={classNames(className, classes.root, `view-${currentView}`)}>
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
    </div>
  )
}

function ExpandedNetCheckinsSection({ slug, className, currentView, onViewChange, operatingRef, operatorRef }) {
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
    <>
      <Paper square elevation={3} className={classes.sectionHeaderOuter}>
        <Container maxWidth="md" className={classes.sectionHeader}>
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
        </Container>
      </Paper>

      <div className={classNames(className, classes.root, `view-${currentView}`)}>
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
      </div>
    </>
  )
}

export default function NetCheckinsSection(props) {
  const { expanded } = props

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

  const fullProps = { ...props, currentView, onViewChange, operatingRef, operatorRef }

  if (expanded) {
    return ExpandedNetCheckinsSection(fullProps)
  } else {
    return CollapsedNetCheckinsSection(fullProps)
  }
}
