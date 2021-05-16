import React from 'react'
import { Switch, Route } from 'react-router-dom'

import HomePage from './components/pages/HomePage'
import NetPage from './components/pages/NetPage'
import SettingsPage from './components/pages/SettingsPage'
import { createMuiTheme, CssBaseline, lighten, makeStyles, responsiveFontSizes, ThemeProvider } from '@material-ui/core'

/* https://material.io/resources/color/ */
const baseTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#546e7a',
    },
    spotting_self: {
      main: '#0fa3a3',
    },
    spotting_control: {
      main: '#60f',
      bg: lighten('#60f', 0.8),
    },
    spotting_relay: {
      main: '#60f',
    },
    spotting_wanted: {
      main: '#107d10',

      bg: lighten('#107d10', 0.8),
      odd_bg: lighten('#107d10', 0.7),
    },
    spotting_worked: {
      main: '#e53935',
      bg: lighten('#eecbcb', 0.3),
      odd_bg: lighten('#eecbcb', 0.5),
    },
    spotting_hunting: {
      main: '#5a9216',
      contrastText: '#f8f8f8',
    },
    spotting_hunting_mixed: {
      main: '#aed581',
    },
    spotting_operating: {
      main: '#f229f2',
      bg: lighten('#f229f2', 0.75),
    },
  },
})
const theme = responsiveFontSizes(baseTheme)

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',

    '& .callsign': {
      fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;",
    },
    '& .clickable': {
      cursor: 'pointer !important',
    },
    '& unselectable': {
      userSelect: 'none',
      cursor: 'default',
    },
    '& .selectable-text': {
      userSelect: 'text',
      cursor: 'text',
    },
    '& .selectable-all': {
      userSelect: 'all',
      cursor: 'text',
    },
  },
}))

function App() {
  const classes = useStyles()

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
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
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
