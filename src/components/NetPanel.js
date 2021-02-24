import React from 'react'

import './NetPanel.css'

export default function NetPanel({ net }) {
  console.log(net)
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
      </div>
    )
  } else {
    return <div className="NetPanel">Please select a net</div>
  }
}
