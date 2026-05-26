"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  MessageSquare, Send, Terminal, FileText, Plus, Trash2, 
  Sparkles, Clock, Database, RefreshCw, AlertCircle, ArrowLeft, Brain
} from "lucide-react";

// Stop words to filter out to improve local RAG search relevancy
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", 
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", 
  "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", 
  "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", 
  "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", 
  "if", "in", "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", 
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", 
  "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", 
  "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", 
  "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", 
  "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "werent", "what", "whats", 
  "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", 
  "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"
]);

// Seed default guidelines documents
const DEFAULT_DOCS = [
  {
    id: "seed-doc-1",
    filename: "shubdeep_labs_faq.txt",
    content: `Shubdeep Labs is an academic project development and tutoring platform designed specifically for Diploma, BCA, MCA, B.E., and B.Tech engineering students.
Our office provides customized, high-quality coding solutions rather than static templates. Every code draft is commented and reviewed from scratch.
Contact information: Students can call the registry office coordinator directly at +91 90288 33275 or send inquiries via email at shubdeeplabs@gmail.com.
Office hours: The lab desk is open Monday to Saturday from 9:30 AM to 7:00 PM.`,
    chunksCount: 1,
    addedAt: new Date().toISOString()
  },
  {
    id: "seed-doc-2",
    filename: "pricing_and_deliverables.txt",
    content: `We offer three pricing tiers based on technical complexity:
- Easy Project Plan (₹1999): Simple utility tools, clean interface, draft PPT slides, complete source code.
- Medium Project Plan (₹3499): Relational database models, multi-feature UI, PPT, comprehensive thesis report draft, and 2 code logic revisions.
- Hard Project Plan (₹4599): Advanced algorithms (AI/ML/Deep Learning/Custom APIs), secure authentication dashboards, complete thesis reports, 3 code revisions, remote installation assistance over Zoom/AnyDesk, and a 1-on-1 code walkthrough explanation.`,
    chunksCount: 1,
    addedAt: new Date().toISOString()
  },
  {
    id: "seed-doc-3",
    filename: "refund_and_revisions_policy.txt",
    content: `Revision policy: For Medium projects, you get up to 2 free logic revisions. For Hard projects, you get up to 3 revisions. Revisions must align with the initially approved project scope.
Refund policy: If a project cannot be compiled or delivered by our team due to unexpected technical constraints, we guarantee a 100% full refund. No refunds are granted after final code deliverables are successfully compiled and handed over.`,
    chunksCount: 1,
    addedAt: new Date().toISOString()
  }
];

export default function ChatbotWorkspace() {
  const [mounted, setMounted] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [logs, setLogs] = useState([]);
  
  // Chat States
  const [messages, setMessages] = useState([
    { id: "msg-1", sender: "bot", text: "Hello! Welcome to Shubdeep Labs Customer Care Workspace. I can answer questions about our pricing tiers, office schedule, refund policy, and revision limits. Try asking a question or upload custom documents on the right to index them into my active RAG context!", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Document indexing UI states
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [isIndexing, setIsIndexing] = useState(false);

  // Stats / Analytics
  const [analytics, setAnalytics] = useState({
    totalMessages: 1,
    queryCount: 0,
    averageResponseTime: 0,
    documentsCount: 3,
    chunksCount: 3
  });

  const chatBottomRef = useRef(null);
  const terminalBottomRef = useRef(null);

  // Initial load
  useEffect(() => {
    setMounted(true);
    // Load documents from LocalStorage or seed defaults
    const local = localStorage.getItem("shubdeep_chatbot_docs");
    if (local) {
      setDocuments(JSON.parse(local));
    } else {
      setDocuments(DEFAULT_DOCS);
      localStorage.setItem("shubdeep_chatbot_docs", JSON.stringify(DEFAULT_DOCS));
    }

    addLog("=======================================================", "info");
    addLog("  Next.js Chatbot API route initialized.", "info");
    addLog("  Client-Side RAG Vector Indexer online (Zero-Database).", "info");
    addLog("=======================================================", "info");
  }, []);

  // Sync scrollbars
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollTop = terminalBottomRef.current.scrollHeight;
    }
  }, [logs]);

  // Document counting helper
  useEffect(() => {
    if (!mounted) return;
    const totalChunks = documents.reduce((sum, doc) => {
      // split by double paragraph to estimate chunks
      const paragraphs = doc.content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
      return sum + paragraphs.length;
    }, 0);

    setAnalytics(prev => ({
      ...prev,
      documentsCount: documents.length,
      chunksCount: totalChunks
    }));
  }, [documents, mounted]);

  // Console logging helper
  const addLog = (message, level = "info") => {
    const timestamp = new Date().toISOString();
    setLogs(prev => [...prev, { timestamp, level, message }].slice(-100));
  };

  // --- RAG TF-IDF SIMILARITY ENGINE (BROWSER PORTED) ---
  const tokenize = (text) => {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 1 && !STOP_WORDS.has(word));
  };

  const getTermFrequency = (tokens) => {
    const tf = {};
    tokens.forEach(token => {
      tf[token] = (tf[token] || 0) + 1;
    });
    const length = tokens.length;
    for (const token in tf) {
      tf[token] = tf[token] / length;
    }
    return tf;
  };

  const getChunksList = (docs) => {
    const allChunks = [];
    docs.forEach(doc => {
      const paragraphs = doc.content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
      paragraphs.forEach((para, idx) => {
        const tokens = tokenize(para);
        if (tokens.length === 0) return;
        allChunks.push({
          id: `${doc.id}-ch-${idx}`,
          docId: doc.id,
          filename: doc.filename,
          content: para,
          tokens,
          tf: getTermFrequency(tokens)
        });
      });
    });
    return allChunks;
  };

  const getIDF = (allChunks) => {
    const idf = {};
    const N = allChunks.length;
    if (N === 0) return idf;

    allChunks.forEach(chunk => {
      const uniqueTokens = new Set(chunk.tokens);
      uniqueTokens.forEach(token => {
        idf[token] = (idf[token] || 0) + 1;
      });
    });

    for (const token in idf) {
      idf[token] = Math.log(N / idf[token]) + 1;
    }
    return idf;
  };

  const performRAGSearch = (queryText) => {
    addLog(`[RAG Search] Initiating similarity search for: "${queryText}"`, "info");
    const allChunks = getChunksList(documents);
    const queryTokens = tokenize(queryText);

    if (queryTokens.length === 0 || allChunks.length === 0) {
      addLog("[RAG Search] Query is empty or index contains no chunks.", "warn");
      return [];
    }

    const idf = getIDF(allChunks);
    const queryTf = getTermFrequency(queryTokens);
    const queryVector = {};
    let queryLength = 0;

    queryTokens.forEach(token => {
      const tokenIdf = idf[token] || 0;
      queryVector[token] = queryTf[token] * tokenIdf;
      queryLength += queryVector[token] * queryVector[token];
    });
    queryLength = Math.sqrt(queryLength);

    if (queryLength === 0) {
      addLog("[RAG Search] Vector vocabulary mismatch. Baseline responses active.", "warn");
      return [];
    }

    const results = allChunks.map(chunk => {
      let dotProduct = 0;
      let chunkLength = 0;

      const chunkVector = {};
      for (const token in chunk.tf) {
        const tokenIdf = idf[token] || 0;
        chunkVector[token] = chunk.tf[token] * tokenIdf;
        chunkLength += chunkVector[token] * chunkVector[token];

        if (queryVector[token]) {
          dotProduct += queryVector[token] * chunkVector[token];
        }
      }
      chunkLength = Math.sqrt(chunkLength);

      const score = chunkLength === 0 || queryLength === 0 ? 0 : dotProduct / (queryLength * chunkLength);

      return {
        chunkId: chunk.id,
        filename: chunk.filename,
        content: chunk.content,
        score: Math.round(score * 1000) / 1000
      };
    });

    const sorted = results
      .filter(r => r.score > 0.05)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    addLog(`[RAG Search] Local Index scan yielded ${sorted.length} matching fragments.`, "info");
    sorted.forEach((match, idx) => {
      addLog(`  - Fragment #${idx + 1}: Score=${match.score} | File="${match.filename}" | Preview="${match.content.substring(0, 45)}..."`, "info");
    });

    return sorted;
  };

  // --- ACTIONS ---

  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || inputValue;
    if (!queryText.trim()) return;

    if (!textToSend) setInputValue("");

    // Add user message
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const startTime = Date.now();

    // 1. Client-side RAG context lookup
    const matches = performRAGSearch(queryText);
    let contextText = "";
    let sourcesUsed = [];
    if (matches.length > 0) {
      contextText = matches.map(c => `[From doc: ${c.filename}]: ${c.content}`).join("\n---\n");
      sourcesUsed = matches.map(c => c.filename);
      addLog(`[Prompt Inject] Appended ${matches.length} context files to payload.`, "info");
    }

    try {
      // 2. Query Next.js API Route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          context: contextText,
          history: messages
        })
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();

      // Append API logs to our browser logs terminal
      if (data.logs) {
        data.logs.forEach(log => {
          addLog(log.message, log.level);
        });
      }

      // Add bot message
      const botMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        text: data.reply,
        sources: [...new Set(sourcesUsed)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);

      // Latency analytics
      const totalTime = Date.now() - startTime;
      setAnalytics(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 2,
        queryCount: prev.queryCount + 1,
        averageResponseTime: prev.queryCount === 0 ? totalTime : Math.round((prev.averageResponseTime + totalTime) / 2)
      }));

    } catch (err) {
      addLog(`[LLM Handshake Error] Connection timeout or API failed.`, "error");
      const errBubble = {
        id: `msg-${Date.now()}`,
        sender: "bot",
        text: "I encountered a connection issue querying the backend route handler. Check your local dev server configs.",
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errBubble]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleIndexDocument = (e) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocContent.trim()) return;

    setIsIndexing(true);
    addLog(`[RAG Indexer] Processing "${newDocName}"...`, "info");

    const newDoc = {
      id: `doc-${Date.now()}`,
      filename: newDocName.toLowerCase().endsWith(".txt") ? newDocName : `${newDocName}.txt`,
      content: newDocContent,
      addedAt: new Date().toISOString()
    };

    const updated = [...documents, newDoc];
    setDocuments(updated);
    localStorage.setItem("shubdeep_chatbot_docs", JSON.stringify(updated));

    addLog(`[RAG Indexer] Document "${newDoc.filename}" successfully tokenized and saved to localStorage.`, "info");

    setNewDocName("");
    setNewDocContent("");
    setShowAddDoc(false);
    setIsIndexing(false);
  };

  const handleDeleteDocument = (id) => {
    const docToDelete = documents.find(d => d.id === id);
    if (!docToDelete) return;

    addLog(`[RAG Indexer] Removing document "${docToDelete.filename}"...`, "info");
    const filtered = documents.filter(d => d.id !== id);
    setDocuments(filtered);
    localStorage.setItem("shubdeep_chatbot_docs", JSON.stringify(filtered));
    addLog("[RAG Indexer] Document removed from active directory.", "info");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#070A13] text-[#94A3B8] p-4 flex flex-col font-sans">
      
      {/* 1. ROW HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#111726]/80 backdrop-blur-md border border-white/5 rounded-xl shadow-lg mb-4 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] p-2 rounded-lg shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              <Brain size={18} color="#FFF" />
            </div>
            <div>
              <h1 className="text-white text-base md:text-lg font-bold leading-none">Advanced AI Customer Care Chatbot</h1>
              <p className="text-[10px] md:text-xs text-slate-500 mt-1">Unified Next.js RAG Portal & Real-time Console Monitor</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_6px_#10b981]"></span>
            <span className="text-slate-400">ENGINE: ACTIVE</span>
          </div>
          <button 
            onClick={() => {
              setDocuments(DEFAULT_DOCS);
              localStorage.setItem("shubdeep_chatbot_docs", JSON.stringify(DEFAULT_DOCS));
              addLog("[System] Knowledge base reset to default faq guidelines.", "info");
            }}
            className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 transition-all flex items-center gap-1.5"
            title="Reset DB"
          >
            <RefreshCw size={12} />
            <span>Reset Guides</span>
          </button>
        </div>
      </header>

      {/* 2. SPLIT LAYOUT */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 h-[calc(100vh-100px)] min-h-0">
        
        {/* LEFT COLUMN: CHAT CANVAS */}
        <section className="bg-[#111726]/60 backdrop-blur-md border border-white/5 rounded-xl shadow-xl flex flex-col overflow-hidden h-full">
          <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-slate-900/30">
            <h2 className="text-white text-sm font-semibold flex items-center gap-2">
              <MessageSquare size={16} className="text-[#8B5CF6]" />
              <span>Customer Care Dialogue Workspace</span>
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">NEXTJS ROUTE: /chatbot</span>
          </div>

          {/* Chat scroll box */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/20">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl p-3.5 text-sm shadow-md ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white rounded-tr-none"
                    : msg.isError 
                      ? "bg-rose-950/20 border border-rose-800/40 text-rose-300 rounded-tl-none"
                      : "bg-white/5 border border-white/5 text-slate-200 rounded-tl-none"
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/5">
                      <span className="block text-[9px] text-slate-500 uppercase tracking-wider mb-1.5">RETRIEVED CONTEXT REFERENCE:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, i) => (
                          <span key={i} className="text-[9px] font-mono px-2 py-0.5 bg-cyan-950/30 border border-cyan-800/40 text-cyan-400 rounded">
                            📄 {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="block text-[9px] text-slate-500 mt-2 text-right">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 rounded-xl rounded-tl-none p-3.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Form Actions */}
          <div className="p-4 border-t border-white/5 bg-slate-950/40 flex flex-col gap-3">
            
            {/* Quick Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => handleQuickReply("What are the pricing plans?")} className="text-[10px] md:text-xs px-3 py-1 bg-white/5 border border-white/5 hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/10 text-slate-300 rounded-full transition-all">
                💰 Pricing Tiers
              </button>
              <button onClick={() => handleQuickReply("How can I contact Shubdeep Labs?")} className="text-[10px] md:text-xs px-3 py-1 bg-white/5 border border-white/5 hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/10 text-slate-300 rounded-full transition-all">
                📞 Call Coordinator
              </button>
              <button onClick={() => handleQuickReply("What is the revision policy?")} className="text-[10px] md:text-xs px-3 py-1 bg-white/5 border border-white/5 hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/10 text-slate-300 rounded-full transition-all">
                🔄 Revisions policy
              </button>
              <button onClick={() => handleQuickReply("Do you guarantee refunds?")} className="text-[10px] md:text-xs px-3 py-1 bg-white/5 border border-white/5 hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/10 text-slate-300 rounded-full transition-all">
                🛡️ Refund info
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Submit query to RAG agent (e.g. 'What is the price of the hard project?')..."
                className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6] transition-colors"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isTyping}
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={isTyping || !inputValue.trim()}
                className="px-4 py-2 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] hover:from-[#9061F9] hover:to-[#6C2BD9] text-white text-sm font-semibold rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={14} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: RAG DETAILS & TERMINAL */}
        <section className="flex flex-col gap-4 h-full min-h-0">
          
          {/* RAG Knowledge Indexer */}
          <div className="bg-[#111726]/60 backdrop-blur-md border border-white/5 rounded-xl shadow-xl flex flex-col overflow-hidden flex-[1.1] min-h-0">
            <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-slate-900/30">
              <h2 className="text-white text-sm font-semibold flex items-center gap-2">
                <Database size={16} className="text-[#06B6D4]" />
                <span>Customizable RAG Document Indexer</span>
              </h2>
              <button 
                onClick={() => setShowAddDoc(!showAddDoc)}
                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-slate-200 text-[11px] hover:bg-white/10 transition-all flex items-center gap-1"
              >
                <Plus size={12} />
                <span>{showAddDoc ? "Close" : "Index Document"}</span>
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
              
              {/* Analytics metrics */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/2 border border-white/5 rounded-lg p-2">
                  <div className="text-base font-bold text-[#06B6D4]">{analytics.documentsCount}</div>
                  <div className="text-[9px] text-slate-500 uppercase font-semibold">Documents</div>
                </div>
                <div className="bg-white/2 border border-white/5 rounded-lg p-2">
                  <div className="text-base font-bold text-[#06B6D4]">{analytics.chunksCount}</div>
                  <div className="text-[9px] text-slate-500 uppercase font-semibold">Total Chunks</div>
                </div>
                <div className="bg-white/2 border border-white/5 rounded-lg p-2">
                  <div className="text-base font-bold text-[#06B6D4]">{analytics.queryCount}</div>
                  <div className="text-[9px] text-slate-500 uppercase font-semibold">Queries</div>
                </div>
                <div className="bg-white/2 border border-white/5 rounded-lg p-2">
                  <div className="text-base font-bold text-[#06B6D4]">{analytics.averageResponseTime}ms</div>
                  <div className="text-[9px] text-slate-500 uppercase font-semibold">Latency</div>
                </div>
              </div>

              {/* Add document form */}
              {showAddDoc && (
                <form onSubmit={handleIndexDocument} className="bg-slate-900/50 border border-white/5 p-3 rounded-lg flex flex-col gap-3">
                  <h3 className="text-white text-xs font-semibold">Create New Context File</h3>
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase mb-1">Filename (e.g. revisions.txt)</label>
                    <input
                      type="text"
                      required
                      placeholder="revisions.txt"
                      className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#06B6D4]"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase mb-1">Knowledge Content (unstructured text)</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Paste factual statements, guidelines, or Q&As. The local vector scanner computes term frequencies for matching..."
                      className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#06B6D4] resize-none"
                      value={newDocContent}
                      onChange={(e) => setNewDocContent(e.target.value)}
                    />
                  </div>
                  <button type="submit" disabled={isIndexing} className="self-end px-3 py-1.5 bg-[#06B6D4] hover:bg-[#0891B2] text-slate-900 text-xs font-semibold rounded transition-colors disabled:opacity-50">
                    {isIndexing ? "Indexing..." : "Index Content"}
                  </button>
                </form>
              )}

              {/* Document rows */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <h3 className="text-white text-xs font-semibold mb-2 flex items-center gap-1.5">
                  <FileText size={12} />
                  <span>Factual Guidelines Database</span>
                </h3>
                
                {documents.length === 0 ? (
                  <div className="border border-dashed border-white/5 p-4 rounded-lg text-center text-slate-500">
                    <AlertCircle size={20} className="mx-auto mb-1.5 opacity-50" />
                    <p className="text-xs">No documents indexed. Using generic defaults.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex justify-between items-center p-2.5 bg-white/2 border border-white/5 rounded-lg">
                        <div>
                          <div className="text-xs font-semibold text-slate-200">📄 {doc.filename}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Added: {new Date(doc.addedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-rose-500 hover:text-rose-400 transition-colors p-1"
                          title="De-index"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Retro terminal console logs */}
          <div className="bg-black border border-white/5 rounded-xl shadow-xl flex flex-col overflow-hidden flex-[0.9] min-h-0">
            <div className="px-5 py-2 border-b border-white/5 flex justify-between items-center bg-[#070A13]">
              <h2 className="text-white text-xs font-semibold flex items-center gap-2 font-mono">
                <Terminal size={14} className="text-[#10b981]" />
                <span>RAG Vector Search & Pipeline Monitor</span>
              </h2>
              <button 
                onClick={() => setLogs([])}
                className="text-slate-500 hover:text-slate-300 text-[10px] font-mono border border-white/10 rounded px-1.5 py-0.5"
              >
                CLEAR
              </button>
            </div>

            <div className="flex-1 p-3 bg-black font-mono text-[11px] overflow-y-auto leading-relaxed" ref={terminalBottomRef}>
              {logs.length === 0 ? (
                <div className="text-slate-600 italic text-center mt-4">
                  Waiting for chat query or document indexation event logs...
                </div>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-slate-500 flex-shrink-0">[{log.timestamp.split('T')[1].substring(0, 8)}]</span>
                      <span className={`font-semibold flex-shrink-0 uppercase ${
                        log.level === "error" 
                          ? "text-rose-500" 
                          : log.level === "warn" 
                            ? "text-amber-500" 
                            : "text-cyan-400"
                      }`}>{log.level}</span>
                      <span className="text-slate-300 whitespace-pre-wrap">{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
