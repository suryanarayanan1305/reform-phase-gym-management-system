import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000'

export default function Fees() {
  const [fees, setFees]       = useState([])
  const [members, setMembers] = useState([])
  const [form, setForm]       = useState({ member_id:'', amount:'', due_date:'' })
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    axios.get(`${API}/api/fees`).then(r => setFees(r.data))
    axios.get(`${API}/api/members`).then(r => setMembers(r.data))
  }

  useEffect(() => { load() }, [])

  const pay = async (id) => {
    await axios.put(`${API}/api/fees/pay/${id}`)
    load()
  }

  const addFee = async () => {
    if (!form.member_id || !form.amount || !form.due_date)
      return alert('All fields are required!')
    await axios.post(`${API}/api/fees`, form)
    setForm({ member_id:'', amount:'', due_date:'' })
    setShowForm(false)
    load()
  }

  const isOverdue = (due_date, status) => {
    if (status === 'paid') return false
    return new Date(due_date) <= new Date()
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
          <h1 className="page-title">Fee Management</h1>
          <p className="page-subtitle">Track dues, payment records, and member subscriptions</p>
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
              Record New Fee
            </>
          )}
        </button>
      </div>

      {/* Add Fee Form Card */}
      {showForm && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              Issue Fee Invoice
            </h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Select Athlete *</label>
              <select 
                value={form.member_id}
                onChange={e => setForm({...form, member_id: e.target.value})}
              >
                <option value="">Select Member</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input 
                type="number" 
                placeholder="e.g. 2500"
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input 
                type="date" 
                value={form.due_date}
                onChange={e => setForm({...form, due_date: e.target.value})} 
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={addFee}>
              Save Fee Record
            </button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Fees List Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
              <path d="M6 15h2" />
              <path d="M12 15h4" />
            </svg>
            Fee Ledger & Invoices
          </h2>
          <span className="badge badge-navy">
            {fees.length} Total Records
          </span>
        </div>

        {fees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div className="empty-state-title">No fee records found</div>
            <p className="empty-state-text">Use "+ Record New Fee" above to create fee records for studio athletes.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(f => {
                  const overdue = isOverdue(f.due_date, f.status)
                  return (
                    <tr key={f.id}>
                      <td>
                        <div className="member-cell">
                          <span className="member-avatar">{getInitials(f.member_name)}</span>
                          <strong>{f.member_name}</strong>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        ₹{Number(f.amount).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ 
                            color: overdue ? 'var(--badge-red-text)' : 'inherit',
                            fontWeight: overdue ? 600 : 400
                          }}>
                            {new Date(f.due_date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          {overdue && (
                            <span 
                              className="badge badge-danger" 
                              style={{ padding: '2px 8px', fontSize: '11px' }}
                            >
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${f.status === 'paid' ? 'badge-success' : 'badge-danger'}`}>
                          <span className="badge-dot" />
                          {f.status === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {f.status === 'unpaid' ? (
                          <button 
                            className="btn btn-success"
                            style={{ padding: '5px 12px', fontSize: '12px' }}
                            onClick={() => pay(f.id)}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Mark Paid
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--badge-green-text)', fontWeight: 500 }}>
                            Settled ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
