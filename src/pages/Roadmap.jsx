import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Lock, Clock, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import roadmapData from '../data/roadmap.json'
import { isComplete, getCompletedCount } from '../utils/progress'

const levelColors = {
  '1': { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', badge: 'bg-green-500', text: 'text-green-600 dark:text-green-400', bar: 'bg-green-500' },
  '2': { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', badge: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' },
  '3': { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', badge: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-500' },
  '4': { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', badge: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
  '5': { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', badge: 'bg-red-500', text: 'text-red-600 dark:text-red-400', bar: 'bg-red-500' },
}

export default function Roadmap() {
  const [expandedLevel, setExpandedLevel] = useState('1')

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Learning Roadmap</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Follow the path from beginner to advanced grammar mastery</p>
      </div>

      <div className="space-y-4">
        {roadmapData.levels.map((level) => {
          const colors = levelColors[level.id] || levelColors['1']
          const completedInLevel = level.topics.filter(t => isComplete(t.id)).length
          const totalInLevel = level.topics.length
          const progress = totalInLevel > 0 ? (completedInLevel / totalInLevel) * 100 : 0
          const isExpanded = expandedLevel === level.id

          return (
            <div key={level.id} className={`rounded-2xl border ${colors.border} overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg' : ''}`}>
              {/* Level Header */}
              <button
                onClick={() => setExpandedLevel(isExpanded ? null : level.id)}
                className={`w-full px-6 py-5 flex items-center justify-between ${colors.bg} hover:opacity-90 transition-opacity`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{level.emoji}</span>
                  <div className="text-left">
                    <h2 className="font-semibold text-gray-900 dark:text-white text-lg">{level.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{level.subtitle} · {level.estimated_time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${colors.bar} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-500">{completedInLevel}/{totalInLevel}</span>
                  </div>
                  {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
              </button>

              {/* Topics List */}
              {isExpanded && (
                <div className="px-4 py-3 bg-white dark:bg-gray-900/50">
                  <div className="grid gap-2">
                    {level.topics.map((topic, i) => {
                      const done = isComplete(topic.id)
                      return (
                        <Link
                          to={`/lesson/${topic.id}`}
                          key={topic.id}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${
                            done
                              ? 'bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                              done ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                            }`}>
                              {done ? <CheckCircle size={16} /> : i + 1}
                            </div>
                            <div>
                              <h3 className={`font-medium text-sm ${done ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>{topic.title}</h3>
                              <p className="text-xs text-gray-400">{topic.summary}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} />{topic.estimated_time}</span>
                            <ArrowRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
