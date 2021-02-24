import React from 'react'

import './NetSelection.css'

function sortNets(nets) {
  const netArray = Object.keys(nets).map((name) => nets[name])
  return netArray.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
}

export default function NetsSelection({ nets, selected, onSelect }) {
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
            <span className="pill">{net.subscriberCount}</span>
            {' • '}
            {net.band}
            {' • '}
            {net.frequency} MHz {net.mode}
          </div>
        </li>
      ))}
    </ul>
  )
}
