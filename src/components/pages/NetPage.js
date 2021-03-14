import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

import Header from '../nav/Header'

import { netSelector, netCheckinsSelector, netLocalSelector } from '../../data/netlogger'
import { upcasedCallsignSelector, huntingSelector } from '../../data/settings'
import { logSelector } from '../../data/logs'

import CheckinsLoader from '../checkins/CheckinsLoader'
import CheckinsList from '../checkins/CheckinsList'

/* ================================================================================================================== */
export default function NetPage() {
  const { slug } = useParams()
  const hunting = useSelector(huntingSelector())
  const net = useSelector(netSelector(slug))
  const checkins = useSelector(netCheckinsSelector(slug))
  const local = useSelector(netLocalSelector(slug))
  const callsign = useSelector(upcasedCallsignSelector())
  const log = useSelector(logSelector())

  if (net && net.slug) {
    return (
      <>
        <Header />
        <main className="NetPage overflow-y-auto">
          <div className="flex-row-baseline pb-100 flex-0">
            <div>
              <h2 className="p-0 m-0">{net.NetName}</h2>
              <div className="secondary">
                {net.Band} • {net.Frequency} MHz {net.Mode}
              </div>
            </div>

            <div className="align-right">
              Net Control: <span className="callsign">{net.NetControl}</span>
              {' • '}
              <span>{net.SubscriberCount} subscribers</span>
              {' • '}
              <span>Started {new Date(net.Date).toLocaleTimeString([], { timeStyle: 'short' })}</span>
              {' • '}
              <CheckinsLoader net={net} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <CheckinsList net={net} checkins={checkins} operator={callsign} log={log} local={local} hunting={hunting} />
          </div>
        </main>
      </>
    )
  } else {
    return <Redirect to={'/'} />
  }
}
