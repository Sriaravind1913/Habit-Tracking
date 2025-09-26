import React from 'react'

export default function Notifications() {
  const [status, setStatus] = React.useState(typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported')
  const [showHelp, setShowHelp] = React.useState(false)

  React.useEffect(() => {
    if (!('Notification' in window)) return
    setStatus(Notification.permission)
  }, [])

  async function requestPermission() {
    if (!('Notification' in window)) return
    if (Notification.permission === 'denied') {
      setShowHelp(true)
      return
    }
    const perm = await Notification.requestPermission()
    setStatus(perm)
    if (perm === 'granted') {
      new Notification('HabitTrack', { body: 'Welcome! We will remind you to check your habits.' })
    } else if (perm === 'denied') {
      setShowHelp(true)
    }
  }

  return (
    React.createElement('div', { className: 'rounded border p-3 bg-white' },
      React.createElement('div', { className: 'font-semibold mb-1' }, 'Notifications'),
      React.createElement('div', { className: 'text-sm text-gray-600 mb-2' }, 'Enable browser notifications for gentle reminders.'),
      status === 'granted'
        ? React.createElement('div', { className: 'text-sm text-green-600' }, 'Notifications are enabled.')
        : React.createElement('button', { onClick: requestPermission, className: 'px-3 py-1 rounded bg-gray-900 text-white' }, status === 'denied' ? 'How to enable' : 'Enable'),
      showHelp && React.createElement('div', { className: 'mt-3 text-sm text-gray-700 space-y-2' },
        React.createElement('div', null, 'Notifications are blocked by your browser.'),
        React.createElement('div', null, 'To enable them:'),
        React.createElement('ul', { className: 'list-disc pl-5 space-y-1' },
          React.createElement('li', null, 'Click the lock icon next to the URL.'),
          React.createElement('li', null, 'Open Site settings (or Permissions).'),
          React.createElement('li', null, 'Find Notifications and set to Allow.'),
        ),
        React.createElement('div', { className: 'text-xs text-gray-500' },
          'Help: ',
          React.createElement('a', { href: 'https://support.google.com/chrome/answer/3220216', target: '_blank', rel: 'noreferrer', className: 'underline' }, 'Chrome'),
          ' · ',
          React.createElement('a', { href: 'https://support.mozilla.org/en-US/kb/push-notifications-firefox', target: '_blank', rel: 'noreferrer', className: 'underline' }, 'Firefox'),
          ' · ',
          React.createElement('a', { href: 'https://support.apple.com/guide/safari/sfri40734/mac', target: '_blank', rel: 'noreferrer', className: 'underline' }, 'Safari')
        )
      )
    )
  )
}


