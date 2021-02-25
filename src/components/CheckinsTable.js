import React from 'react'
import classNames from 'classnames'

import './CheckinsTable.css'

/* ================================================================================================================== */
const TITLES = {
  serial: '#',
  callsign: 'Call',
  name: 'Name',
  country: 'Country',
  city: 'City',
  state: 'State',
  county: 'County',
  qslInfo: 'QSL Info',
  remarks: 'Remarks',
  status: 'Status',
}

const STYLES = {
  serial: 'number',
  callsign: 'callsign',
}

const HEADER_COMPONENTS = {
  default: ({ field }) => <th className={classNames(`${field}-field`, STYLES[field])}>{TITLES[field] || field}</th>,
}

/* ================================================================================================================== */
const DATA_COMPONENTS = {
  // serial: ({ checkin }) => <td className="number serial-field">{checkin.serial}</td>,
  // callsign: ({ checkin }) => <td className="callsign callsign-field">{checkin.callsign}</td>,
  default: ({ checkin, field }) => <td className={classNames(`${field}-field`, STYLES[field])}>{checkin[field]}</td>,
}

/* ================================================================================================================== */
export default function CheckinsTable({ net, checkins }) {
  const fields = ['serial', 'callsign', 'status', 'name', 'country', 'city', 'state', 'county', 'remarks', 'qslInfo']

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
            <tr key={checkin.serial}>
              {fields.map((field, col) => {
                const DataComponent = DATA_COMPONENTS[field] || DATA_COMPONENTS.default
                return (
                  <DataComponent
                    checkin={checkin}
                    field={field}
                    row={row}
                    col={col}
                    net={net}
                    key={`${checkin.serial}-${field}`}
                  />
                )
              })}
            </tr>
          ))}
      </tbody>
    </table>
  )
}
