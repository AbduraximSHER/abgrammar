import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Roadmap from './pages/Roadmap'
import Lesson from './pages/Lesson'
import Dashboard from './pages/Dashboard'
import VocabularyList from './pages/vocabulary/VocabularyList'
import VocabularyDetail from './pages/vocabulary/VocabularyDetail'
import ReadingList from './pages/reading/ReadingList'
import ReadingDetail from './pages/reading/ReadingDetail'
import WritingPage from './pages/writing/WritingPage'
import DailyChallenge from './pages/daily/DailyChallenge'

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grammar" element={<Roadmap />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/vocabulary" element={<VocabularyList />} />
        <Route path="/vocabulary/:topicId" element={<VocabularyDetail />} />
        <Route path="/reading" element={<ReadingList />} />
        <Route path="/reading/:passageId" element={<ReadingDetail />} />
        <Route path="/writing" element={<WritingPage />} />
        <Route path="/daily" element={<DailyChallenge />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}
