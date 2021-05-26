import React, { useMemo, useCallback } from 'react'
import classNames from 'classnames'
import { Chip, Container, Grid, Link, makeStyles, Typography } from '@material-ui/core'

import { qualifierFor } from '../../data/logs/logsActions'

import CheckinControls from './CheckinControls'

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

    '&.ci_wanted.odd': {
      backgroundColor: theme.palette.spotting_wanted.odd_bg,
    },
    '&.ci_wanted.even': {
      backgroundColor: theme.palette.spotting_wanted.bg,
    },

    '&.ci_operating': {
      paddingTop: theme.spacing(0.5),
      borderTopStyle: 'solid',
      borderTopWidth: theme.spacing(0.5),
      borderTopColor: theme.palette.spotting_operating.main,
      paddingBottom: theme.spacing(0.5),
      borderBottomStyle: 'solid',
      borderBottomWidth: theme.spacing(0.5),
      borderBottomColor: theme.palette.spotting_operating.main,
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
    '& .gridSerial': {
      order: 1,
    },
    '& .gridCallsign': {
      order: 2,
    },
    '& .gridName': {
      order: 3,
    },
    '& .gridLocation': {
      order: 4,
      [theme.breakpoints.down('sm')]: {
        order: 7,
      },
      [theme.breakpoints.down('md')]: {
        order: 6,
      },
    },
    '& .gridSpacer1': {
      order: 5,
      [theme.breakpoints.down('sm')]: {
        order: 4,
      },
    },
    '& .gridControls': {
      order: 6,
      [theme.breakpoints.down('sm')]: {
        order: 5,
      },
    },
    '& .gridSpacer2': {
      order: 7,
      display: 'none',
      [theme.breakpoints.down('xs')]: {
        display: 'block',
        order: 6,
      },
    },

    '.ci_self & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_self.main,
    },

    '.ci_self & .tagSelf': {
      fontWeight: 'bold',
      color: theme.palette.spotting_self.main,
    },

    '.ci_unavailable &': {
      opacity: 0.3,
    },

    '.ci_wanted & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_wanted.main,
    },

    '& .MuiChip-root.tagWanted': {
      color: theme.palette.spotting_wanted.main,
      backgroundColor: theme.palette.spotting_wanted.bg,
      borderColor: theme.palette.spotting_wanted.main,
    },

    '& .tagWanted .MuiSvgIcon-root': {
      color: theme.palette.spotting_wanted.main,
    },

    '& .MuiChip-root.tagWorked': {
      color: theme.palette.spotting_worked.main,
      backgroundColor: theme.palette.spotting_worked.bg,
      borderColor: theme.palette.spotting_worked.main,
    },

    '& .tagWorked .MuiSvgIcon-root': {
      color: theme.palette.spotting_worked.main,
    },

    '.ci_operating & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_operating.main,
    },

    '.ci_operating & .tagOperating': {
      fontWeight: 'bold',
      color: theme.palette.spotting_operating.main,
    },

    '& .MuiChip-root.tagOperating': {
      color: theme.palette.spotting_operating.main,
      backgroundColor: theme.palette.spotting_operating.bg,
      borderColor: theme.palette.spotting_operating.main,
    },

    '& .MuiChip-root.tagOperating .MuiChip-icon': {
      color: theme.palette.spotting_operating.main,
    },

    '& .MuiChip-root.tagControl': {
      color: theme.palette.spotting_control.main,
      backgroundColor: theme.palette.spotting_control.bg,
      borderColor: theme.palette.spotting_control.main,
      marginLeft: theme.spacing(1),
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

    '.ci_new_state & .fieldState': {
      backgroundColor: theme.palette.spotting_hunting.main,
      color: theme.palette.spotting_hunting.contrastText,
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      fontWeight: 'bold',
      borderRadius: '3px',
    },

    '.ci_confirmed_state_mixed & .fieldState': {
      backgroundColor: theme.palette.spotting_hunting_mixed.main,
      color: theme.palette.text.primary,
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      borderRadius: '3px',
    },

    '& .MuiChip-root': {
      marginRight: theme.spacing(0.5),
    },

    '& span.segment': {
      marginLeft: theme.spacing(0.75),
      marginRight: theme.spacing(0.75),
      whiteSpace: 'nowrap',
    },

    '& .MuiGrid-root .segment:first-child': {
      marginLeft: 0,
    },

    '& .MuiGrid-root .MuiChip-root:first-child': {
      marginLeft: -theme.spacing(1),
    },

    '& .fieldCallsign': {
      fontWeight: 'bold',
    },

    '& .fieldName': {
      fontWeight: 'bold',
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
  if (localInfo?.wanted) classes.push('ci_wanted')

  if (checkin.statuses.netControl) classes.push('ci_netcontrol')
  if (checkin.statuses.relay) classes.push('ci_relay')

  if (checkin.Callsign && checkin.Callsign === operator) classes.push('ci_self')

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
        <Typography component="div">
          <Grid
            container
            className={classes.card}
            alignContent="flex-start"
            justify="flex-start"
            ref={
              (checkin.operating && operatingRef) ||
              (operator && checkin.Callsign && checkin.Callsign === operator && operatorRef) ||
              undefined
            }
          >
            <Grid item xs={1} sm={1} md={1} lg={1} className="gridSerial fieldSerialNo">
              {checkin.SerialNo}
            </Grid>

            <Grid item xs={3} sm={2} md={2} lg={1} className="gridCallsign">
              {checkin.Callsign && (
                <Typography className={'callsign fieldCallsign selectable-text'}>
                  {checkin.Callsign}
                  {checkin.statuses.portable ? <strong>/P</strong> : ''}
                  {checkin.statuses.mobile ? <strong>/M</strong> : ''}
                </Typography>
              )}
            </Grid>

            <Grid item xs={8} sm={9} md={9} lg={4} className="gridName selectable-text">
              <Link
                color="inherit"
                href={`https://www.qrz.com/db?query=${checkin.Callsign}&mode=callsign`}
                target="qrz"
                title={checkin.Name}
                className="fieldName segment"
              >
                {checkin.PreferredName || checkin.Name}
              </Link>

              {checkin.statuses.netControl && <Chip size="small" className="tagControl" label="Net Control" />}
              {checkin.statuses.relay && <Chip size="small" className="tagControl" label="Relay" />}
              {checkin.statuses.logger && <Chip size="small" className="tagControl" label="Logger" />}
              {checkin.statuses.vip && <Chip size="small" className="tagControl" label="VIP" />}

              {checkin.MemberID && <span className="segment fieldMemberID">{checkin.MemberID}</span>}
            </Grid>

            <Grid item xs={1} sm={1} md={1} lg={1} className="gridSpacer1" />
            <Grid item xs={3} sm={false} md={false} lg={false} className="gridSpacer2" />

            <Grid item xs={11} sm={4} md={6} lg={6} className="gridControls">
              <CheckinControls
                net={net}
                checkin={checkin}
                localInfo={localInfo}
                operator={operator}
                activeControls={isOpen}
              />
            </Grid>

            <Grid item xs={9} sm={7} md={5} lg={6} className="gridLocation">
              <div>
                {checkin.City ? (
                  checkin.State ? (
                    <span className="segment">
                      {checkin.City},&nbsp;
                      <span className="fieldState">{checkin.State}</span>
                    </span>
                  ) : (
                    <span className="segment">{checkin.City}</span>
                  )
                ) : (
                  checkin.State && <span className="segment fieldState">{checkin.State}</span>
                )}
                {checkin.Country && <span className="segment">{checkin.Country}</span>}
                {checkin.County && <span className="segment">&nbsp;&nbsp;{checkin.County}</span>}
              </div>

              {checkin.statuses.other?.length >= 0 && (
                <div>
                  {checkin.statuses.other?.map((status) => (
                    <Chip size="small" className="tagOther" key={status} label={status} />
                  ))}
                </div>
              )}
              {checkin.Remarks && (
                <div className="selectable-text fieldRemarks">
                  {checkin.statuses.other?.length > 0 && <br />}
                  <label>Remarks: </label>
                  {checkin.Remarks}
                </div>
              )}
              {checkin.QSLInfo && (
                <div className="fieldQSLInfo selectable-text">
                  <label>QSL Info: </label>
                  {checkin.QSLInfo}
                </div>
              )}
            </Grid>
          </Grid>
        </Typography>
      </Container>
    </div>
  )
}
