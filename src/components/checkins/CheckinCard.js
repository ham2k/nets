import React, { useMemo, useCallback } from 'react'
import classNames from 'classnames'
import { Chip, Container, Grid, Link, makeStyles, Typography } from '@material-ui/core'

import { qualifierFor } from '../../data/logs/logsActions'

import CheckinControls from './CheckinControls'

import './Checkins.css'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),

    '&.odd': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.even': {
      backgroundColor: 'inherit',
    },

    '&.ci_heard.odd': {
      backgroundColor: theme.palette.spotting_heard.odd_bg,
    },
    '&.ci_heard.even': {
      backgroundColor: theme.palette.spotting_heard.bg,
    },

    '&.ci_operating': {
      backgroundColor: theme.palette.spotting_operating.bg,
    },

    '&.ci_worked_callsign.odd': {
      backgroundColor: theme.palette.spotting_worked.odd_bg,
    },
    '&.ci_worked_callsign.even': {
      backgroundColor: theme.palette.spotting_worked.bg,
    },
    '&.ci_confirmed_callsign.odd': {
      backgroundColor: theme.palette.spotting_worked.odd_bg,
    },
    '&.ci_confirmed_callsign.even': {
      backgroundColor: theme.palette.spotting_worked.bg,
    },
  },
  card: {
    '.ci_unavailable &': {
      opacity: 0.3,
    },

    '.ci_heard & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_heard.main,
    },

    '.ci_operating & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_operating.main,
    },

    '.ci_worked_callsign & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_worked.main,
    },

    '.ci_confirmed_callsign & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_worked.main,
      textDecoration: 'strike-thru',
    },
  },
}))

/* ================================================================================================================== */
const classNamesFor = ({ checkin, net, operator, log, localInfo, hunting }) => {
  const classes = []
  if (checkin.operating) classes.push('ci_operating')
  if (checkin.statuses.checkedOut) classes.push('ci_unavailable')
  if (checkin.statuses.notResponding) classes.push('ci_unavailable')
  if (checkin.statuses.unavailable) classes.push('ci_unavailable')
  if (localInfo?.notHeard) classes.push('ci_unavailable')
  if (localInfo?.heard) classes.push('ci_heard')

  if (checkin.statuses.netControl) classes.push('ci_netcontrol')
  if (checkin.statuses.relay) classes.push('ci_relay')

  if (checkin.Callsign && checkin.Callsign === operator) classes.push('ci_operator')

  let qsl = qualifierFor({ qsl: true, band: net.Band, mode: net.Mode })
  let qso = qualifierFor({ qsl: false, band: net.Band, mode: net.Mode })
  let qslMixed = qualifierFor({ qsl: true })
  let qsoMixed = qualifierFor({ qsl: false })

  if (localInfo?.sentToQRZ) classes.push('ci_worked_callsign')
  else if (hunting.callsigns) {
    if (localInfo?.notWorked) classes.push('ci_new_callsign')
    else if (log?.lookup?.[qsl]?.callsigns[checkin.Callsign]) classes.push('ci_confirmed_callsign')
    else if (log?.lookup?.[qso]?.callsigns[checkin.Callsign]) classes.push('ci_worked_callsign')
    else if (log?.lookup?.[qslMixed]?.callsigns[checkin.Callsign]) classes.push('ci_confirmed_callsign_mixed')
    else if (log?.lookup?.[qsoMixed]?.callsigns[checkin.Callsign]) classes.push('ci_worked_callsign_mixed')
    else if (localInfo?.worked) classes.push('ci_worked_callsign')
    else classes.push('ci_new_callsign')
  }

  if (hunting.states && checkin.normalizedState) {
    if (log?.lookup?.[qsl]?.states[checkin.normalizedState]) classes.push('ci_confirmed_state')
    else if (log?.lookup?.[qso]?.states[checkin.normalizedState]) classes.push('ci_worked_state')
    else if (log?.lookup?.[qslMixed]?.states[checkin.normalizedState]) classes.push('ci_confirmed_state_mixed')
    else if (log?.lookup?.[qsoMixed]?.states[checkin.normalizedState]) classes.push('ci_worked_state_mixed')
    else classes.push('ci_new_state')
  }

  return classes
}

/* ================================================================================================================== */
export default function CheckinCard({
  className,
  checkin,
  index,
  net,
  checkins,
  local,
  operator,
  log,
  hunting,
  isOpen,
  onClick,
  operatingRef,
  operatorRef,
}) {
  const classes = useStyles()

  const localInfo = useMemo(() => local?.callsignInfo?.[checkin.Callsign] || {}, [local, checkin])

  const selectiveOnClick = useCallback(
    (ev) => {
      if (ev.defaultPrevented) return
      if (ev.target?.tagName === 'A') return
      if (ev.target?.tagName === 'INPUT') return
      if (ev.target?.tagName === 'BUTTON') return
      if (ev.target?.tagName === 'LABEL') return
      if (ev.target?.tagName === 'TEXTAREA') return

      ev.stopPropagation()
      ev.preventDefault()
      onClick && onClick(ev)
    },
    [onClick]
  )

  return (
    <div
      className={classNames(
        className,
        classes.root,
        'clickable unselectable',
        (index + 1) % 2 === 0 ? 'even' : 'odd',
        isOpen ? 'open' : 'closed',
        ...classNamesFor({ checkin, net, operator, log, localInfo, hunting })
      )}
      onClick={selectiveOnClick}
    >
      <Container maxWidth="md">
        <Typography>
          <Grid
            container
            className={classes.card}
            ref={
              (checkin.operating && operatingRef) ||
              (operator && checkin.Callsign && checkin.Callsign === operator && operatorRef) ||
              undefined
            }
          >
            <Grid item container xs={2}>
              <Grid item xs={4}>
                {checkin.SerialNo}
              </Grid>

              <Grid item xs={8}>
                {checkin.Callsign && (
                  <Typography className="callsign selectable-text">
                    {checkin.Callsign}
                    {checkin.statuses.portable ? <strong>/P</strong> : ''}
                    {checkin.statuses.mobile ? <strong>/M</strong> : ''}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} className="Status-section">
                <CheckinControls
                  net={net}
                  checkin={checkin}
                  localInfo={localInfo}
                  operator={operator}
                  activeControls={isOpen}
                />
              </Grid>
            </Grid>

            <Grid xs={4} item>
              <Link
                color="inherit"
                href={`https://www.qrz.com/db?query=${checkin.Callsign}&mode=callsign`}
                target="qrz"
                title={checkin.Name}
              >
                {checkin.PreferredName || checkin.Name}
              </Link>

              {checkin.statuses.netControl && (
                <Chip className="tagNetControl" label="Net Control" color="spotting_control" />
              )}
              {checkin.statuses.relay && <Chip className="tagRelay" label="Relay" color="spotting_relay" />}
              {checkin.statuses.logger && <Chip className="tagLogger" label="Logger" color="spotting_relay" />}
              {checkin.statuses.vip && <Chip className="tagVip" label="VIP" />}

              {checkin.MemberID && <Chip className="MemberID-field tagMemberID" label={checkin.MemberID} />}
            </Grid>

            <Grid xs={6} item container>
              <Grid xs={12}>
                {checkin.State && <Chip className="StateHunting-field" label={checkin.State} />}
                {checkin.City && <span className="City-field">{[checkin.City, checkin.State].join(', ')}</span>}
                {checkin.County && <span className="County-field">{checkin.County}</span>}
                {checkin.Country && <span className="Country-field">{checkin.Country}</span>}
              </Grid>

              <Grid xs={12} item className="Remarks-section">
                {checkin.Remarks && (
                  <div className="Remarks-field">
                    {checkin.statuses.other?.map((status) => (
                      <span className="tag selectable-text" key={status}>
                        {status}
                      </span>
                    ))}
                    {checkin.statuses.other?.length > 0 && <br />}
                    <span className="">
                      <label>Remarks: </label>
                      {checkin.Remarks}
                    </span>
                  </div>
                )}
                {checkin.QSLInfo && (
                  <div className="QSLInfo-field selectable-text">
                    <label>QSL Info: </label>
                    {checkin.QSLInfo}
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Typography>
      </Container>
    </div>
  )
}
