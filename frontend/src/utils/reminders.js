// Simple daily reminder scheduler using Web Notifications and setTimeout
// Persists reminder configs in localStorage so they resume on reload

const STORAGE_KEY = 'habitReminders'

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (_e) {
    return {}
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (_e) {
    // ignore
  }
}

function minutesUntil(time24) {
  // time24: HH:MM (24-hour)
  const [hStr, mStr] = String(time24).split(':')
  const targetMinutes = parseInt(hStr, 10) * 60 + parseInt(mStr, 10)
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  let diff = targetMinutes - nowMinutes
  if (diff <= 0) diff += 24 * 60
  return diff
}

function msUntil(time24) {
  return minutesUntil(time24) * 60 * 1000
}

function showNotification(title, body) {
  if (typeof window === 'undefined') return
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body })
      return
    }
    if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') new Notification(title, { body })
        else alert(`${title}\n\n${body}`)
      })
      return
    }
  }
  alert(`${title}\n\n${body}`)
}

// Hold active timers in-memory so we can reschedule without duplicates
const activeTimers = {}

function scheduleLoop(key, cfg) {
  // cfg: { name, time24, message }
  const delay = msUntil(cfg.time24)
  clearTimeout(activeTimers[key])
  activeTimers[key] = setTimeout(function trigger() {
    showNotification(cfg.name, cfg.message || `It's time for ${cfg.name}! You got this.`)
    // schedule the next day
    activeTimers[key] = setTimeout(trigger, 24 * 60 * 60 * 1000)
  }, delay)
}

export function scheduleDailyReminder({ key, name, time24, message }) {
  // key can be habit id or name; must be unique per habit
  const store = readStore()
  store[key] = { name, time24, message }
  writeStore(store)
  scheduleLoop(key, store[key])
}

export function cancelReminder(key) {
  const store = readStore()
  delete store[key]
  writeStore(store)
  if (activeTimers[key]) {
    clearTimeout(activeTimers[key])
    delete activeTimers[key]
  }
}

export function getReminder(key) {
  const store = readStore()
  return store[key] || null
}

export function initializeReminders() {
  const store = readStore()
  Object.keys(store).forEach((key) => {
    scheduleLoop(key, store[key])
  })
}

export function to24Hour({ format, hour12, minute, ampm, time24 }) {
  if (format === '24') return time24 || '09:00'
  const h = Math.max(1, Math.min(12, parseInt(hour12 || '9', 10)))
  const m = Math.max(0, Math.min(59, parseInt(minute || '0', 10)))
  const isPM = (ampm || 'AM') === 'PM'
  const hh = ((h % 12) + (isPM ? 12 : 0)).toString().padStart(2, '0')
  const mm = m.toString().padStart(2, '0')
  return `${hh}:${mm}`
}


