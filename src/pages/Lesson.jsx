import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, BookOpen, Lightbulb, Trophy, RotateCcw } from 'lucide-react'
import { isComplete, markComplete } from '../utils/progress'
import roadmapData from '../data/roadmap.json'

export default function Lesson() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [step, setStep] = useState(0) // 0=context, 1=explanation, 2=exercises
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setLesson(null)
    setStep(0)
    setCurrentQ(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setFinished(false)
    setCompleted(isComplete(id))
    import(`../data/lessons/${id}.json`)
      .then(mod => { setLesson(mod.default); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [id])

  // Find next/prev lesson
  const allTopics = roadmapData.levels.flatMap(l => l.topics)
  const currentIdx = allTopics.findIndex(t => t.id === id)
  const prevLesson = currentIdx > 0 ? allTopics[currentIdx - 1] : null
  const nextLesson = currentIdx < allTopics.length - 1 ? allTopics[currentIdx + 1] : null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl block mb-4">📚</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lesson not found</h2>
          <p className="text-gray-500 mb-4">This lesson doesn't exist or couldn't be loaded.</p>
          <Link to="/grammar" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark">Back to Grammar</Link>
        </div>
      </div>
    )
  }

  const exercises = lesson.step_3_interactive_exercises || []
  const totalQ = exercises.length

  const handleAnswer = (answer) => {
    if (showResult) return
    setSelected(answer)
    setShowResult(true)
    const ex = exercises[currentQ]
    const isCorrect = ex.type === 'multiple_choice'
      ? answer === ex.correct_answer
      : answer === ex.corrected_sentence
    if (isCorrect) setScore(s => s + 1)
  }

  const nextQuestion = () => {
    if (currentQ + 1 >= totalQ) {
      setFinished(true)
      if (!completed) {
        markComplete(id)
        setCompleted(true)
      }
    } else {
      setCurrentQ(c => c + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  const restart = () => {
    setStep(0)
    setCurrentQ(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setFinished(false)
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/roadmap" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">{lesson.meta.topic}</h1>
            {completed && <CheckCircle size={20} className="text-green-500" />}
          </div>
          <p className="text-sm text-gray-500">{lesson.meta.level}</p>
        </div>
      </div>

      {/* Step Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-8">
        {['Context', 'Rules', 'Practice'].map((label, i) => (
          <button key={label} onClick={() => setStep(i)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              step === i ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Step 0: Context */}
      {step === 0 && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <BookOpen size={20} />
              <span className="font-semibold text-sm">Context</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {(() => {
                const highlights = lesson.step_1_context.highlight_indices || []
                if (highlights.length === 0) return lesson.step_1_context.text
                const escaped = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                return lesson.step_1_context.text.split(new RegExp(`(${escaped.join('|')})`, 'gi')).map((part, i) =>
                  highlights.some(h => h.toLowerCase() === part.toLowerCase())
                    ? <mark key={i} className="bg-primary/20 text-primary font-semibold px-1 rounded">{part}</mark>
                    : part
                )
              })()}
            </p>
          </div>
          <button onClick={() => setStep(1)} className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
            Continue to Rules <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Step 1: Explanation */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4 text-amber-500">
              <Lightbulb size={20} />
              <span className="font-semibold text-sm">Rule</span>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">{lesson.step_2_explanation.simple_rule}</p>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Formula</p>
              <p className="font-mono text-primary font-semibold">{lesson.step_2_explanation.formula}</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-800/30">
              <p className="text-sm text-red-500 font-medium mb-1">⚠️ Common Mistake</p>
              <p className="text-sm text-red-700 dark:text-red-400">{lesson.step_2_explanation.common_mistake}</p>
            </div>
          </div>
          <button onClick={() => { setStep(2); setCurrentQ(0); setFinished(false); setScore(0); setSelected(null); setShowResult(false) }}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
            Start Practice <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Step 2: Exercises */}
      {step === 2 && !finished && exercises.length > 0 && (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${((currentQ) / totalQ) * 100}%` }} />
            </div>
            <span className="text-sm font-medium text-gray-500">{currentQ + 1}/{totalQ}</span>
          </div>

          {(() => {
            const ex = exercises[currentQ]
            if (ex.type === 'multiple_choice') {
              const isCorrect = selected === ex.correct_answer
              return (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white mb-5 text-lg">{ex.question}</p>
                  <div className="space-y-3">
                    {ex.options.map(opt => {
                      let cls = 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5'
                      if (showResult && opt === ex.correct_answer) cls = 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      else if (showResult && opt === selected && !isCorrect) cls = 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      else if (selected === opt && !showResult) cls = 'border-primary bg-primary/5'
                      return (
                        <button key={opt} onClick={() => handleAnswer(opt)}
                          className={`w-full text-left px-5 py-3.5 rounded-xl border-2 ${cls} transition-all text-sm font-medium text-gray-700 dark:text-gray-300`}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {showResult && (
                    <div className={`mt-5 p-4 rounded-xl ${isCorrect ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {isCorrect ? <CheckCircle className="text-green-500" size={18} /> : <XCircle className="text-red-500" size={18} />}
                        <span className={`font-semibold text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ex.explanation_for_failure}</p>
                    </div>
                  )}
                  {showResult && (
                    <button onClick={nextQuestion} className="mt-4 w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors">
                      {currentQ + 1 >= totalQ ? 'See Results' : 'Next Question'}
                    </button>
                  )}
                </div>
              )
            }
            // Error correction
            if (ex.type === 'error_correction') {
              const opts = [ex.incorrect_sentence, ex.corrected_sentence].sort()
              const isCorrect = selected === ex.corrected_sentence
              return (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white mb-2 text-lg">Find the correct sentence:</p>
                  <p className="text-sm text-gray-500 mb-5">One of these has an error. Pick the correct one.</p>
                  <div className="space-y-3">
                    {opts.map(opt => {
                      let cls = 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      if (showResult && opt === ex.corrected_sentence) cls = 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      else if (showResult && opt === selected && !isCorrect) cls = 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      return (
                        <button key={opt} onClick={() => handleAnswer(opt)}
                          className={`w-full text-left px-5 py-3.5 rounded-xl border-2 ${cls} transition-all text-sm font-medium text-gray-700 dark:text-gray-300`}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {showResult && (
                    <div className={`mt-5 p-4 rounded-xl ${isCorrect ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ex.error_analysis}</p>
                    </div>
                  )}
                  {showResult && (
                    <button onClick={nextQuestion} className="mt-4 w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors">
                      {currentQ + 1 >= totalQ ? 'See Results' : 'Next Question'}
                    </button>
                  )}
                </div>
              )
            }
            return null
          })()}
        </div>
      )}

      {/* Finished */}
      {step === 2 && finished && (
        <div className="text-center py-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Trophy size={36} className="text-primary" />
          </div>
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-gray-900 dark:text-white mb-2">Lesson Complete!</h2>
          <p className="text-gray-500 mb-2">You scored {score}/{totalQ}</p>
          <p className="text-primary font-semibold mb-8">+25 XP earned</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={restart} className="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2">
              <RotateCcw size={16} /> Retry
            </button>
            {nextLesson && (
              <Link to={`/lesson/${nextLesson.id}`} className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                Next: {nextLesson.title} <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
        {prevLesson ? (
          <Link to={`/lesson/${prevLesson.id}`} className="text-sm text-gray-500 hover:text-primary flex items-center gap-1">
            <ArrowLeft size={14} /> {prevLesson.title}
          </Link>
        ) : <div />}
        {nextLesson && (
          <Link to={`/lesson/${nextLesson.id}`} className="text-sm text-gray-500 hover:text-primary flex items-center gap-1">
            {nextLesson.title} <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  )
}
