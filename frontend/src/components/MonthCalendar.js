import React, { useMemo } from 'react'

function getMonthMatrix(year, month) {
  const first = new Date(Date.UTC(year, month, 1))
  const startDay = (first.getUTCDay() + 6) % 7 // Mon=0
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const cells = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function MonthCalendar({ year, month, marksByDate, onDayClick }) {
  const cells = useMemo(() => getMonthMatrix(year, month), [year, month])
  const monthName = new Date(Date.UTC(year, month, 1)).toLocaleString('en-US', { month: 'long' })

  return (
    React.createElement('div', { className: 'rounded border bg-white overflow-hidden' },
      React.createElement('div', { className: 'px-4 py-3 border-b flex items-center justify-between' },
        React.createElement('div', { className: 'font-semibold' }, `${monthName} ${year}`),
        React.createElement('div', { className: 'text-xs text-gray-500' }, 'Mon - Sun')
      ),
      React.createElement('div', { className: 'grid grid-cols-7 gap-px bg-gray-200' },
        ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
          React.createElement('div', { key: d, className: 'bg-white text-center text-xs py-1 text-gray-500' }, d)
        )),
      ),
      React.createElement('div', { className: 'grid grid-cols-7 gap-px bg-gray-200' },
        cells.map((d, idx) => {
          if (d === null) return React.createElement('div', { key: idx, className: 'bg-gray-50 h-16' })
          const iso = new Date(Date.UTC(year, month, d)).toISOString().slice(0,10)
          const mark = marksByDate && marksByDate[iso]
          const bg = mark === true ? 'bg-green-100' : mark === false ? 'bg-red-100' : 'bg-white'
          return React.createElement('button', {
            key: idx,
            className: `${bg} h-16 w-full text-left p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`,
            onClick: () => onDayClick && onDayClick(iso),
          },
            React.createElement('div', { className: 'text-xs text-gray-500' }, String(d)),
            mark === true ? React.createElement('div', { className: 'mt-2 text-green-700 text-xs' }, 'Done') : null,
            mark === false ? React.createElement('div', { className: 'mt-2 text-red-700 text-xs' }, 'Missed') : null
          )
        })
      )
    )
  )
}


