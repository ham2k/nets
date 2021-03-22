import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTools } from '@fortawesome/free-solid-svg-icons'

export default function Header({ className }) {
  return (
    <header className={classNames('Header', 'flex-col-stretch', className)}>
      <div className="flex-row-center">
        <h1 className="flex-1">
          <Link to={'/'}>
            <span className="h2k">Ham2K</span>
            <span className="h2k-app">Nets</span> <span className="smaller">v0.1</span>
          </Link>
        </h1>
        <div className="flex-1 align-right">
          <Link to={'/app/settings'}>
            <FontAwesomeIcon icon={faTools} />
          </Link>
        </div>
      </div>
    </header>
  )
}
