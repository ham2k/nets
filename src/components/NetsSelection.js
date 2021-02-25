import React from 'react'
import { useSelector } from 'react-redux'

import { selectNets } from '../store/nets'

import './NetSelection.css'

/* ================================================================================================================== */
function sortNets(nets) {
  const netArray = Object.keys(nets).map((name) => nets[name])
  return netArray.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
}

/* ================================================================================================================== */
export default function NetsSelection({ selected, onSelect }) {
  const nets = useSelector(selectNets)
  const sortedNets = sortNets(nets)

  return (
    <ul className="NetSelection">
      {sortedNets.map((net) => (
        <li
          key={net.name}
          onClick={() => onSelect && onSelect(net.name)}
          className={selected === net.name ? 'selected' : ''}
        >
          {net.name}
          <div className="secondary">
            {net.band}
            {' • '}
            {net.frequency} MHz {net.mode}
          </div>
        </li>
      ))}
    </ul>
  )
}
