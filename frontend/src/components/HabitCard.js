import React from 'react'

export default function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  return (
    React.createElement('div', { className: 'rounded border p-4 bg-white shadow-sm flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('div', { className: 'font-semibold' }, habit.name),
        React.createElement('div', { className: 'text-sm text-gray-500' }, habit.description),
        React.createElement('div', { className: 'text-sm mt-1' }, 'Streak: ',
          React.createElement('span', { className: habit.streak > 0 ? 'text-green-600' : 'text-red-600' }, String(habit.streak || 0))
        )
      ),
      React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('button', { 
          onClick: () => onToggle(habit), 
          className: 'px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition-colors',
          'data-habit-id': habit.id
        }, 'Mark'),
        React.createElement('button', { onClick: () => onEdit(habit), className: 'px-3 py-1 rounded bg-blue-600 text-white' }, 'Edit'),
        React.createElement('button', { onClick: () => onDelete(habit), className: 'px-3 py-1 rounded bg-red-600 text-white' }, 'Delete')
      )
    )
  )
}


