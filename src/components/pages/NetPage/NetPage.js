import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import classNames from 'classnames'
import { Helmet } from 'react-helmet-async'
import { makeStyles } from '@material-ui/core'
import SplitPane from '../../../utils/split-pane/SplitPane'

import { netSelector, newNetSelector } from '../../../data/netlogger'
import { setUI } from '../../../data/ui'

import Header from '../../nav/Header'
import NetInfoSection from './NetInfoSection'
import NetCheckinsSection from './NetCheckinsSection'
import NetChatSection from './NetChatSection'

import baseStyles from '../../../styles/styles'

const useStyles = makeStyles((theme) => ({ ...baseStyles(theme) }))

/* ================================================================================================================== */
export default function NetPage() {
  const classes = useStyles()

  const dispatch = useDispatch()

  const { slug } = useParams()
  let net = useSelector(slug === '*new*' ? newNetSelector(slug) : netSelector(slug))
  useEffect(() => {
    dispatch(setUI({ currentSlug: net?.slug }))
  }, [dispatch, net?.slug])

  const [showCheckins, setShowCheckins] = React.useState(!net.isNew)
  const [showChat, setShowChat] = React.useState(!net.isNew)

  if (net && net.slug) {
    return (
      <div className={classNames('NetPage', classes.pageRoot)}>
        <Helmet>
          <title>{net.NetName} - Ham2k Nets</title>
        </Helmet>

        <Header className={classes.pageHeader} title={net.NetName} />

        <NetInfoSection net={net} expanded={net.isNew} style={{ flex: 0 }} />

        {showCheckins && showChat ? (
          <div style={{ flex: 1, position: 'relative' }}>
            <SplitPane split="horizontal" minSize={100} defaultSize={'65%'}>
              <NetCheckinsSection
                expanded={showCheckins}
                net={net}
                onAccordionChange={() => !net.isNew && setShowCheckins(!showCheckins)}
              />
              <NetChatSection
                expanded={showChat}
                net={net}
                onAccordionChange={() => !net.isNew && setShowChat(!showChat)}
              />
            </SplitPane>
          </div>
        ) : (
          <>
            <NetCheckinsSection
              expanded={showCheckins}
              net={net}
              onAccordionChange={() => !net.isNew && setShowCheckins(!showCheckins)}
            />
            <NetChatSection
              expanded={showChat}
              net={net}
              onAccordionChange={() => !net.isNew && setShowChat(!showChat)}
            />
          </>
        )}
      </div>
    )
  } else {
    return <Redirect to={'/'} />
  }
}
