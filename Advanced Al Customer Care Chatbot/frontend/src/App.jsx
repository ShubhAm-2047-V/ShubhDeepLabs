import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Send, Terminal, FileText, Plus, Trash2, 
  Sparkles, Clock, Database, RefreshCw, AlertCircle, Trash
} from "lucide-react";

export default function App() {
  // Connection states
  const [backendUrl] = useState("http://localhost:5000");
  const [logsConnected, setLogsConnected] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  // Chat panel states
  const [messages, setMessages] = useState([
    { id: "msg-1", sender: "bot", text: "Hello! Welcome to Shubdeep Labs Customer Care Workspace. I can answer questions about our pricing tiers, office schedule, refund policy, and revision limits. Try asking a question or upload custom documents on the right to index them into my active RAG context!", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Documents manager states
  const [documents, setDocuments] = useState([]);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [isIndexing, setIsIndexing] = useState(false);

  // Analytics stats
  const [analytics, setAnalytics] = useState({
    totalMessages: 1,
    queryCount: 0,
    averageResponseTime: 450,
    documentsCount: 0,
    chunksCount: 0
  });

  // Retro logs console states
  const [logs, setLogs] = useState([]);

  // DOM Refs for auto-scroll
  const chatBottomRef = useRef(null);
  const terminalBottomRef = useRef(null);

  // Fetch initial documents and analytics, check backend health
  const fetchData = async () => {
    try {
      const docRes = await fetch(`${backendUrl}/api/documents`);
      if (docRes.ok) {
        const docData = await docRes.json();
        setDocuments(docData);
        setBackendOnline(true);
      }
      
      const analRes = await fetch(`${backendUrl}/api/analytics`);
      if (analRes.ok) {
        const analData = await analRes.json();
        setAnalytics(analData);
      }
    } catch (e) {
      console.error("Failed to connect to backend api:", e);
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000); // refresh metadata stats
    return () => clearInterval(interval);
  }, []);

  // Set up SSE EventSource stream listener for real-time logs
  useEffect(() => {
    const eventSource = new EventSource(`${backendUrl}/api/logs`);
    
    eventSource.onopen = () => {
      setLogsConnected(true);
      setBackendOnline(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const logEntry = JSON.parse(event.data);
        setLogs((prev) => [...prev, logEntry].slice(-100)); // keep last 100 entries
      } catch (err) {
        console.error("Failed to parse log event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Logs SSE event stream error:", err);
      setLogsConnected(false);
      eventSource.close();
      
      // Retry connection after 5 seconds
      const timeout = setTimeout(() => {
        setLogsConnected(false);
      }, 5000);
      return () => clearTimeout(timeout);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Auto scroll effects
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollTop = terminalBottomRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle message sending to RAG API
  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim()) return;

    // Clear input
    if (!textToSend) setInputValue("");

    // Append user message
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages
        })
      });

      if (!response.ok) throw new Error("Server response error");

      const data = await response.json();
      
      // Append bot response
      const botMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        text: data.reply,
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
      fetchData(); // update stats
    } catch (e) {
      // Show failure banner in chat
      const errorMsg = {
        id: `msg-${Date.now()}`,
        sender: "bot",
        text: "Error: I failed to establish connection with the LLM reasoning agent. Please check your backend connection.",
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Quick reply handler
  const handleQuickReply = (question) => {
    handleSendMessage(question);
  };

  // Upload/Index document
  const handleIndexDocument = async (e) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocContent.trim()) return;
    
    setIsIndexing(true);
    try {
      const response = await fetch(`${backendUrl}/api/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: newDocName,
          content: newDocContent
        })
      });

      if (response.ok) {
        setNewDocName("");
        setNewDocContent("");
        setShowAddDoc(false);
        fetchData(); // update documents list & analytics
      }
    } catch (err) {
      console.error("Index document failed:", err);
    } finally {
      setIsIndexing(false);
    }
  };

  // Delete Document
  const handleDeleteDocument = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/documents/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Delete document failed:", err);
    }
  };

  // Clear Terminal display
  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="workspace-container">
      
      {/* 1. TOP HEADER PANEL */}
      <header className="workspace-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 12px var(--primary-glow)"
          }}>
            <Sparkles size={20} color="#FFF" />
          </div>
          <div>
            <h1 style={{ fontSize: "18px", margin: 0, fontWeight: 700, letterSpacing: "-0.5px" }}>
              Advanced AI Customer Care Chatbot Workspace
            </h1>
            <p style={{ fontSize: "11px", color: "var(--text-dim)", margin: 0 }}>
              Academic Solution Platform: RAG & Reasoning Log Console
            </p>
          </div>
        </div>

        {/* Status markers */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="status-indicator">
            <span className="status-dot" style={{ backgroundColor: backendOnline ? "var(--color-success)" : "var(--color-danger)", boxShadow: `0 0 10px ${backendOnline ? "var(--color-success)" : "var(--color-danger)"}` }}></span>
            <span>API SERVER: {backendOnline ? "ONLINE" : "OFFLINE"}</span>
          </div>
          <div className="status-indicator">
            <span className="status-dot" style={{ backgroundColor: logsConnected ? "var(--color-success)" : "var(--color-warning)", boxShadow: `0 0 10px ${logsConnected ? "var(--color-success)" : "var(--color-warning)"}` }}></span>
            <span>LOG MONITOR: {logsConnected ? "LINKED" : "UNLINKED"}</span>
          </div>
          <button onClick={fetchData} className="btn btn-secondary" style={{ padding: "6px 10px", borderRadius: "6px" }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </header>

      {/* 2. LEFT GRID PANEL: INTELLIGENT MESSAGING CENTER */}
      <section className="glass-panel" style={{ height: "100%", maxHeight: "calc(100vh - 100px)" }}>
        <div className="panel-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageSquare size={18} color="var(--primary)" />
            <h2 style={{ fontSize: "16px", margin: 0 }}>Customer Conversation Canvas</h2>
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            Contextual Prompting: Active
          </span>
        </div>

        {/* Message bubble canvas */}
        <div className="panel-body" style={{ background: "rgba(0,0,0,0.15)" }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}>
              <div className="message-bubble" style={msg.isError ? { border: "1px solid var(--color-danger)", background: "rgba(239, 68, 68, 0.08)", color: "var(--color-danger)" } : {}}>
                {msg.text}
                
                {/* RAG citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "6px" }}>
                    <span style={{ display: "block", fontSize: "9px", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "4px" }}>
                      Retrieved Context Sources:
                    </span>
                    {msg.sources.map((src, i) => (
                      <span key={i} className="sources-pill">
                        📄 {src}
                      </span>
                    ))}
                  </div>
                )}
                
                <span style={{ 
                  display: "block", 
                  fontSize: "9px", 
                  color: msg.sender === "user" ? "rgba(255,255,255,0.5)" : "var(--text-dim)", 
                  marginTop: "6px",
                  textAlign: msg.sender === "user" ? "right" : "left"
                }}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Typing delay animation */}
          {isTyping && (
            <div className="chat-message bot">
              <div className="message-bubble" style={{ padding: "10px 14px" }}>
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatBottomRef} />
        </div>

        {/* Prompt panel inputs */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* Quick Triggers FAQ pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <button className="quick-reply-btn" onClick={() => handleQuickReply("What are the pricing plans?")}>
              💰 Pricing Tiers
            </button>
            <button className="quick-reply-btn" onClick={() => handleQuickReply("How can I contact Shubdeep Labs?")}>
              📞 Office Contacts
            </button>
            <button className="quick-reply-btn" onClick={() => handleQuickReply("What is the revision policy for medium plans?")}>
              🔄 Revisions Info
            </button>
            <button className="quick-reply-btn" onClick={() => handleQuickReply("Is there a refund policy?")}>
              🛡️ Refund Policy
            </button>
          </div>

          {/* Core message inputs */}
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              className="form-input"
              placeholder={backendOnline ? "Ask customer query (e.g. 'What is the price of the medium plan?')..." : "Server offline. Launch backend server..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={!backendOnline || isTyping}
            />
            <button 
              className="btn btn-primary" 
              onClick={() => handleSendMessage()}
              disabled={!backendOnline || isTyping || !inputValue.trim()}
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. RIGHT GRID PANEL: RAG MANAGEMENTS & RETRO TERMINALS */}
      <div style={{ display: "grid", gridTemplateRows: "1.1fr 0.9fr", gap: "16px", height: "100%", maxHeight: "calc(100vh - 100px)" }}>
        
        {/* RAG Knowledge base management */}
        <section className="glass-panel">
          <div className="panel-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Database size={18} color="var(--secondary)" />
              <h2 style={{ fontSize: "16px", margin: 0 }}>Customizable RAG Document Indexer</h2>
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ padding: "6px 12px", fontSize: "12px" }}
              onClick={() => setShowAddDoc(!showAddDoc)}
            >
              <Plus size={14} />
              <span>{showAddDoc ? "Close Panel" : "Index Document"}</span>
            </button>
          </div>

          <div className="panel-body">
            {/* Stats Summary Section */}
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-value">{analytics.documentsCount}</div>
                <div className="stat-label">Indexed Files</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{analytics.chunksCount}</div>
                <div className="stat-label">Total Chunks</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{analytics.totalMessages}</div>
                <div className="stat-label">Total Logs</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{analytics.averageResponseTime}ms</div>
                <div className="stat-label">Avg Latency</div>
              </div>
            </div>

            {/* Document Indexing Drawer Form */}
            {showAddDoc ? (
              <form onSubmit={handleIndexDocument} style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(0,0,0,0.25)", padding: "14px", borderRadius: "10px", border: "1px dashed var(--border-color)", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 600 }}>Create New Context Resource</h3>
                <div>
                  <label style={{ display: "block", fontSize: "10px", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "4px" }}>Filename (e.g. refund_guide.txt)</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="refund_guide.txt"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "4px" }}>Document Content (Facts/FAQs)</label>
                  <textarea
                    required
                    rows={4}
                    className="form-input"
                    placeholder="Paste guidelines, FAQs, or raw business information here. The search engine splits contents into term frequency vector chunks..."
                    style={{ resize: "none" }}
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" disabled={isIndexing} className="btn btn-primary" style={{ alignSelf: "flex-end" }}>
                  {isIndexing ? "Analyzing..." : "Analyze & Compute Index"}
                </button>
              </form>
            ) : null}

            {/* Document list view */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              <h3 style={{ fontSize: "13px", color: "var(--text-bright)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <FileText size={14} />
                <span>Active Knowledge Repositories</span>
              </h3>
              
              {documents.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "8px", color: "var(--text-dim)" }}>
                  <AlertCircle size={24} style={{ margin: "0 auto 8px", opacity: 0.6 }} />
                  <p style={{ fontSize: "12px" }}>No custom documents indexed yet. The system is running on base chatbot templates.</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="doc-item-row">
                    <div>
                      <div className="doc-name">📄 {doc.filename}</div>
                      <div className="doc-meta">
                        Chunks: {doc.chunksCount} | Added: {new Date(doc.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteDocument(doc.id)} 
                      className="doc-delete"
                      title="De-index Document"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Real-time Retro Log Terminal monitor */}
        <section className="glass-panel" style={{ overflow: "hidden" }}>
          <div className="panel-header" style={{ padding: "10px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Terminal size={18} color="var(--primary)" />
              <h2 style={{ fontSize: "14px", margin: 0 }}>System RAG & Completion logs (SSE Monitor)</h2>
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ padding: "4px 8px", fontSize: "10px", height: "auto" }}
              onClick={handleClearLogs}
            >
              Clear Logs
            </button>
          </div>

          <div className="panel-body" style={{ padding: "10px", background: "black" }}>
            <div className="terminal-console" ref={terminalBottomRef}>
              {logs.length === 0 ? (
                <div style={{ color: "var(--text-dim)", fontSize: "11px", fontStyle: "italic", textAlign: "center", padding: "20px" }}>
                  Terminal monitoring connected. Logs will appear here in real-time as interactions happen...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="terminal-line">
                    <span className="terminal-time">[{log.timestamp ? log.timestamp.split('T')[1].substring(0, 8) : ''}]</span>
                    <span className={`terminal-level ${log.level}`}>{log.level}</span>
                    <span className="terminal-msg">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
