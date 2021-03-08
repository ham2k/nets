import React from 'react'
import { Link } from 'react-router-dom'

import './Header.css'

export default function LargeHeader() {
  return (
    <header className="Header LargeHeader">
      <h1>
        <Link to={'/'}>
          📻 ham2k <strong>Nets</strong>
        </Link>
      </h1>
    </header>
  )
}
