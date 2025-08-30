import React from 'react'

export default function ProgressTracker({ logs }) {
  return (
    React.createElement('div', { className: 'grid grid-cols-7 gap-1' },
      logs.map((log, idx) => (
        React.createElement('div', {
          key: idx,
          title: log.date,
          className: `h-6 rounded ${log.completed ? 'bg-green-500' : 'bg-red-400'}`,
        })
      ))
    )
  )
}


