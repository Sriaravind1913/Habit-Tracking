import React from 'react'
import { Link } from 'react-router-dom'

const Step = (title, body) => (
  React.createElement('div', { className: 'rounded border bg-white p-4 flex items-start gap-3' },
    React.createElement('div', { className: 'w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0' }, '✓'),
    React.createElement('div', null,
      React.createElement('div', { className: 'font-semibold' }, title),
      React.createElement('div', { className: 'text-sm text-gray-600' }, body)
    )
  )
)

export default function Onboarding() {
  return (
    React.createElement('div', { className: 'max-w-3xl mx-auto space-y-6' },
      React.createElement('h1', { className: 'text-3xl font-bold text-center' }, 'Welcome to HabitTrack'),
      React.createElement('p', { className: 'text-center text-gray-600' }, 'A calm, focused tracker to help you build better days.'),
      Step('Create a habit', 'Start small. Add one or two simple habits you can complete daily or weekly.'),
      Step('Track with the calendar', 'Tap any day to mark complete and jot down a quick reflection.'),
      Step('Review insights', 'See your progress each month and celebrate consistent effort.'),
      React.createElement('div', { className: 'text-center' },
        React.createElement(Link, { to: '/dashboard', className: 'inline-block px-6 py-3 rounded bg-green-600 text-white' }, 'Start Today')
      )
    )
  )
}


