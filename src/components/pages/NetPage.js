import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons'

import Header from '../nav/Header'

import { netSelector } from '../../data/netlogger'
import { setUI } from '../../data/ui'

import CheckinsLoader from '../checkins/CheckinsLoader'
import CheckinsSection from '../checkins/CheckinsSection'

import MessagesSection from '../messages/MessagesSection'

/* ================================================================================================================== */
export default function NetPage() {
  const dispatch = useDispatch()

  const { slug } = useParams()
  const net = useSelector(netSelector(slug))

  useEffect(() => {
    dispatch(setUI({ currentSlug: net.slug }))
  }, [dispatch, net.slug])

  if (net && net.slug) {
    return (
      <>
        <Header />
        <main className="NetPage">
          <section className="flex-0">
            <div className="flex-row-baseline plr-100 pb-100">
              <FontAwesomeIcon icon={faProjectDiagram} className="flex-0 mr-100" />
              <div className="flex-2">
                <h2 className="p-0 m-0">{net.NetName}</h2>
                <div className="secondary">
                  {net.Band} • {net.Frequency} MHz {net.Mode}
                </div>
              </div>

              <div className="align-right flex-1">
                Net Control: <span className="callsign">{net.NetControl}</span>
                {' • '}
                <span>{net.SubscriberCount} subscribers</span>
                {' • '}
                <span>Started at {new Date(net.Date).toLocaleTimeString([], { timeStyle: 'short' })}</span>
                {' • '}
                <CheckinsLoader net={net} />
              </div>
            </div>
          </section>

          {net.status !== 'active' && (
            <section>
              <h3>Net has ended</h3>
            </section>
          )}

          <CheckinsSection className="flex-2 plr-0" slug={slug} />

          <MessagesSection className="flex-1 p-0" slug={slug} />
        </main>
      </>
    )
  } else {
    return <Redirect to={'/'} />
  }
}
