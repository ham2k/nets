import React from 'react'
import './App.css'

import Nets from './components/Nets'
import NetsLoader from './components/NetsLoader'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>📻 Ham2K Nets</h1>
      </header>

      <Nets />
      <NetsLoader />
    </div>
  )
}

export default App
