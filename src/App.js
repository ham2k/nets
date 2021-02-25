import React, { useState } from 'react'

import './App.css'

import NetsSelection from './components/NetsSelection'
import NetsLoader from './components/NetsLoader'
import NetPanel from './components/NetPanel'

function App() {
  const [selectedNet, setSelectedNet] = useState()

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          📻 ham2k <strong>Nets</strong>
        </h1>
      </header>
      <nav>
        <NetsSelection selected={selectedNet} onSelect={(net) => setSelectedNet(net)} />
        <NetsLoader />
      </nav>
      <main>
        <NetPanel selected={selectedNet} />
      </main>
    </div>
  )
}

export default App
