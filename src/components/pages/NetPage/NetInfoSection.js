import React, { useState } from 'react'
import classNames from 'classnames'

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import CheckinsLoader from '../../checkins/CheckinsLoader'
import BANDS from '../../../data/consts/bands'
import MODES from '../../../data/consts/modes'

import baseStyles from './styles'
import { useSelector } from 'react-redux'
import { serversSelector } from '../../../data/netlogger'

const useStyles = makeStyles((theme) => ({
  ...baseStyles(theme),

  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
    },
  },
  info: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  secondary: {
    textAlign: 'right',
    [theme.breakpoints.down('md')]: {
      textAlign: 'left',
    },
  },
}))

const defaultFormValues = (net) => {
  const { NetName, Frequency, Band, Mode, NetControl, ServerName, Password } = net
  return { modified: false, NetName, Frequency, Band, Mode, NetControl, ServerName, Password }
}
export default function NetInfoSection({ net, className, style, onViewChange, currentView }) {
  const classes = useStyles()

  const servers = useSelector(serversSelector())

  const [form, setFormData] = useState(() => defaultFormValues(net))

  const handleForm = (ev) => {
    const field = ev.target?.dataset?.field
    const value = ev.target?.value
    if (field) {
      setFormData({
        ...form,
        [field]: value,
        modified: form.modified || net[field] !== value,
      })
    } else {
      console.log(ev.target)
    }
  }

  const handleCancel = () => {
    setFormData(defaultFormValues(net))
  }

  const handleSave = () => {}

  const isNew = false
  const isEditable = form.Password

  return (
    <Accordion className={classNames(className, classes.sectionRoot)} style={style} square>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.sectionHeader}>
        <InfoIcon className={classes.sectionIcon} />

        <Typography variant="h2">
          {net.Band} • {net.Frequency} MHz {net.Mode}
          {' • '}
          <span>Started at {new Date(net.Date).toLocaleTimeString([], { timeStyle: 'short' })}</span>
        </Typography>

        <CheckinsLoader net={net} />
      </AccordionSummary>

      <AccordionDetails className={classes.sectionIndented}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Net Name"
              value={form.NetName || ''}
              onChange={handleForm}
              inputProps={{ 'data-field': 'NetName' }}
              disabled={!isEditable}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Frequency"
              value={form.Frequency || ''}
              onChange={handleForm}
              inputProps={{ 'data-field': 'Frequency' }}
              disabled={!isEditable}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel id="net-mode-label" disabled={!isEditable}>
              Mode
            </InputLabel>
            <Select
              labelId="net-mode-label"
              disabled={!isEditable}
              value={form.Mode || ''}
              onChange={(ev) => handleForm({ target: { value: ev.target.value, dataset: { field: 'Mode' } } })}
              fullWidth={true}
            >
              {MODES.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </Select>{' '}
          </Grid>
          <Grid item xs={4}>
            <InputLabel id="net-band-label" disabled={!isEditable}>
              Band
            </InputLabel>
            <Select
              labelId="net-band-label"
              disabled={!isEditable}
              value={form.Band || ''}
              onChange={(ev) => handleForm({ target: { value: ev.target.value, dataset: { field: 'Band' } } })}
              fullWidth={true}
            >
              {BANDS.map((band) => (
                <MenuItem key={band} value={band}>
                  {band}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4} sm={3}>
            <TextField
              label="Net Control"
              value={form.NetControl || ''}
              disabled={!isEditable}
              onChange={handleForm}
              inputProps={{ 'data-field': 'NetControl' }}
              fullWidth={true}
            />
          </Grid>

          <Grid item xs={8} sm={3}>
            <InputLabel id="net-server-label" disabled={!isEditable || !isNew}>
              Server
            </InputLabel>

            <Select
              labelId="net-band-label"
              disabled={!isEditable || !isNew}
              value={form.ServerName || ''}
              onChange={(ev) => handleForm({ target: { value: ev.target.value, dataset: { field: 'ServerName' } } })}
              fullWidth={true}
            >
              {servers.map((server) => (
                <MenuItem key={server.ServerName} value={server.ServerName}>
                  {server.ServerName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Net Password"
              value={form.Password || ''}
              onChange={handleForm}
              inputProps={{ 'data-field': 'Password' }}
              placeholder={'Enter the net password if you know it'}
              type={'password'}
              fullWidth={true}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
      <AccordionActions>
        <Button size="small" onClick={handleCancel} disabled={!form.modified}>
          Cancel
        </Button>
        <Button size="small" onClick={handleSave} color="primary" disabled={!form.modified}>
          Save
        </Button>
      </AccordionActions>
    </Accordion>
  )
}
