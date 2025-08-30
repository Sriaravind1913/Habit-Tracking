import React, { useState, useEffect } from 'react'

export default function HabitFormModal({ open, onClose, onSave, initial }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [target_frequency, setTargetFrequency] = useState('daily')
  const [start_date, setStartDate] = useState('')

  useEffect(() => {
    if (initial) {
      setName(initial.name || '')
      setDescription(initial.description || '')
      setTargetFrequency(initial.target_frequency || 'daily')
      setStartDate(initial.start_date || '')
    }
  }, [initial])

  if (!open) return null

  return (
    React.createElement('div', { className: 'fixed inset-0 bg-black/40 flex items-center justify-center p-4' },
      React.createElement('div', { className: 'bg-white rounded p-4 w-full max-w-md' },
        React.createElement('h3', { className: 'font-semibold text-lg mb-2' }, initial ? 'Edit Habit' : 'Add Habit'),
        React.createElement('div', { className: 'space-y-2' },
          React.createElement('input', { className: 'w-full border rounded px-3 py-2', placeholder: 'Name', value: name, onChange: e=>setName(e.target.value) }),
          React.createElement('textarea', { className: 'w-full border rounded px-3 py-2', placeholder: 'Description', value: description, onChange: e=>setDescription(e.target.value) }),
          React.createElement('select', { className: 'w-full border rounded px-3 py-2', value: target_frequency, onChange: e=>setTargetFrequency(e.target.value) },
            React.createElement('option', { value: 'daily' }, 'Daily'),
            React.createElement('option', { value: 'weekly' }, 'Weekly'),
          ),
          React.createElement('input', { type: 'date', className: 'w-full border rounded px-3 py-2', value: start_date, onChange: e=>setStartDate(e.target.value) }),
        ),
        React.createElement('div', { className: 'mt-4 flex justify-end gap-2' },
          React.createElement('button', { className: 'px-3 py-1 rounded border', onClick: onClose }, 'Cancel'),
          React.createElement('button', { className: 'px-3 py-1 rounded bg-gray-900 text-white', onClick: () => onSave({ name, description, target_frequency, start_date }) }, 'Save'),
        )
      )
    )
  )
}


