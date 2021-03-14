import React from 'react'
import classNames from 'classnames'

import CheckinCard from './CheckinCard'

import './Checkins.css'

export default function CheckinsList({ net, checkins, operator, log, local, hunting, className }) {
  const passthru = { net, checkins, operator, log, local, hunting }

  return (
    <div className={classNames(className, 'Checkins')}>
      {checkins &&
        checkins.map((checkin, index) => (
          <CheckinCard key={checkin.SerialNo} {...passthru} checkin={checkin} index={index} />
        ))}
    </div>
  )
}
