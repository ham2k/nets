import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import classNames from 'classnames'

import { Container, makeStyles, Paper } from '@material-ui/core'

import Header from '../nav/Header'

import { netSelector } from '../../data/netlogger'
import { setUI, uiSelector } from '../../data/ui'

import CheckinsSection from '../checkins/CheckinsSection'

import MessagesSection from '../messages/MessagesSection'
import NetHeader from '../nets/NetHeader'
import NetControls from '../nets/NetControls'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    flex: 0,
  },
  footer: {
    flex: 0,
  },
  subHeader: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(1),

    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    zIndex: 100,
  },
  overflowContainer: {
    overflow: 'hidden',
    minHeight: 0,
  },
  splitContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    flex: 1,
    overflow: 'hidden',
    minHeight: 0,
  },
  splitDivider: {
    flex: 0,
    backgroundColor: '#CCC',
    minHeight: '0.5rem',
    maxHeight: '0.5rem',
    height: '0.5rem',
    cursor: 'row-resize',
  },
  splitTop: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    flex: 1,
    overflow: 'hidden',
    minHeight: 0,
  },
  splitBottom: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    flex: 0,
    overflow: 'hidden',
    minHeight: 0,
  },
  netCheckins: {
    flex: 1,
  },
  netMessages: {
    flex: 1,
  },
}))

/* ================================================================================================================== */
export default function NetPage() {
  const classes = useStyles()

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
        dragContainerRef.current.style.cursor = 'row-resize'
        dispatch(setUI({ chatHeight: chatHeight - ev.movementY }))
        ev.preventDefault()
      }
    },
    [dispatch, chatHeight, dragContainerRef]
  )

  if (net && net.slug) {
    return (
      <div className={classNames('NetPage', classes.root, classes.overflowContainer)}>
        <Header className={classes.header} />

        <Paper square className={classNames(classes.subHeader)} elevation={3}>
          <Container maxWidth="md">
            <NetHeader net={net} />
            <NetControls
              className={classes.netControls}
              net={net}
              onViewChange={onViewChange}
              currentView={currentView}
            />
          </Container>
        </Paper>

        <div
          className={classes.splitContainer}
          ref={dragContainerRef}
          onMouseUp={dividerIsDragging ? onDragMouseUp : undefined}
          onMouseMove={dividerIsDragging ? onDragMouseMove : undefined}
        >
          <div className={classes.splitTop}>
            <CheckinsSection
              className={classes.netCheckins}
              slug={slug}
              currentView={currentView}
              operatingRef={operatingRef}
              operatorRef={operatorRef}
            />
          </div>

          <div className={classes.splitBottom} style={{ minHeight: chatHeight }}>
            <div className={classes.splitDivider} onMouseMove={onDragMouseDown}></div>

            <MessagesSection className={classes.netMessages} slug={slug} />
          </div>
        </div>
      </div>
    )
  } else {
    return <Redirect to={'/'} />
  }
}
