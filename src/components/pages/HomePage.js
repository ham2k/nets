import React, { useCallback } from 'react'

import Header from '../nav/Header'
import NetsSelection from '../nets/NetsSelection'
import NetsLoader from '../nets/NetsLoader'
import { useSelector } from 'react-redux'
import { activeNetsSelector } from '../../data/netlogger'
import { uiSelector } from '../../data/ui'
import { Container, IconButton, makeStyles, Paper } from '@material-ui/core'
import classNames from 'classnames'
import Footer from '../nav/Footer'
import { Helmet } from 'react-helmet-async'
import AddIcon from '@material-ui/icons/Add'

import baseStyles from '../../styles/styles'
import { useHistory } from 'react-router'

const useStyles = makeStyles((theme) => ({
  ...baseStyles(theme),

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
    marginTop: theme.spacing(1),
  },
  content: {
    flex: 1,
    overflow: 'auto',
    paddingBottom: theme.spacing(2),
  },
  subHeader: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    marginBottom: theme.spacing(1),

    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
  },
}))

function HomePage() {
  const classes = useStyles()

  const nets = useSelector(activeNetsSelector())
  const { currentSlug } = useSelector(uiSelector())

  const history = useHistory()

  const newNetHandler = useCallback(() => {
    history.push('/*new*')
  }, [history])

  return (
    <div className={classNames('HomePage', classes.root, classes.overflowContainer)}>
      <Helmet>
        <title>Ham2k Nets</title>
      </Helmet>

      <Header className={classes.header} />
      <Paper className={classNames(classes.sectionHeader)} elevation={3} square>
        <Container maxWidth="md" style={{ display: 'flex', flexDirection: 'row' }}>
          <NetsLoader />
          <div style={{ flex: 1 }} />
          <IconButton onClick={newNetHandler}>
            <AddIcon />
          </IconButton>
        </Container>
      </Paper>
      <Container maxWidth="md" className={classes.content}>
        <NetsSelection nets={nets} currentSlug={currentSlug} />
      </Container>
      <Paper square className={classNames(classes.footer)} elevation={3}>
        <Footer />
      </Paper>
    </div>
  )
}

export default HomePage
