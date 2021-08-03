import React, { useCallback, useState } from 'react'
import classNames from 'classnames'

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import EditIcon from '@material-ui/icons/Edit'

import CheckinsLoader from '../../checkins/CheckinsLoader'
import BANDS from '../../../data/consts/bands'
import MODES from '../../../data/consts/modes'

import baseStyles from '../../../styles/styles'
import { useDispatch, useSelector } from 'react-redux'
import { authenticateNet, closeNet, clustersSelector, createNewNet } from '../../../data/netlogger'
import { useHistory } from 'react-router'

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

function defaultFormValues(net) {
  const { NetName, Frequency, Band, Mode, NetControl, ClusterName, ServerName, Token, isNew } = net
  return { modified: false, NetName, Frequency, Band, Mode, NetControl, ClusterName, ServerName, Token, isNew }
}

function validateForm(form, isNew) {
  const errors = {}

  if (!form.NetName || form.NetName.length < 3) {
    errors.NetName = 'You need to give your net a name at least 3 characters long.'
  }

  if (!form.Frequency || form.Frequency.length < 2) {
    errors.Frequency = "What's the frequency, Kenneth?"
  }

  if (!form.Mode) {
    errors.Mode = 'Pick a mode!'
  }

  if (!form.Band) {
    errors.Band = 'Pick a band!'
  }

  if (!form.NetControl) {
    errors.NetControl = "Who's running this net?"
  }

  if (isNew && !form.ClusterName) {
    errors.ClusterName = 'Pick a server cluster!'
  }

  if (!form.Token) {
    errors.Token = 'Your net needs a password'
  }

  if (isNew && (!form.TokenConfirmation || form.TokenConfirmation !== form.Token)) {
    errors.TokenConfirmation = 'Password does not match!'
  }

  if (Object.keys(errors).length > 0) {
    errors.isInvalid = true
  }

  return errors
}

function guessBandAndMode(freq) {
  let band, mode
  if (freq) {
    const f = Number(freq)
    if (f >= 0.135 && f <= 0.138) {
      band = '2200m'
    } else if (f >= 0.472 && f <= 0.479) {
      band = '630m'
    } else if (f >= 1.8 && f <= 2) {
      band = '160m'
    } else if (f >= 3.5 && f <= 3.6) {
      band = '80m'
      mode = 'CW'
    } else if (f > 3.6 && f <= 4) {
      band = '80m'
      mode = 'SSB'
    } else if (f >= 5.3 && f <= 5.4) {
      band = '60m'
    } else if (f >= 7.0 && f <= 7.125) {
      band = '40m'
      mode = 'CW'
    } else if (f > 7.125 && f <= 7.3) {
      band = '40m'
      mode = 'SSB'
    } else if (f >= 10.1 && f <= 10.15) {
      band = '30m'
      mode = 'CW'
    } else if (f >= 14.0 && f < 14.15) {
      band = '20m'
      mode = 'CW'
    } else if (f >= 14.15 && f < 14.35) {
      band = '20m'
      mode = 'SSB'
    } else if (f >= 18.068 && f < 18.11) {
      band = '17m'
      mode = 'CW'
    } else if (f >= 18.11 && f < 18.168) {
      band = '17m'
      mode = 'SSB'
    } else if (f >= 21 && f < 21.2) {
      band = '15m'
      mode = 'CW'
    } else if (f >= 21.2 && f < 21.45) {
      band = '15m'
      mode = 'SSB'
    } else if (f >= 24.89 && f < 24.93) {
      band = '12m'
      mode = 'CW'
    } else if (f >= 24.93 && f < 24.99) {
      band = '12m'
      mode = 'SSB'
    } else if (f >= 28 && f < 28.3) {
      band = '10m'
      mode = 'CW'
    } else if (f >= 28.3 && f < 29.7) {
      band = '10m'
      mode = 'SSB'
    } else if (f >= 28.3 && f < 29.7) {
      band = '10m'
      mode = 'SSB'
    } else if (f >= 50 && f <= 54) {
      band = '6m'
    } else if (f >= 144 && f <= 148) {
      band = '2m'
      mode = 'FM'
    } else if (f >= 222 && f <= 225) {
      band = '1.25m'
      mode = 'FM'
    } else if (f >= 420 && f <= 450) {
      band = '70cm'
      mode = 'FM'
    }
  }
  return { band, mode }
}

export default function NetInfoSection({ net, className, style, expanded, onViewChange, currentView }) {
  const dispatch = useDispatch()
  const classes = useStyles()

  const clusters = useSelector(clustersSelector())

  const [form, setFormData] = useState(() => defaultFormValues(net))

  const handleForm = (ev) => {
    const field = ev.target?.dataset?.field
    const value = ev.target?.value
    if (field) {
      let newForm = { ...form, [field]: value, modified: form.modified || net[field] !== value }
      if (field === 'Frequency') {
        const { band, mode } = guessBandAndMode(value)
        newForm.Band = band
        newForm.Mode = mode
      }
      if (newForm.errors) {
        newForm.errors = validateForm(newForm)
      }

      setFormData(newForm)
    } else {
      console.log(ev.target)
    }
  }

  const history = useHistory()
  const handleCancelNew = useCallback(() => {
    history.goBack()
  }, [history])

  const handleRestore = () => {
    setFormData(defaultFormValues(net))
  }

  const handleSave = () => {
    const errors = validateForm(form)
    console.log('saving?', form)
    if (errors.isInvalid) {
      console.log('invalid', errors)
      setFormData({ ...form, errors })
    } else {
      // console.log('saving!', form)
    }
  }

  const handleCreate = () => {
    const errors = validateForm(form)
    if (errors.isInvalid) {
      setFormData({ ...form, errors })
    } else {
      dispatch(
        createNewNet(form, (data) => {
          history.replace(`/${data.slug}`)
        })
      )
    }
  }

  const handleAuthenticate = () => {
    dispatch(authenticateNet(net.slug, form.Token))
  }

  const handleClose = () => {
    dispatch(closeNet(net.slug, form.Token))
  }

  const isEditable = net.isNew || net.isAuthenticated

  return (
    <Accordion expanded={expanded} className={classNames(className, classes.sectionRoot)} style={style} square>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.sectionHeader}>
        <Grid container direction="row">
          <Grid item xs={10}>
            <InfoIcon className={classes.sectionIcon} />

            {net.isNew ? (
              <Typography variant="h2">
                <span>Details for new net</span>
              </Typography>
            ) : (
              <>
                <Typography variant="h2">
                  {net.Band} • {net.Frequency} MHz {net.Mode}
                  {net.Date && (
                    <span>
                      {' • '}Started at {new Date(net.Date).toLocaleTimeString([], { timeStyle: 'short' })}
                    </span>
                  )}
                </Typography>
                <CheckinsLoader net={net} />
              </>
            )}
          </Grid>
          <Grid item xs={2} style={{ justifyContent: 'flex-end' }}>
            {net.isAuthenticated ? (
              <span>
                <EditIcon /> You are logging
              </span>
            ) : (
              <span>&nbsp;</span>
            )}
          </Grid>
        </Grid>
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
              error={form.errors?.NetName}
              helperText={form.errors?.NetName}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Frequency"
              value={form.Frequency || ''}
              onChange={handleForm}
              InputProps={{
                startAdornment: <InputAdornment position="start">in MHz</InputAdornment>,
              }}
              inputProps={{
                'data-field': 'Frequency',
              }}
              disabled={!isEditable}
              fullWidth={true}
              error={form.errors?.Frequency}
              helperText={form.errors?.Frequency}
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel id="net-mode-label" disabled={!isEditable} error={form.errors?.Mode}>
              Mode
            </InputLabel>
            <Select
              labelId="net-mode-label"
              disabled={!isEditable}
              value={form.Mode || ''}
              onChange={(ev) => handleForm({ target: { value: ev.target.value, dataset: { field: 'Mode' } } })}
              fullWidth={true}
              error={form.errors?.Mode}
            >
              {MODES.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </Select>
            {form.errors?.Mode && <FormHelperText error>{form.errors?.Mode}</FormHelperText>}
          </Grid>
          <Grid item xs={4}>
            <InputLabel id="net-band-label" disabled={!isEditable} error={form.errors?.Band}>
              Band
            </InputLabel>
            <Select
              labelId="net-band-label"
              disabled={!isEditable}
              value={form.Band || ''}
              onChange={(ev) => handleForm({ target: { value: ev.target.value, dataset: { field: 'Band' } } })}
              fullWidth={true}
              error={form.errors?.Band}
            >
              {BANDS.map((band) => (
                <MenuItem key={band} value={band}>
                  {band}
                </MenuItem>
              ))}
            </Select>
            {form.errors?.Band && <FormHelperText error>{form.errors?.Band}</FormHelperText>}
          </Grid>
          <Grid item xs={4} sm={3}>
            <TextField
              label="Net Control"
              value={form.NetControl || ''}
              disabled={!isEditable}
              onChange={handleForm}
              inputProps={{ 'data-field': 'NetControl' }}
              fullWidth={true}
              error={form.errors?.NetControl}
              helperText={form.errors?.NetControl}
            />
          </Grid>

          <Grid item xs={8} sm={3}>
            {net.isNew ? (
              <>
                <InputLabel id="net-server-label" disabled={!isEditable || !net.isNew} error={form.errors?.ClusterName}>
                  Server Cluster
                </InputLabel>
                <Select
                  labelId="net-band-label"
                  disabled={!net.isNew}
                  value={form.ClusterName || ''}
                  onChange={(ev) =>
                    handleForm({ target: { value: ev.target.value, dataset: { field: 'ClusterName' } } })
                  }
                  fullWidth={true}
                  error={form.errors?.ClusterName}
                >
                  {clusters.map((cluster) => (
                    <MenuItem key={cluster.ClusterName} value={cluster.ClusterName}>
                      {cluster.ClusterName}
                    </MenuItem>
                  ))}
                </Select>
                {form.errors?.ClusterName && <FormHelperText error>{form.errors?.ClusterName}</FormHelperText>}
              </>
            ) : (
              <TextField label="Server" value={form.ServerName || ''} disabled fullWidth={true} />
            )}
          </Grid>
          {net.isNew ? (
            <>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Net Password"
                  value={form.Token || ''}
                  onChange={handleForm}
                  inputProps={{ 'data-field': 'Token' }}
                  placeholder={'Password for new net'}
                  type={'password'}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={form.errors?.Token}
                  helperText={form.errors?.Token}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Confirm Password"
                  value={form.TokenConfirmation || ''}
                  onChange={handleForm}
                  inputProps={{ 'data-field': 'TokenConfirmation' }}
                  placeholder={'Repeat password'}
                  type={'password'}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={form.errors?.TokenConfirmation}
                  helperText={form.errors?.TokenConfirmation}
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Net Password"
                value={form.Token || ''}
                onChange={handleForm}
                inputProps={{ 'data-field': 'Token' }}
                placeholder={'Enter the net password if you know it'}
                type={'password'}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
                error={form.errors?.Token}
                helperText={form.errors?.Token}
              />
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
      <AccordionActions>
        {net.isNew ? (
          <>
            <Button size="small" onClick={handleCancelNew}>
              Cancel
            </Button>
            <Button size="small" onClick={handleCreate} color="primary" disabled={!form.modified}>
              Create
            </Button>
          </>
        ) : (
          <>
            {net.isAuthenticated ? (
              <>
                <Button size="small" onClick={handleClose} color="primary" disabled={!form.modified}>
                  Close
                </Button>

                <Button size="small" onClick={handleRestore} disabled={!form.modified}>
                  Cancel
                </Button>

                <Button size="small" onClick={handleSave} color="primary" disabled={!form.modified}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button size="small" onClick={handleRestore} disabled={!form.modified}>
                  Cancel
                </Button>

                <Button size="small" onClick={handleAuthenticate} color="primary" disabled={!form.modified}>
                  Authenticate
                </Button>
              </>
            )}
          </>
        )}
      </AccordionActions>
    </Accordion>
  )
}
