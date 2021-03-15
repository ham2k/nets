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
            📻 Ham2K <strong>Nets</strong> <span className="smaller">v0.1</span>
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
