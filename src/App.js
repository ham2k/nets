import React from 'react'
import { Switch, Route } from 'react-router-dom'

import HomePage from './components/pages/HomePage'
import NetPage from './components/pages/NetPage'
import SettingsPage from './components/pages/SettingsPage'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/app/settings">
          <SettingsPage />
        </Route>
        <Route path="/:slug">
          <NetPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      <footer>
        <b>Ham2K Nets</b> is an alternative client for <a href="http://netlogger.org/">NetLogger</a> developed by{' '}
        <a href="https://www.qrz.com/db/W2ASD">W2ASD</a> • <a href="https://twitter.com/sd">@sd</a>
      </footer>
    </div>
  )
}

export default App
