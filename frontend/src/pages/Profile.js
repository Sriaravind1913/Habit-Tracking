import React, { useEffect, useState } from 'react'

export default function Profile() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [dark])

  return (
    React.createElement('div', { className: 'space-y-4' },
      React.createElement('h1', { className: 'text-2xl font-bold' }, 'Profile / Settings'),
      React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('input', { id: 'darkmode', type: 'checkbox', checked: dark, onChange: e=>setDark(e.target.checked) }),
        React.createElement('label', { htmlFor: 'darkmode' }, 'Dark mode')
      )
    )
  )
}


