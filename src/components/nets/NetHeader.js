import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons'

import CheckinsLoader from '../checkins/CheckinsLoader'
import { netCheckinsSelector, netLocalSelector } from '../../data/netlogger'
import { upcasedCallsignSelector } from '../../data/settings'

export default function NetHeader({ net, className, onViewChange, currentView }) {
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
    <div className={classNames(className, 'NetHeader')}>
      <section className="flex-col-stretch">
        <div className="flex-row-baseline plr-100 pb-100">
          <FontAwesomeIcon icon={faProjectDiagram} className="flex-0 mr-100" />
          <div className="flex-2">
            <h2 className="p-0 m-0">{net.NetName}</h2>
            <div className="secondary">
              {net.Band} • {net.Frequency} MHz {net.Mode}
              {' • '}
              <span>Started at {new Date(net.Date).toLocaleTimeString([], { timeStyle: 'short' })}</span>
            </div>
          </div>

          <div className="align-right flex-1">
            <div className="secondary no-wrap">
              Net Control: <span className="callsign">{net.NetControl}</span>
            </div>
            <div className="secondary no-wrap">{net.SubscriberCount} subscribers</div>
          </div>
          <div className="flex-0 ml-200">
            <CheckinsLoader net={net} />
          </div>
        </div>
        <div className="NetHeader-status flex-row-baseline align-self-center pb-100">
          {net.status !== 'active' && (
            <span>
              <strong>Net has ended</strong>
            </span>
          )}

          <span
            className={classNames('tag checkins clickable', currentView === 'checkins' && 'current')}
            onClick={(ev) => {
              onViewChange && onViewChange('checkins')
              ev.stopPropagation()
            }}
          >
            {checkinCount} checkins
            {inactiveCheckinCount > 0 ? `, ${checkinCount - inactiveCheckinCount} active` : ''}
          </span>

          {(heardCount > 0 || currentView === 'heard') && (
            <span
              className={classNames('tag heard clickable', currentView === 'heard' && 'current')}
              onClick={(ev) => {
                onViewChange && onViewChange('heard')
                ev.stopPropagation()
              }}
            >
              {heardCount} heard
            </span>
          )}

          {currentCheckin && (
            <span
              className="tag operating clickable"
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
            </span>
          )}

          {selfCheckin && (
            <span
              className="tag operator clickable"
              onClick={(ev) => {
                onViewChange && onViewChange('operator')
                ev.stopPropagation()
              }}
            >
              You are #{selfCheckin.SerialNo} <span className="callsign">{selfCheckin.Callsign}</span>
            </span>
          )}
        </div>
      </section>
    </div>
  )
}
