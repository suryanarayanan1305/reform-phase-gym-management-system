import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Attendance from './pages/Attendance'
import Fees from './pages/Fees'
import AIChat from './pages/AIChat'

function NavigationContent({ mobileOpen, setMobileOpen }) {
  const closeMenu = () => setMobileOpen(false)

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`sidebar-backdrop ${mobileOpen ? 'open' : ''}`} 
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-crest">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 5v14" />
              <path d="M18 5v14" />
              <path d="M2 9v6" />
              <path d="M22 9v6" />
              <path d="M6 12h12" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
            </svg>
          </div>
          <div className="brand-title-main">REFORM PHASE</div>
          <div className="brand-title-sub">FITNESS STUDIO</div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <NavLink to="/" end onClick={closeMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Dashboard
          </NavLink>

          <NavLink to="/members" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Members
          </NavLink>

          <NavLink to="/attendance" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="m9 16 2 2 4-4" />
            </svg>
            Attendance
          </NavLink>

          <NavLink to="/fees" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
              <path d="M6 15h2" />
              <path d="M12 15h4" />
            </svg>
            Fees
          </NavLink>

          <NavLink to="/ai" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
            </svg>
            Virtual Assistant
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-status-pill">
            <span className="sidebar-status-dot" />
            <span>Studio Live</span>
          </div>
          <div className="sidebar-version">v2.0</div>
        </div>
      </aside>
    </>
  )
}

function LayoutContent() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="layout">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div className="mobile-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 5v14" />
            <path d="M18 5v14" />
            <path d="M2 9v6" />
            <path d="M22 9v6" />
            <path d="M6 12h12" />
          </svg>
          <div className="mobile-brand-title">
            REFORM <span>PHASE</span>
          </div>
        </div>
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </header>

      <NavigationContent mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/ai" element={<AIChat />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <LayoutContent />
    </BrowserRouter>
  )
}

export default App
