import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import QuickSettings from '../settings/QuickSettings'

export default function LargeHeader() {
  const [settingsToggle, setSettingsToggle] = useState(false)

  return (
    <header className="Header flex-col-stretch">
      <div className="flex-row-center">
        <h1 className="flex-1">
          <Link to={'/'}>
            📻 ham2k <strong>Nets</strong>
          </Link>
        </h1>
        <div className="flex-1 align-right">
          <button onClick={() => setSettingsToggle(!settingsToggle)}>
            {settingsToggle ? 'Hide Settings' : 'Show Settings'}
          </button>
        </div>
      </div>
      {settingsToggle && (
        <div className="Settings flex-1">
          <QuickSettings />
        </div>
      )}
    </header>
  )
}
