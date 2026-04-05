import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle, XCircle, Shuffle, BookA, Layers, Gamepad2, PenLine, Volume2 } from 'lucide-react'
import { addXP } from '../../utils/progress'

export default function VocabularyDetail() {
  const { topicId } = useParams()
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('cards')
  
  useEffect(() => {
    import(`../../data/vocabulary/${topicId}.json`)
      .then(mod => setData(mod.default))
      .catch(() => setData(null))
  }, [topicId])

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <BookA size={32} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Loading topic...</p>
        <Link to="/vocabulary" className="text-primary text-sm hover:underline mt-2 block">Back to Topics</Link>
      </div>
    </div>
  )

  const tabs = [
    { id: 'cards', label: 'Flashcards', icon: Layers },
    { id: 'match', label: 'Matching', icon: Gamepad2 },
    { id: 'fill', label: 'Fill-in', icon: PenLine },
    { id: 'quiz', label: 'Quiz', icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/vocabulary" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">{data.title}</h1>
          <p className="text-sm text-gray-500">{data.words.length} words · {data.level}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'
            }`}>
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'cards' && <Flashcards words={data.words} />}
      {tab === 'match' && <MatchingGame pairs={data.exercises.matching} />}
      {tab === 'fill' && <FillIn exercises={data.exercises.fillIn} />}
      {tab === 'quiz' && <Quiz questions={data.exercises.multipleChoice} />}
    </div>
  )
}

function Flashcards({ words }) {
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [shuffled, setShuffled] = useState(words)

  const shuffle = () => {
    setShuffled([...words].sort(() => Math.random() - 0.5))
    setIdx(0)
    setFlipped(false)
  }

  const w = shuffled[idx]

  return (
    <div>
      {/* Card */}
      <div onClick={() => setFlipped(!flipped)} className="cursor-pointer select-none">
        <div className={`relative min-h-[280px] rounded-2xl border-2 p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
          flipped
            ? 'bg-primary/5 dark:bg-primary/10 border-primary/30'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/40'
        }`}>
          {!flipped ? (
            <>
              <span className="text-5xl mb-4">{w.emoji}</span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{w.word}</h2>
              <span className="text-sm text-gray-400 italic">{w.type}</span>
              <p className="text-xs text-gray-400 mt-4">Tap to flip</p>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">{w.meaning}</p>
              <p className="text-xl font-semibold text-primary mb-3">🇺🇿 {w.uzbek}</p>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl w-full">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{w.example}"</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={() => { setIdx(Math.max(0, idx - 1)); setFlipped(false) }}
          disabled={idx === 0}
          className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">{idx + 1} / {shuffled.length}</span>
          <button onClick={shuffle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400" title="Shuffle">
            <Shuffle size={18} />
          </button>
        </div>
        <button onClick={() => { setIdx(Math.min(shuffled.length - 1, idx + 1)); setFlipped(false) }}
          disabled={idx === shuffled.length - 1}
          className="p-3 rounded-xl bg-primary text-white disabled:opacity-30 hover:bg-primary-dark transition-colors">
          <ArrowRight size={20} />
        </button>
      </div>
      
      {/* Word dots */}
      <div className="flex justify-center gap-1 mt-4 flex-wrap">
        {shuffled.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
        ))}
      </div>
    </div>
  )
}

function MatchingGame({ pairs }) {
  const [selected, setSelected] = useState(null)
  const [matched, setMatched] = useState([])
  const [wrong, setWrong] = useState(null)
  const [completed, setCompleted] = useState(false)

  const gamePairs = useMemo(() => pairs.slice(0, 6), [pairs])
  const leftCol = useMemo(() => gamePairs.map(p => p.word).sort(() => Math.random() - 0.5), [gamePairs])
  const rightCol = useMemo(() => gamePairs.map(p => p.match).sort(() => Math.random() - 0.5), [gamePairs])

  const handleClick = (item, side) => {
    if (matched.includes(item)) return
    if (!selected) {
      setSelected({ item, side })
      setWrong(null)
    } else if (selected.side === side) {
      setSelected({ item, side })
    } else {
      const pair = gamePairs.find(p =>
        (p.word === selected.item && p.match === item) ||
        (p.match === selected.item && p.word === item)
      )
      if (pair) {
        const newMatched = [...matched, pair.word, pair.match]
        setMatched(newMatched)
        if (newMatched.length === gamePairs.length * 2) {
          setCompleted(true)
          addXP(15)
        }
      } else {
        setWrong({ left: selected.item, right: item })
        setTimeout(() => setWrong(null), 600)
      }
      setSelected(null)
    }
  }

  const reset = () => { setSelected(null); setMatched([]); setWrong(null); setCompleted(false) }

  if (completed) return (
    <div className="text-center py-12">
      <span className="text-5xl block mb-4">🎉</span>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">All Matched!</h3>
      <p className="text-primary font-medium mb-6">+15 XP</p>
      <button onClick={reset} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold flex items-center gap-2 mx-auto">
        <RotateCcw size={16} /> Play Again
      </button>
    </div>
  )

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4 text-center">Match the English words with their Uzbek translations</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {leftCol.map(w => {
            const isMatched = matched.includes(w)
            const isSel = selected?.item === w
            const isWrong = wrong?.left === w || wrong?.right === w
            return (
              <button key={w} onClick={() => handleClick(w, 'left')} disabled={isMatched}
                className={`w-full py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                  isMatched ? 'bg-green-50 border-green-300 text-green-600 dark:bg-green-900/20 dark:border-green-700' :
                  isWrong ? 'bg-red-50 border-red-300 text-red-600 animate-pulse' :
                  isSel ? 'bg-primary/10 border-primary text-primary' :
                  'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-900 dark:text-white'
                }`}>
                {w}
              </button>
            )
          })}
        </div>
        <div className="space-y-2">
          {rightCol.map(m => {
            const isMatched = matched.includes(m)
            const isSel = selected?.item === m
            const isWrong = wrong?.left === m || wrong?.right === m
            return (
              <button key={m} onClick={() => handleClick(m, 'right')} disabled={isMatched}
                className={`w-full py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                  isMatched ? 'bg-green-50 border-green-300 text-green-600 dark:bg-green-900/20 dark:border-green-700' :
                  isWrong ? 'bg-red-50 border-red-300 text-red-600 animate-pulse' :
                  isSel ? 'bg-primary/10 border-primary text-primary' :
                  'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-900 dark:text-white'
                }`}>
                {m}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function FillIn({ exercises }) {
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const ex = exercises[idx]

  const check = () => {
    setChecked(true)
    if (input.trim().toLowerCase() === ex.answer.toLowerCase()) setScore(s => s + 1)
  }

  const next = () => {
    if (idx + 1 >= exercises.length) {
      setDone(true)
      addXP(20)
    } else {
      setIdx(i => i + 1)
      setInput('')
      setChecked(false)
    }
  }

  if (done) return (
    <div className="text-center py-12">
      <span className="text-5xl block mb-4">✏️</span>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Completed!</h3>
      <p className="text-gray-500 mb-1">{score}/{exercises.length} correct</p>
      <p className="text-primary font-medium mb-6">+20 XP</p>
      <button onClick={() => { setIdx(0); setInput(''); setChecked(false); setScore(0); setDone(false) }}
        className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">Try Again</button>
    </div>
  )

  const isCorrect = input.trim().toLowerCase() === ex.answer.toLowerCase()

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-500">Question {idx + 1}/{exercises.length}</span>
        <span className="text-sm font-medium text-primary">Score: {score}</span>
      </div>
      <p className="text-lg text-gray-900 dark:text-white mb-2 font-medium">{ex.sentence}</p>
      <p className="text-sm text-gray-400 mb-4">Hint: <span className="text-primary">{ex.hint}</span></p>
      <input type="text" value={input} onChange={e => setInput(e.target.value)} disabled={checked}
        onKeyDown={e => e.key === 'Enter' && !checked && input && check()}
        placeholder="Type your answer..."
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:border-primary outline-none text-gray-900 dark:text-white mb-4" />
      {checked && (
        <div className={`p-3 rounded-xl mb-4 flex items-center gap-2 ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          {isCorrect ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
          <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Correct!' : `Answer: ${ex.answer}`}
          </span>
        </div>
      )}
      {!checked ? (
        <button onClick={check} disabled={!input.trim()} className="w-full py-3 bg-primary text-white rounded-xl font-semibold disabled:opacity-40">Check</button>
      ) : (
        <button onClick={next} className="w-full py-3 bg-primary text-white rounded-xl font-semibold">
          {idx + 1 >= exercises.length ? 'See Results' : 'Next'}
        </button>
      )}
    </div>
  )
}

function Quiz({ questions }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[idx]

  const handleSelect = (opt) => {
    if (selected) return
    setSelected(opt)
    if (opt === q.correct) setScore(s => s + 1)
  }

  const next = () => {
    if (idx + 1 >= questions.length) {
      setDone(true)
      addXP(15)
    } else {
      setIdx(i => i + 1)
      setSelected(null)
    }
  }

  if (done) return (
    <div className="text-center py-12">
      <span className="text-5xl block mb-4">🏆</span>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h3>
      <p className="text-gray-500 mb-1">{score}/{questions.length} correct</p>
      <p className="text-primary font-medium mb-6">+15 XP</p>
      <button onClick={() => { setIdx(0); setSelected(null); setScore(0); setDone(false) }}
        className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">Retry</button>
    </div>
  )

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
      <p className="text-sm text-gray-500 mb-4">Question {idx + 1}/{questions.length}</p>
      <p className="text-lg font-medium text-gray-900 dark:text-white mb-5">{q.question}</p>
      <div className="space-y-2">
        {q.options.map(opt => {
          let cls = 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
          if (selected && opt === q.correct) cls = 'border-green-500 bg-green-50 dark:bg-green-900/20'
          else if (selected === opt && opt !== q.correct) cls = 'border-red-500 bg-red-50 dark:bg-red-900/20'
          return (
            <button key={opt} onClick={() => handleSelect(opt)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 ${cls} transition-all text-sm font-medium text-gray-700 dark:text-gray-300`}>
              {opt}
            </button>
          )
        })}
      </div>
      {selected && (
        <button onClick={next} className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-semibold">
          {idx + 1 >= questions.length ? 'See Results' : 'Next'}
        </button>
      )}
    </div>
  )
}
