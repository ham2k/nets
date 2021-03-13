import React from 'react'

import LargeHeader from '../nav/LargeHeader'
import NetsSelection from '../NetsSelection'

function App() {
  return (
    <>
      <LargeHeader />
      <main className="HomePage overflow-auto">
        <NetsSelection />
      </main>
    </>
  )
}

export default App
