import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Trophy, BookOpen } from 'lucide-react'
import passagesData from '../../data/reading/passages.json'
import { addXP } from '../../utils/progress'

export default function ReadingDetail() {
  const { passageId } = useParams()
  const passage = passagesData.passages.find(p => p.id === passageId)
  const [step, setStep] = useState('read') // read | quiz | results
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)

  if (!passage) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-2">Passage not found</p>
        <Link to="/reading" className="text-primary">Back to Reading</Link>
      </div>
    </div>
  )

  const q = passage.questions[qIdx]

  const handleAnswer = (opt) => {
    if (selected) return
    setSelected(opt)
    if (opt === q.correct) setScore(s => s + 1)
  }

  const next = () => {
    if (qIdx + 1 >= passage.questions.length) {
      setStep('results')
      addXP(30)
    } else {
      setQIdx(i => i + 1)
      setSelected(null)
    }
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/reading" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">{passage.emoji} {passage.title}</h1>
          <p className="text-sm text-gray-500">{passage.level} · {passage.readTime}</p>
        </div>
      </div>

      {step === 'read' && (
        <div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6">
            <div className="flex items-center gap-2 mb-4 text-blue-500"><BookOpen size={18} /><span className="text-sm font-semibold">Read the passage</span></div>
            {passage.text.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 last:mb-0">{para}</p>
            ))}
          </div>
          {passage.vocabulary && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30 mb-6">
              <p className="text-sm font-semibold text-amber-600 mb-2">Key Vocabulary</p>
              <div className="flex flex-wrap gap-2">
                {passage.vocabulary.map(v => (
                  <span key={v} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border">{v}</span>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => setStep('quiz')} className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold">
            Start Comprehension Quiz
          </button>
        </div>
      )}

      {step === 'quiz' && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(qIdx / passage.questions.length) * 100}%` }} />
            </div>
            <span className="text-sm text-gray-500">{qIdx + 1}/{passage.questions.length}</span>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-5">{q.question}</p>
            <div className="space-y-2">
              {q.options.map(opt => {
                let cls = 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                if (selected && opt === q.correct) cls = 'border-green-500 bg-green-50 dark:bg-green-900/20'
                else if (selected === opt && opt !== q.correct) cls = 'border-red-500 bg-red-50 dark:bg-red-900/20'
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 ${cls} transition-all text-sm font-medium text-gray-700 dark:text-gray-300`}>
                    {opt}
                  </button>
                )
              })}
            </div>
            {selected && <button onClick={next} className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-semibold">
              {qIdx + 1 >= passage.questions.length ? 'See Results' : 'Next Question'}
            </button>}
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="text-center py-12">
          <Trophy size={48} className="text-primary mx-auto mb-4" />
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-gray-900 dark:text-white mb-2">Reading Complete!</h2>
          <p className="text-gray-500 mb-1">{score}/{passage.questions.length} correct answers</p>
          <p className="text-primary font-semibold mb-6">+30 XP</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep('read'); setQIdx(0); setSelected(null); setScore(0) }}
              className="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300">Read Again</button>
            <Link to="/reading" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">More Passages</Link>
          </div>
        </div>
      )}
    </div>
  )
}
