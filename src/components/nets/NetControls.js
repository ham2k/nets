import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { Tabs, Tab, makeStyles } from '@material-ui/core'

import CheckinsLoader from '../checkins/CheckinsLoader'
import { netCheckinsSelector, netLocalSelector } from '../../data/netlogger'
import { upcasedCallsignSelector } from '../../data/settings'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    '& .ci_operating': {
      color: theme.palette.spotting_operating.main,
    },
  },
  tabs: { flex: 1 },
  more: { flex: 1 },
}))

export default function NetControls({ net, className, onViewChange, currentView }) {
  currentView = currentView || 'checkins'

  const classes = useStyles()

  const checkins = useSelector(netCheckinsSelector(net.slug))
  const local = useSelector(netLocalSelector(net.slug))
  const operator = useSelector(upcasedCallsignSelector())

  const onTabChange = useCallback(
    (ev, value) => {
      onViewChange(value)
      ev.stopPropagation()
    },
    [onViewChange]
  )

  const checkinCount = checkins.filter((checkin) => checkin.Callsign).length
  const inactiveCheckinCount = checkins.filter(
    (checkin) =>
      checkin.statuses.checkedOut ||
      checkin.statuses.notResponding ||
      checkin.statuses.unavailable ||
      local?.callsignInfo?.[checkin.Callsign]?.notHeard
  ).length
  const heardCount = checkins.filter((checkin) => local?.callsignInfo?.[checkin.Callsign]?.heard).length

  const currentCheckin = checkins.find((checkin) => checkin.operating)
  const selfCheckin = operator && checkins.find((checkin) => checkin.Callsign === operator)

  let checkinsLabel
  if (inactiveCheckinCount > 0) {
    checkinsLabel = `${checkinCount} checkins, ${inactiveCheckinCount} inactive`
  } else {
    checkinsLabel = `${checkinCount} checkins`
  }

  let heardsLabel = `${heardCount} marked as heard`

  return (
    <div className={classes.root}>
      <Tabs
        className={classes.tabs}
        value={currentView}
        indicatorColor="primary"
        textColor="primary"
        onChange={onTabChange}
        aria-label="disabled tabs example"
      >
        <Tab label={checkinsLabel} value="checkins" />
        <Tab label={heardsLabel} value="heard" />
      </Tabs>

      {net.status !== 'active' && (
        <div>
          <strong>Net has ended</strong>
        </div>
      )}
      {currentCheckin && (
        <div
          className="ci_operating clickable"
          onClick={(ev) => {
            onViewChange && onViewChange('operating')
            ev.stopPropagation()
          }}
        >
          #{currentCheckin.SerialNo}{' '}
          <strong>
            <span className="callsign">{currentCheckin.Callsign}</span>{' '}
            {currentCheckin.PreferredName || currentCheckin.Name}
          </strong>{' '}
          is operating
        </div>
      )}
      {selfCheckin && (
        <div
          className="operator clickable"
          onClick={(ev) => {
            onViewChange && onViewChange('operator')
            ev.stopPropagation()
          }}
        >
          You are #{selfCheckin.SerialNo} <span className="callsign">{selfCheckin.Callsign}</span>
        </div>
      )}
      <div>
        <CheckinsLoader net={net} />
      </div>
    </div>

    //   <section>
    //

    //     <div
    //       className={classNames('tab checkins', currentView === 'checkins' && 'current')}
    //       onClick={(ev) => {
    //         onViewChange && onViewChange('checkins')
    //         ev.stopPropagation()
    //       }}
    //     >
    //       {checkinCount} checkins
    //       {inactiveCheckinCount > 0 ? `, ${checkinCount - inactiveCheckinCount} active` : ''}
    //     </div>

    //     {(heardCount > 0 || currentView === 'heard') && (
    //       <div
    //         className={classNames('tab heard', currentView === 'heard' && 'current')}
    //         onClick={(ev) => {
    //           onViewChange && onViewChange('heard')
    //           ev.stopPropagation()
    //         }}
    //       >
    //         {heardCount} heard
    //       </div>
    //     )}

    //   </section>
    // </div>
  )
}
