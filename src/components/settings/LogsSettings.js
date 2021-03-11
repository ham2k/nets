/* eslint-disable no-unused-vars */
import React, { Component, useState } from 'react'
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
    <div className="LogSettings">
      <label>{log?.records ? <span>{log.records.length} QSOs</span> : <span>No log</span>} </label>
      <input type="file" onChange={handleFileSelected} />
    </div>
  )
}
