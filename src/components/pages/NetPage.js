import React, { useCallback, useEffect, useRef, useState } from 'react'
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

  const [currentView, setCurrentView] = useState('')

  useEffect(() => {
    dispatch(setUI({ currentSlug: net.slug }))
  }, [dispatch, net.slug])

  const onViewChange = useCallback(
    (mode) => {
      if (mode === 'operating') {
        operatingRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (mode === 'operator') {
        operatorRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (mode === 'heard') {
        if (currentView === 'heard') setCurrentView('')
        else setCurrentView('heard')
      } else {
        if (currentView === 'checkins') setCurrentView('')
        else setCurrentView('checkins')
      }
    },
    [currentView]
  )

  if (net && net.slug) {
    return (
      <>
        <Header />
        <main className="NetPage">
          <NetHeader net={net} className="flex-0" onViewChange={onViewChange} currentView={currentView} />

          <CheckinsSection
            className="flex-2 plr-0"
            slug={slug}
            currentView={currentView}
            operatingRef={operatingRef}
            operatorRef={operatorRef}
          />

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
