import React from 'react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core'

const isNetControl = (checkins, name) => {
  const [callsign] = name.split('-')
  const checkin = checkins.find((checkin) => checkin.Callsign === callsign)
  return checkin?.statuses?.netControl || checkin?.statuses?.relay
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    marginBottom: theme.spacing(0.5),
  },
  time: {
    flex: 0,
    minWidth: '4rem',
    textAlign: 'right',
    marginRight: theme.spacing(1),
  },
  nameAndText: { flex: 1 },
  name: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
  text: {},
}))

export default function Messages({ net, message, operator, checkins, className }) {
  const classes = useStyles()

  return (
    <div className={classNames(classes.root, isNetControl(checkins, message.Name) && 'netcontrol')} key={message.ID}>
      <div className={classes.time}>{new Date(message.Timestamp).toLocaleTimeString([], { timeStyle: 'short' })}</div>
      <div className={classes.nameAndText}>
        <span className={classNames(classes.name, 'callsign')}>{message.Name}</span>
        <span className={classes.text}>{message.Message}</span>
      </div>
    </div>
  )
}
