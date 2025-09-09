import React, { useState, useEffect } from 'react'
import { scheduleDailyReminder, getReminder, to24Hour } from '../utils/reminders.js'

export default function HabitFormModal({ open, onClose, onSave, initial }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [target_frequency, setTargetFrequency] = useState('daily')
  const [start_date, setStartDate] = useState('')
  // time panel state
  const [timeFormat, setTimeFormat] = useState('24') // '24' | '12'
  const [time24, setTime24] = useState('09:00')
  const [hour12, setHour12] = useState('9')
  const [minute, setMinute] = useState('00')
  const [ampm, setAmPm] = useState('AM')

  useEffect(() => {
    if (initial) {
      setName(initial.name || '')
      setDescription(initial.description || '')
      setTargetFrequency(initial.target_frequency || 'daily')
      setStartDate(initial.start_date || '')
      // load existing reminder if any
      const key = String(initial.id || initial.name || '')
      const r = key ? (getReminder(key) || (initial.reminder_time ? { time24: initial.reminder_time } : null)) : null
      if (r && r.time24) {
        setTime24(r.time24)
        // also hydrate 12h controls
        const [h, m] = r.time24.split(':').map(x=>parseInt(x,10))
        const isPM = h >= 12
        const h12 = h % 12 === 0 ? 12 : h % 12
        setHour12(String(h12))
        setMinute(String(m).padStart(2,'0'))
        setAmPm(isPM ? 'PM' : 'AM')
      }
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
          // Time Panel
          React.createElement('div', { className: 'border rounded p-3', role: 'group', 'aria-labelledby': 'time-panel-label', style: { display: 'grid', gap: '8px' } },
            React.createElement('div', { id: 'time-panel-label', className: 'font-medium' }, 'Reminder Time'),
            React.createElement('div', { className: 'flex items-center gap-2 flex-wrap' },
              React.createElement('label', { className: 'text-sm' }, 'Format:'),
              React.createElement('select', { className: 'border rounded px-2 py-1', value: timeFormat, onChange: e=>setTimeFormat(e.target.value) },
                React.createElement('option', { value: '24' }, '24-hour'),
                React.createElement('option', { value: '12' }, 'AM/PM'),
              )
            ),
            timeFormat === '24'
              ? React.createElement('input', { type: 'time', className: 'w-full border rounded px-3 py-2', value: time24, onChange: e=>setTime24(e.target.value) })
              : React.createElement('div', { className: 'flex items-center gap-2' },
                  React.createElement('input', { 'aria-label': 'Hour', className: 'border rounded px-2 py-1 w-16', inputMode: 'numeric', value: hour12, onChange: e=>setHour12(e.target.value) }),
                  React.createElement('span', null, ':'),
                  React.createElement('input', { 'aria-label': 'Minute', className: 'border rounded px-2 py-1 w-16', inputMode: 'numeric', value: minute, onChange: e=>setMinute(e.target.value) }),
                  React.createElement('select', { 'aria-label': 'AM/PM', className: 'border rounded px-2 py-1', value: ampm, onChange: e=>setAmPm(e.target.value) },
                    React.createElement('option', { value: 'AM' }, 'AM'),
                    React.createElement('option', { value: 'PM' }, 'PM'),
                  )
                )
          ),
        ),
        React.createElement('div', { className: 'mt-4 flex justify-end gap-2' },
          React.createElement('button', { className: 'px-3 py-1 rounded border', onClick: onClose }, 'Cancel'),
          React.createElement('button', { className: 'px-3 py-1 rounded bg-gray-900 text-white', onClick: () => {
            const chosen24 = timeFormat === '24' ? time24 : to24Hour({ format: '12', hour12, minute, ampm })
            // persist and schedule reminder
            const key = String(initial?.id || name)
            if (name && key) {
              scheduleDailyReminder({ key, name, time24: chosen24, message: `It's time for ${name}! Stay consistent.` })
            }
            onSave({ name, description, target_frequency, start_date, reminder_time: chosen24 })
          } }, 'Save'),
        )
      )
    )
  )
}


