import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'
import { Container, makeStyles, Paper, Typography } from '@material-ui/core'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'

import Header from '../../nav/Header'

import { netSelector } from '../../../data/netlogger'
import { setUI, uiSelector } from '../../../data/ui'

import MessagesSection from '../../messages/MessagesSection'
import NetInfoSection from './NetInfoSection'
import NetCheckinsSection from './NetCheckinsSection'

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
    borderTop: '1px solid #ccc',
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

  const { slug } = useParams()
  const net = useSelector(netSelector(slug))

  const chatHeight = useSelector(uiSelector())?.chatHeight || 200

  useEffect(() => {
    dispatch(setUI({ currentSlug: net?.slug }))
  }, [dispatch, net?.slug])

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
        <Helmet>
          <title>{net.NetName} - Ham2k Nets</title>
        </Helmet>
        <Header className={classes.header} title={net.NetName} />

        <Paper square className={classNames(classes.subHeader)} elevation={3}>
          <NetInfoSection net={net} onSectionClick={() => {}} />
        </Paper>

        <div
          className={classes.splitContainer}
          ref={dragContainerRef}
          onMouseUp={dividerIsDragging ? onDragMouseUp : undefined}
          onMouseMove={dividerIsDragging ? onDragMouseMove : undefined}
        >
          <div className={classes.splitTop}>
            <NetCheckinsSection expanded={true} className={classes.netCheckins} slug={slug} />
          </div>

          <div className={classes.splitBottom} style={{ minHeight: chatHeight }}>
            <div className={classes.splitDivider} onMouseMove={onDragMouseDown} />
            <Paper elevation={3} square>
              <Container className={classes.header} maxWidth="md">
                <Typography variant="h6">
                  <QuestionAnswerIcon /> Almost Instant Messages
                </Typography>
              </Container>
            </Paper>

            <MessagesSection className={classes.netMessages} slug={slug} />
          </div>
        </div>
      </div>
    )
  } else {
    return <Redirect to={'/'} />
  }
}
