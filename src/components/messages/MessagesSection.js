import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import { netSelector, netCheckinsSelector, netIMsSelector, postMessageToNet } from '../../data/netlogger'
import { upcasedCallsignSelector, nameSelector } from '../../data/settings'

import Message from './Message'

import './Messages.css'

export default function MessagesSection({ slug, className, style }) {
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
    let atBottom = true

    if (messagesElement) {
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
  }, [])

  return (
    <div className={classNames(className, 'MessagesSection')}>
      <section>
        <div className="header plr-200">
          <h4>
            <FontAwesomeIcon icon={faComments} /> Almost Instant Messages
          </h4>
        </div>

        <div className="MessagesList" ref={messagesElement}>
          {messages.map((message, index) => (
            <Message key={message.ID} message={message} {...passthru} />
          ))}
        </div>

        {operator ? (
          <div className="footer flex-row-baseline plr-200">
            <input
              className="flex-1 mr-100 p-100"
              type="text"
              value={message}
              id="messages_input"
              onChange={(ev) => setMessage(ev.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  dispatch(postMessageToNet(net.slug, `${operator}-${operatorName}`, message))
                  setMessage('')
                }
              }}
            />
            <button
              className="p-100"
              onClick={() => {
                dispatch(postMessageToNet(net.slug, `${operator}-${operatorName}`, message))
                setMessage('')
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        ) : (
          <div className="footer flex-row-baseline plr-200">
            <div className="flex-1 mr-100 p-100">
              To send Instant Messages first you need to configure your callsing and name in{' '}
              <Link to="/app/settings">settings</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
