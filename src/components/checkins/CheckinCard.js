import React, { useMemo, useCallback } from 'react'
import classNames from 'classnames'

import { qualifierFor } from '../../data/logs/logsActions'

import CheckinControls from './CheckinControls'

import './Checkins.css'

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
        'Checkin',
        'clickable unselectable',
        (index + 1) % 2 === 0 ? 'even' : 'odd',
        isOpen ? 'open' : 'closed',
        ...classNamesFor({ checkin, net, operator, log, localInfo, hunting })
      )}
      onClick={selectiveOnClick}
    >
      <div
        className="CheckinCard"
        ref={
          (checkin.operating && operatingRef) ||
          (operator && checkin.Callsign && checkin.Callsign === operator && operatorRef) ||
          undefined
        }
      >
        <div className="SerialNo-field">{checkin.SerialNo}</div>

        <div className="Status-section">
          <CheckinControls
            net={net}
            checkin={checkin}
            localInfo={localInfo}
            operator={operator}
            activeControls={isOpen}
          />
        </div>

        <div className="Callsign-field">
          {checkin.Callsign && (
            <span className="callsign selectable-text">
              {checkin.Callsign}
              {checkin.statuses.portable ? <strong>/P</strong> : ''}
              {checkin.statuses.mobile ? <strong>/M</strong> : ''}
            </span>
          )}
        </div>

        <div className="Operator-section">
          <span className="Name-field selectable-text">
            <a
              href={`https://www.qrz.com/db?query=${checkin.Callsign}&mode=callsign`}
              target="qrz"
              title={checkin.Name}
            >
              {checkin.PreferredName || checkin.Name}
            </a>
          </span>

          {checkin.statuses.netControl && <span className="tag tagNetControl">Net Control</span>}
          {checkin.statuses.relay && <span className="tag tagRelay">Relay</span>}
          {checkin.statuses.logger && <span className="tag tagLogger">Logger</span>}
          {checkin.statuses.vip && <span className="tag tagVip">VIP</span>}

          {checkin.MemberID && <span className="MemberID-field tag tagMemberID">{checkin.MemberID}</span>}
        </div>

        <div className="Location-section selectable-text">
          {checkin.State && <span className="StateHunting-field">{checkin.State}</span>}
          {checkin.City && <span className="City-field">{[checkin.City, checkin.State].join(', ')}</span>}
          {checkin.County && <span className="County-field">{checkin.County}</span>}
          {checkin.Country && <span className="Country-field">{checkin.Country}</span>}
        </div>

        <div className="Remarks-section">
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
        </div>
      </div>
    </div>
  )
}
