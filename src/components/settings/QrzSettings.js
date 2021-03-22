import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { qrzSelector, setQrz } from '../../data/settings'
import { getLogbook } from '../../data/qrz'

/* ================================================================================================================== */
export default function QrzSettings() {
  const dispatch = useDispatch()
  const qrz = useSelector(qrzSelector())

  return (
    <section className="QrzSettings">
      <h3>QRZ.com Logging</h3>
      <label htmlFor={'qrz_key_settings'}>QRZ API Key:</label>
      <input
        id={'qrz_key_settings'}
        value={qrz.key}
        onChange={(e) => dispatch(setQrz({ key: e.target.value }))}
        size={24}
      />{' '}
      <button onClick={() => dispatch(getLogbook())}>Fetch Logbook</button>
    </section>
  )
}
