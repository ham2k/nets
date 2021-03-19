import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons'

import CheckinsLoader from '../checkins/CheckinsLoader'
import { netCheckinsSelector } from '../../data/netlogger'
import { upcasedCallsignSelector } from '../../data/settings'

export default function NetHeader({ net, className, operatingRef, operatorRef }) {
  const checkins = useSelector(netCheckinsSelector(net.slug))
  const operator = useSelector(upcasedCallsignSelector())

  const checkinCount = checkins.filter((checkin) => checkin.Callsign).length
  const inactiveCheckinCount = checkins.filter(
    (checkin) => checkin.statuses.checkedOut || checkin.statuses.notResponding || checkin.statuses.unavailable
  ).length
  const currentCheckin = checkins.find((checkin) => checkin.operating)
  const selfCheckin = operator && checkins.find((checkin) => checkin.Callsign === operator)

  return (
    <section className={classNames(className, 'NetHeader', 'flex-col-stretch')}>
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

        <span>
          {checkinCount} checkins
          {inactiveCheckinCount > 0 ? `, ${checkinCount - inactiveCheckinCount} active` : ''}
        </span>

        {currentCheckin && (
          <span
            className="tag current clickable"
            onClick={(ev) => {
              operatingRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              ev.stopPropagation()
            }}
          >
            #{currentCheckin.SerialNo} <span className="callsign">{currentCheckin.Callsign}</span>{' '}
            {currentCheckin.PreferredName || currentCheckin.Name} is operating
          </span>
        )}

        {selfCheckin && (
          <span
            className="tag you clickable"
            onClick={(ev) => {
              if (currentCheckin.Callsign === operator)
                operatingRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              else operatorRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

              ev.stopPropagation()
            }}
          >
            You are #{selfCheckin.SerialNo} <span className="callsign">{selfCheckin.Callsign}</span>
          </span>
        )}
      </div>
    </section>
  )
}
