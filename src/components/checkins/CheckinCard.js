import React from 'react'
import classNames from 'classnames'

import { qualifierFor } from '../../data/logs/logsActions'

import './Checkins.css'

/* ================================================================================================================== */
const classNamesFor = ({ checkin, net, operator, log }) => {
  const classes = []
  if (checkin.operating) classes.push('ci_operating')
  if (checkin.statuses['(c/o)']) classes.push('ci_unavailable')
  if (checkin.statuses['(n/r)']) classes.push('ci_unavailable')
  if (checkin.statuses['(u)']) classes.push('ci_unavailable')

  if (checkin.statuses['(nc)']) classes.push('ci_netcontrol')
  if (checkin.statuses['(rel)']) classes.push('ci_relay')

  if (checkin.Callsign === operator) classes.push('ci_operator')

  let qsl = qualifierFor({ qsl: true, band: net.Band, mode: net.Mode })
  let qso = qualifierFor({ qsl: false, band: net.Band, mode: net.Mode })
  let qslMixed = qualifierFor({ qsl: true })
  let qsoMixed = qualifierFor({ qsl: false })

  if (log?.lookup?.[qsl]?.callsigns[checkin.Callsign]) classes.push('ci_confirmed_callsign')
  else if (log?.lookup?.[qso]?.callsigns[checkin.Callsign]) classes.push('ci_worked_callsign')
  else if (log?.lookup?.[qslMixed]?.callsigns[checkin.Callsign]) classes.push('ci_confirmed_callsign_mixed')
  else if (log?.lookup?.[qsoMixed]?.callsigns[checkin.Callsign]) classes.push('ci_worked_callsign_mixed')
  else classes.push('ci_new_callsign')

  if (checkin.State.trim()) {
    if (log?.lookup?.[qsl]?.states[checkin.State]) classes.push('ci_confirmed_state')
    else if (log?.lookup?.[qso]?.states[checkin.State]) classes.push('ci_worked_state')
    else if (log?.lookup?.[qslMixed]?.states[checkin.State]) classes.push('ci_confirmed_state_mixed')
    else if (log?.lookup?.[qsoMixed]?.states[checkin.State]) classes.push('ci_worked_state_mixed')
    else classes.push('ci_new_state')
  }

  return classes
}

/* ================================================================================================================== */
export default function CheckinCard({ checkin, index, net, checkins, operator, log }) {
  return (
    <div
      className={classNames(
        'Checkin',
        (index + 1) % 2 === 0 ? 'even' : 'odd',
        ...classNamesFor({ checkin, net, operator, log })
      )}
    >
      <div className="SerialNo-field">{checkin.SerialNo}</div>

      <div className="Status-field">
        {checkin.Status}
        {operator === checkin.Callsign ? <b>you</b> : ''}
      </div>

      <div className="Callsign-field ">
        <span className="pill callsign">
          {checkin.Callsign}
          {checkin.statuses['(p)'] ? <strong>/P</strong> : ''}
          {checkin.statuses['(m)'] ? <strong>/M</strong> : ''}
        </span>
      </div>

      <div className="Operator-section">
        <span className="Name-field">
          <a href={`https://www.qrz.com/db?query=${checkin.Callsign}&mode=callsign`} target="qrz" title={checkin.Name}>
            {checkin.PreferredName || checkin.Name}
          </a>
        </span>

        {checkin.MemberID && <span className="MemberID-field">{checkin.MemberID}</span>}
      </div>
      <div className="Location-section">
        {checkin.State && <span className="StateHunting-field">{checkin.State}</span>}
        {checkin.City && <span className="City-field">{[checkin.City, checkin.State].join(', ')}</span>}
        {checkin.County && <span className="County-field">{checkin.County}</span>}
        {checkin.Country && <span className="Country-field">{checkin.Country}</span>}
      </div>

      {checkin.Remarks ? (
        <div className="Remarks-field">
          <label>Remarks: </label>
          {checkin.Remarks}
        </div>
      ) : (
        ''
      )}
      {checkin.QSLInfo ? (
        <div className="QSLInfo-field">
          <label>QSL Info: </label>
          {checkin.QSLInfo}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
