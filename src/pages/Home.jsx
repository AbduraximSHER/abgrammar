import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Brain, Trophy, Zap, CheckCircle, Star } from 'lucide-react'
import { getCompletedCount, getXP, getStreak } from '../utils/progress'

const features = [
  { icon: BookOpen, title: '94 Interactive Lessons', desc: 'From beginner to advanced, every grammar topic covered', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30' },
  { icon: Brain, title: 'Smart Learning Path', desc: 'Structured roadmap that adapts to your level', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30' },
  { icon: Zap, title: 'Practice & Quizzes', desc: 'Multiple choice, error correction, and fill-in exercises', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
  { icon: Trophy, title: 'Track Your Progress', desc: 'Earn XP, build streaks, and see your growth', color: 'text-green-500 bg-green-50 dark:bg-green-900/30' },
]

const levels = [
  { name: 'Beginner', emoji: '🌱', color: 'from-green-400 to-emerald-500', count: 12 },
  { name: 'Elementary', emoji: '📗', color: 'from-blue-400 to-cyan-500', count: 12 },
  { name: 'Intermediate', emoji: '📘', color: 'from-purple-400 to-violet-500', count: 12 },
  { name: 'Upper-Intermediate', emoji: '📙', color: 'from-amber-400 to-orange-500', count: 8 },
  { name: 'Advanced', emoji: '🎓', color: 'from-red-400 to-rose-500', count: 50 },
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
        
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary text-sm font-medium mb-6">
              <Star size={14} className="fill-primary" />
              94 lessons across 5 levels
            </div>
            <h1 className="font-[var(--font-display)] text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] mb-6">
              Master English<br />
              <span className="text-primary">Grammar</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-xl">
              Interactive lessons with smart exercises. From basic tenses to advanced structures — learn at your own pace.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/roadmap" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-semibold text-base transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5">
                Start Learning <ArrowRight size={18} />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-semibold text-base transition-all">
                My Progress
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          {completed > 0 && (
            <div className="mt-14 flex flex-wrap gap-4">
              {[
                { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-green-500' },
                { label: 'XP Earned', value: xp, icon: Zap, color: 'text-amber-500' },
                { label: 'Day Streak', value: streak, icon: Trophy, color: 'text-primary' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <s.icon size={20} className={s.color} />
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">Why ABGrammar?</h2>
        <p className="text-gray-500 text-center mb-14 text-lg">Everything you need to master English grammar</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div key={f.title} className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Levels Preview */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">5 Levels of Mastery</h2>
        <p className="text-gray-500 text-center mb-14 text-lg">Progress from basics to expert-level grammar</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {levels.map((lvl, i) => (
            <Link to="/roadmap" key={lvl.name} className="group relative p-5 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="text-3xl mb-3">{lvl.emoji}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{lvl.name}</h3>
              <p className="text-xs text-gray-500">{lvl.count} lessons</p>
              <div className={`absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r ${lvl.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">G</div>
            ABGrammar
          </div>
          <p>Master English Grammar — 94 Interactive Lessons</p>
        </div>
      </footer>
    </div>
  )
}
