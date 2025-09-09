import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.js'
import './index.css'
import { initTheme } from './theme.js'
import { initializeReminders } from './utils/reminders.js'

const container = document.getElementById('root')
const root = createRoot(container)
initTheme()
initializeReminders()
root.render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(App)
    )
  )
)


