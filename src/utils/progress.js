const STORAGE_KEY = 'abg_progress'
const XP_KEY = 'abg_xp'
const STREAK_KEY = 'abg_streak'
const LAST_DATE_KEY = 'abg_last_date'

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch { return {} }
}

export function markComplete(lessonId) {
  const progress = getProgress()
  progress[lessonId] = { completed: true, date: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  addXP(25)
  updateStreak()
}

export function isComplete(lessonId) {
  return getProgress()[lessonId]?.completed || false
}

export function getCompletedCount() {
  return Object.values(getProgress()).filter(p => p.completed).length
}

export function getXP() {
  return parseInt(localStorage.getItem(XP_KEY) || '0', 10)
}

export function addXP(amount) {
  const current = getXP()
  localStorage.setItem(XP_KEY, String(current + amount))
}

export function getStreak() {
  return parseInt(localStorage.getItem(STREAK_KEY) || '0', 10)
}

export function updateStreak() {
  const today = new Date().toDateString()
  const lastDate = localStorage.getItem(LAST_DATE_KEY)
  
  if (lastDate === today) return
  
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  if (lastDate === yesterday) {
    localStorage.setItem(STREAK_KEY, String(getStreak() + 1))
  } else if (lastDate !== today) {
    localStorage.setItem(STREAK_KEY, '1')
  }
  localStorage.setItem(LAST_DATE_KEY, today)
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(XP_KEY)
  localStorage.removeItem(STREAK_KEY)
  localStorage.removeItem(LAST_DATE_KEY)
}
