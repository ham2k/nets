import React from 'react'

import Header from '../nav/Header'
import NetsSelection from '../nets/NetsSelection'
import NetsLoader from '../nets/NetsLoader'
import { useSelector } from 'react-redux'
import { activeNetsSelector } from '../../data/netlogger'
import { uiSelector } from '../../data/ui'
import { Container, makeStyles, Paper } from '@material-ui/core'
import classNames from 'classnames'
import Footer from '../nav/Footer'
import { Helmet } from 'react-helmet-async'

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
  container: {},
  overflowContainer: {
    overflow: 'hidden',
    minHeight: 0,
  },
}))

function HomePage() {
  const classes = useStyles()

  const nets = useSelector(activeNetsSelector())
  const { currentSlug } = useSelector(uiSelector())
  return (
    <div className={classNames('HomePage', classes.root, classes.overflowContainer)}>
      <Helmet>
        <title>Ham2k Nets</title>
      </Helmet>

      <Header className={classes.header} />
      <Paper className={classNames(classes.subHeader)} elevation={3}>
        <Container maxWidth="md">
          <NetsLoader />
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
