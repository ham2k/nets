import React from 'react'

import Header from '../nav/Header'
import CallsignSettings from '../settings/CallsignSettings'
import LogsSettings from '../settings/LogsSettings'
import HuntingSettings from '../settings/HuntingSettings'
import QrzSettings from '../settings/QrzSettings'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTools } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { uiSelector } from '../../data/ui'
import { netSelector } from '../../data/netlogger'
import { Link } from 'react-router-dom'

function SettingsPage() {
  const { currentSlug } = useSelector(uiSelector())
  const net = useSelector(netSelector(currentSlug))

  return (
    <>
      <Header showSettings={false} />
      <main className="SettingsPage narrow-content">
        <section className="">
          <div className="flex-row-baseline">
            <h2>
              <FontAwesomeIcon icon={faTools} /> Settings
            </h2>

            <div>{net && net.NetName && <Link to={`/${net.slug}`}>⬅ back to {net.NetName}</Link>}</div>
          </div>
          <CallsignSettings />
          <HuntingSettings />
          <LogsSettings />
          <QrzSettings />
        </section>
      </main>
    </>
  )
}

export default SettingsPage
