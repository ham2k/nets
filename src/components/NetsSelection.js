import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectNets } from '../data/netlogger'

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
  const nets = useSelector(selectNets)
  const sortedNets = sortNets(nets)

  return (
    <ul className="NetSelection">
      {sortedNets.map((net) => (
        <li key={net.NetName} className={selected === net.NetName ? 'selected' : ''}>
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
