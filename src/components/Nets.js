import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectNets } from '../store/nets'

export default function Nets() {
  const nets = useSelector(selectNets)

  const dispatch = useDispatch()

  if (nets.length > 0) {
    return <div>No nets</div>
  } else {
    return <div>{nets.length} logs</div>
  }
}
