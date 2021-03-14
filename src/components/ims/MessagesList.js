import React, { useState } from 'react'
import classNames from 'classnames'

import './IMs.css'

const isNetControl = (checkins, name) => {
  const [callsign] = name.split('-')
  const checkin = checkins.find((checkin) => checkin.Callsign === callsign)
  return checkin?.statuses?.netControl || checkin?.statuses?.relay
}

export default function MessagesList({ net, messages, operator, checkins, className }) {
  const reversedMessages = [...messages].reverse()
  const [message, setMessage] = useState('')

  return (
    <div className={classNames(className, 'Messages')}>
      <div className="header">
        <h4>Almost Instant Messages</h4>
      </div>
      <div className="MessagesList">
        {reversedMessages.map((message, index) => (
          <div className={classNames('Message', isNetControl(checkins, message.Name) && 'netcontrol')} key={message.ID}>
            <span className="Timestamp-field">
              {new Date(message.Timestamp).toLocaleTimeString([], { timeStyle: 'short' })}
            </span>
            <span className="Name-field">{message.Name}</span>
            <span className="Message-field">{message.Message}</span>
          </div>
        ))}
      </div>
      <div className="footer flex-row-baseline">
        <input
          className="flex-1 mr-100 p-100"
          type="text"
          value={message}
          id="messages_input"
          onChange={(ev) => setMessage(ev.target.value)}
        />
        <button className="p-100">Send</button>
      </div>
    </div>
  )
}
