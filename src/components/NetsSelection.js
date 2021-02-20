import React from 'react'
import { useSelector } from 'react-redux'
import { selectNets } from '../store/nets'

export default function NetsSelection({ selected, onSelect }) {
  const nets = useSelector(selectNets)

  if (nets.length > 0) {
    return (
      <div>
        Nets
        {nets.map((net) => (
          <div
            key={net.name}
            onClick={() => onSelect && onSelect(net.name)}
            style={{
              cursor: 'pointer',
              fontWeight: selected === net.name ? 'bold' : 'normal',
            }}
          >
            • {net.name}
          </div>
        ))}
      </div>
    )
  } else {
    return <div />
  }
}
