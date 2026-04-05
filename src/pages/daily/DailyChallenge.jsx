import { useState, useMemo } from 'react'
import { Zap, CheckCircle, XCircle, ArrowRight, Flame, Trophy } from 'lucide-react'
import challengesData from '../../data/daily/challenges.json'
import { addXP, getStreak, updateStreak } from '../../utils/progress'

export default function DailyChallenge() {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
  
  const dailyChallenges = useMemo(() => {
    const all = challengesData.challenges
    const startIdx = dayOfYear % all.length
    return [all[startIdx], all[(startIdx + 1) % all.length], all[(startIdx + 2) % all.length]]
  }, [dayOfYear])

  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [input, setInput] = useState('')
  const [completed, setCompleted] = useState(false)
  const streak = getStreak()

  const challenge = dailyChallenges[currentIdx]

  const handleSubmit = (answer) => {
    const c = challenge
    let isCorrect = false
    if (c.type === 'grammar_fix') isCorrect = true // just show the answer
    else if (c.type === 'translate') {
      const lower = answer.toLowerCase().replace(/[.!?]/g, '').trim()
      isCorrect = lower === c.answer.toLowerCase().replace(/[.!?]/g, '').trim() ||
        (c.alternatives || []).some(a => lower === a.toLowerCase().replace(/[.!?]/g, '').trim())
    } else if (c.type === 'fill_blank') {
      isCorrect = answer.toLowerCase().trim() === c.answer.toLowerCase().trim()
    } else if (c.type === 'word_of_day') {
      isCorrect = true
    }
    setAnswers({ ...answers, [c.id]: { answer, isCorrect } })
  }

  const nextChallenge = () => {
    if (currentIdx + 1 >= dailyChallenges.length) {
      setCompleted(true)
      addXP(50)
      updateStreak()
    } else {
      setCurrentIdx(i => i + 1)
      setInput('')
    }
  }

  if (completed) return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-10">
      <div className="text-center py-16">
        <Trophy size={56} className="text-primary mx-auto mb-4" />
        <h2 className="font-[var(--font-display)] text-3xl font-bold text-gray-900 dark:text-white mb-2">Daily Challenge Complete!</h2>
        <p className="text-primary font-semibold text-lg mb-2">+50 XP</p>
        <div className="flex items-center justify-center gap-2 text-amber-500 mb-6">
          <Flame size={20} />
          <span className="font-semibold">{streak + 1} day streak!</span>
        </div>
        <p className="text-gray-500 mb-8">Come back tomorrow for new challenges!</p>
        <div className="space-y-3 max-w-md mx-auto">
          {dailyChallenges.map((c, i) => (
            <div key={c.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-left">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {c.type === 'word_of_day' ? `Word: ${c.word}` :
                   c.type === 'grammar_fix' ? 'Grammar Fix' :
                   c.type === 'translate' ? 'Translation' : 'Fill in the blank'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const answered = answers[challenge.id]

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <Zap size={22} className="text-amber-500" />
            </div>
            <h1 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Daily Challenge</h1>
          </div>
          <p className="text-sm text-gray-500 ml-13">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
          <Flame size={18} className="text-amber-500" />
          <span className="font-bold text-amber-600">{streak}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {dailyChallenges.map((_, i) => (
          <div key={i} className={`flex-1 h-2 rounded-full ${
            i < currentIdx ? 'bg-green-500' : i === currentIdx ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
          }`} />
        ))}
      </div>

      {/* Challenge Card */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Challenge {currentIdx + 1} of {dailyChallenges.length}
        </span>

        {challenge.type === 'word_of_day' && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-primary mb-3">📚 Word of the Day</h3>
            <div className="text-center py-6">
              <span className="text-4xl block mb-3">{challenge.emoji}</span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{challenge.word}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">{challenge.meaning}</p>
              <p className="text-primary font-medium">🇺🇿 {challenge.uzbek}</p>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{challenge.example}"</p>
              </div>
            </div>
            {!answered && (
              <button onClick={() => handleSubmit('learned')} className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-semibold">
                Got it! ✓
              </button>
            )}
          </div>
        )}

        {challenge.type === 'grammar_fix' && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-red-500 mb-3">🔧 Fix the Grammar</h3>
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl mb-4">
              <p className="text-lg text-red-700 dark:text-red-400 line-through">{challenge.sentence}</p>
            </div>
            {!answered ? (
              <button onClick={() => handleSubmit(challenge.correct)} className="w-full py-3 bg-primary text-white rounded-xl font-semibold">
                Show Correct Answer
              </button>
            ) : (
              <div>
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl mb-3">
                  <p className="text-lg text-green-700 dark:text-green-400 font-medium">{challenge.correct}</p>
                </div>
                <p className="text-sm text-gray-500 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">💡 {challenge.rule}</p>
              </div>
            )}
          </div>
        )}

        {challenge.type === 'translate' && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-blue-500 mb-3">🔄 Translate to English</h3>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl mb-4">
              <p className="text-lg text-gray-900 dark:text-white font-medium">🇺🇿 {challenge.uzbek}</p>
            </div>
            {!answered ? (
              <>
                <input type="text" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && input.trim() && handleSubmit(input)}
                  placeholder="Type your translation..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:border-primary outline-none text-gray-900 dark:text-white mb-3" />
                <button onClick={() => handleSubmit(input)} disabled={!input.trim()}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold disabled:opacity-40">Check</button>
              </>
            ) : (
              <div className={`p-4 rounded-xl ${answered.isCorrect ? 'bg-green-50 dark:bg-green-900/10' : 'bg-amber-50 dark:bg-amber-900/10'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {answered.isCorrect ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-amber-500" />}
                  <span className="font-medium text-sm">{answered.isCorrect ? 'Correct!' : 'Good try!'}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Answer: {challenge.answer}</p>
              </div>
            )}
          </div>
        )}

        {challenge.type === 'fill_blank' && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-purple-500 mb-3">✏️ Fill in the Blank</h3>
            <p className="text-lg text-gray-900 dark:text-white font-medium mb-2">{challenge.sentence}</p>
            <p className="text-sm text-gray-400 mb-4">Hint: {challenge.hint}</p>
            {!answered ? (
              <>
                <input type="text" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && input.trim() && handleSubmit(input)}
                  placeholder="Your answer..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:border-primary outline-none text-gray-900 dark:text-white mb-3" />
                <button onClick={() => handleSubmit(input)} disabled={!input.trim()}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold disabled:opacity-40">Check</button>
              </>
            ) : (
              <div className={`p-4 rounded-xl ${answered.isCorrect ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {answered.isCorrect ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
                  <span className="font-medium text-sm">{answered.isCorrect ? 'Correct!' : 'Incorrect'}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Answer: {challenge.answer}</p>
              </div>
            )}
          </div>
        )}

        {answered && (
          <button onClick={nextChallenge} className="w-full mt-4 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            {currentIdx + 1 >= dailyChallenges.length ? 'Finish!' : 'Next Challenge'} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
