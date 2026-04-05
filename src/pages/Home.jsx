import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Brain, Trophy, Zap, CheckCircle, Star, BookA, Newspaper, Pencil, Flame, Map } from 'lucide-react'
import { getCompletedCount, getXP, getStreak } from '../utils/progress'

const sections = [
  { to: '/grammar', icon: Map, title: 'Grammar', desc: '94 interactive lessons from basic tenses to advanced structures', color: 'bg-green-50 dark:bg-green-900/20 text-green-600', emoji: '📐' },
  { to: '/vocabulary', icon: BookA, title: 'Vocabulary', desc: 'Learn words by topics with flashcards, matching games & quizzes', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600', emoji: '📚' },
  { to: '/reading', icon: Newspaper, title: 'Reading', desc: 'Read stories and passages with comprehension questions', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600', emoji: '📖' },
  { to: '/writing', icon: Pencil, title: 'Writing', desc: 'Practice writing with guided prompts for every level', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600', emoji: '✍️' },
  { to: '/daily', icon: Zap, title: 'Daily Challenge', desc: 'New challenges every day — build your streak!', color: 'bg-red-50 dark:bg-red-900/20 text-red-600', emoji: '🔥' },
]

const features = [
  { icon: BookOpen, title: 'All Levels', desc: 'Beginner to Advanced — learn at your own pace', color: 'text-green-500 bg-green-50 dark:bg-green-900/30' },
  { icon: Brain, title: 'Smart Exercises', desc: 'Flashcards, matching, fill-in, quizzes & more', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30' },
  { icon: Zap, title: 'Daily Challenges', desc: 'New grammar & vocab challenges every day', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
  { icon: Trophy, title: 'Track Progress', desc: 'Earn XP, build streaks, and level up', color: 'text-primary bg-orange-50 dark:bg-orange-900/30' },
]

export default function Home() {
  const completed = getCompletedCount()
  const xp = getXP()
  const streak = getStreak()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 md:pt-28 md:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary text-sm font-medium mb-6">
              <Star size={14} className="fill-primary" />
              Grammar · Vocabulary · Reading · Writing
            </div>
            <h1 className="font-[var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] mb-6">
              Learn English<br />
              <span className="text-primary">The Smart Way</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-xl">
              Interactive grammar, vocabulary, reading & writing — all in one place. From beginner to advanced.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/grammar" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5">
                Start Learning <ArrowRight size={18} />
              </Link>
              <Link to="/daily" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-semibold transition-all">
                <Flame size={18} className="text-amber-500" /> Daily Challenge
              </Link>
            </div>
          </div>

          {completed > 0 && (
            <div className="mt-12 flex flex-wrap gap-3">
              {[
                { label: 'Lessons Done', value: completed, icon: CheckCircle, color: 'text-green-500' },
                { label: 'XP Earned', value: xp, icon: Zap, color: 'text-amber-500' },
                { label: 'Day Streak', value: streak, icon: Flame, color: 'text-primary' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <s.icon size={18} className={s.color} />
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Learning Sections */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">Choose Your Path</h2>
        <p className="text-gray-500 text-center mb-12 text-lg">Five ways to improve your English every day</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map(s => (
            <Link to={s.to} key={s.title}
              className="group p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{s.emoji}</span>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors">{s.title}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{s.desc}</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Explore <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(f => (
            <div key={f.title} className="p-5 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-3`}>
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">G</div>
            ABGrammar
          </div>
          <p>Learn English — Grammar · Vocabulary · Reading · Writing</p>
        </div>
      </footer>
    </div>
  )
}
