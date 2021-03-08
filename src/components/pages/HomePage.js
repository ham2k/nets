import React from 'react'

import LargeHeader from '../nav/LargeHeader'
import NetsSelection from '../NetsSelection'

function App() {
  return (
    <>
      <LargeHeader />
      <main className="HomePage">
        <NetsSelection />
      </main>
    </>
  )
}

export default App
