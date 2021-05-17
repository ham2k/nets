import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { Container, makeStyles, Paper, Typography } from '@material-ui/core'

import Header from '../nav/Header'
import CallsignSettings from '../settings/CallsignSettings'
import LogsSettings from '../settings/LogsSettings'
import HuntingSettings from '../settings/HuntingSettings'
import QrzSettings from '../settings/QrzSettings'

import { uiSelector } from '../../data/ui'
import { netSelector } from '../../data/netlogger'
import Footer from '../nav/Footer'
import { Helmet } from 'react-helmet'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    flex: 0,
  },
  footer: {
    flex: 0,
  },
  content: {
    flex: 1,
    overflow: 'auto',
    '& .MuiPaper-root': {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    '& .MuiTextField-root': {
      marginRight: theme.spacing(2),
    },
  },
  subHeader: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(2),

    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  overflowContainer: {
    overflow: 'hidden',
    minHeight: 0,
  },
}))

function SettingsPage() {
  const classes = useStyles()

  const { currentSlug } = useSelector(uiSelector())
  const net = useSelector(netSelector(currentSlug))

  return (
    <div className={classNames('SettingsPage', classes.root, classes.overflowContainer)}>
      <Helmet>
        <title>Ham2k Nets - Settings</title>
      </Helmet>

      <Header className={classes.header} hideSettings={true} />
      <Paper className={classNames(classes.subHeader)} elevation={3}>
        <Typography component="h2" variant="h6" color="inherit" noWrap className={classes.title}>
          Settings
        </Typography>
        <div>{net && net.NetName && <Link to={`/${net.slug}`}>⬅ back to {net.NetName}</Link>}</div>
      </Paper>
      <Container maxWidth="md" className={classes.content}>
        <CallsignSettings />
        <HuntingSettings />
        <LogsSettings />
        <QrzSettings />
      </Container>
      <Paper square className={classNames(classes.footer)} elevation={3}>
        <Footer />
      </Paper>
    </div>
  )
}

export default SettingsPage
