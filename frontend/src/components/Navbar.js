import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setTheme } from '../theme.js'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('access')

  function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    navigate('/login')
  }

  return (
    React.createElement('header', { className: 'sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b dark:border-gray-700' },
      React.createElement('div', { className: 'container mx-auto px-4 py-3 flex items-center justify-between' },
        React.createElement(Link, { to: '/', className: 'font-bold text-lg' }, 'HabitTrack'),
        React.createElement('nav', { className: 'flex items-center gap-4' },
          React.createElement(Link, { to: '/', className: 'hover:underline' }, 'Home'),
          React.createElement(Link, { to: '/dashboard', className: 'hover:underline' }, 'Habits'),
          React.createElement(Link, { to: '/insights', className: 'hover:underline' }, 'Insights'),

          React.createElement('button', { 
            className: 'p-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors', 
            onClick: () => {
              const isDark = document.documentElement.classList.contains('dark')
              setTheme(!isDark)
            },
            title: 'Toggle theme'
          }, 
            React.createElement('span', { className: 'text-lg' }, 
              document.documentElement.classList.contains('dark') ? '☀️' : '🌙'
            )
          ),
          token
            ? React.createElement('button', { onClick: logout, className: 'px-3 py-1 rounded bg-gray-900 text-white' }, 'Logout')
            : React.createElement(Link, { to: '/login', className: 'px-3 py-1 rounded bg-gray-900 text-white' }, 'Login')
        )
      )
    )
  )
}


