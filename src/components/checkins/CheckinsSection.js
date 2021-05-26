import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { makeStyles } from '@material-ui/core'

import { netSelector, netCheckinsSelector, netLocalSelector } from '../../data/netlogger'
import { upcasedCallsignSelector, huntingSelector } from '../../data/settings'
import { logSelector } from '../../data/logs'

import CheckinCard from './CheckinCard'

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: 'auto',
  },
}))

export default function CheckinsSection({ slug, className, currentView, operatingRef, operatorRef }) {
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
