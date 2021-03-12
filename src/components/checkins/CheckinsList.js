import React from 'react'

import CheckinCard from './CheckinCard'

import './Checkins.css'

export default function CheckinsList({ net, checkins, operator, log }) {
  const passthru = { net, checkins, operator, log }

  return (
    <div className="Checkins">
      {checkins &&
        checkins.map((checkin, index) => (
          <CheckinCard key={checkin.SerialNo} {...passthru} checkin={checkin} index={index} />
        ))}
    </div>
  )
}
