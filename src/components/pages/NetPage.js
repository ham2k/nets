import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import Header from '../nav/Header'

import { netSelector, netCheckinsSelector } from '../../data/netlogger'
import { upcasedCallsignSelector } from '../../data/settings'

import CheckinsLoader from '../CheckinsLoader'
import CheckinsTable from '../CheckinsTable'

/* ================================================================================================================== */
export default function NetPage() {
  const { slug } = useParams()
  const net = useSelector(netSelector(slug))
  const checkins = useSelector(netCheckinsSelector(slug))
  const callsign = useSelector(upcasedCallsignSelector())

  if (net && net.NetName) {
    return (
      <>
        <Header />
        <main className="NetPage">
          <h2>{net.NetName}</h2>

          <div className="secondary">
            {net.Band} • {net.Frequency} MHz {net.Mode}
          </div>

          <div>
            Net Control: <span className="callsign">{net.NetControl}</span>
            {' • '}
            <span>{net.SubscriberCount} subscribers</span>
            {' • '}
            <span>Started {new Date(net.Date).toLocaleTimeString([], { timeStyle: 'short' })}</span>
          </div>

          <CheckinsTable net={net} checkins={checkins} operator={callsign} />

          <CheckinsLoader net={net} />
        </main>
      </>
    )
  } else {
    return (
      <>
        <Header />
        <main>
          <div className="NetPanel">Please select a net</div>
        </main>
      </>
    )
  }
}
