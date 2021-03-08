import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import Header from '../nav/Header'

import { selectNet, selectNetCheckins } from '../../data/netlogger'
import CheckinsLoader from '../CheckinsLoader'
import CheckinsTable from '../CheckinsTable'

/* ================================================================================================================== */
export default function NetPage() {
  const { slug } = useParams()
  console.log('slug', slug)
  const net = useSelector(selectNet(slug))
  const checkins = useSelector(selectNetCheckins(slug))

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
            <span>Started {net.Date}</span>
          </div>

          <CheckinsTable net={net} checkins={checkins} />

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
