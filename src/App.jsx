import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import HelpRequest from './pages/HelpRequest'
import Game from './pages/Game'
import Analytics from './pages/Analytics'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="app-shell">
      <div className="ambient-orb left-[-8rem] top-20 h-72 w-72 bg-amber-200/70" />
      <div className="ambient-orb right-[-6rem] top-40 h-96 w-96 bg-white/60" />
      <div className="ambient-orb bottom-[-8rem] left-1/4 h-80 w-80 bg-orange-200/60" />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/help" element={<HelpRequest />} />
            <Route path="/game" element={<Game />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
