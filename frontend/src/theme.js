export function initTheme() {
  try {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = stored ? stored === 'dark' : prefersDark
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
  } catch (_) {}
}

export function setTheme(dark) {
  const root = document.documentElement
  if (dark) {
    root.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    root.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}


