import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeadphones, faBook } from '@fortawesome/free-solid-svg-icons'

import { setNetLocalCallsignInfo } from '../../data/netlogger'

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
    },
    [dispatch, checkin, localInfo, net]
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
          {localInfo.worked && <span className="worked">Worked</span>}
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
