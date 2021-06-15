import React from 'react'
import { useHistory } from 'react-router-dom'

import { AppBar, IconButton, Link, makeStyles, Toolbar, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import RadioIcon from '@material-ui/icons/Radio'
import SettingsIcon from '@material-ui/icons/Settings'
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos'
import classNames from 'classnames'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  untitledLeft: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'baseline',
  },
  titledLeft: {
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',

    [theme.breakpoints.down('sm')]: {
      width: 'inherit',
    },
    [theme.breakpoints.up('md')]: {
      width: '11rem',
    },
  },
  center: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    textAlign: 'center',
    maxHeight: '3rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  right: {
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    [theme.breakpoints.down('sm')]: {
      width: 'inherit',
    },
    [theme.breakpoints.up('md')]: {
      width: '11rem',
    },
  },
  toolbar: {
    justifyContent: 'space-around',
    [theme.breakpoints.up('xs')]: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  },
  titleMain: {
    [theme.breakpoints.up('xs')]: {
      fontSize: theme.typography.h6.fontSize,
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.h5.fontSize,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.h4.fontSize,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.h4.fontSize,
    },
  },
  titleSecondary: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.h6.fontSize,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.h6.fontSize,
    },
  },
  version: {
    paddingLeft: theme.spacing(2),
  },
}))

export default function Header({ className, children, title, hideSettings }) {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const smScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <AppBar position="static" className={classNames(className, classes.root)} role="banner">
      <Toolbar className={classNames(classes.toolbar)}>
        {/* <IconButton color="inherit" aria-label="open drawer">
          <MenuIcon />
        </IconButton> */}

        {title ? (
          <div className={classes.titledLeft}>
            {smScreen ? (
              <IconButton
                color="inherit"
                onClick={(ev) => {
                  history.push('/')
                  ev.preventDefault()
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <Typography component="h2" variant="h5" color="inherit" noWrap className={classes.titleSecondary}>
                <IconButton
                  color="inherit"
                  onClick={(ev) => {
                    history.push('/')
                    ev.preventDefault()
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Link
                  href="/"
                  color="inherit"
                  onClick={(ev) => {
                    history.push('/')
                    ev.preventDefault()
                  }}
                >
                  <RadioIcon style={{ fontSize: '120%', position: 'relative', top: '0.1em' }} /> Ham2K Nets
                </Link>
              </Typography>
            )}
          </div>
        ) : (
          <div className={classes.untitledLeft}>
            <Typography component="h1" variant="h4" color="inherit" noWrap className={classes.titleMain}>
              <Link
                href="/"
                color="inherit"
                onClick={(ev) => {
                  history.push('/')
                  ev.preventDefault()
                }}
              >
                <RadioIcon style={{ fontSize: '120%', position: 'relative', top: '0.1em' }} /> Ham2K Nets
              </Link>
            </Typography>
            <Typography component="div" color="inherit" noWrap className={classes.version}>
              v0.0.4-alpha
            </Typography>
          </div>
        )}

        <div className={classes.center}>
          {title && (
            <Typography component="h1" variant="h4" color="inherit" className={classes.titleMain}>
              {title}
            </Typography>
          )}

          {children}
        </div>

        <div className={classes.right}>
          {!hideSettings && (
            <IconButton color="inherit" onClick={() => history.push('/app/settings')}>
              <SettingsIcon />
            </IconButton>
          )}
        </div>
      </Toolbar>
    </AppBar>
  )
}
