import React, { useState } from 'react'
import classNames from 'classnames'

import { makeStyles } from '@material-ui/core'

import CheckinCard from './CheckinCard'

import checkinStyles from './checkinStyles'

const useStyles = makeStyles((theme) => ({
  ...checkinStyles(theme),
}))

//       // "leftMargin | controls | controls | controls | controls | info | rightMargin"\n
//       padding: 0,
//       '& > li': {
//         listStyle: 'none',
//         margin: 0,
//         padding: 0,
//         display: 'grid',
//         gridColumn: 'leftEdge / rightEdge',

//         '& .cardSerial': {
//           gridColumn: 'serial',
//         },
//       },
//     },
//   },
// }))

export default function CheckinsList({
  net,
  className,
  style,
  checkins,
  hunting,
  local,
  operator,
  log,
  operatingRef,
  operatorRef,
}) {
  const classes = useStyles()
  const [openCheckin, setOpenCheckin] = useState()

  const passthru = { net, checkins, operator, log, local, hunting }

  return (
    <div className={classNames(className, classes.list)} style={style}>
      {checkins
        .filter((checkin) => checkin)
        .map((checkin, index) => (
          <CheckinCard
            key={checkin.SerialNo}
            {...passthru}
            className={classes.card}
            checkin={checkin}
            index={index}
            isOpen={openCheckin === checkin.SerialNo}
            onClick={() => setOpenCheckin(openCheckin === checkin.SerialNo ? null : checkin.SerialNo)}
            operatingRef={operatingRef}
            operatorRef={operatorRef}
          />
        ))}
    </div>
  )
}
