import React from 'react'
import classNames from 'classnames'
import { Card, Link, makeStyles, Typography } from '@material-ui/core'

import GroupIcon from '@material-ui/icons/Group'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1.5),
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

export default function NetSelectionCard({ net, currentSlug, onSelect }) {
  const classes = useStyles()

  return (
    <Card
      className={classNames(classes.root, currentSlug === net.slug && 'current')}
      onClick={(ev) => {
        if (ev.defaultPrevented) return
        ev.preventDefault()
        onSelect && onSelect(net)
      }}
    >
      <div className={classes.icon}>
        <GroupIcon fontSize="large" />
      </div>
      <div className={classes.content}>
        <Typography component="div" variant="h6" color="inherit" className={classes.title}>
          <Link href={`/${net.slug}`} color="inherit">
            {net.NetName}
          </Link>
        </Typography>
        <Typography component="div" color="textSecondary" className={classes.secondary}>
          {net.Band}
          {' • '}
          {net.Frequency} MHz {net.Mode}
        </Typography>
      </div>
    </Card>
  )
}
