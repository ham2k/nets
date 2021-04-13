import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

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

export default function MessagesSection({ slug, className }) {
  const classes = useStyles()

  const dispatch = useDispatch()
  const net = useSelector(netSelector(slug))
  const checkins = useSelector(netCheckinsSelector(slug)) || []
  const messages = useSelector(netIMsSelector(slug)) || []
  const operator = useSelector(upcasedCallsignSelector())
  const operatorName = useSelector(nameSelector())

  const [message, setMessage] = useState('')

  const passthru = { net, operator, checkins }

  const messagesElement = useRef(null)

  useEffect(() => {
    if (messagesElement.current) {
      let atBottom = true

      messagesElement.current.scroll({ top: messagesElement.current.scrollHeight, behavior: 'auto' })

      messagesElement.current.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event

        if (atBottom) {
          target.scroll({ top: target.scrollHeight, behavior: 'smooth' })
        }
      })

      messagesElement.current.addEventListener('scroll', (event) => {
        const { target } = event

        if (target.scrollTop + target.clientHeight + 1 >= target.scrollHeight) {
          atBottom = true
        } else {
          atBottom = false
        }
      })
    }
  }, [messagesElement])

  return (
    <div className={classNames(className, classes.root)}>
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
                  setMessage('')
                }
              }}
            />
            <IconButton
              className={classes.messageSubmit}
              onClick={() => {
                dispatch(postMessageToNet(net.slug, `${operator}-${operatorName}`, message))
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
