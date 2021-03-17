import React from 'react'

import Header from '../nav/Header'
import NetsSelection from '../nets/NetsSelection'
import NetsLoader from '../nets/NetsLoader'

function HomePage() {
  return (
    <>
      <Header className="larger" />
      <main className="HomePage overflow-auto">
        <NetsLoader />

        <NetsSelection />
      </main>
    </>
  )
}

export default HomePage
