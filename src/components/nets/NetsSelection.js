import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons'

import { netsSelector } from '../../data/netlogger'

import './Nets.css'

/* ================================================================================================================== */
function sortNets(nets) {
  const netArray = Object.keys(nets || {}).map((name) => nets[name])
  return netArray.sort((a, b) => {
    if (a.NetName < b.NetName) return -1
    if (a.NetName > b.NetName) return 1
    return 0
  })
}

/* ================================================================================================================== */
export default function NetsSelection({ selected }) {
  const nets = useSelector(netsSelector())
  const sortedNets = sortNets(nets)
  const history = useHistory()

  return (
    <section className="normal-content content-60">
      <ul className="NetSelection">
        {sortedNets.map((net) => (
          <li
            key={net.slug}
            className={selected === net.slug ? 'selected' : ''}
            onClick={(ev) => {
              if (ev.defaultPrevented) return
              ev.preventDefault()

              history.push(`/${net.slug}`)
            }}
          >
            <Link to={`/${net.slug}`}>
              <FontAwesomeIcon icon={faProjectDiagram} /> {net.NetName}
            </Link>
            <div className="secondary">
              {net.Band}
              {' • '}
              {net.Frequency} MHz {net.Mode}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
