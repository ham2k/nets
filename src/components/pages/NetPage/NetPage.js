import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import classNames from 'classnames'
import { Helmet } from 'react-helmet-async'
import { makeStyles } from '@material-ui/core'
import SplitPane from '../../../utils/split-pane/SplitPane'

import { netSelector } from '../../../data/netlogger'
import { setUI } from '../../../data/ui'

import Header from '../../nav/Header'
import NetInfoSection from './NetInfoSection'
import NetCheckinsSection from './NetCheckinsSection'
import NetChatSection from './NetChatSection'

import baseStyles from './styles'

const useStyles = makeStyles((theme) => ({ ...baseStyles(theme) }))

/* ================================================================================================================== */
export default function NetPage() {
  const classes = useStyles()

  const dispatch = useDispatch()

  const { slug } = useParams()
  const net = useSelector(netSelector(slug))

  useEffect(() => {
    dispatch(setUI({ currentSlug: net?.slug }))
  }, [dispatch, net?.slug])

  const [showCheckins, setShowCheckins] = React.useState(true)
  const [showChat, setShowChat] = React.useState(true)

  if (net && net.slug) {
    return (
      <div className={classNames('NetPage', classes.pageRoot)}>
        <Helmet>
          <title>{net.NetName} - Ham2k Nets</title>
        </Helmet>

        <Header className={classes.pageHeader} title={net.NetName} />

        <NetInfoSection net={net} expanded={false} style={{ flex: 0 }} />

        {showCheckins && showChat ? (
          <div style={{ flex: 1, position: 'relative' }}>
            <SplitPane split="horizontal" minSize={100} defaultSize={'65%'}>
              <NetCheckinsSection
                expanded={showCheckins}
                slug={slug}
                onAccordionChange={() => setShowCheckins(!showCheckins)}
              />
              <NetChatSection expanded={showChat} slug={slug} onAccordionChange={() => setShowChat(!showChat)} />
            </SplitPane>
          </div>
        ) : (
          <>
            <NetCheckinsSection
              expanded={showCheckins}
              slug={slug}
              onAccordionChange={() => setShowCheckins(!showCheckins)}
            />
            <NetChatSection expanded={showChat} slug={slug} onAccordionChange={() => setShowChat(!showChat)} />
          </>
        )}
      </div>
    )
  } else {
    return <Redirect to={'/'} />
  }
}
