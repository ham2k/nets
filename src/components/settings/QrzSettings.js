import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { qrzSelector, setQrz } from '../../data/settings'
import { getLogbook } from '../../data/qrz'
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core'

/* ================================================================================================================== */
export default function QrzSettings() {
  const dispatch = useDispatch()
  const qrz = useSelector(qrzSelector())

  return (
    <Paper elevation={2}>
      <Typography component="h2" variant="h5">
        QRZ.com Logging
      </Typography>
      <Grid container direction="row" alignItems="flex-end">
        <Grid item>
          <TextField
            label="QRZ API Key"
            id={'qrz_key_settings'}
            value={qrz.key}
            onChange={(e) => dispatch(setQrz({ key: e.target.value }))}
            margin="normal"
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => dispatch(getLogbook())}>
            Fetch Logbook
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}
