import { Paper, TextField, Typography } from '@material-ui/core'
import { useRollbar } from '@rollbar/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import debounce from 'lodash/debounce'

import { callsignSelector, setCallsign, nameSelector, setName } from '../../data/settings'

const reportCall = debounce((rollbar, v) => {
  rollbar.info(`Operator Callsign: ${v}`)
  console.log(v)
}, 3000)
const reportName = debounce((rollbar, v) => {
  rollbar.info(`Operator Name: ${v}`)
  console.log(v)
}, 3000)

/* ================================================================================================================== */
export default function CallsignSettings(classes) {
  const dispatch = useDispatch()
  const callsign = useSelector(callsignSelector())
  const name = useSelector(nameSelector())
  const rollbar = useRollbar()

  const handleSetCall = (v) => {
    dispatch(setCallsign(v))
    reportCall(rollbar, v)
  }
  const handleSetName = (v) => {
    dispatch(setName(v))
    reportName(rollbar, v)
  }

  return (
    <Paper elevation={2}>
      <Typography component="h2" variant="h5">
        Operator
      </Typography>

      <TextField
        label="Your Callsign"
        id={'callsign_settings'}
        value={callsign}
        onChange={(e) => handleSetCall(e.target.value)}
        onBlur={(e) => handleSetCall(callsign.toUpperCase())}
        margin="normal"
      />
      <TextField
        label="Your Name"
        id={'name_settings'}
        value={name}
        onChange={(e) => handleSetName(e.target.value)}
        onBlur={(e) => handleSetName(name.toUpperCase())}
        margin="normal"
      />
    </Paper>
  )
}
