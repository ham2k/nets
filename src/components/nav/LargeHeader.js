import React from 'react'
import { Link } from 'react-router-dom'

export default function LargeHeader() {
  return (
    <header className="Header larger">
      <h1>
        <Link to={'/'}>
          📻 ham2k <strong>Nets</strong>
        </Link>
      </h1>
    </header>
  )
}
