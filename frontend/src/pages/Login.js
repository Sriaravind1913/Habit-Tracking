import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password })
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      navigate('/')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    React.createElement('div', { className: 'max-w-sm mx-auto' },
      React.createElement('h1', { className: 'text-2xl font-bold mb-4' }, 'Login'),
      React.createElement('form', { onSubmit: submit, className: 'space-y-3' },
        React.createElement('input', { className: 'w-full border rounded px-3 py-2', placeholder: 'Username', value: username, onChange: e=>setUsername(e.target.value) }),
        React.createElement('input', { type: 'password', className: 'w-full border rounded px-3 py-2', placeholder: 'Password', value: password, onChange: e=>setPassword(e.target.value) }),
        error ? React.createElement('div', { className: 'text-red-600 text-sm' }, error) : null,
        React.createElement('button', { className: 'w-full px-3 py-2 rounded bg-gray-900 text-white' }, 'Sign In')
      ),
      React.createElement('div', { className: 'text-sm mt-2' }, 'No account? ', React.createElement(Link, { className: 'underline', to: '/signup' }, 'Sign up'))
    )
  )
}


