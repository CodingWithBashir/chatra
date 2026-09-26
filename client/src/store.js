const KEY = 'chatra.session.v1'

export function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null')
  } catch {
    return null
  }
}

export function saveSession(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function clearSession() {
  localStorage.removeItem(KEY)
}

export function ageFromDob(dob) {
  if (!dob) return 0
  const d = new Date(dob)
  if (Number.isNaN(d.getTime())) return 0
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
  return age
}

export function usernameOk(u) {
  if (!u) return { ok: false, reason: 'Required' }
  const name = u.replace(/^@/, '').toLowerCase()
  if (name.length < 3 || name.length > 20) return { ok: false, reason: '3–20 characters' }
  if (!/^[a-z0-9_]+$/.test(name)) return { ok: false, reason: 'Letters, numbers, underscore only' }
  const reserved = ['chatra', 'admin', 'support', 'system']
  if (reserved.includes(name)) return { ok: false, reason: 'Reserved' }
  const taken = ['niakodes', 'devafr']
  if (taken.includes(name)) return { ok: false, reason: 'Taken', suggestions: [`${name}_dev`, `${name}hq`, `the${name}`] }
  return { ok: true, name }
}
