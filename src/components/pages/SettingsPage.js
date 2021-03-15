import React from 'react'

import Header from '../nav/Header'
import CallsignSettings from '../settings/CallsignSettings'
import LogsSettings from '../settings/LogsSettings'
import HuntingSettings from '../settings/HuntingSettings'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTools } from '@fortawesome/free-solid-svg-icons'

function SettingsPage() {
  return (
    <>
      <Header />
      <main className="SettingsPage overflow-auto">
        <section className="normal-content">
          <h2>
            <FontAwesomeIcon icon={faTools} /> Settings
          </h2>
          <CallsignSettings />
          <LogsSettings />
          <HuntingSettings />
        </section>
      </main>
    </>
  )
}

export default SettingsPage
