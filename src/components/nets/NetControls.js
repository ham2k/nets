import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import CheckinsLoader from '../checkins/CheckinsLoader'
import { netCheckinsSelector, netLocalSelector } from '../../data/netlogger'
import { upcasedCallsignSelector } from '../../data/settings'

export default function NetControls({ net, className, onViewChange, currentView }) {
  currentView = currentView || 'checkins'

  const checkins = useSelector(netCheckinsSelector(net.slug))
  const local = useSelector(netLocalSelector(net.slug))
  const operator = useSelector(upcasedCallsignSelector())

  const checkinCount = checkins.filter((checkin) => checkin.Callsign).length
  const inactiveCheckinCount = checkins.filter(
    (checkin) =>
      checkin.statuses.checkedOut ||
      checkin.statuses.notResponding ||
      checkin.statuses.unavailable ||
      local?.callsignInfo?.[checkin.Callsign]?.notHeard
  ).length
  const heardCount = checkins.filter((checkin) => local?.callsignInfo?.[checkin.Callsign]?.heard).length

  const currentCheckin = checkins.find((checkin) => checkin.operating)
  const selfCheckin = operator && checkins.find((checkin) => checkin.Callsign === operator)

  return (
    <div className={classNames(className, 'NetControls tabs')}>
      <section>
        {net.status !== 'active' && (
          <div>
            <strong>Net has ended</strong>
          </div>
        )}

        <div
          className={classNames('tab checkins', currentView === 'checkins' && 'current')}
          onClick={(ev) => {
            onViewChange && onViewChange('checkins')
            ev.stopPropagation()
          }}
        >
          {checkinCount} checkins
          {inactiveCheckinCount > 0 ? `, ${checkinCount - inactiveCheckinCount} active` : ''}
        </div>

        {(heardCount > 0 || currentView === 'heard') && (
          <div
            className={classNames('tab heard', currentView === 'heard' && 'current')}
            onClick={(ev) => {
              onViewChange && onViewChange('heard')
              ev.stopPropagation()
            }}
          >
            {heardCount} heard
          </div>
        )}

        {currentCheckin && (
          <div
            className="operating clickable"
            onClick={(ev) => {
              onViewChange && onViewChange('operating')
              ev.stopPropagation()
            }}
          >
            #{currentCheckin.SerialNo}{' '}
            <strong>
              <span className="callsign">{currentCheckin.Callsign}</span>{' '}
              {currentCheckin.PreferredName || currentCheckin.Name}
            </strong>{' '}
            is operating
          </div>
        )}

        {selfCheckin && (
          <div
            className="operator clickable"
            onClick={(ev) => {
              onViewChange && onViewChange('operator')
              ev.stopPropagation()
            }}
          >
            You are #{selfCheckin.SerialNo} <span className="callsign">{selfCheckin.Callsign}</span>
          </div>
        )}
        <div>
          <CheckinsLoader net={net} />
        </div>
      </section>
    </div>
  )
}
