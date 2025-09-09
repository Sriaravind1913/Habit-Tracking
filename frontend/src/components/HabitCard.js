import React from 'react'

export default function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  return (
    React.createElement('div', { className: 'rounded border p-4 bg-white shadow-sm flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('div', { className: 'font-semibold' }, habit.name),
        React.createElement('div', { className: 'text-sm text-gray-500' }, habit.description),
        // Styled reminder chip (replaces plain text)
        habit.reminder_time ? (function(){
          const chipStyle = {
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 8px', borderRadius: '9999px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.05))',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 2px 6px rgba(0,0,0,0.10)',
            color: '#cbd5e1', fontSize: '12px', marginTop: '6px'
          }
          return React.createElement('div', { style: chipStyle },
            React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 24 24', 'aria-hidden': true, style: { filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.6))' } },
              React.createElement('circle', { cx: 12, cy: 12, r: 8, fill: 'none', stroke: '#94a3b8', strokeWidth: 2 }),
              React.createElement('path', { d: 'M12 8v5l3 2', fill: 'none', stroke: '#64748b', strokeWidth: 2, strokeLinecap: 'round' })
            ),
            `Reminds at ${habit.reminder_time}`
          )
        })() : null,
        // Styled streak chip (replaces plain text)
        (function(){
          const chipStyle = {
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 8px', borderRadius: '9999px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.05))',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 2px 6px rgba(0,0,0,0.10)',
            color: '#cbd5e1', fontSize: '12px', marginTop: '6px'
          }
          const good = (habit.streak || 0) > 0
          const stroke = good ? '#22c55e' : '#ef4444'
          return React.createElement('div', { style: chipStyle },
            React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 24 24', 'aria-hidden': true, style: { filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.6))' } },
              good
                ? React.createElement('path', { d: 'M5 13l4 4 10-10', fill: 'none', stroke: stroke, strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
                : React.createElement('path', { d: 'M6 6l12 12M18 6L6 18', stroke: stroke, strokeWidth: 2.5, strokeLinecap: 'round' })
            ),
            'Streak: ',
            React.createElement('span', { style: { color: good ? '#22c55e' : '#ef4444', fontWeight: 600 } }, String(habit.streak || 0))
          )
        })()
      ),
      React.createElement('div', { className: 'flex items-center gap-2' },
        // MARK: replace with accessible checkbox styled as 3D check/cross
        (function(){
          const today = new Date().toISOString().slice(0,10)
          const initialChecked = Array.isArray(habit.logs) ? habit.logs.some(l => l.date === today && !!l.completed) : false
          const [checked, setChecked] = React.useState(initialChecked)
          const id = `habit-toggle-${habit.id}`
          const size = 28
          const bg = checked ? '#16a34a' : '#ef4444'
          const shadow = checked
            ? '0 6px 12px rgba(0,0,0,0.25), inset 0 2px 2px rgba(255,255,255,0.35), inset 0 -4px 8px rgba(0,0,0,0.25)'
            : '0 6px 12px rgba(0,0,0,0.28), inset 0 2px 2px rgba(255,255,255,0.35), inset 0 -4px 8px rgba(0,0,0,0.3)'
          return React.createElement('label', {
            htmlFor: id,
            title: checked ? 'Unmark' : 'Mark completed',
            style: {
              width: size + 'px', height: size + 'px', borderRadius: '6px',
              background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: shadow, cursor: 'pointer', transition: 'transform 120ms ease, box-shadow 180ms ease'
            },
            onMouseDown: (e)=>{ e.currentTarget.style.transform='translateY(1px)'; },
            onMouseUp: (e)=>{ e.currentTarget.style.transform='translateY(0)'; },
          },
            React.createElement('input', {
              id,
              type: 'checkbox',
              checked,
              onChange: (ev)=>{ setChecked(ev.target.checked); onToggle(habit) },
              'data-habit-id': habit.id,
              'aria-checked': checked,
              'aria-label': checked ? 'Unmark habit' : 'Mark habit completed',
              style: { position: 'absolute', opacity: 0, width: 0, height: 0 }
            }),
            checked
              ? React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': true, style: { filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.4)) drop-shadow(0 3px 6px rgba(0,0,0,0.35))' } },
                  React.createElement('path', { d: 'M5 13l4 4 10-10', fill: 'none', stroke: 'white', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
                )
              : React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': true, style: { filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.35)) drop-shadow(0 3px 6px rgba(0,0,0,0.35))' } },
                  React.createElement('path', { d: 'M6 6l12 12M18 6L6 18', stroke: 'white', strokeWidth: 2.5, strokeLinecap: 'round' })
                )
          )
        })(),
        // EDIT button with 3D pencil icon
        React.createElement('button', {
          onClick: () => onEdit(habit),
          className: 'px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors',
          'aria-label': 'Edit habit',
          onMouseEnter: (e)=>{ e.currentTarget.style.boxShadow='0 6px 14px rgba(0,0,0,0.25), inset 0 2px 2px rgba(255,255,255,0.35)'; },
          onMouseLeave: (e)=>{ e.currentTarget.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.25)'; e.currentTarget.style.transform='translateY(0)'; },
          onMouseDown: (e)=>{ e.currentTarget.style.transform='translateY(1px)'; e.currentTarget.style.boxShadow='0 3px 8px rgba(0,0,0,0.25), inset 0 3px 6px rgba(0,0,0,0.2)'; },
          onMouseUp: (e)=>{ e.currentTarget.style.transform='translateY(0)'; }
        },
          React.createElement('span', { 'aria-hidden': true },
            React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', style: { filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.4)) drop-shadow(0 3px 6px rgba(0,0,0,0.35))' } },
              React.createElement('defs', null,
                React.createElement('linearGradient', { id: 'g-pencil', x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
                  React.createElement('stop', { offset: '0%', stopColor: '#ffffff', stopOpacity: 0.9 }),
                  React.createElement('stop', { offset: '100%', stopColor: '#dbeafe', stopOpacity: 0.85 })
                )
              ),
              React.createElement('rect', { x: 2, y: 2, width: 20, height: 20, rx: 4, fill: 'url(#g-pencil)', opacity: 0.18 }),
              React.createElement('path', { d: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z', fill: 'white' }),
              React.createElement('path', { d: 'M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z', fill: 'white' })
            )
          )
        ),
        // DELETE button with 3D cross icon
        React.createElement('button', {
          onClick: () => onDelete(habit),
          className: 'px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors',
          'aria-label': 'Delete habit',
          onMouseEnter: (e)=>{ e.currentTarget.style.boxShadow='0 6px 14px rgba(0,0,0,0.28), inset 0 2px 2px rgba(255,255,255,0.35)'; },
          onMouseLeave: (e)=>{ e.currentTarget.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.25)'; e.currentTarget.style.transform='translateY(0)'; },
          onMouseDown: (e)=>{ e.currentTarget.style.transform='translateY(1px)'; e.currentTarget.style.boxShadow='0 3px 8px rgba(0,0,0,0.25), inset 0 3px 6px rgba(0,0,0,0.2)'; },
          onMouseUp: (e)=>{ e.currentTarget.style.transform='translateY(0)'; }
        },
          React.createElement('span', { 'aria-hidden': true },
            React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', style: { filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.4)) drop-shadow(0 3px 6px rgba(0,0,0,0.35))' } },
              React.createElement('defs', null,
                React.createElement('linearGradient', { id: 'g-cross', x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
                  React.createElement('stop', { offset: '0%', stopColor: '#ffffff', stopOpacity: 0.9 }),
                  React.createElement('stop', { offset: '100%', stopColor: '#fee2e2', stopOpacity: 0.85 })
                )
              ),
              React.createElement('rect', { x: 2, y: 2, width: 20, height: 20, rx: 4, fill: 'url(#g-cross)', opacity: 0.18 }),
              React.createElement('path', { d: 'M6 6l12 12M18 6L6 18', stroke: 'white', strokeWidth: 2.5, strokeLinecap: 'round' })
            )
          )
        )
      )
    )
  )
}


