/* eslint-disable no-unused-vars */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadADIFromUri, logSelector } from '../../data/logs'

export default function LogsSettings() {
  const dispatch = useDispatch()
  const log = useSelector(logSelector())

  const handleFileSelected = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      dispatch(loadADIFromUri({ uri: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <section className="LogSettings">
      <h4>
        Logs:
        {log?.records ? <span>{log.records.length} QSOs loaded</span> : <span>No log loaded</span>}
      </h4>
      <div>
        Load an ADIF log file: <input type="file" onChange={handleFileSelected} />
      </div>
    </section>
  )
}
