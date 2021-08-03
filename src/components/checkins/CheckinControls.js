import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Grid, IconButton, TextField } from '@material-ui/core'
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

  const onWantedClick = useCallback(
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
      {activeControls ? (
        <div className="no-wrap">
          {localInfo.wanted ? (
            <>
              <Chip
                onClick={onWantedClick}
                variant="outlined"
                size="small"
                className="tagWanted"
                label="Wanted"
                icon={<StarIcon />}
              />
            </>
          ) : (
            <>
              <Chip
                onClick={onWantedClick}
                variant="outlined"
                size="small"
                className=""
                label="Wanted?"
                icon={<StarBorderIcon />}
              />
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
          {localInfo.worked && (
            <>
              <Chip
                onClick={onWorkedClick}
                variant="outlined"
                size="small"
                className="tagWorked"
                label="Worked"
                icon={<MenuBookIcon fontSize="inherit" />}
              />
              <TextField
                label="Sent"
                size="small"
                type="number"
                variant="outlined"
                style={{ width: '5em', marginLeft: '1em' }}
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
              <TextField
                label="Rcvd"
                size="small"
                type="number"
                variant="outlined"
                style={{ width: '5em', marginLeft: '1em' }}
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
              {localInfo.savedToQRZ ? (
                <Button disabled style={{ width: '6em', marginLeft: '1em' }}>
                  QRZ!
                </Button>
              ) : (
                <Button variant="contained" style={{ width: '6em', marginLeft: '1em' }} onClick={onSaveToQRZ}>
                  &gt; QRZ
                </Button>
              )}
            </>
          )}

          {localInfo.notWorked && (
            <Chip
              onClick={onWorkedClick}
              variant="outlined"
              size="small"
              className="tagNotWorked"
              label="Not Worked"
              icon={<MenuBookIcon fontSize="inherit" />}
            />
          )}

          {!localInfo.worked && !localInfo.notWorked && (
            <Chip
              onClick={onWorkedClick}
              variant="outlined"
              size="small"
              className="tagNotWorked"
              label="Worked?"
              icon={<MenuBookIcon fontSize="inherit" />}
            />
          )}
        </div>
      ) : (
        <>
          {localInfo.worked && (
            <Chip
              variant="outlined"
              size="small"
              className="tagWorked"
              label="Worked"
              icon={<MenuBookIcon fontSize="inherit" />}
            />
          )}
          {localInfo.notWorked && (
            <Chip
              variant="outlined"
              size="small"
              className="tagNotWorked"
              label="Not Worked"
              icon={<MenuBookIcon fontSize="inherit" />}
            />
          )}
        </>
      )}
    </Typography>
  )
}
