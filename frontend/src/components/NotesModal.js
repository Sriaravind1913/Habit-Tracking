import React, { useEffect, useState } from 'react'

export default function NotesModal({ open, date, initialContent, onClose, onSave }) {
  const [content, setContent] = useState('')

  useEffect(() => {
    if (open) setContent(initialContent || '')
  }, [open, initialContent])

  if (!open) return null

  return (
    React.createElement('div', { className: 'fixed inset-0 bg-black/40 flex items-center justify-center p-4' },
      React.createElement('div', { className: 'bg-white rounded p-4 w-full max-w-lg' },
        React.createElement('div', { className: 'flex items-center justify-between mb-2' },
          React.createElement('h3', { className: 'font-semibold text-lg' }, `Notes for ${date}`),
          React.createElement('button', { onClick: onClose, className: 'px-2 py-1 border rounded' }, 'Close')
        ),
        React.createElement('textarea', {
          className: 'w-full min-h-40 border rounded px-3 py-2',
          placeholder: 'Write your reflection... ',
          value: content,
          onChange: e => setContent(e.target.value)
        }),
        React.createElement('div', { className: 'mt-3 flex justify-end gap-2' },
          React.createElement('button', { onClick: onClose, className: 'px-3 py-1 rounded border' }, 'Cancel'),
          React.createElement('button', { onClick: () => onSave(content), className: 'px-3 py-1 rounded bg-green-600 text-white' }, 'Save')
        )
      )
    )
  )
}


