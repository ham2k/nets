import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

import Header from '../nav/Header'

import { netSelector } from '../../data/netlogger'
import { setUI } from '../../data/ui'

import CheckinsSection from '../checkins/CheckinsSection'

import MessagesSection from '../messages/MessagesSection'
import NetHeader from '../nets/NetHeader'

/* ================================================================================================================== */
export default function NetPage() {
  const dispatch = useDispatch()
  const operatingRef = useRef()
  const operatorRef = useRef()

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
          <NetHeader net={net} className="flex-0" operatingRef={operatingRef} operatorRef={operatorRef} />

          <CheckinsSection className="flex-2 plr-0" slug={slug} operatingRef={operatingRef} operatorRef={operatorRef} />

          <MessagesSection
            className="
          flex-1 p-0"
            slug={slug}
          />
        </main>
      </>
    )
  } else {
    return <Redirect to={'/'} />
  }
}
