import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTools, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

export default function Header({ className, children, hideSettings }) {
  return (
    <header className={classNames('Header', className)}>
      <h1 className="header-left no-wrap">
        <Link to={'/'}>
          <span className="inline-block pr-200">
            <FontAwesomeIcon icon={faChevronLeft} />
          </span>
          <span className="h2k">Ham2K</span>
          <span className="h2k-app">Nets</span>
        </Link>
      </h1>
      <div className="header-main">{children}</div>
      {!hideSettings && (
        <div className="header-right">
          <Link to={'/app/settings'}>
            <FontAwesomeIcon icon={faTools} />
          </Link>
        </div>
      )}
    </header>
  )
}
