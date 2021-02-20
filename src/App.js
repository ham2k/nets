import React, { useState } from 'react'
import './App.css'

import NetsSelection from './components/NetsSelection'
import NetsLoader from './components/NetsLoader'

function App() {
  const [selectedNet, setSelectedNet] = useState()

  return (
    <div className="App">
      <header className="App-header">
        <h1>📻 Ham2K Nets</h1>
      </header>
      <h2>{selectedNet}</h2>
      <NetsSelection selected={selectedNet} onSelect={(net) => setSelectedNet(net)} />

      <NetsLoader />
    </div>
  )
}

export default App
