import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom'

import NetSelectionCard from './NetSelectionCard'

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
export default function NetsSelection({ nets, currentSlug }) {
  const history = useHistory()

  const sortedNets = useMemo(() => sortNets(nets), [nets])

  return (
    <div>
      {sortedNets.map((net) => (
        <NetSelectionCard
          key={net.slug}
          net={net}
          currentSlug={currentSlug}
          onSelect={() => history.push(`/${net.slug}`)}
        />
      ))}
    </div>
  )
}
