import React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons'

const NetSelectionRow = ({ net, currentSlug, onSelect }) => {
  return (
    <li
      className={classNames(currentSlug === net.slug && 'current')}
      onClick={(ev) => {
        if (ev.defaultPrevented) return
        ev.preventDefault()
        onSelect && onSelect(net)
      }}
    >
      <div className="icon">
        <a href={`/${net.slug}`}>
          <FontAwesomeIcon icon={faProjectDiagram} />
        </a>
      </div>
      <div>
        <a href={`/${net.slug}`}>{net.NetName}</a>
        <div className="secondary">
          {net.Band}
          {' • '}
          {net.Frequency} MHz {net.Mode}
        </div>
      </div>
    </li>
  )
}

export default NetSelectionRow
