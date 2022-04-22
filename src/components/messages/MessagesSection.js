import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useRollbar } from '@rollbar/react'

import { Container, IconButton, makeStyles } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'

import { netSelector, netCheckinsSelector, netIMsSelector, postMessageToNet } from '../../data/netlogger'
import { upcasedCallsignSelector, nameSelector } from '../../data/settings'

import Message from './Message'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',

    overflow: 'hidden',
    minHeight: 0,
  },
  header: {
    flex: 0,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
    '& > div': {
      maxHeight: 0, // To prevent it from stretching the containing div, and allow scrolling
    },
  },
  scroll: {
    overflowY: 'auto',
  },
  footer: {
    flex: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  messageInput: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  messageSubmit: {
    flex: 0,
  },
}))

export default function MessagesSection({ slug, className, style }) {
  const classes = useStyles()

  const dispatch = useDispatch()
  const net = useSelector(netSelector(slug))
  const checkins = useSelector(netCheckinsSelector(slug)) || []
  const messages = useSelector(netIMsSelector(slug)) || []
  const operator = useSelector(upcasedCallsignSelector())
  const operatorName = useSelector(nameSelector())
  const rollbar = useRollbar()

  const [message, setMessage] = useState('')

  const messagesElement = useRef(null)

  const [atBottom, setAtBottom] = useState(null)

  useEffect(() => {
    // Scroll to bottom on first load
    const element = messagesElement.current
    if (element) {
      element.scroll({ top: element.scrollHeight, behavior: 'auto' })
      setAtBottom(true)
    }
  }, [messagesElement])

  useEffect(() => {
    // Add handlers to keep the chat pinned to bottom, unless the user has scrolled
    const element = messagesElement.current
    if (element && atBottom !== null) {
      const handleDOMNodeInserted = (event) => {
        if (atBottom) {
          setImmediate(() => element.scroll({ top: element.scrollHeight, behavior: 'smooth' }))
        }
      }
      const handleScroll = (event) => {
        const { target } = event

        if (target.scrollTop + target.clientHeight + 1 >= target.scrollHeight) {
          setAtBottom(true)
        } else {
          setAtBottom(false)
        }
      }

      element.addEventListener('DOMNodeInserted', handleDOMNodeInserted)
      element.addEventListener('scroll', handleScroll)
      return () => {
        element.removeEventListener('DOMNodeInserted', handleDOMNodeInserted)
        element.removeEventListener('scroll', handleScroll)
      }
    }
  }, [messagesElement, atBottom])

  useEffect(() => {
    if (rollbar && operator && net.slug) {
      rollbar.info(`Message Window for ${operator}-${operatorName} on ${net.slug}`)
    }
  }, [rollbar, operator, operatorName, net.slug])
  const passthru = { net, operator, checkins }

  return (
    <div className={classNames(className, classes.root)} style={style}>
      <div className={classes.content} ref={messagesElement}>
        <Container maxWidth="md">
          {messages.map((message, index) => (
            <Message key={message.ID} message={message} {...passthru} />
          ))}
        </Container>
      </div>

      <Container className={classes.footer} maxWidth="md">
        {operator ? (
          <>
            <input
              className={classes.messageInput}
              type="text"
              value={message}
              id="messages_input"
              autoComplete="off"
              onChange={(ev) => setMessage(ev.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  dispatch(postMessageToNet(net.slug, `${operator}-${operatorName}`, message))
                  // rollbar.info(`${operator}-${operatorName} sent a message to ${net.slug}`)
                  setMessage('')
                }
              }}
            />
            <IconButton
              className={classes.messageSubmit}
              onClick={() => {
                dispatch(postMessageToNet(net.slug, `${operator}-${operatorName}`, message))
                // rollbar.info(`${operator}-${operatorName} sent a message to ${net.slug}`)
                setMessage('')
              }}
            >
              <SendIcon />
            </IconButton>
          </>
        ) : (
          <div>
            To send Instant Messages first you need to configure your callsing and name in{' '}
            <Link to="/app/settings">settings</Link>
          </div>
        )}
      </Container>
    </div>
  )
}
