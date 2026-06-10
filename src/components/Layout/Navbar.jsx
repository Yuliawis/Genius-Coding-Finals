import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/help', label: 'Request Help' },
  { path: '/game', label: 'Preparedness Game' },
  { path: '/analytics', label: 'Analytics' },
]

export default function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <header className="relative z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="glass-panel-strong mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 rounded-[32px] px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div>
            <img
              src="/logo_go.png"
              alt="ResilienCity"
              className="h-14 w-auto object-contain"
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="glass-button glass-panel md:hidden"
        >
          Menu
        </button>

        <div className={`${isOpen ? 'flex' : 'hidden'} w-full flex-col gap-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition duration-300 ${
                isActive(link.path)
                  ? 'glass-panel text-slate-900 shadow-glass-sm'
                  : 'text-slate-600 hover:bg-white/30 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
