import React from 'react'
import { useHistory } from 'react-router-dom'

import { AppBar, IconButton, Link, makeStyles, Toolbar, Typography } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import classNames from 'classnames'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
  },
  titleMain: {
    paddingRight: theme.spacing(2),
  },
}))

export default function Header({ className, children, title, hideSettings }) {
  const classes = useStyles()
  const history = useHistory()

  return (
    <AppBar position="static" className={classNames(className, classes.root)} role="banner">
      <Toolbar>
        {/* <IconButton color="inherit" aria-label="open drawer">
          <MenuIcon />
        </IconButton> */}
        <div className={classes.title}>
          {title ? (
            <Typography component="h1" variant="h5" color="inherit" noWrap className={classes.titleMain}>
              <Link
                href="/"
                color="inherit"
                onClick={(ev) => {
                  history.push('/')
                  ev.preventDefault()
                }}
              >
                Ham2K Nets:
              </Link>{' '}
              {title}
            </Typography>
          ) : (
            <Typography component="h1" variant="h4" color="inherit" noWrap className={classes.titleMain}>
              <Link
                href="/"
                color="inherit"
                onClick={(ev) => {
                  history.push('/')
                  ev.preventDefault()
                }}
              >
                Ham2K Nets
              </Link>
            </Typography>
          )}

          {children}
        </div>

        {!hideSettings && (
          <IconButton color="inherit" onClick={() => history.push('/app/settings')}>
            <SettingsIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  )
}
