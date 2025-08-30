import React from 'react'

export default function Footer() {
  const link = (href, label) => React.createElement('a', { href, className: 'hover:underline', target: '_blank', rel: 'noreferrer' }, label)
  return (
    React.createElement('footer', { className: 'border-t bg-white dark:bg-gray-800 dark:border-gray-700 mt-10' },
      React.createElement('div', { className: 'container mx-auto px-4 py-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between' },
                  React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, '© ', new Date().getFullYear(), ' HabitTrack'),
        React.createElement('div', { className: 'flex gap-4 text-sm' },
          React.createElement('a', { href: '/privacy', className: 'hover:underline' }, 'Privacy'),
          React.createElement('a', { href: '/terms', className: 'hover:underline' }, 'Terms'),
          React.createElement('a', { href: '/contact', className: 'hover:underline' }, 'Contact')
        )
      )
    )
  )
}


