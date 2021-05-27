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

import baseStyles from './styles'
import NetChatSection from './NetChatSection'

const useStyles = makeStyles((theme) => ({ ...baseStyles(theme) }))

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
      console.log('onDragMouseDown')
      setDividerIsDragging(true)
      ev.preventDefault()
    },
    [setDividerIsDragging]
  )

  const onDragMouseUp = useCallback(
    (ev) => {
      console.log('onDragMouseUp')
      setDividerIsDragging(false)
      dragContainerRef.current.style.cursor = undefined
      ev.preventDefault()
    },
    [setDividerIsDragging, dragContainerRef]
  )

  const onDragMouseMove = useCallback(
    (ev) => {
      console.log('onDragMouseMove')
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
      <div className={classNames('NetPage', classes.pageRoot, classes.overflowContainer)}>
        <Helmet>
          <title>{net.NetName} - Ham2k Nets</title>
        </Helmet>

        <Header className={classes.pageHeader} title={net.NetName} />

        <NetInfoSection net={net} expanded={true} onSectionClick={() => {}} />

        <div
          className={classes.splitContainer}
          ref={dragContainerRef}
          onMouseUp={dividerIsDragging ? onDragMouseUp : undefined}
          onMouseMove={dividerIsDragging ? onDragMouseMove : undefined}
        >
          <div className={classes.splitTop}>
            <NetCheckinsSection expanded={true} slug={slug} />
          </div>

          <div className={classes.splitBottom} style={{ minHeight: chatHeight }}>
            <div className={classes.splitDivider} onMouseDown={onDragMouseDown}>
              ...
            </div>

            <NetChatSection expanded={true} slug={slug} />
          </div>
        </div>
      </div>
    )
  } else {
    return <Redirect to={'/'} />
  }
}
