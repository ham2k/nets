import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { callsignSelector, setCallsign, nameSelector, setName } from '../../data/settings'

/* ================================================================================================================== */
export default function CallsignSettings() {
  const dispatch = useDispatch()
  const callsign = useSelector(callsignSelector())
  const name = useSelector(nameSelector())

  return (
    <section className="CallsignSettings">
      <h3>Operator Settings</h3>
      <label htmlFor={'callsign_settings'}>Your callsign:</label>
      <input
        id={'callsign_settings'}
        value={callsign}
        onChange={(e) => dispatch(setCallsign(e.target.value))}
        onBlur={(e) => dispatch(setCallsign(callsign.toUpperCase()))}
        size={8}
      />{' '}
      <label htmlFor={'name_settings'}>Name:</label>
      <input
        id={'name_settings'}
        value={name}
        onChange={(e) => dispatch(setName(e.target.value))}
        onBlur={(e) => dispatch(setName(name.toUpperCase()))}
        size={8}
      />
    </section>
  )
}
