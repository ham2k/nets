import React from 'react'

import Header from '../nav/Header'
import NetsSelection from '../nets/NetsSelection'
import NetsLoader from '../nets/NetsLoader'
import { useSelector } from 'react-redux'
import { activeNetsSelector } from '../../data/netlogger'
import { uiSelector } from '../../data/ui'

function HomePage() {
  const nets = useSelector(activeNetsSelector())
  const { currentSlug } = useSelector(uiSelector())

  return (
    <>
      <Header className="larger" />
      <main className="HomePage overflow-auto narrow-content">
        <NetsLoader />

        <NetsSelection nets={nets} currentSlug={currentSlug} />
      </main>
    </>
  )
}

export default HomePage
