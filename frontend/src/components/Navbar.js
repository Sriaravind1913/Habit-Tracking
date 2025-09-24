import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setTheme } from '../theme.js'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase-config.js'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('access')
  const [uiTick, setUiTick] = React.useState(0)
  const [firebaseUser, setFirebaseUser] = React.useState(null)

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      if (user && (!user.photoURL || user.photoURL === '')) {
        // Try to refresh user profile to get latest photoURL from provider
        user.reload?.().then(() => {
          setFirebaseUser(auth.currentUser)
        }).catch(()=>{})
      }
    })
    return () => unsub()
  }, [])

  function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    try { signOut(auth) } catch (_) {}
    navigate('/login')
  }

  return (
    React.createElement('header', { className: 'sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b dark:border-gray-700' },
      React.createElement('div', { className: 'container mx-auto px-4 py-3 flex items-center justify-between' },
        React.createElement(Link, { to: '/', className: 'font-bold text-lg' }, 'HabitTrack'),
        React.createElement('nav', { className: 'flex items-center gap-4' },
          React.createElement(Link, { to: '/', className: 'hover:underline' }, 'Home'),
          React.createElement(Link, { to: '/dashboard', className: 'hover:underline' }, 'Habits'),
          React.createElement(Link, { to: '/insights', className: 'hover:underline' }, 'Insights'),

          (function(){
            const isDark = document.documentElement.classList.contains('dark')
            const [pressed, setPressed] = [false, ()=>{}] // placeholder for inline events; not using extra state
            const bg = isDark
              ? 'radial-gradient(circle at 35% 35%, #1f2937 0%, #111827 45%, #0b1220 100%)'
              : 'radial-gradient(circle at 35% 35%, #ffffff 0%, #f3f4f6 50%, #e5e7eb 100%)'
            const border = isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'
            const icon = isDark ? '☾' : '☼'
            const iconColor = isDark ? '#cbd5e1' : '#374151'

            return React.createElement('button', {
              type: 'button',
              role: 'switch',
              'aria-checked': isDark,
              title: 'Toggle theme',
              onClick: () => {
                const current = document.documentElement.classList.contains('dark')
                setTheme(!current)
                setUiTick(x=>x+1)
              },
              onMouseEnter: (e)=>{ e.currentTarget.style.boxShadow = (document.documentElement.classList.contains('dark')
                ? '0 9px 16px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -4px 10px rgba(0,0,0,0.50)'
                : '0 9px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,1), inset 0 -4px 10px rgba(0,0,0,0.14)') },
              onMouseLeave: (e)=>{ e.currentTarget.style.boxShadow = (document.documentElement.classList.contains('dark')
                ? '0 6px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -4px 10px rgba(0,0,0,0.45)'
                : '0 6px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -4px 10px rgba(0,0,0,0.12)'); e.currentTarget.style.transform='translateY(0) scale(1)' },
              onMouseDown: (e)=>{ e.currentTarget.style.transform='translateY(1px) scale(0.97)'; e.currentTarget.style.boxShadow = (document.documentElement.classList.contains('dark')
                ? '0 3px 6px rgba(0,0,0,0.55), inset 0 2px 6px rgba(0,0,0,0.6)'
                : '0 3px 6px rgba(0,0,0,0.25), inset 0 2px 6px rgba(0,0,0,0.18)') },
              onMouseUp:   (e)=>{ e.currentTarget.style.transform='translateY(0) scale(1)' },
              style: {
                width: '40px',
                height: '40px',
                borderRadius: '9999px',
                background: bg,
                border: border,
                boxShadow: isDark
                  ? '0 10px 18px rgba(3,7,18,0.55), 0 2px 3px rgba(0,0,0,0.25), inset 0 2px 3px rgba(255,255,255,0.06), inset 0 -6px 14px rgba(0,0,0,0.55)'
                  : '0 10px 18px rgba(0,0,0,0.22), 0 2px 3px rgba(0,0,0,0.08), inset 0 2px 3px rgba(255,255,255,0.95), inset 0 -6px 14px rgba(0,0,0,0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 120ms ease, box-shadow 180ms ease'
              }
            },
              React.createElement('span', {
                'aria-hidden': true,
                style: {
                  color: iconColor,
                  fontSize: '16px',
                  transform: isDark ? 'translateX(0)' : 'translateX(0)',
                  transition: 'transform 280ms ease, opacity 220ms ease'
                }
              }, icon),
              // outer rim for beveled edge
              React.createElement('span', {
                'aria-hidden': true,
                style: {
                  position: 'absolute',
                  inset: '2px',
                  borderRadius: '9999px',
                  boxShadow: isDark
                    ? 'inset 0 1px 1px rgba(255,255,255,0.06), inset 0 -2px 4px rgba(0,0,0,0.6)'
                    : 'inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.12)'
                }
              }),
              React.createElement('span', {
                style: {
                  position: 'absolute',
                  width: '160%',
                  height: '160%',
                  left: '-20%',
                  top: isDark ? '55%' : '-55%',
                  background: isDark ? 'linear-gradient(180deg, rgba(99,102,241,0.25), rgba(0,0,0,0))' : 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0))',
                  transform: 'rotate(25deg)',
                  transition: 'top 320ms ease'
                }
              }),
              // soft drop shadow ellipse beneath to boost 3D
              React.createElement('span', {
                'aria-hidden': true,
                style: {
                  position: 'absolute',
                  bottom: '-18px',
                  width: '70%',
                  height: '26px',
                  borderRadius: '50%',
                  filter: 'blur(10px)',
                  background: isDark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.20)'
                }
              })
            )
          })(),
          firebaseUser
            ? React.createElement('div', { className: 'flex items-center gap-3' },
                React.createElement('button', { onClick: ()=>navigate('/profile'), className: 'flex items-center gap-2' },
                  (firebaseUser.photoURL || (firebaseUser.providerData && firebaseUser.providerData.find && (firebaseUser.providerData.find(p=>p.photoURL) || {}).photoURL) || (firebaseUser.providerData && firebaseUser.providerData[0] && firebaseUser.providerData[0].photoURL))
                    ? React.createElement('img', { src: firebaseUser.photoURL || (firebaseUser.providerData && firebaseUser.providerData.find && (firebaseUser.providerData.find(p=>p.photoURL) || {}).photoURL) || (firebaseUser.providerData && firebaseUser.providerData[0] && firebaseUser.providerData[0].photoURL), alt: firebaseUser.displayName || 'Profile', className: 'w-8 h-8 rounded-full border object-cover' })
                    : React.createElement('div', { className: 'w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border' },
                        React.createElement('span', { className: 'text-sm text-gray-700' }, (firebaseUser.displayName || 'U')[0])
                      )
                ),
                React.createElement('span', { className: 'text-sm hidden sm:inline text-gray-700 dark:text-gray-200' }, firebaseUser.displayName || firebaseUser.email || 'Profile'),
                React.createElement('button', { onClick: logout, className: 'px-3 py-1 rounded bg-gray-900 text-white' }, 'Logout')
              )
            : (token
                ? React.createElement('button', { onClick: logout, className: 'px-3 py-1 rounded bg-gray-900 text-white' }, 'Logout')
                : React.createElement(Link, { to: '/login', className: 'px-3 py-1 rounded bg-gray-900 text-white' }, 'Login')
              )
        )
      )
    )
  )
}


