import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { netSelector, netCheckinsSelector, netLocalSelector } from '../../data/netlogger'
import { upcasedCallsignSelector, huntingSelector } from '../../data/settings'
import { logSelector } from '../../data/logs'

import CheckinCard from './CheckinCard'

import './Checkins.css'

export default function CheckinsSection({ slug, className, currentView, operatingRef, operatorRef }) {
  const [openCheckin, setOpenCheckin] = useState()

  const hunting = useSelector(huntingSelector())
  const net = useSelector(netSelector(slug))
  const checkins = useSelector(netCheckinsSelector(slug))
  const local = useSelector(netLocalSelector(slug))
  const operator = useSelector(upcasedCallsignSelector())
  const log = useSelector(logSelector())

  const passthru = { net, checkins, operator, log, local, hunting }

  return (
    <div
      className={classNames(className, 'CheckinsSection flex-col-stretch overflow-container', `view-${currentView}`)}
    >
      <section className={'overflow-y-auto'}>
        {checkins &&
          checkins.map((checkin, index) => (
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
      </section>
    </div>
  )
}
