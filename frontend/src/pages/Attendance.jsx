import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000'

export default function Attendance() {
  const [date, setDate]       = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAtt]  = useState([])
  const [saving, setSaving]   = useState(false)

  const load = (d) => {
    axios.get(`${API}/api/attendance/${d}`).then(r => setAtt(r.data))
  }

  useEffect(() => { load(date) }, [date])

  const mark = async (member_id, status) => {
    await axios.post(`${API}/api/attendance`, { member_id, date, status })
    load(date)
  }

  const markAll = async (status) => {
    setSaving(true)
    for (const a of attendance) {
      await axios.post(`${API}/api/attendance`, { member_id: a.id, date, status })
    }
    load(date)
    setSaving(false)
  }

  const present = attendance.filter(a => a.status === 'present').length

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Attendance Tracker</h1>
          <p className="page-subtitle">Record daily floor attendance and athlete check-ins</p>
        </div>
      </div>

      {/* Control Toolbar Card */}
      <div className="card">
        <div className="attendance-toolbar">
          <div className="attendance-date-wrap">
            <label className="form-label" style={{ marginBottom: 0, fontWeight: 600 }}>Date:</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
            />
          </div>

          <div className="attendance-stats-pill">
            <span style={{ color: 'var(--badge-green-text)', fontWeight: 700 }}>{present}</span> of {attendance.length} Present
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button 
              className="btn btn-success" 
              onClick={() => markAll('present')} 
              disabled={saving || attendance.length === 0}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {saving ? 'Updating...' : 'Mark All Present'}
            </button>
            <button 
              className="btn btn-danger" 
              onClick={() => markAll('absent')} 
              disabled={saving || attendance.length === 0}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {saving ? 'Updating...' : 'Mark All Absent'}
            </button>
          </div>
        </div>
      </div>

      {/* Member Attendance Grid */}
      {attendance.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="empty-state-title">No athletes available</div>
            <p className="empty-state-text">Add members to the studio database first to mark daily attendance.</p>
          </div>
        </div>
      ) : (
        <div className="attendance-grid">
          {attendance.map(a => {
            const isPresent = a.status === 'present'
            return (
              <div key={a.id} className={`attendance-card ${isPresent ? 'present' : 'absent'}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="member-avatar" style={{ width: 36, height: 36 }}>
                    {getInitials(a.name)}
                  </span>
                  <div>
                    <div className="attendance-member-name">{a.name}</div>
                    <div className="attendance-status-text">
                      {isPresent ? '✓ Present' : '✗ Absent'}
                    </div>
                  </div>
                </div>

                <div className="attendance-btn-group">
                  <button 
                    className={`btn btn-att ${isPresent ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => mark(a.id, 'present')}
                    title="Mark Present"
                    style={{ fontWeight: isPresent ? 700 : 500 }}
                  >
                    P
                  </button>
                  <button 
                    className={`btn btn-att ${!isPresent ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => mark(a.id, 'absent')}
                    title="Mark Absent"
                    style={{ fontWeight: !isPresent ? 700 : 500 }}
                  >
                    A
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
