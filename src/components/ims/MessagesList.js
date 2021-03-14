import React from 'react'
import classNames from 'classnames'

import './IMs.css'

const isNetControl = (checkins, name) => {
  const [callsign, ...parts] = name.split('-')
  return !!checkins.find((checkin) => checkin.Callsign === callsign)
}

export default function MessagesList({ net, messages, operator, checkins }) {
  return (
    <div className="Messages">
      {messages &&
        messages.map((message, index) => (
          <div className={classNames('Message', isNetControl(checkins, message.Name) && 'netcontrol')} key={message.ID}>
            <span className="Timestamp-field">
              {new Date(message.Timestamp).toLocaleTimeString([], { timeStyle: 'short' })}
            </span>
            <span className="Name-field">{message.Name}</span>
            <span className="Message-field">{message.Message}</span>
          </div>
        ))}
    </div>
  )
}
