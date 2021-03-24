import React from 'react'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTools } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
  return (
    <header className="Header">
      <h1 className="header-main">
        <Link to={'/'}>
          <span className="h2k">Ham2K</span>
          <span className="h2k-app">Nets</span>
        </Link>
      </h1>
      <div className="header-right">
        <Link to={'/app/settings'}>
          <FontAwesomeIcon icon={faTools} />
        </Link>
      </div>
    </header>
  )
}
