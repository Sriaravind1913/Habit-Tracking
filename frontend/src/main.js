import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.js'
import './index.css'
import { initTheme } from './theme.js'

const container = document.getElementById('root')
const root = createRoot(container)
initTheme()
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


