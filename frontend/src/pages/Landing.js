import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    React.createElement('section', { className: 'text-center py-16' },
      React.createElement('div', { className: 'max-w-2xl mx-auto space-y-6' },
        React.createElement('h1', { className: 'text-4xl sm:text-5xl font-extrabold tracking-tight' }, 'Build better days, one habit at a time'),
        React.createElement('p', { className: 'text-gray-600' }, 'A calm, focused habit tracker to help you show up consistently.'),
        React.createElement(Link, { to: '/signup', className: 'inline-block px-6 py-3 rounded bg-green-600 text-white' }, 'Get Started')
      )
    )
  )
}


