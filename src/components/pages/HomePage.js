import React from 'react'

import Header from '../nav/Header'
import NetsSelection from '../nets/NetsSelection'

function HomePage() {
  return (
    <>
      <Header className="larger" />
      <main className="HomePage overflow-auto">
        <NetsSelection />
      </main>
    </>
  )
}

export default HomePage
