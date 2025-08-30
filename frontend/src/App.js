import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import Landing from './pages/Landing.js'

import Insights from './pages/Insights.js'
import Onboarding from './pages/Onboarding.js'
import Dashboard from './pages/Dashboard.js'
import HabitDetails from './pages/HabitDetails.js'
import Login from './pages/Login.js'
import Signup from './pages/Signup.js'
import Profile from './pages/Profile.js'

export default function App() {
  return (
    React.createElement('div', { className: 'min-h-screen flex flex-col' },
      React.createElement(Navbar),
      React.createElement('main', { className: 'flex-1 container mx-auto px-4 py-6' },
        React.createElement(Routes, null,
          React.createElement(Route, { path: '/', element: React.createElement(Landing) }),

          React.createElement(Route, { path: '/insights', element: React.createElement(Insights) }),
          React.createElement(Route, { path: '/dashboard', element: React.createElement(Dashboard) }),
          React.createElement(Route, { path: '/onboarding', element: React.createElement(Onboarding) }),
          React.createElement(Route, { path: '/login', element: React.createElement(Login) }),
          React.createElement(Route, { path: '/signup', element: React.createElement(Signup) }),
          React.createElement(Route, { path: '/habits/:id', element: React.createElement(HabitDetails) }),
          React.createElement(Route, { path: '/profile', element: React.createElement(Profile) }),
          React.createElement(Route, { path: '*', element: React.createElement(Navigate, { to: '/', replace: true }) })
        )
      ),
      React.createElement(Footer)
    )
  )
}


