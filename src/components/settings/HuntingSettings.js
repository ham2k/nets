import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { huntingSelector, setHunting } from '../../data/settings'

/* ================================================================================================================== */
export default function HuntingSettings() {
  const dispatch = useDispatch()
  const hunting = useSelector(huntingSelector())

  return (
    <section className="HuntingSettings">
      <h3>Hunting</h3>
      <div>
        <label>
          <input
            type="checkbox"
            checked={hunting.states}
            onChange={(ev) => dispatch(setHunting({ states: ev.target.checked }))}
          />{' '}
          States
        </label>
        <label>
          <input
            type="checkbox"
            checked={hunting.callsigns}
            onChange={(ev) => dispatch(setHunting({ callsigns: ev.target.checked }))}
          />{' '}
          Callsigns
        </label>
      </div>
    </section>
  )
}
