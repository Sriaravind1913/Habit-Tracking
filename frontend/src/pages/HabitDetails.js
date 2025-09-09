import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api.js'
import ProgressTracker from '../components/ProgressTracker.js'
import MonthCalendar from '../components/MonthCalendar.js'
import NotesModal from '../components/NotesModal.js'

export default function HabitDetails() {
  const { id } = useParams()
  const [habit, setHabit] = useState(null)
  const [logs, setLogs] = useState([])
  const [notes, setNotes] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState('')
  const [modalInitial, setModalInitial] = useState('')

  useEffect(() => {
    async function load() {
      const [h, l, n] = await Promise.all([
        api.get(`/habits/${id}/`),
        api.get(`/habits/${id}/logs/`),
        api.get(`/habits/${id}/notes/`),
      ])
      setHabit(h.data)
      setLogs(l.data)
      setNotes(n.data)
    }
    load()
  }, [id])

  function marksByDate() {
    const map = {}
    logs.forEach(l => { map[l.date] = !!l.completed })
    return map
  }

  async function saveNote(content) {
    await api.post(`/habits/${id}/notes/`, { date: modalDate, content })
    // refresh notes
    const res = await api.get(`/habits/${id}/notes/`)
    setNotes(res.data)
    setModalOpen(false)
  }

  function openNoteFor(date) {
    setModalDate(date)
    const found = notes.find(n => n.date === date)
    setModalInitial(found ? found.content : '')
    setModalOpen(true)
  }

  if (!habit) return React.createElement('div', null, 'Loading...')
  return (
    React.createElement('div', { className: 'space-y-6' },
      React.createElement('h1', { className: 'text-2xl font-bold' }, habit.name),
      React.createElement('p', { className: 'text-gray-600' }, habit.description),
      React.createElement(MonthCalendar, { year: new Date().getFullYear(), month: new Date().getMonth(), marksByDate: marksByDate(), onDayClick: openNoteFor }),
      React.createElement('div', { className: 'space-y-2' },
        React.createElement('h3', { className: 'font-semibold' }, 'Recent Notes'),
        React.createElement('div', { className: 'space-y-2' },
          notes.slice(0, 5).map((n, i) => React.createElement('div', { key: i, className: 'rounded border p-3 bg-white' },
            React.createElement('div', { className: 'text-xs text-gray-500' }, n.date),
            React.createElement('div', null, n.content || '—')
          ))
        )
      ),
      React.createElement(NotesModal, { open: modalOpen, date: modalDate, initialContent: modalInitial, onClose: () => setModalOpen(false), onSave: saveNote })
    )
  )
}


