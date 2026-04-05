import { useState } from 'react'
import { Pencil, Send, RotateCcw, CheckCircle, Lightbulb } from 'lucide-react'
import promptsData from '../../data/writing-prompts.json'
import { addXP } from '../../utils/progress'

const levelColors = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  elementary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  intermediate: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'upper-intermediate': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function WritingPage() {
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? promptsData.prompts : promptsData.prompts.filter(p => p.level === filter)
  const levels = ['all', 'beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced']

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  const handleSubmit = () => {
    setSubmitted(true)
    addXP(35)
  }

  const reset = () => {
    setSelectedPrompt(null)
    setText('')
    setSubmitted(false)
  }

  if (submitted) return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-10">
      <div className="text-center py-12">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-[var(--font-display)] text-3xl font-bold text-gray-900 dark:text-white mb-2">Great Writing!</h2>
        <p className="text-gray-500 mb-1">You wrote {wordCount} words</p>
        <p className="text-primary font-semibold mb-6">+35 XP</p>
        <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-left mb-6 max-w-lg mx-auto">
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{text}</p>
        </div>
        <button onClick={reset} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold flex items-center gap-2 mx-auto">
          <RotateCcw size={16} /> Write Another
        </button>
      </div>
    </div>
  )

  if (selectedPrompt) {
    const p = selectedPrompt
    return (
      <div className="min-h-screen max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => { setSelectedPrompt(null); setText('') }} className="text-sm text-gray-500 hover:text-primary mb-4 block">← Back to prompts</button>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{p.emoji}</span>
            <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">{p.title}</h1>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${levelColors[p.level]}`}>{p.level}</span>
        </div>

        <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800/30 mb-4">
          <p className="text-gray-700 dark:text-gray-300">{p.prompt}</p>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30 mb-6">
          <div className="flex items-center gap-2 mb-2"><Lightbulb size={16} className="text-amber-500" /><span className="text-sm font-semibold text-amber-600">Tips</span></div>
          <ul className="space-y-1">
            {p.hints.map((h, i) => <li key={i} className="text-sm text-gray-600 dark:text-gray-400">• {h}</li>)}
          </ul>
        </div>

        <div className="relative">
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Start writing here..."
            rows={10}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 focus:border-primary outline-none text-gray-900 dark:text-white resize-none leading-relaxed" />
          <div className="absolute bottom-3 right-3 flex items-center gap-3">
            <span className={`text-xs font-medium ${wordCount >= p.wordLimit ? 'text-green-500' : 'text-gray-400'}`}>
              {wordCount}/{p.wordLimit} words
            </span>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={wordCount < 10}
          className="w-full mt-4 py-3.5 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-40">
          <Send size={16} /> Submit Writing
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
            <Pencil size={22} className="text-purple-500" />
          </div>
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Writing</h1>
        </div>
        <p className="text-gray-500 text-lg">Practice your English writing with guided prompts</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {levels.map(l => (
          <button key={l} onClick={() => setFilter(l)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
              filter === l ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
            {l === 'all' ? 'All' : l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(p => (
          <button key={p.id} onClick={() => setSelectedPrompt(p)}
            className="text-left p-5 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{p.emoji}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${levelColors[p.level]}`}>{p.level}</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{p.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{p.prompt}</p>
            <p className="text-xs text-gray-400 mt-2">~{p.wordLimit} words</p>
          </button>
        ))}
      </div>
    </div>
  )
}
