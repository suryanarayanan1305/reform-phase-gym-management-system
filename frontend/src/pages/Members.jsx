import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000'

export default function Members() {
  const [members, setMembers] = useState([])
  const [form, setForm] = useState({ name:'', phone:'', email:'', plan_type:'Monthly' })
  const [showForm, setShowForm] = useState(false)

  const load = () => axios.get(`${API}/api/members`).then(r => setMembers(r.data))

  useEffect(() => { load() }, [])

  const submit = async () => {
    if (!form.name) return alert('Name is required!')
    await axios.post(`${API}/api/members`, form)
    setForm({ name:'', phone:'', email:'', plan_type:'Monthly' })
    setShowForm(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this member?')) return
    await axios.delete(`${API}/api/members/${id}`)
    load()
  }

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
          <h1 className="page-title">Members Directory</h1>
          <p className="page-subtitle">Manage athlete profiles, memberships and enrollments</p>
        </div>
        <button 
          className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`} 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add New Member
            </>
          )}
        </button>
      </div>

      {/* Add Member Form Card */}
      {showForm && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              New Member Registration
            </h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                placeholder="e.g. Alexander Thorne" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                placeholder="e.g. +91 98765 43210" 
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email"
                placeholder="e.g. athlete@reformphase.com" 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Membership Tier</label>
              <select 
                value={form.plan_type}
                onChange={e => setForm({...form, plan_type: e.target.value})}
              >
                <option value="Monthly">Monthly Membership</option>
                <option value="Quarterly">Quarterly Membership</option>
                <option value="Annual">Annual Membership</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={submit}>
              Complete Enrollment
            </button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Members Directory Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Enrolled Members
          </h2>
          <span className="badge badge-navy">
            {members.length} Total Athletes
          </span>
        </div>

        {members.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="7" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className="empty-state-title">No members enrolled yet</div>
            <p className="empty-state-text">Click "Add New Member" above to create your first studio member profile.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Plan Tier</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="member-cell">
                        <span className="member-avatar">{getInitials(m.name)}</span>
                        <strong>{m.name}</strong>
                      </div>
                    </td>
                    <td>
                      {m.phone ? (
                        <a href={`tel:${m.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {m.phone}
                        </a>
                      ) : (
                        <span style={{ color: '#A0AEC0' }}>—</span>
                      )}
                    </td>
                    <td>
                      {m.email ? (
                        <a href={`mailto:${m.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {m.email}
                        </a>
                      ) : (
                        <span style={{ color: '#A0AEC0' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-warning">
                        <span className="badge-dot" />
                        {m.plan_type}
                      </span>
                    </td>
                    <td>
                      {new Date(m.join_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-danger"
                        style={{ padding: '5px 12px', fontSize: '12px' }}
                        onClick={() => remove(m.id)}
                        title="Remove member"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
