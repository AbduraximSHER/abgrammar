import { Link } from 'react-router-dom'
import { BookA, ArrowRight } from 'lucide-react'
import topicsData from '../../data/vocabulary/topics.json'

const colorMap = {
  green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
}

export default function VocabularyList() {
  const groupedByLevel = topicsData.levels.map(level => ({
    ...level,
    topics: topicsData.topics.filter(t => t.level === level.id)
  }))

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookA size={22} className="text-primary" />
          </div>
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Vocabulary</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Learn new words by topics — from greetings to academic English</p>
      </div>

      <div className="space-y-8">
        {groupedByLevel.map(level => (
          level.topics.length > 0 && (
            <div key={level.id}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{level.emoji}</span>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{level.title}</h2>
                <span className="text-sm text-gray-400">· {level.topics.length} topics</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {level.topics.map(topic => (
                  <Link to={`/vocabulary/${topic.id}`} key={topic.id}
                    className={`group p-5 rounded-2xl border ${colorMap[level.color]} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{topic.emoji}</span>
                      <ArrowRight size={16} className="text-gray-300 group-hover:text-primary transition-colors mt-1" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{topic.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{topic.description}</p>
                    <span className="text-xs font-medium text-gray-400">{topic.wordCount} words</span>
                  </Link>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}
