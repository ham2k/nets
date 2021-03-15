import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

import Header from '../nav/Header'

import { netSelector } from '../../data/netlogger'

import CheckinsLoader from '../checkins/CheckinsLoader'
import CheckinsSection from '../checkins/CheckinsSection'

import MessagesSection from '../ims/MessagesSection'

/* ================================================================================================================== */
export default function NetPage() {
  const { slug } = useParams()
  const net = useSelector(netSelector(slug))

  if (net && net.slug) {
    return (
      <>
        <Header />
        <main className="NetPage">
          <section className="flex-row-baseline pb-100 flex-0">
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
          </section>

          <CheckinsSection className="flex-2 plr-0" slug={slug} />

          <MessagesSection className="flex-1 p-0" slug={slug} />
        </main>
      </>
    )
  } else {
    return <Redirect to={'/'} />
  }
}
