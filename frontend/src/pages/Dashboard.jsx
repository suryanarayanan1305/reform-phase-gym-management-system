import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000'

export default function Dashboard() {
  const [members, setMembers]   = useState([])
  const [overdue, setOverdue]   = useState([])
  const [fees, setFees]         = useState([])
  const [todayAtt, setTodayAtt] = useState([])

  // Detail Modal State
  const [activePanel, setActivePanel]   = useState(null)
  const [panelData, setPanelData]       = useState([])
  const [panelLoading, setPanelLoading] = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    axios.get(`${API}/api/members`).then(r => setMembers(r.data))
    axios.get(`${API}/api/fees/overdue`).then(r => setOverdue(r.data))
    axios.get(`${API}/api/fees`).then(r => setFees(r.data))
    axios.get(`${API}/api/attendance/${today}`).then(r => setTodayAtt(r.data))
  }, [])

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePanel(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const presentToday = todayAtt.filter(a => a.status === 'present').length
  const totalUnpaid  = fees.filter(f => f.status === 'unpaid').length
  const absentToday  = Math.max(0, members.length - presentToday)

  const openPanel = (type) => {
    setActivePanel(type)
    setSearchQuery('')
    setPanelLoading(true)
    axios.get(`${API}/api/dashboard/details?type=${type}`)
      .then(res => {
        setPanelData(res.data)
        setPanelLoading(false)
      })
      .catch(() => {
        setPanelLoading(false)
        setPanelData([])
      })
  }

  const closePanel = () => {
    setActivePanel(null)
    setPanelData([])
    setSearchQuery('')
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  // Filter panel records based on search input
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return panelData
    const q = searchQuery.toLowerCase().trim()
    return panelData.filter(item => {
      const name = (item.name || '').toLowerCase()
      const phone = (item.phone || '').toLowerCase()
      const plan = (item.plan_type || '').toLowerCase()
      const status = (item.attendance_status || '').toLowerCase()
      const amount = (item.amount ? String(item.amount) : '').toLowerCase()
      return name.includes(q) || phone.includes(q) || plan.includes(q) || status.includes(q) || amount.includes(q)
    })
  }, [panelData, searchQuery])

  // Panel Meta Configuration
  const panelMeta = {
    total: {
      title: 'Total Members Roster',
      subtitle: 'Complete list of all registered studio athletes',
      iconColor: 'gold'
    },
    present: {
      title: 'Present Today',
      subtitle: 'Athletes who have checked in on the floor today',
      iconColor: 'green'
    },
    absent: {
      title: 'Absent Today',
      subtitle: 'Athletes marked absent or not yet checked in today',
      iconColor: 'red'
    },
    unpaid: {
      title: 'Unpaid Fees Ledger',
      subtitle: 'Athletes with pending membership settlements',
      iconColor: 'red'
    },
    alerts: {
      title: 'Fee Payment Alerts',
      subtitle: 'Accounts requiring immediate follow-up (overdue or due within 3 days)',
      iconColor: 'gold'
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">Studio performance overview & member activity</p>
        </div>
      </div>

      {/* 5 Clickable Stats Cards */}
      <div className="stats-grid">
        {/* 1. Total Members */}
        <div className="stat-card clickable" onClick={() => openPanel('total')} title="Click to view all members">
          <div className="stat-card-top">
            <h3>Total Members</h3>
            <div className="stat-icon gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <p>{members.length}</p>
          <div className="stat-footer-text">Registered studio athletes</div>
          <div className="stat-card-hint">
            <span>View directory</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* 2. Present Today */}
        <div className="stat-card clickable" onClick={() => openPanel('present')} title="Click to view present members">
          <div className="stat-card-top">
            <h3>Present Today</h3>
            <div className="stat-icon green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <p style={{ color: 'var(--badge-green-text)' }}>{presentToday}</p>
          <div className="stat-footer-text">
            {members.length > 0 ? `${Math.round((presentToday / members.length) * 100)}% attendance rate` : 'Floor check-ins'}
          </div>
          <div className="stat-card-hint" style={{ color: 'var(--badge-green-text)' }}>
            <span>View attendees</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* 3. Absent Today */}
        <div className="stat-card clickable" onClick={() => openPanel('absent')} title="Click to view absent members">
          <div className="stat-card-top">
            <h3>Absent Today</h3>
            <div className="stat-icon red">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
          </div>
          <p style={{ color: 'var(--badge-red-text)' }}>{absentToday}</p>
          <div className="stat-footer-text">Absent or not yet marked</div>
          <div className="stat-card-hint" style={{ color: 'var(--badge-red-text)' }}>
            <span>View absentees</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* 4. Unpaid Fees */}
        <div className="stat-card clickable" onClick={() => openPanel('unpaid')} title="Click to view unpaid fees">
          <div className="stat-card-top">
            <h3>Unpaid Fees</h3>
            <div className="stat-icon red">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
          </div>
          <p style={{ color: 'var(--badge-red-text)' }}>{totalUnpaid}</p>
          <div className="stat-footer-text">Pending settlements</div>
          <div className="stat-card-hint" style={{ color: 'var(--badge-red-text)' }}>
            <span>View fee ledger</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* 5. Fee Alerts */}
        <div className="stat-card clickable" onClick={() => openPanel('alerts')} title="Click to view fee alerts">
          <div className="stat-card-top">
            <h3>Fee Alerts</h3>
            <div className="stat-icon navy">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
          </div>
          <p style={{ color: 'var(--gold-primary)' }}>{overdue.length}</p>
          <div className="stat-footer-text">Overdue or due in ≤ 3 days</div>
          <div className="stat-card-hint">
            <span>View alert list</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Refined Fee Alert Box */}
      {overdue.length > 0 && (
        <div className="alert-box">
          <div className="alert-header">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Payment Due Notice & Overdue Accounts
            </h3>
            <span className="alert-count-pill">{overdue.length} Account{overdue.length > 1 ? 's' : ''} Overdue</span>
          </div>

          <div>
            {overdue.map(m => (
              <div className="alert-item" key={m.fee_id}>
                <div>
                  <span className="alert-member-name">{m.name}</span>
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="alert-phone">
                      📞 {m.phone}
                    </a>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="alert-amount">
                    ₹{Number(m.amount).toLocaleString('en-IN')}
                  </div>
                  <div className="alert-due-date">
                    Due: {new Date(m.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Attendance Table Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Today's Member Attendance
          </h2>
          <span className="badge badge-navy">
            {presentToday} of {todayAtt.length} Checked In
          </span>
        </div>

        {todayAtt.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="empty-state-title">No attendance recorded yet today</div>
            <p className="empty-state-text">Check-ins marked on the Attendance page will display here automatically.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th style={{ width: '160px', textAlign: 'right' }}>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAtt.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="member-cell">
                        <span className="member-avatar">{getInitials(a.name)}</span>
                        <strong>{a.name}</strong>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`badge ${a.status === 'present' ? 'badge-success' : 'badge-danger'}`}>
                        <span className="badge-dot" />
                        {a.status === 'present' ? 'Present' : (a.status || 'Not marked')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================
          CLEAN DETAIL PANEL (MODAL / SLIDE-OVER)
          ============================================================ */}
      {activePanel && (
        <div className="modal-overlay" onClick={closePanel} aria-modal="true" role="dialog">
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {panelMeta[activePanel]?.title}
                  <span className="badge badge-navy" style={{ fontSize: '12px' }}>
                    {filteredRecords.length} {filteredRecords.length === 1 ? 'Record' : 'Records'}
                  </span>
                </h2>
                <p className="modal-subtitle">
                  {panelMeta[activePanel]?.subtitle}
                </p>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={closePanel} 
                aria-label="Close detail panel"
                title="Close (Esc)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="modal-search-wrapper">
              <svg className="modal-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, phone number, or plan..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            {/* Modal Content Body */}
            <div className="modal-body">
              {panelLoading ? (
                <div className="empty-state">
                  <div className="empty-state-title">Loading details...</div>
                  <p className="empty-state-text">Fetching current records from database.</p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <div className="empty-state-title">
                    {searchQuery ? 'No matching records found' : 'No records available'}
                  </div>
                  <p className="empty-state-text">
                    {searchQuery ? `No results match "${searchQuery}". Try a different keyword.` : 'There are currently no records for this category.'}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Athlete</th>
                        <th>Contact Phone</th>
                        {/* Columns according to type */}
                        {(activePanel === 'total' || activePanel === 'present' || activePanel === 'absent') && (
                          <th>Plan Tier</th>
                        )}
                        {activePanel === 'present' && (
                          <th style={{ textAlign: 'right' }}>Attendance</th>
                        )}
                        {activePanel === 'absent' && (
                          <th style={{ textAlign: 'right' }}>Today's Status</th>
                        )}
                        {(activePanel === 'unpaid' || activePanel === 'alerts') && (
                          <>
                            <th>Plan Tier</th>
                            <th>Fee Amount</th>
                            <th>Due Date</th>
                            <th style={{ textAlign: 'right' }}>Status</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((item, idx) => (
                        <tr key={item.id || item.fee_id || idx}>
                          {/* Name + Initials Avatar */}
                          <td>
                            <div className="member-cell">
                              <span className="member-avatar">{getInitials(item.name)}</span>
                              <strong>{item.name}</strong>
                            </div>
                          </td>

                          {/* Phone */}
                          <td>
                            {item.phone ? (
                              <a href={`tel:${item.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                📞 {item.phone}
                              </a>
                            ) : (
                              <span style={{ color: '#A0AEC0' }}>—</span>
                            )}
                          </td>

                          {/* Plan Tier for Member/Attendance Views */}
                          {(activePanel === 'total' || activePanel === 'present' || activePanel === 'absent') && (
                            <td>
                              <span className="badge badge-warning">
                                <span className="badge-dot" />
                                {item.plan_type || 'Standard'}
                              </span>
                            </td>
                          )}

                          {/* Attendance Status for Present */}
                          {activePanel === 'present' && (
                            <td style={{ textAlign: 'right' }}>
                              <span className="badge badge-success">
                                <span className="badge-dot" />
                                Present
                              </span>
                            </td>
                          )}

                          {/* Attendance Status for Absent */}
                          {activePanel === 'absent' && (
                            <td style={{ textAlign: 'right' }}>
                              {item.attendance_status === 'marked absent' ? (
                                <span className="badge badge-danger">
                                  <span className="badge-dot" />
                                  Marked Absent
                                </span>
                              ) : (
                                <span className="badge badge-navy">
                                  <span className="badge-dot" />
                                  Not Marked
                                </span>
                              )}
                            </td>
                          )}

                          {/* Fee Details for Unpaid and Alerts */}
                          {(activePanel === 'unpaid' || activePanel === 'alerts') && (
                            <>
                              <td>
                                <span className="badge badge-warning">
                                  <span className="badge-dot" />
                                  {item.plan_type || 'Monthly'}
                                </span>
                              </td>
                              <td style={{ fontWeight: 700, color: '#A93829' }}>
                                ₹{Number(item.amount).toLocaleString('en-IN')}
                              </td>
                              <td>
                                {new Date(item.due_date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                {item.is_overdue ? (
                                  <span className="badge badge-danger">
                                    <span className="badge-dot" />
                                    Overdue
                                  </span>
                                ) : (
                                  <span className="badge badge-warning">
                                    <span className="badge-dot" />
                                    Due Soon
                                  </span>
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <span>Press <kbd style={{ padding: '2px 6px', background: '#FFFFFF', border: '1px solid #D8D2C7', borderRadius: '4px', fontSize: '11px' }}>Esc</kbd> or click outside to dismiss</span>
              <button className="btn btn-secondary" onClick={closePanel} style={{ padding: '6px 16px', fontSize: '12px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
