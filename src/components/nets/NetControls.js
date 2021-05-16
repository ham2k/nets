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
    alignItems: 'center',
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
    (checkin) => checkin.statuses.checkedOut || checkin.statuses.notResponding || checkin.statuses.unavailable
  ).length
  const wantedCount = checkins.filter((checkin) => local?.callsignInfo?.[checkin.Callsign]?.wanted).length

  const currentCheckin = checkins.find((checkin) => checkin.operating)
  const selfCheckin = operator && checkins.find((checkin) => checkin.Callsign === operator)

  let checkinsLabel
  if (inactiveCheckinCount > 0) {
    checkinsLabel = `${checkinCount} checkins, ${inactiveCheckinCount} inactive`
  } else {
    checkinsLabel = `${checkinCount} checkins`
  }

  let wantedLabel = `${wantedCount} wanted`

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
        <Tab label={wantedLabel} value="wanted" />
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
          className="ci_self clickable"
          onClick={(ev) => {
            onViewChange && onViewChange('operator')
            ev.stopPropagation()
          }}
        >
          &nbsp; You are #{selfCheckin.SerialNo} <span className="callsign">{selfCheckin.Callsign}</span>
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

    //     {(wantedCount > 0 || currentView === 'wanted') && (
    //       <div
    //         className={classNames('tab wanted', currentView === 'wanted' && 'current')}
    //         onClick={(ev) => {
    //           onViewChange && onViewChange('wanted')
    //           ev.stopPropagation()
    //         }}
    //       >
    //         {wantedCount} wanted
    //       </div>
    //     )}

    //   </section>
    // </div>
  )
}
