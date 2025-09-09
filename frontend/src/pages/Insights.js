import React, { useEffect, useState } from 'react'
import api from '../utils/api.js'

export default function Insights() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/dashboard/')
        setData(res.data)
      } catch (e) { /* ignore */ }
    }
    load()
  }, [])

  if (!data) return React.createElement('div', null, 'Loading...')
  return (
    React.createElement('div', { className: 'space-y-4' },
      React.createElement('div', { className: 'grid sm:grid-cols-3 gap-4' },
        React.createElement('div', { className: 'rounded border p-4 bg-white' },
          React.createElement('div', { className: 'text-sm text-gray-500' }, 'Completion (30d)'),
          React.createElement('div', { className: 'text-3xl font-bold' }, `${data.completion_rate}%`)
        ),
        React.createElement('div', { className: 'rounded border p-4 bg-white' },
          React.createElement('div', { className: 'text-sm text-gray-500' }, 'Best Streak'),
          React.createElement('div', { className: 'text-3xl font-bold' }, String(data.best_streak))
        ),
        React.createElement('div', { className: 'rounded border p-4 bg-white' },
          React.createElement('div', { className: 'text-sm text-gray-500' }, 'Total Habits'),
          React.createElement('div', { className: 'text-3xl font-bold' }, String(data.total_habits))
        ),
      ),
      React.createElement('div', { className: 'flex gap-3' },
        React.createElement('a', { href: '/api/export/csv/', className: 'px-3 py-2 rounded bg-gray-900 text-white', onClick: (e) => {
          e.preventDefault()
          window.open('/api/export/csv/', '_blank')
        } }, 'Export CSV'),
        React.createElement('a', { href: '/api/export/json/', className: 'px-3 py-2 rounded border', onClick: (e) => {
          e.preventDefault()
          window.open('/api/export/json/', '_blank')
        } }, 'Export JSON'),
      )
    )
  )
}


