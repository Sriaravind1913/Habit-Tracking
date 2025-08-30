import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import HabitCard from '../components/HabitCard.js'
import HabitFormModal from '../components/HabitFormModal.js'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Notifications from '../components/Notifications.js'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export default function Dashboard() {
  const [habits, setHabits] = useState([])
  const [stats, setStats] = useState({ total_habits: 0, completion_rate: 0, best_streak: 0 })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const navigate = useNavigate()

  const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } })

  useEffect(() => {
    if (!localStorage.getItem('access')) {
      navigate('/login')
      return
    }
    fetchData()
  }, [])

  async function fetchData() {
    const [h, d] = await Promise.all([
      axios.get(`${API}/habits/`, auth()),
      axios.get(`${API}/dashboard/`, auth()),
    ])
    const rows = h.data.map(x => ({ ...x, streak: 0 }))
    setHabits(rows)
    setStats(d.data)
  }

  async function addHabit(values) {
    const res = await axios.post(`${API}/habits/`, values, auth())
    setHabits(prev => [...prev, { ...res.data, streak: 0 }])
    setOpen(false); setEditing(null)
  }

  async function updateHabit(habitId, values) {
    const res = await axios.put(`${API}/habits/${habitId}/`, values, auth())
    setHabits(prev => prev.map(h => h.id === habitId ? { ...res.data, streak: h.streak } : h))
    setOpen(false); setEditing(null)
  }

  async function deleteHabit(habit) {
    await axios.delete(`${API}/habits/${habit.id}/`, auth())
    setHabits(prev => prev.filter(h => h.id !== habit.id))
  }

  async function toggleHabit(habit) {
    const today = new Date().toISOString().slice(0,10)
    try {
      // Toggle completion status
      await axios.post(`${API}/habits/${habit.id}/logs/`, { date: today, completed: true }, auth())
      
      // Refresh both habits list and dashboard stats
      const [h, d] = await Promise.all([
        axios.get(`${API}/habits/`, auth()),
        axios.get(`${API}/dashboard/`, auth())
      ])
      
      const updatedHabits = h.data.map(x => ({ ...x, streak: 0 }))
      setHabits(updatedHabits)
      setStats(d.data)
      
      // Show visual feedback
      const button = document.querySelector(`[data-habit-id="${habit.id}"]`)
      if (button) {
        button.classList.add('bg-green-500')
        setTimeout(() => button.classList.remove('bg-green-500'), 500)
      }
    } catch (error) {
      console.error('Failed to toggle habit:', error)
    }
  }

  function onDragEnd(result) {
    if (!result.destination) return
    const items = Array.from(habits)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    setHabits(items)
    const order = items.map((h, idx) => ({ id: h.id, order: idx }))
    axios.post(`${API}/habits/reorder/`, { order }, auth())
  }

  return (
    React.createElement('div', { className: 'space-y-6' },
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('h1', { className: 'text-2xl font-bold' }, 'Dashboard'),
        React.createElement('button', { className: 'px-3 py-2 rounded bg-gray-900 text-white', onClick: () => { setEditing(null); setOpen(true) } }, 'Add Habit')
      ),
      React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4' },
        React.createElement('div', { className: 'rounded border p-4 bg-white' },
          React.createElement('div', { className: 'text-sm text-gray-500' }, 'Total Habits'),
          React.createElement('div', { className: 'text-2xl font-bold' }, String(stats.total_habits))
        ),
        React.createElement('div', { className: 'rounded border p-4 bg-white' },
          React.createElement('div', { className: 'text-sm text-gray-500' }, 'Completion'),
          React.createElement('div', { className: 'text-2xl font-bold' }, `${stats.completion_rate}%`)
        ),
        React.createElement('div', { className: 'rounded border p-4 bg-white' },
          React.createElement('div', { className: 'text-sm text-gray-500' }, 'Best Streak'),
          React.createElement('div', { className: 'text-2xl font-bold' }, String(stats.best_streak))
        ),
      ),
      React.createElement(DragDropContext, { onDragEnd },
        React.createElement(Droppable, { droppableId: 'habits-list' }, (provided) => (
          React.createElement('div', { ...provided.droppableProps, ref: provided.innerRef, className: 'space-y-3' },
            habits.map((h, idx) => (
              React.createElement(Draggable, { key: h.id, draggableId: String(h.id), index: idx }, (prov) => (
                React.createElement('div', { ref: prov.innerRef, ...prov.draggableProps, ...prov.dragHandleProps },
                  React.createElement(HabitCard, { habit: h, onToggle: toggleHabit, onEdit: (x)=>{setEditing(x); setOpen(true)}, onDelete: deleteHabit })
                )
              ))
            )),
            provided.placeholder
          )
        ))
      ),
      React.createElement(Notifications),
      React.createElement(HabitFormModal, {
        open,
        initial: editing,
        onClose: () => { setOpen(false); setEditing(null) },
        onSave: (values) => editing ? updateHabit(editing.id, values) : addHabit(values)
      })
    )
  )
}


