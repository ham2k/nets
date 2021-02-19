import React from 'react'
import { useSelector } from 'react-redux'
import { selectNets } from '../store/nets'

export default function Nets() {
  const nets = useSelector(selectNets)

  if (nets.length > 0) {
    return (
      <div>
        Nets
        {nets.map((net) => (
          <div key={net.name}>• {net.name}</div>
        ))}
      </div>
    )
  } else {
    return <div />
  }
}
