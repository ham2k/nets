import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectCallsign, setCallsign } from '../../data/settings'

/* ================================================================================================================== */
export default function CallsignSettings() {
  const dispatch = useDispatch()
  const callsign = useSelector(selectCallsign()) || ''

  return (
    <span className="CallsignSettings">
      <label for={'callsign_settings'}>Callsign</label>
      <input
        id={'callsign_settings'}
        value={callsign}
        onChange={(e) => dispatch(setCallsign(e.target.value))}
        onBlur={(e) => dispatch(setCallsign(callsign.toUpperCase()))}
        size={8}
      />
    </span>
  )
}
