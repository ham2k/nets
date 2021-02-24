import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import './App.css'

import NetsSelection from './components/NetsSelection'
import NetsLoader from './components/NetsLoader'
import NetPanel from './components/NetPanel'

import { selectNets } from './store/nets'

function App() {
  const [selectedNet, setSelectedNet] = useState()
  const nets = useSelector(selectNets)

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          📻 ham2k <strong>Nets</strong>
        </h1>
      </header>
      <nav>
        <NetsSelection nets={nets} selected={selectedNet} onSelect={(net) => setSelectedNet(net)} />
        <NetsLoader />
      </nav>
      <main>
        <NetPanel net={nets[selectedNet]} />
      </main>
    </div>
  )
}

export default App
