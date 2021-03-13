import React from 'react'
import { Switch, Route } from 'react-router-dom'

import HomePage from './components/pages/HomePage'
import NetPage from './components/pages/NetPage'
import NetsLoader from './components/NetsLoader'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/:slug">
          <NetPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      <footer>
        <NetsLoader />
      </footer>
    </div>
  )
}

export default App
