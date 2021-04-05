import { Paper, TextField, Typography } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { callsignSelector, setCallsign, nameSelector, setName } from '../../data/settings'

/* ================================================================================================================== */
export default function CallsignSettings(classes) {
  const dispatch = useDispatch()
  const callsign = useSelector(callsignSelector())
  const name = useSelector(nameSelector())

  return (
    <Paper elevation={2}>
      <Typography component="h2" variant="h5">
        Operator
      </Typography>

      <TextField
        label="Your Callsign"
        id={'callsign_settings'}
        value={callsign}
        onChange={(e) => dispatch(setCallsign(e.target.value))}
        onBlur={(e) => dispatch(setCallsign(callsign.toUpperCase()))}
        margin="normal"
      />
      <TextField
        label="Your Name"
        id={'name_settings'}
        value={name}
        onChange={(e) => dispatch(setName(e.target.value))}
        onBlur={(e) => dispatch(setName(name.toUpperCase()))}
        margin="normal"
      />
    </Paper>
  )
}
