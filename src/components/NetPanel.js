import React from 'react'
import { useSelector } from 'react-redux'

import { selectNet, selectNetCheckins } from '../store/nets'
import CheckinsLoader from './CheckinsLoader'
import CheckinsTable from './CheckinsTable'

import './NetPanel.css'

/* ================================================================================================================== */
export default function NetPanel({ selected }) {
  const net = useSelector(selectNet(selected))
  const checkins = useSelector(selectNetCheckins(selected))

  if (net && net.name) {
    return (
      <div className="NetPanel">
        <h2>{net.name}</h2>

        <div className="secondary">
          {net.band} • {net.frequency} MHz {net.mode}
        </div>

        <div>
          Net Control: <span className="callsign">{net.netControl}</span>
          {' • '}
          <span>{net.subscriberCount} subscribers</span>
          {' • '}
          <span>Started {net.date}</span>
        </div>

        <CheckinsTable net={net} checkins={checkins} />

        <CheckinsLoader net={net} />
      </div>
    )
  } else {
    return <div className="NetPanel">Please select a net</div>
  }
}
