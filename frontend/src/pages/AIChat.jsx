import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000'

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Greetings! I am your REFORM PHASE Virtual Assistant. Ask me anything regarding registered members, attendance patterns, pending fee settlements, or guided workout routines.",
      options: ["Today's workout plan", "List members on annual plans", "Who hasn't paid fees?"]
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input
    if (!query.trim() || loading) return

    const userMsg = query.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(`${API}/api/ai/chat`, { message: userMsg })
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: res.data.reply,
          options: res.data.options || []
        }
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: "Notice: Unable to reach the studio assistant service. Please ensure the backend server is running on http://localhost:5000.",
          options: ["Today's workout plan", "List members on annual plans", "Who hasn't paid fees?"]
        }
      ])
    }
    setLoading(false)
  }

  const promptSuggestions = [
    "Today's workout plan",
    "List members on annual plans",
    "Who hasn't paid fees?",
    "Who is present today?",
    "How many members do we have?"
  ]

  // Clean Markdown & List Formatter for Chat Messages
  const renderFormattedContent = (content) => {
    if (!content) return null

    const lines = content.split('\n')
    return (
      <div className="chat-message-content">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} style={{ height: '6px' }} />
          }

          // Parse **bold** and *italic*
          const formatInline = (str) => {
            const parts = []
            // Regex to match **bold** or *italic*
            const regex = /(\*\*.*?\*\*|\*.*?\*)/g
            let lastIndex = 0
            let match

            while ((match = regex.exec(str)) !== null) {
              if (match.index > lastIndex) {
                parts.push(str.substring(lastIndex, match.index))
              }
              const matchedStr = match[0]
              if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
                parts.push(
                  <strong key={match.index} style={{ fontWeight: 600 }}>
                    {matchedStr.slice(2, -2)}
                  </strong>
                )
              } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
                parts.push(
                  <em key={match.index} style={{ opacity: 0.9 }}>
                    {matchedStr.slice(1, -1)}
                  </em>
                )
              }
              lastIndex = regex.lastIndex
            }

            if (lastIndex < str.length) {
              parts.push(str.substring(lastIndex))
            }

            return parts.length > 0 ? parts : str
          }

          const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-')
          const isNumber = /^\d+\./.test(line.trim())

          return (
            <div 
              key={idx} 
              style={{ 
                marginBottom: '4px',
                paddingLeft: isBullet || isNumber ? '12px' : '0',
                textIndent: isBullet || isNumber ? '-12px' : '0'
              }}
            >
              {formatInline(line)}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Virtual Assistant</h1>
          <p className="page-subtitle">Conversational insights for studio operations, member records & guided workouts</p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="card chat-container">
        <div className="card-header" style={{ marginBottom: 12 }}>
          <div className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
            </svg>
            REFORM PHASE Virtual Assistant
          </div>
          <span className="badge badge-success">
            <span className="badge-dot" />
            Online
          </span>
        </div>

        {/* Message Thread */}
        <div className="chat-box">
          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.role}`}>
              {m.role === 'user' ? (
                <div>{m.text}</div>
              ) : (
                <>
                  {renderFormattedContent(m.text)}

                  {/* Clickable Workout & Query Option Buttons */}
                  {m.options && m.options.length > 0 && (
                    <div className="chat-options-container">
                      {m.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          className="chat-option-btn"
                          onClick={() => handleSend(opt)}
                          type="button"
                          disabled={loading}
                        >
                          <span>{opt}</span>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-message thinking">
              <span>Synthesizing verified response</span>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="chat-suggestions">
          {promptSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              className="suggestion-chip"
              onClick={() => handleSend(suggestion)}
              type="button"
              disabled={loading}
            >
              💡 {suggestion}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="chat-input-row">
          <input
            placeholder="Ask about members, fees, attendance, or workout plans..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button 
            className="btn btn-primary" 
            onClick={() => handleSend()} 
            disabled={loading || !input.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
