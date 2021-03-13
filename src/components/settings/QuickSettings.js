import React from 'react'

import LogsSettings from './LogsSettings'
import CallsignSettings from './CallsignSettings'

/* ================================================================================================================== */
export default function QuickSettings() {
  return (
    <div className="QuickSettings Settings">
      <LogsSettings />
      <CallsignSettings />
    </div>
  )
}
