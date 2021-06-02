import React from 'react'
import classNames from 'classnames'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import CheckinsLoader from '../../checkins/CheckinsLoader'

import baseStyles from './styles'

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

const NET_MODES = [
  'SSB',
  'AM',
  'FM',
  'CW',
  'RTTY',
  'PSK31',
  'PSK63',
  'JT9',
  'JT65',
  'PACKET',
  'AMTOR',
  'PACTOR',
  'SSTV',
  'MT63',
  'OLIVIA',
  'Other',
]
const NET_BANDS = [
  '2190m',
  '560m',
  '160m',
  '80m',
  '60m',
  '40m',
  '30m',
  '20m',
  '17m',
  '15m',
  '12m',
  '10m',
  '6m',
  '4m',
  '2m',
  '1.25m',
  '70cm',
  '33cm',
  '23cm',
  '13cm',
  '9cm',
  '6cm',
  '3cm',
  '1.25cm',
  '70cm',
  '6mm',
  '4mm',
  '2.5mm',
  '2mm',
  '1mm',
]

export default function NetInfoSection({ net, className, style, onViewChange, currentView }) {
  const classes = useStyles()
  const editable = true
  const readOnly = !editable

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
        <Grid container spacing={2} xs={12}>
          <Grid item xs={12}>
            <TextField label="Net Name" value={net.NetName || ''} disabled={readOnly} fullWidth={true} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Frequency" value={net.Frequency || ''} disabled={readOnly} fullWidth={true} />
          </Grid>
          <Grid item xs={4}>
            <InputLabel id="net-mode-label" disabled={readOnly}>
              Mode
            </InputLabel>
            <Select labelId="net-mode-label" disabled={readOnly} value={net.Mode || ''} fullWidth={true}>
              {NET_MODES.map((mode) => (
                <MenuItem index={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </Select>{' '}
          </Grid>
          <Grid item xs={4}>
            <InputLabel id="net-band-label" disabled={readOnly}>
              Band
            </InputLabel>
            <Select labelId="net-band-label" disabled={readOnly} value={net.Band || ''} fullWidth={true}>
              {NET_BANDS.map((band) => (
                <MenuItem index={band} value={band}>
                  {band}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4} sm={3}>
            <TextField label="Net Control" value={net.NetControl || ''} disabled={readOnly} fullWidth={true} />
          </Grid>
          <Grid item xs={8} sm={3}>
            <TextField label="Server" value={net.ServerName || ''} disabled={readOnly} fullWidth={true} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Net Password"
              value={net.Password || ''}
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
    </Accordion>
  )
}
