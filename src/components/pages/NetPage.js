import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

import Header from '../nav/Header'

import { netSelector } from '../../data/netlogger'
import { setUI, uiSelector } from '../../data/ui'

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

  const chatHeight = useSelector(uiSelector())?.chatHeight || 200

  const [currentView, setCurrentView] = useState('')

  useEffect(() => {
    dispatch(setUI({ currentSlug: net?.slug }))
  }, [dispatch, net?.slug])

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

  const dragContainerRef = useRef()
  const [dividerIsDragging, setDividerIsDragging] = useState(false)

  const onDragMouseDown = useCallback(
    (ev) => {
      setDividerIsDragging(true)
      ev.preventDefault()
    },
    [setDividerIsDragging]
  )

  const onDragMouseUp = useCallback(
    (ev) => {
      setDividerIsDragging(false)
      dragContainerRef.current.style.cursor = undefined
      ev.preventDefault()
    },
    [setDividerIsDragging, dragContainerRef]
  )

  const onDragMouseMove = useCallback(
    (ev) => {
      if (ev.buttons && ev.movementY) {
        console.log(ev)
        dragContainerRef.current.style.cursor = 'row-resize'
        dispatch(setUI({ chatHeight: chatHeight - ev.movementY }))
        ev.preventDefault()
      }
    },
    [dispatch, chatHeight, dragContainerRef]
  )

  if (net && net.slug) {
    return (
      <>
        <Header />
        <main
          className="NetPage"
          ref={dragContainerRef}
          onMouseUp={dividerIsDragging ? onDragMouseUp : undefined}
          onMouseMove={dividerIsDragging ? onDragMouseMove : undefined}
        >
          <NetHeader net={net} className="flex-0 bb-1" onViewChange={onViewChange} currentView={currentView} />

          <CheckinsSection
            className="flex-1 plr-0"
            slug={slug}
            currentView={currentView}
            operatingRef={operatingRef}
            operatorRef={operatorRef}
          />

          <div className="flex-0 p-0 flex-col-stretch" style={{ minHeight: chatHeight }}>
            <div className="Divider flex-0" onMouseMove={onDragMouseDown}></div>
            <MessagesSection className="flex-1" slug={slug} />
          </div>
        </main>
      </>
    )
  } else {
    return <Redirect to={'/'} />
  }
}
