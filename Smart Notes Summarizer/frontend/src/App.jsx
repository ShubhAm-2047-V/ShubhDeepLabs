import { useState, useEffect, useRef, useCallback } from 'react'
import {
  BookOpen, Brain, Zap, RotateCcw, Download, RefreshCw,
  Layers, BarChart2, Terminal, ChevronRight, Sparkles,
  FileText, CheckCircle, Clock, Hash
} from 'lucide-react'

// ─── Markdown-ish renderer ─────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hublp])/gm, '')
}

// ─── Concept Item ──────────────────────────────────────────────────
function ConceptItem({ text }) {
  const parts = text.replace(/^[-•]\s*/, '').split(':')
  return (
    <li className="concept-item">
      <div className="concept-bullet" />
      <span>
        {parts.length > 1
          ? <><strong>{parts[0]}:</strong>{parts.slice(1).join(':')}</>
          : text.replace(/^[-•]\s*/, '')
        }
      </span>
    </li>
  )
}

// ─── Flashcard ─────────────────────────────────────────────────────
function Flashcard({ card, index }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      className={`flashcard ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped(f => !f)}
      role="button"
      tabIndex={0}
      aria-label={`Flashcard ${index + 1}: ${flipped ? 'showing answer' : 'showing question'}`}
      onKeyDown={e => e.key === 'Enter' && setFlipped(f => !f)}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="card-label">❓ Question</span>
          <div className="flashcard-number">#{index + 1}</div>
          <p className="card-question">{card.question}</p>
          <div className="card-flip-hint">tap to reveal ↻</div>
        </div>
        <div className="flashcard-back">
          <span className="card-label">✅ Answer</span>
          <div className="flashcard-number">#{index + 1}</div>
          <p className="card-answer">{card.answer}</p>
          <div className="card-flip-hint">tap to flip ↻</div>
        </div>
      </div>
    </div>
  )
}

// ─── Terminal Logs ─────────────────────────────────────────────────
function TerminalPanel({ logs }) {
  const bodyRef = useRef(null)
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
        </div>
        <Terminal size={12} style={{ color: '#8b949e' }} />
        <span className="terminal-title">backend — notes-summarizer-api</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {logs.length === 0 ? (
          <div className="terminal-line">
            <span className="terminal-msg info">$ Waiting for backend connection...</span>
          </div>
        ) : (
          logs.map((log, i) => (
            <div className="terminal-line" key={i}>
              <span className="terminal-time">{log.timestamp}</span>
              <span className={`terminal-msg ${log.level}`}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Analytics Panel ───────────────────────────────────────────────
function AnalyticsPanel({ analytics, onReset }) {
  return (
    <div>
      <div className="analytics-grid">
        <div className="analytics-stat">
          <div className="stat-value">{analytics.total_summaries}</div>
          <div className="stat-label">Summaries</div>
        </div>
        <div className="analytics-stat">
          <div className="stat-value">{analytics.total_flashcards_created}</div>
          <div className="stat-label">Flashcards</div>
        </div>
        <div className="analytics-stat">
          <div className="stat-value">{analytics.total_words_processed?.toLocaleString() || 0}</div>
          <div className="stat-label">Words Processed</div>
        </div>
        <div className="analytics-stat">
          <div className="stat-value">{analytics.avg_words_per_session || 0}</div>
          <div className="stat-label">Avg Words/Session</div>
        </div>
      </div>
      {analytics.recent_sessions?.length > 0 && (
        <div style={{ fontSize: '0.78rem', color: '#888', fontFamily: 'var(--font-mono)' }}>
          <div style={{ marginBottom: '0.5rem', color: '#666', fontWeight: 600 }}>Recent Sessions</div>
          {analytics.recent_sessions.slice(-5).reverse().map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid var(--rule-line)' }}>
              <span style={{ color: s.mode === 'gemini' ? '#56d364' : '#e3b341' }}>
                {s.mode === 'gemini' ? '🤖 Gemini' : '🔵 Offline'}
              </span>
              <span>{s.words} words</span>
              <span>{s.flashcards} cards</span>
              <span>{s.elapsed_s}s</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-secondary" onClick={onReset} id="btn-reset-analytics">
          <RotateCcw size={13} /> Reset Stats
        </button>
      </div>
    </div>
  )
}

// ─── Main App ──────────────────────────────────────────────────────
export default function App() {
  const [notesText, setNotesText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')
  const [result, setResult] = useState(null) // { summary, concepts, flashcards, meta }
  const [sseLog, setSseLog] = useState([])
  const [analytics, setAnalytics] = useState({
    total_summaries: 0,
    total_words_processed: 0,
    total_flashcards_created: 0,
    avg_words_per_session: 0,
    recent_sessions: []
  })
  const [backendStatus, setBackendStatus] = useState('checking') // checking | online | offline
  const [toast, setToast] = useState(null)
  const sseRef = useRef(null)

  const wordCount = notesText.trim().split(/\s+/).filter(Boolean).length
  const charCount = notesText.length
  const lineCount = notesText.split('\n').length

  // ── Toast helper ───────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  // ── Health check ───────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/health')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setBackendStatus(data.gemini_configured ? 'online' : 'sandbox')
        } else {
          setBackendStatus('offline')
        }
      })
      .catch(() => setBackendStatus('offline'))
  }, [])

  // ── SSE connection ─────────────────────────────────────────────
  useEffect(() => {
    const es = new EventSource('/api/logs')
    sseRef.current = es
    es.onmessage = (e) => {
      try {
        const log = JSON.parse(e.data)
        setSseLog(prev => [...prev.slice(-80), log])
      } catch (_) {}
    }
    es.onerror = () => {
      setSseLog(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level: 'warn',
        message: '⚠️ SSE connection interrupted. Reconnecting...'
      }])
    }
    return () => es.close()
  }, [])

  // ── Fetch analytics ────────────────────────────────────────────
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics')
      if (res.ok) setAnalytics(await res.json())
    } catch (_) {}
  }, [])

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 15000)
    return () => clearInterval(interval)
  }, [fetchAnalytics])

  // ── Summarize handler ──────────────────────────────────────────
  const handleSummarize = async () => {
    if (!notesText.trim()) {
      showToast('⚠️ Please enter some notes first!')
      return
    }
    setIsLoading(true)
    setResult(null)
    setActiveTab('summary')

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notesText })
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
        showToast(`✅ Analysis complete! ${data.flashcards.length} flashcards generated.`)
        fetchAnalytics()
      } else {
        showToast(`❌ Error: ${data.detail || 'Something went wrong'}`)
      }
    } catch (err) {
      showToast('❌ Could not connect to backend. Is it running?')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Export CSV ─────────────────────────────────────────────────
  const exportCSV = () => {
    if (!result?.flashcards?.length) return
    const rows = [['#', 'Question', 'Answer']]
    result.flashcards.forEach((fc, i) => rows.push([i + 1, fc.question, fc.answer]))
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `study-flashcards-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('📥 Flashcards exported as CSV!')
  }

  // ── Reset analytics ────────────────────────────────────────────
  const handleReset = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' })
      fetchAnalytics()
      showToast('🔄 Analytics reset!')
    } catch (_) {}
  }

  // ── Concept lines ──────────────────────────────────────────────
  const conceptLines = result?.concepts
    ? result.concepts.split('\n').filter(l => l.trim())
    : []

  // ── Status label ──────────────────────────────────────────────
  const statusLabel = {
    checking: '⏳ Connecting...',
    online: '🤖 Gemini AI Active',
    sandbox: '🔵 Sandbox Mode',
    offline: '🔴 Backend Offline'
  }[backendStatus]

  const tabs = [
    { id: 'summary', icon: <FileText size={14} />, label: 'Summary', count: result ? 1 : 0 },
    { id: 'concepts', icon: <Brain size={14} />, label: 'Concepts', count: conceptLines.length },
    { id: 'flashcards', icon: <Layers size={14} />, label: 'Flashcards', count: result?.flashcards?.length || 0 },
    { id: 'analytics', icon: <BarChart2 size={14} />, label: 'Analytics', count: analytics.total_summaries },
  ]

  return (
    <>
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-brand">
          <span className="header-icon">📓</span>
          <div>
            <div className="header-title">Smart Notes Summarizer</div>
            <div className="header-subtitle">AI-Powered Study Assistant</div>
          </div>
        </div>
        <div className="header-status">
          <div className={`status-dot ${backendStatus !== 'online' ? 'offline' : ''}`} />
          {statusLabel}
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="app-layout">

        {/* ── Left: Input + Output ── */}
        <div className="main-panel">

          {/* Notes Input Card */}
          <div className="paper-card spiral-binder notebook-bg">
            <div className="spiral-rings">
              {Array.from({ length: 18 }).map((_, i) => (
                <div className="spiral-ring" key={i} />
              ))}
            </div>
            <div className="card-header" style={{ paddingLeft: '85px' }}>
              <div className="card-title">
                <BookOpen size={16} />
                Your Study Notes
              </div>
              <button
                className="btn-secondary"
                onClick={() => { setNotesText(''); setResult(null) }}
                id="btn-clear-notes"
                title="Clear notes"
              >
                <RotateCcw size={13} /> Clear
              </button>
            </div>
            <div className="notes-input-wrapper">
              <textarea
                className="notes-textarea"
                id="notes-input"
                value={notesText}
                onChange={e => setNotesText(e.target.value)}
                placeholder="✏️ Paste or type your study notes here...

For example:
• Chapter summaries
• Lecture key points
• Research findings
• Any text you want to understand better..."
              />
            </div>
            <div className="notes-stats">
              <div className="stat-badge"><Hash size={11} />{wordCount} words</div>
              <div className="stat-badge"><FileText size={11} />{charCount} chars</div>
              <div className="stat-badge"><Clock size={11} />{lineCount} lines</div>
              {wordCount > 0 && (
                <div className="stat-badge" style={{ marginLeft: 'auto', color: wordCount > 50 ? '#2f9e44' : '#e67700' }}>
                  {wordCount > 50 ? '✅ Good length' : '⚠️ Add more notes'}
                </div>
              )}
            </div>
          </div>

          {/* Summarize Button */}
          <button
            className="btn-primary"
            id="btn-summarize"
            onClick={handleSummarize}
            disabled={isLoading || !notesText.trim()}
          >
            {isLoading ? (
              <>
                <span>Analyzing with AI</span>
                <div className="loading-dots">
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                </div>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Summarize My Notes
                <ChevronRight size={16} />
              </>
            )}
          </button>

          {isLoading && <div className="progress-bar"><div className="progress-fill" style={{ width: '100%' }} /></div>}

          {/* Results Card */}
          <div className="paper-card">
            {/* Tabs */}
            <div className="tabs-bar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  id={`tab-${tab.id}`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count > 0 && <span className="tab-count">{tab.count}</span>}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'summary' && (
              result?.summary ? (
                <div
                  className="summary-output card-body"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(result.summary) }}
                />
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <div className="empty-text">Your AI summary will appear here</div>
                </div>
              )
            )}

            {activeTab === 'concepts' && (
              conceptLines.length > 0 ? (
                <div className="card-body">
                  <ul className="concepts-list">
                    {conceptLines.map((line, i) => <ConceptItem key={i} text={line} />)}
                  </ul>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🧠</div>
                  <div className="empty-text">Core concepts will appear here</div>
                </div>
              )
            )}

            {activeTab === 'flashcards' && (
              result?.flashcards?.length > 0 ? (
                <>
                  <div className="card-body">
                    <div className="flashcard-deck">
                      {result.flashcards.map((card, i) => (
                        <Flashcard key={i} card={card} index={i} />
                      ))}
                    </div>
                  </div>
                  <div className="export-row">
                    <button className="btn-secondary" onClick={exportCSV} id="btn-export-csv">
                      <Download size={13} /> Export CSV
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🃏</div>
                  <div className="empty-text">Study flashcards will appear here</div>
                </div>
              )
            )}

            {activeTab === 'analytics' && (
              <div className="card-body">
                <AnalyticsPanel analytics={analytics} onReset={handleReset} />
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Terminal + Meta ── */}
        <div className="side-panel">

          {/* Live Terminal */}
          <div className="paper-card">
            <div className="card-header">
              <div className="card-title">
                <Terminal size={15} />
                Backend Live Logs
              </div>
              <button
                className="btn-secondary"
                onClick={() => setSseLog([])}
                id="btn-clear-logs"
                title="Clear terminal"
              >
                <RefreshCw size={12} />
              </button>
            </div>
            <div className="card-body" style={{ padding: '0.75rem' }}>
              <TerminalPanel logs={sseLog} />
            </div>
          </div>

          {/* AI Info Card */}
          {result?.meta && (
            <div className="paper-card">
              <div className="card-header">
                <div className="card-title">
                  <Zap size={15} />
                  Session Info
                </div>
              </div>
              <div className="card-body">
                <div className="analytics-grid">
                  <div className="analytics-stat">
                    <div className="stat-value">{result.meta.word_count}</div>
                    <div className="stat-label">Words In</div>
                  </div>
                  <div className="analytics-stat">
                    <div className="stat-value">{result.meta.flashcard_count}</div>
                    <div className="stat-label">Cards Out</div>
                  </div>
                  <div className="analytics-stat">
                    <div className="stat-value">{result.meta.elapsed_s}s</div>
                    <div className="stat-label">Processing</div>
                  </div>
                  <div className="analytics-stat" style={{
                    background: result.meta.mode === 'gemini'
                      ? 'linear-gradient(135deg, rgba(46,213,115,0.1), rgba(46,213,115,0.05))'
                      : 'linear-gradient(135deg, rgba(255,165,0,0.1), rgba(255,165,0,0.05))'
                  }}>
                    <div className="stat-value" style={{ fontSize: '1rem' }}>
                      {result.meta.mode === 'gemini' ? '🤖' : '🔵'}
                    </div>
                    <div className="stat-label">
                      {result.meta.mode === 'gemini' ? 'Gemini AI' : 'Offline'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* How to Use card */}
          <div className="paper-card">
            <div className="card-header">
              <div className="card-title">
                <CheckCircle size={15} />
                How to Use
              </div>
            </div>
            <div className="card-body">
              <ol style={{ paddingLeft: '1.2rem', fontFamily: 'var(--font-hand)', fontSize: '0.95rem', lineHeight: 2, color: 'var(--ink-mid)' }}>
                <li>Paste or type your study notes into the notepad</li>
                <li>Click <strong>"Summarize My Notes"</strong></li>
                <li>Review the AI-generated summary</li>
                <li>Study using interactive flip flashcards</li>
                <li>Export flashcards as CSV for Anki import</li>
              </ol>
            </div>
          </div>

          {/* Stats card */}
          <div className="paper-card">
            <div className="card-header">
              <div className="card-title">
                <BarChart2 size={15} />
                Total Stats
              </div>
            </div>
            <div className="card-body">
              <div className="analytics-grid">
                <div className="analytics-stat">
                  <div className="stat-value">{analytics.total_summaries}</div>
                  <div className="stat-label">Sessions</div>
                </div>
                <div className="analytics-stat">
                  <div className="stat-value">{analytics.total_flashcards_created}</div>
                  <div className="stat-label">Cards Made</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
