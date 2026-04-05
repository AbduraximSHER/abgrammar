import { Link, useLocation } from 'react-router-dom'
import { BookOpen, LayoutDashboard, Map, Moon, Sun, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const location = useLocation()
  const [dark, setDark] = useState(() => localStorage.getItem('abg_theme') === 'dark')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('abg_theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => { setOpen(false) }, [location])

  const links = [
    { to: '/', label: 'Home', icon: BookOpen },
    { to: '/roadmap', label: 'Roadmap', icon: Map },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg font-[var(--font-display)] group-hover:scale-110 transition-transform">G</div>
          <span className="font-[var(--font-display)] text-xl font-semibold text-gray-900 dark:text-white tracking-tight">ABGrammar</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(to) 
                  ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <button onClick={() => setDark(!dark)} className="ml-2 p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg text-gray-500">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg text-gray-700 dark:text-gray-300">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pb-4 pt-2">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                isActive(to) ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400'
              }`}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
