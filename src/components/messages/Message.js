import React from 'react'
import classNames from 'classnames'

const isNetControl = (checkins, name) => {
  const [callsign] = name.split('-')
  const checkin = checkins.find((checkin) => checkin.Callsign === callsign)
  return checkin?.statuses?.netControl || checkin?.statuses?.relay
}

export default function Messages({ net, message, operator, checkins, className }) {
  return (
    <div className={classNames('Message', isNetControl(checkins, message.Name) && 'netcontrol')} key={message.ID}>
      <div className="Timestamp-field">
        {new Date(message.Timestamp).toLocaleTimeString([], { timeStyle: 'short' })}
      </div>
      <div>
        <span className="Name-field">{message.Name}</span>
        <span className="Message-field">{message.Message}</span>
      </div>
    </div>
  )
}
