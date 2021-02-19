import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { selectNets, selectNetsMetadata, getNetsFromNetlogger } from '../store/nets'

export default function NetsLoader() {
  const nets = useSelector(selectNets)
  const meta = useSelector(selectNetsMetadata)

  const dispatch = useDispatch()

  return (
    <div>
      <div>
        {nets.length > 0 ? nets.length : 'no'} nets
        {meta.loading ? (
          <button disabled={true}>Loading…</button>
        ) : (
          <button onClick={() => dispatch(getNetsFromNetlogger())}>Reload</button>
        )}
      </div>
    </div>
  )
}
