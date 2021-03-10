import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import { netsSelector } from '../data/netlogger'

import './NetsSelection.css'

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
    <ul className="NetSelection">
      {sortedNets.map((net) => (
        <li
          key={net.NetName}
          className={selected === net.NetName ? 'selected' : ''}
          onClick={(ev) => {
            if (ev.defaultPrevented) return
            ev.preventDefault()

            history.push(`/${net.NetName}`)
          }}
        >
          <Link to={`/${net.NetName}`}>{net.NetName}</Link>
          <div className="secondary">
            {net.Band}
            {' • '}
            {net.Frequency} MHz {net.Mode}
          </div>
        </li>
      ))}
    </ul>
  )
}
