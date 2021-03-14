import React, { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

import { qualifierFor } from '../../data/logs/logsActions'

import { setNetLocalCallsignInfo } from '../../data/netlogger'

import './Checkins.css'

/* ================================================================================================================== */
const classNamesFor = ({ checkin, net, operator, log, localInfo, hunting }) => {
  const classes = []
  if (checkin.operating) classes.push('ci_operating')
  if (checkin.statuses.checkedOut) classes.push('ci_unavailable')
  if (checkin.statuses.notResponding) classes.push('ci_unavailable')
  if (checkin.statuses.unavailable) classes.push('ci_unavailable')
  if (localInfo?.notHeard) classes.push('ci_unavailable')

  if (checkin.statuses.netControl) classes.push('ci_netcontrol')
  if (checkin.statuses.relay) classes.push('ci_relay')

  if (checkin.Callsign && checkin.Callsign === operator) classes.push('ci_operator')

  let qsl = qualifierFor({ qsl: true, band: net.Band, mode: net.Mode })
  let qso = qualifierFor({ qsl: false, band: net.Band, mode: net.Mode })
  let qslMixed = qualifierFor({ qsl: true })
  let qsoMixed = qualifierFor({ qsl: false })

  if (hunting.callsigns) {
    if (localInfo?.notWorked) classes.push('ci_new_callsign')
    else if (log?.lookup?.[qsl]?.callsigns[checkin.Callsign]) classes.push('ci_confirmed_callsign')
    else if (log?.lookup?.[qso]?.callsigns[checkin.Callsign]) classes.push('ci_worked_callsign')
    else if (log?.lookup?.[qslMixed]?.callsigns[checkin.Callsign]) classes.push('ci_confirmed_callsign_mixed')
    else if (log?.lookup?.[qsoMixed]?.callsigns[checkin.Callsign]) classes.push('ci_worked_callsign_mixed')
    else if (localInfo?.worked) classes.push('ci_worked_callsign')
    else classes.push('ci_new_callsign')
  }

  if (hunting.states && checkin.State.trim()) {
    if (log?.lookup?.[qsl]?.states[checkin.State]) classes.push('ci_confirmed_state')
    else if (log?.lookup?.[qso]?.states[checkin.State]) classes.push('ci_worked_state')
    else if (log?.lookup?.[qslMixed]?.states[checkin.State]) classes.push('ci_confirmed_state_mixed')
    else if (log?.lookup?.[qsoMixed]?.states[checkin.State]) classes.push('ci_worked_state_mixed')
    else classes.push('ci_new_state')
  }

  return classes
}

/* ================================================================================================================== */
export default function CheckinCard({ checkin, index, net, checkins, local, operator, log, hunting }) {
  const dispatch = useDispatch()

  const localInfo = useMemo(() => local?.callsignInfo?.[checkin.Callsign] || {}, [local, checkin])

  const onClick = useCallback(
    (event) => {
      let newInfo = undefined

      if (localInfo.worked) newInfo = { worked: false, notWorked: true, notHeard: false }
      else if (localInfo.notWorked) newInfo = { worked: false, notWorked: false, notHeard: false }
      else if (localInfo.notHeard) newInfo = { worked: true, notWorked: false, notHeard: false }
      else newInfo = { worked: false, notWorked: false, notHeard: true }

      if (newInfo) {
        dispatch(setNetLocalCallsignInfo({ slug: net.slug, info: { [checkin.Callsign]: newInfo } }))
      }
    },
    [dispatch, checkin, localInfo, net]
  )

  return (
    <div
      className={classNames(
        'Checkin',
        (index + 1) % 2 === 0 ? 'even' : 'odd',
        ...classNamesFor({ checkin, net, operator, log, localInfo, hunting })
      )}
    >
      <div className="CheckinCard">
        <div className="SerialNo-field">{checkin.SerialNo}</div>

        <div className="Status-field">
          {checkin.Callsign && checkin.Callsign === operator ? <span className="you">you</span> : ''}
          {checkin.operating && <span className="operating">Current</span>}
          {localInfo.notHeard && <span>not heard</span>}
          {localInfo.worked && <span>worked</span>}
          {localInfo.notWorked && <span>not worked</span>}
          {checkin.statuses.checkedOut && <span className="secondary">checked out</span>}
          {checkin.statuses.notHeard && <span className="secondary">not heard</span>}
          {checkin.statuses.notResponding && <span className="secondary">not responding</span>}
          {checkin.statuses.unavailable && <span className="secondary">unavailable</span>}
        </div>

        <div className="Callsign-field ">
          {checkin.Callsign && (
            <span className="pill callsign clickable" onClick={onClick}>
              {checkin.Callsign}
              {checkin.statuses.portable ? <strong>/P</strong> : ''}
              {checkin.statuses.mobile ? <strong>/M</strong> : ''}
            </span>
          )}
        </div>

        <div className="Operator-section">
          <span className="Name-field">
            <a
              href={`https://www.qrz.com/db?query=${checkin.Callsign}&mode=callsign`}
              target="qrz"
              title={checkin.Name}
            >
              {checkin.PreferredName || checkin.Name}
            </a>
          </span>

          {checkin.statuses.netControl && <span>[Net Control]</span>}
          {checkin.statuses.relay && <span>[Relay]</span>}
          {checkin.statuses.logger && <span>[Logger]</span>}
          {checkin.statuses.vip && <span>[VIP]</span>}

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
            {checkin.statuses.other?.length > 0 && (
              <span>
                {checkin.statuses.other?.length}
                {checkin.statuses.other.join(' ')}
                <br />
              </span>
            )}

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
    </div>
  )
}
