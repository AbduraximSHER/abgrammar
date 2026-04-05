import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Zap, Flame, CheckCircle, BookOpen, RotateCcw, ArrowRight } from 'lucide-react'
import { getProgress, getXP, getStreak, getCompletedCount, resetProgress } from '../utils/progress'
import roadmapData from '../data/roadmap.json'

export default function Dashboard() {
  const [showReset, setShowReset] = useState(false)
  const progress = getProgress()
  const xp = getXP()
  const streak = getStreak()
  const completed = getCompletedCount()
  const allTopics = roadmapData.levels.flatMap(l => l.topics)
  const total = allTopics.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  // Recent completions
  const recent = Object.entries(progress)
    .filter(([_, v]) => v.completed)
    .sort((a, b) => new Date(b[1].date) - new Date(a[1].date))
    .slice(0, 5)

  // Next up
  const nextLesson = allTopics.find(t => !progress[t.id]?.completed)

  // Level stats
  const levelStats = roadmapData.levels.map(lvl => {
    const done = lvl.topics.filter(t => progress[t.id]?.completed).length
    return { ...lvl, done, total: lvl.topics.length, pct: Math.round((done / lvl.topics.length) * 100) }
  })

  const handleReset = () => {
    resetProgress()
    window.location.reload()
  }

  const stats = [
    { icon: CheckCircle, label: 'Completed', value: completed, sub: `of ${total} lessons`, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: Zap, label: 'Total XP', value: xp, sub: 'experience points', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { icon: Flame, label: 'Streak', value: `${streak} day${streak !== 1 ? 's' : ''}`, sub: 'keep it going!', color: 'text-primary', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { icon: Trophy, label: 'Progress', value: `${pct}%`, sub: 'overall mastery', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ]

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-500">Track your grammar learning journey</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className={`p-5 rounded-2xl ${s.bg} border border-gray-100 dark:border-gray-700/50`}>
            <s.icon size={22} className={`${s.color} mb-3`} />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Level Progress */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Level Progress</h2>
          {levelStats.map(lvl => (
            <div key={lvl.id} className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{lvl.emoji}</span>
                  <span className="font-medium text-sm text-gray-900 dark:text-white">{lvl.title}</span>
                </div>
                <span className="text-sm text-gray-500">{lvl.done}/{lvl.total}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${lvl.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Continue Learning */}
          {nextLesson && (
            <div className="p-5 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20">
              <p className="text-xs text-primary font-semibold mb-2 uppercase tracking-wide">Continue Learning</p>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{nextLesson.title}</h3>
              <Link to={`/lesson/${nextLesson.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
                Start <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Recent */}
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">Recently Completed</h2>
            {recent.length === 0 ? (
              <p className="text-sm text-gray-500">No lessons completed yet. <Link to="/roadmap" className="text-primary hover:underline">Start learning!</Link></p>
            ) : (
              <div className="space-y-2">
                {recent.map(([id, data]) => {
                  const topic = allTopics.find(t => t.id === id)
                  return (
                    <Link to={`/lesson/${id}`} key={id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <CheckCircle size={16} className="text-green-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{topic?.title || id}</p>
                        <p className="text-xs text-gray-400">{new Date(data.date).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Reset */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {!showReset ? (
              <button onClick={() => setShowReset(true)} className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                <RotateCcw size={12} /> Reset all progress
              </button>
            ) : (
              <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400 mb-2">Are you sure? This cannot be undone.</p>
                <div className="flex gap-2">
                  <button onClick={handleReset} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium">Yes, reset</button>
                  <button onClick={() => setShowReset(false)} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-xs font-medium">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
