import { Checkbox, FormControlLabel, FormGroup, Paper, Typography } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { huntingSelector, setHunting } from '../../data/settings'

/* ================================================================================================================== */
export default function HuntingSettings() {
  const dispatch = useDispatch()
  const hunting = useSelector(huntingSelector())

  return (
    <Paper elevation={2}>
      <Typography component="h2" variant="h5">
        Hunting
      </Typography>

      <FormGroup row>
        <FormControlLabel
          label="States"
          control={
            <Checkbox checked={hunting.states} onChange={(ev) => dispatch(setHunting({ states: ev.target.checked }))} />
          }
        />

        <FormControlLabel
          label="Callsigns"
          control={
            <Checkbox
              checked={hunting.callsigns}
              onChange={(ev) => dispatch(setHunting({ callsigns: ev.target.checked }))}
            />
          }
        />
      </FormGroup>
    </Paper>
  )
}
