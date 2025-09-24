import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase-config.js'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      await axios.post(`${API}/auth/register`, { username, email, password })
      const res = await axios.post(`${API}/auth/login`, { username, password })
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      navigate('/')
    } catch (err) {
      setError('Signup failed')
    }
  }

  async function signupWithGoogle() {
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (err) {
      setError('Google sign-in failed')
    }
  }

  return (
    React.createElement('div', { className: 'max-w-sm mx-auto' },
      React.createElement('h1', { className: 'text-2xl font-bold mb-4' }, 'Sign Up'),
      React.createElement('form', { onSubmit: submit, className: 'space-y-3' },
        React.createElement('input', { className: 'w-full border rounded px-3 py-2', placeholder: 'Username', value: username, onChange: e=>setUsername(e.target.value) }),
        React.createElement('input', { className: 'w-full border rounded px-3 py-2', placeholder: 'Email', value: email, onChange: e=>setEmail(e.target.value) }),
        React.createElement('input', { type: 'password', className: 'w-full border rounded px-3 py-2', placeholder: 'Password', value: password, onChange: e=>setPassword(e.target.value) }),
        error ? React.createElement('div', { className: 'text-red-600 text-sm' }, error) : null,
        React.createElement('button', { className: 'w-full px-3 py-2 rounded bg-gray-900 text-white' }, 'Create Account'),
        React.createElement('button', { type: 'button', onClick: signupWithGoogle, className: 'w-full px-3 py-2 rounded border border-gray-300 text-gray-900 bg-white flex items-center justify-center gap-2' },
          React.createElement('span', null, 'Continue with Google')
        )
      ),
      React.createElement('div', { className: 'text-sm mt-2' }, 'Have an account? ', React.createElement(Link, { className: 'underline', to: '/login' }, 'Login'))
    )
  )
}


