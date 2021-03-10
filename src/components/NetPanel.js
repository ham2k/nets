import React from 'react'
import { useSelector } from 'react-redux'

import { netSelector, netCheckinsSelector } from '../data/netlogger'
import CheckinsLoader from './CheckinsLoader'
import CheckinsTable from './CheckinsTable'

import './NetPanel.css'

/* ================================================================================================================== */
export default function NetPanel({ selected }) {
  const net = useSelector(netSelector(selected))
  const checkins = useSelector(netCheckinsSelector(selected))

  if (net && net.NetName) {
    return (
      <div className="NetPanel">
        <h2>{net.NetName}</h2>

        <div className="secondary">
          {net.Band} • {net.Frequency} MHz {net.Mode}
        </div>

        <div>
          Net Control: <span className="callsign">{net.NetControl}</span>
          {' • '}
          <span>{net.SubscriberCount} subscribers</span>
          {' • '}
          <span>Started {net.Date}</span>
        </div>

        <CheckinsTable net={net} checkins={checkins} />

        <CheckinsLoader net={net} />
      </div>
    )
  } else {
    return <div className="NetPanel">Please select a net</div>
  }
}
