import React from 'react'

import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),

    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },

    textAlign: 'center',
  },
}))

export default function Footer({ className }) {
  const classes = useStyles()

  return (
    <footer className={classNames(className, classes.root)}>
      <b>Ham2K Nets</b> is an alternative client for <a href="http://netlogger.org/">NetLogger</a> developed by{' '}
      <a href="https://www.qrz.com/db/W2ASD">W2ASD</a> • <a href="https://twitter.com/sd">@sd</a>
    </footer>
  )
}
