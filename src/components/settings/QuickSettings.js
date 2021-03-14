import React from 'react'

import LogsSettings from './LogsSettings'
import CallsignSettings from './CallsignSettings'
import HuntingSettings from './HuntingSettings'

import './Settings.css'

/* ================================================================================================================== */
export default function QuickSettings() {
  return (
    <div className="QuickSettings">
      <CallsignSettings />
      <LogsSettings />
      <HuntingSettings />
    </div>
  )
}
