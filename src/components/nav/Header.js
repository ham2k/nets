import React from 'react'
import { Link } from 'react-router-dom'

import QuickSettings from '../settings/QuickSettings'

export default function LargeHeader() {
  return (
    <header className="Header flex-row-center">
      <h1 className="flex-1">
        <Link to={'/'}>
          📻 ham2k <strong>Nets</strong>
        </Link>
      </h1>

      <div className="Settings flex-1 align-right">
        <QuickSettings />
      </div>
    </header>
  )
}
