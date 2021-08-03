import { qualifierFor } from '../../data/logs'

/* ================================================================================================================== */
export const classNamesFor = ({ checkin, net, operator, log, localInfo, hunting }) => {
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
