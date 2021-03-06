import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Grid, IconButton, TextField } from '@material-ui/core'
import MicIcon from '@material-ui/icons/Mic'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import MenuBookIcon from '@material-ui/icons/MenuBook'

import { setNetLocalCallsignInfo } from '../../data/netlogger'
import { insertRecord } from '../../data/qrz/qrzActions'
import { Chip, Typography } from '@material-ui/core'

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
      dispatch(
        setNetLocalCallsignInfo({
          slug: net.slug,
          info: { [checkin.Callsign]: { ...localInfo, wanted: !localInfo.wanted } },
        })
      )

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
    <Typography variant="body2" component="div">
      {checkin.Callsign && checkin.Callsign === operator ? (
        <div>
          <Chip variant="outlined" size="small" className="tagSelf" label="YOU" />
        </div>
      ) : (
        ''
      )}

      {checkin.statuses.checkedOut && (
        <div>
          <Chip size="small" className="tagUnavailable" label="Checked Out" />
        </div>
      )}
      {checkin.statuses.notResponding && <Chip size="small" className="tagUnavailable" label="Not Responding" />}
      {checkin.statuses.unavailable && <Chip size="small" className="tagUnavailable" label="Unavailable" />}

      {checkin.operating && (
        <Chip variant="outlined" size="small" className="tagOperating" label="Operating" icon={<MicIcon />} />
      )}

      {activeControls ? (
        <div className="no-wrap">
          {localInfo.wanted ? (
            <>
              <IconButton onClick={onReceptionClick} className="tagWanted">
                <StarIcon fontSize="small" />
              </IconButton>
              <Chip variant="outlined" size="small" className="tagWanted" label="Wanted" icon={<StarIcon />} />
            </>
          ) : (
            <>
              <IconButton onClick={onReceptionClick} className="tagWanted">
                <StarBorderIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </div>
      ) : (
        <>
          {localInfo.wanted && (
            <Chip variant="outlined" size="small" className="tagWanted" label="Wanted" icon={<StarIcon />} />
          )}
        </>
      )}

      {activeControls ? (
        <div className="no-wrap">
          <IconButton onClick={onWorkedClick} className="tagWorked">
            <MenuBookIcon fontSize="small" />
          </IconButton>
          {localInfo.worked && (
            <>
              <Chip variant="outlined" size="small" className="tagWorked" label="Worked" />
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    label="Sent"
                    size="small"
                    type="number"
                    variant="outlined"
                    value={localInfo.signalSent || ''}
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
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Received"
                    size="small"
                    type="number"
                    variant="outlined"
                    value={localInfo.signalReceived || ''}
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
                </Grid>
                <Grid item xs={4}>
                  {localInfo.savedToQRZ ? (
                    <Button disabled>QRZ!</Button>
                  ) : (
                    <Button variant="contained" onClick={onSaveToQRZ}>
                      &gt; QRZ
                    </Button>
                  )}
                </Grid>
              </Grid>
            </>
          )}

          {localInfo.notWorked && <Chip variant="outlined" size="small" className="tagNotWorked" label="Not Worked" />}
        </div>
      ) : (
        <>
          {localInfo.worked && <Chip variant="outlined" size="small" className="tagWorked" label="Worked" />}
          {localInfo.notWorked && <Chip variant="outlined" size="small" className="tagNotWorked" label="Not Worked" />}
        </>
      )}
    </Typography>
  )
}
