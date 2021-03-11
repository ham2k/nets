import React from 'react'
import classNames from 'classnames'

import { qualifierFor } from '../data/logs/logsActions'

import './CheckinsTable.css'

/* ================================================================================================================== */
const TITLES = {
  SerialNo: '#',
  Callsign: 'Call',
  Mame: 'Name',
  Country: 'Country',
  City: 'City',
  State: 'State',
  County: 'County',
  MemberID: 'Member',
  QSLInfo: 'QSL Info',
  Remarks: 'Remarks',
  Status: 'Status',
}

const STYLES = {
  SerialNo: 'number',
  Callsign: 'callsign',
}

const HEADER_COMPONENTS = {
  default: ({ field }) => <th className={classNames(`${field}-field`, STYLES[field])}>{TITLES[field] || field}</th>,
}

/* ================================================================================================================== */
const DATA_COMPONENTS = {
  // serial: ({ checkin }) => <td className="number serial-field">{checkin.serial}</td>,
  // callsign: ({ checkin }) => <td className="callsign callsign-field">{checkin.callsign}</td>,
  SerialNo: ({ checkin, field, operator, log }) => (
    <td className={classNames(`${field}-field`, STYLES[field])}>
      {checkin.Callsign === operator ? '👉 ' : ''}
      {checkin[field]}
    </td>
  ),
  default: ({ checkin, field }) => (
    <td className={classNames(`${field}-field`, STYLES[field])}>
      <div>{checkin[field]}</div>
    </td>
  ),
}

/* ================================================================================================================== */
const classNamesFor = ({ checkin, net, operator, log }) => {
  const classes = []
  if (checkin.operating) classes.push('ci_operating')
  if (checkin.statuses['(c/o)']) classes.push('ci_unavailable')
  if (checkin.statuses['(n/r)']) classes.push('ci_unavailable')

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
export default function CheckinsTable({ net, checkins, operator, log }) {
  const fields = [
    'SerialNo',
    'Callsign',
    'Status',
    'Name',
    'Country',
    'City',
    'State',
    'County',
    'MemberID',
    'Remarks',
    'QSLInfo',
  ]

  console.log(qualifierFor({ qsl: true, band: net.Band, mode: net.Mode }))

  return (
    <table className="CheckinsTable">
      <thead>
        <tr>
          {fields.map((field, col) => {
            const HeaderComponent = HEADER_COMPONENTS[field] || HEADER_COMPONENTS.default
            return <HeaderComponent field={field} col={col} net={net} key={field} />
          })}
        </tr>
      </thead>
      <tbody>
        {checkins &&
          checkins.map((checkin, row) => (
            <tr key={checkin.SerialNo} className={classNames(...classNamesFor({ checkin, net, operator, log }))}>
              {fields.map((field, col) => {
                const DataComponent = DATA_COMPONENTS[field] || DATA_COMPONENTS.default
                return (
                  <DataComponent
                    checkin={checkin}
                    field={field}
                    operator={operator}
                    row={row}
                    col={col}
                    net={net}
                    key={`${checkin.SerialNo}-${field}`}
                  />
                )
              })}
            </tr>
          ))}
      </tbody>
    </table>
  )
}
