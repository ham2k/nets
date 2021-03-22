import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeadphones, faBook } from '@fortawesome/free-solid-svg-icons'

import { setNetLocalCallsignInfo } from '../../data/netlogger'
import { insertRecord } from '../../data/qrz/qrzActions'

/* ================================================================================================================== */
export default function CheckinControls({ net, checkin, localInfo, operator, activeControls }) {
  const dispatch = useDispatch()

  const onWorkedClick = useCallback(
    (ev) => {
      let newInfo = undefined

      if (localInfo.worked) newInfo = { worked: false, notWorked: true }
      else if (localInfo.notWorked) newInfo = { worked: false, notWorked: false }
      else newInfo = { worked: true, notWorked: false }

      if (newInfo) {
        dispatch(
          setNetLocalCallsignInfo({ slug: net.slug, info: { [checkin.Callsign]: { ...localInfo, ...newInfo } } })
        )
      }

      ev.stopPropagation()
      ev.preventDefault()
    },
    [dispatch, checkin, localInfo, net]
  )

  const onReceptionClick = useCallback(
    (ev) => {
      let newInfo = undefined

      if (localInfo.heard) newInfo = { heard: false, notHeard: true }
      else if (localInfo.notHeard) newInfo = { heard: false, notHeard: false }
      else newInfo = { heard: true, notHeard: false }

      if (newInfo) {
        dispatch(
          setNetLocalCallsignInfo({ slug: net.slug, info: { [checkin.Callsign]: { ...localInfo, ...newInfo } } })
        )
      }

      ev.stopPropagation()
      ev.preventDefault()
    },
    [dispatch, checkin, localInfo, net]
  )

  const onSaveToQRZ = useCallback(
    (ev) => {
      const nowStr = new Date().toISOString()
      const nowDate = nowStr.slice(0, 10).replaceAll('-', '')
      const nowTime = nowStr.slice(11, 19).replaceAll(':', '')

      dispatch(
        insertRecord({
          record: {
            call: checkin.Callsign,
            qso_date: nowDate,
            time_on: nowTime,
            rst_rcvd: localInfo.signalReceived,
            rst_sent: localInfo.signalSent,
            name: checkin.Name,
            band: net.Band,
            mode: net.Mode,
            freq: net.Frequency,
            qth: checkin.City,
            state: checkin.State,
            cnty: checkin.Cnty,
            dxcc: checkin.DXCC,
            country: checkin.Country,
            App_NetLogger_Preferred_Name: checkin.PreferredName,
            operator: operator,
            station_callsign: operator,
            App_NetLogger_Net: net.NetName,
            comment: net.NetName,
          },
        })
      ).then(() => {
        dispatch(
          setNetLocalCallsignInfo({
            slug: net.slug,
            info: { [checkin.Callsign]: { ...localInfo, savedToQRZ: true } },
          })
        )
      })

      ev.stopPropagation()
      ev.preventDefault()
    },
    [dispatch, checkin, localInfo, net, operator]
  )

  return (
    <div className="CheckinControls">
      {checkin.Callsign && checkin.Callsign === operator ? <span className="you">YOU</span> : ''}

      {checkin.statuses.checkedOut && <span className="secondary">Checked Out</span>}
      {checkin.statuses.notResponding && <span className="secondary">Not Responding</span>}
      {checkin.statuses.unavailable && <span className="secondary">Unavailable</span>}

      {checkin.operating && <span className="operating">Current</span>}

      {activeControls ? (
        <div className="no-wrap">
          <button onClick={onReceptionClick}>
            <FontAwesomeIcon icon={faHeadphones} />
          </button>
          {localInfo.notHeard && <span>Not Heard</span>}
          {localInfo.heard && <span className="heard">HEARD</span>}
        </div>
      ) : (
        <>
          {localInfo.notHeard && <span>Not Heard</span>}
          {localInfo.heard && <span className="heard">HEARD</span>}
        </>
      )}

      {activeControls ? (
        <div className="no-wrap">
          <button onClick={onWorkedClick}>
            <FontAwesomeIcon icon={faBook} />
          </button>
          {localInfo.worked && (
            <span>
              <span className="worked">Worked</span>
              <label htmlFor="logging-signal-sent">
                Sent{' '}
                <input
                  value={localInfo.signalSent || ''}
                  size={4}
                  disabled={localInfo.savedToQRZ}
                  onChange={(ev) =>
                    dispatch(
                      setNetLocalCallsignInfo({
                        slug: net.slug,
                        info: { [checkin.Callsign]: { ...localInfo, signalSent: ev.target.value } },
                      })
                    )
                  }
                />
              </label>
              <label htmlFor="logging-signal-received">
                Rec'd{' '}
                <input
                  value={localInfo.signalReceived || ''}
                  size={4}
                  disabled={localInfo.savedToQRZ}
                  onChange={(ev) =>
                    dispatch(
                      setNetLocalCallsignInfo({
                        slug: net.slug,
                        info: { [checkin.Callsign]: { ...localInfo, signalReceived: ev.target.value } },
                      })
                    )
                  }
                />
              </label>
              {localInfo.savedToQRZ ? <button disabled>QRZ!</button> : <button onClick={onSaveToQRZ}>&gt; QRZ</button>}
            </span>
          )}
          {localInfo.notWorked && <span>Not Worked</span>}
        </div>
      ) : (
        <>
          {localInfo.worked && <span className="worked">Worked</span>}
          {localInfo.notWorked && <span>Not Worked</span>}
        </>
      )}
    </div>
  )
}
