import React from 'react'
import { Link } from 'react-router-dom'

import QuickSettings from '../settings/QuickSettings'

import './Header.css'

export default function LargeHeader() {
  return (
    <header className="Header">
      <h1>
        <Link to={'/'}>
          📻 ham2k <strong>Nets</strong>
        </Link>
      </h1>

      <div className="Settings">
        <QuickSettings />
      </div>
    </header>
  )
}
