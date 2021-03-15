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
        <b>ham2k Nets</b> is an alternative client for <a href="http://netlogger.org/">NetLogger</a> developed by{' '}
        <a href="mailto:w2asd@w2asd.net">W2ASD</a> • <a href="https://twitter.com/sd">@sd</a>
        <NetsLoader />
      </footer>
    </div>
  )
}

export default App
