import React from 'react'

import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  this: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .ci_operating': {
      color: theme.palette.spotting_operating.main,
    },
  },
}))

export default function NetControls({ net, checkins, local, operator, onViewChange, currentView }) {
  currentView = currentView || 'checkins'
  checkins = checkins || []

  const classes = useStyles()

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
    <div className={classes.this}>
      <Typography variant="h2" style={{ flex: 1 }}>
        {checkinsLabel}
      </Typography>
      <Typography variant="h3" style={{ flex: 1 }}>
        {wantedLabel}
      </Typography>

      {net.status !== 'active' && (
        <div style={{ flex: 2 }}>
          <strong>Net has ended</strong>
        </div>
      )}
      {currentCheckin && (
        <div
          style={{ flex: 2 }}
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
          style={{ flex: 1 }}
          className="ci_self clickable"
          onClick={(ev) => {
            onViewChange && onViewChange('operator')
            ev.stopPropagation()
          }}
        >
          &nbsp; You are #{selfCheckin.SerialNo} <span className="callsign">{selfCheckin.Callsign}</span>
        </div>
      )}
    </div>
  )
}
