import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Newspaper, Clock, ArrowRight } from 'lucide-react'
import passagesData from '../../data/reading/passages.json'

const levelColors = {
  beginner: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600',
  elementary: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600',
  intermediate: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-600',
  'upper-intermediate': 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-600',
  advanced: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600',
}

export default function ReadingList() {
  const [filter, setFilter] = useState('all')
  const levels = ['all', 'beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced']
  const filtered = filter === 'all' ? passagesData.passages : passagesData.passages.filter(p => p.level === filter)

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Newspaper size={22} className="text-blue-500" />
          </div>
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Reading</h1>
        </div>
        <p className="text-gray-500 text-lg">Read stories and passages, then test your understanding</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {levels.map(l => (
          <button key={l} onClick={() => setFilter(l)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === l ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            }`}>
            {l === 'all' ? 'All Levels' : l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(p => (
          <Link to={`/reading/${p.id}`} key={p.id}
            className="group block p-5 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{p.emoji}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full border ${levelColors[p.level]}`}>{p.level}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{p.readTime}</span>
                    <span>{p.questions.length} questions</span>
                  </div>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-primary transition-colors mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
