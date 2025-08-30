import React from 'react'

export default function Notifications() {
  async function requestPermission() {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      new Notification('HabitTrack', { body: 'Welcome! We will remind you to check your habits.' })
    }
  }

  return (
    React.createElement('div', { className: 'rounded border p-3 bg-white' },
      React.createElement('div', { className: 'font-semibold mb-1' }, 'Notifications'),
      React.createElement('div', { className: 'text-sm text-gray-600 mb-2' }, 'Enable browser notifications for gentle reminders.'),
      React.createElement('button', { onClick: requestPermission, className: 'px-3 py-1 rounded bg-gray-900 text-white' }, 'Enable')
    )
  )
}


