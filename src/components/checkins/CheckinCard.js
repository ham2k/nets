import React, { useMemo, useCallback } from 'react'
import classNames from 'classnames'
import { Chip, Link } from '@material-ui/core'

import MicIcon from '@material-ui/icons/Mic'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ChevronDownIcon from '@material-ui/icons/ExpandMore'

import CheckinControls from './CheckinControls'
import { classNamesFor } from './checkinHelpers'

/* ================================================================================================================== */
export default function CheckinCard({
  className,
  checkin,
  index,
  net,
  checkins,
  local,
  operator,
  log,
  hunting,
  isOpen,
  onClick,
  operatingRef,
  operatorRef,
}) {
  const localInfo = useMemo(() => local?.callsignInfo?.[checkin.Callsign] || {}, [local, checkin])

  const selectiveOnClick = useCallback(
    (ev) => {
      if (ev.defaultPrevented) return
      if (ev.target?.tagName === 'A') return
      if (ev.target?.tagName === 'INPUT') return
      if (ev.target?.tagName === 'BUTTON') return
      if (ev.target?.tagName === 'LABEL') return
      if (ev.target?.tagName === 'TEXTAREA') return

      ev.stopPropagation()
      ev.preventDefault()
      onClick && onClick(ev)
    },
    [onClick]
  )

  return (
    <div
      className={classNames(
        className,
        'checkinCard',
        'clickable unselectable',
        (index + 1) % 2 === 0 ? 'even' : 'odd',
        isOpen ? 'open' : 'closed',
        ...classNamesFor({ checkin, net, operator, log, localInfo, hunting })
      )}
      ref={
        (checkin.operating && operatingRef) ||
        (operator && checkin.Callsign && checkin.Callsign === operator && operatorRef) ||
        undefined
      }
      onClick={selectiveOnClick}
    >
      <div className="cardSerial">
        {checkin.SerialNo}
        {isOpen ? <ChevronDownIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
      </div>

      <div className="cardCallsign">
        {checkin.Callsign && (
          <span className={'callsign fieldCallsign selectable-text'}>
            {checkin.Callsign}
            {checkin.statuses.portable ? <strong>/P</strong> : ''}
            {checkin.statuses.mobile ? <strong>/M</strong> : ''}
          </span>
        )}
      </div>

      <div className="cardName selectable-text">
        <Link
          color="inherit"
          href={`https://www.qrz.com/db?query=${checkin.Callsign}&mode=callsign`}
          target="qrz"
          title={checkin.Name}
          className="fieldName segment"
        >
          {checkin.PreferredName || checkin.Name}
        </Link>
      </div>
      <div className="cardTags">
        {checkin.Callsign && checkin.Callsign === operator && <Chip size="small" className="tagSelf" label="YOU" />}
        {checkin.statuses.netControl && <Chip size="small" className="tagControl" label="Net Control" />}
        {checkin.statuses.relay && <Chip size="small" className="tagControl" label="Relay" />}
        {checkin.statuses.logger && <Chip size="small" className="tagControl" label="Logger" />}
        {checkin.statuses.vip && <Chip size="small" className="tagControl" label="VIP" />}

        {checkin.statuses.checkedOut && <Chip size="small" className="tagUnavailable" label="Checked Out" />}
        {checkin.statuses.notResponding && <Chip size="small" className="tagUnavailable" label="Not Responding" />}
        {checkin.statuses.unavailable && <Chip size="small" className="tagUnavailable" label="Unavailable" />}

        {checkin.operating && (
          <Chip variant="outlined" size="small" className="tagOperating" label="Operating" icon={<MicIcon />} />
        )}

        {checkin.MemberID && <span className="fieldMemberID segment">{checkin.MemberID}</span>}
      </div>

      <div className="cardLocation">
        <div className="fieldAddress selectable-text">
          {checkin.City ? (
            checkin.State ? (
              <span className="segment">
                {checkin.City},&nbsp;
                <span className="fieldState">{checkin.State}</span>
              </span>
            ) : (
              <span className="segment">{checkin.City}</span>
            )
          ) : (
            checkin.State && <span className="segment fieldState">{checkin.State}</span>
          )}
          {checkin.Country && <span className="segment">{checkin.Country}</span>}
          {checkin.County && <span className="segment">&nbsp;&nbsp;&nbsp;{checkin.County}</span>}
        </div>

        {checkin.statuses.other?.length >= 0 && (
          <div>
            {checkin.statuses.other?.map((status) => (
              <Chip size="small" className="tagOther" key={status} label={status} />
            ))}
          </div>
        )}
        {checkin.Remarks && (
          <div className="fieldRemarks selectable-text">
            {checkin.statuses.other?.length > 0 && <br />}
            <label>Remarks: </label>
            {checkin.Remarks}
          </div>
        )}
        {checkin.QSLInfo && (
          <div className="fieldQSLInfo selectable-text">
            <label>QSL Info: </label>
            {checkin.QSLInfo}
          </div>
        )}
      </div>

      <div className="cardControls">
        <CheckinControls
          net={net}
          checkin={checkin}
          localInfo={localInfo}
          operator={operator}
          activeControls={isOpen}
        />
      </div>
    </div>
  )
}
