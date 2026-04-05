import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Roadmap from './pages/Roadmap'
import Lesson from './pages/Lesson'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}
