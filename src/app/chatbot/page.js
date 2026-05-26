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
  
  // Demo Expiry & Timer States
  const [tokenStatus, setTokenStatus] = useState("loading"); // loading, approved, expired, invalid
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300s)

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

  // Verify token on mount
  useEffect(() => {
    setMounted(true);
    
    const localExpiry = localStorage.getItem("shubdeep_demo_expiry");
    if (!localExpiry) {
      setTokenStatus("invalid");
      return;
    }

    const expiryTime = parseInt(localExpiry, 10);
    const remaining = expiryTime - Date.now();
    
    if (remaining > 0) {
      setTokenStatus("approved");
      setTimeLeft(Math.floor(remaining / 1000));
    } else {
      setTokenStatus("expired");
    }

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

  // Timer interval countdown
  useEffect(() => {
    if (tokenStatus !== "approved") return;

    const timer = setInterval(() => {
      const localExpiry = localStorage.getItem("shubdeep_demo_expiry");
      if (!localExpiry) {
        setTokenStatus("invalid");
        clearInterval(timer);
        return;
      }
      const expiryTime = parseInt(localExpiry, 10);
      const remaining = expiryTime - Date.now();

      if (remaining <= 0) {
        clearInterval(timer);
        setTokenStatus("expired");
        setTimeLeft(0);
        addLog("[System] Demo Session Expired. Session locked.", "warn");
      } else {
        setTimeLeft(Math.floor(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tokenStatus]);

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

  const handleQuickReply = (text) => {
    handleSendMessage(text);
  };

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  // Render Loading State
  if (tokenStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#070A13] text-[#94A3B8] flex items-center justify-center font-sans p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-2.5 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold">Verifying Secure Access Token...</p>
        </div>
      </div>
    );
  }

  // Render Expired/Invalid Block State
  if (tokenStatus !== "approved") {
    return (
      <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] flex items-center justify-center font-sans p-4">
        <div className="sketch-card bg-white p-8 max-w-md w-full text-center relative shadow-[6px_8px_0px_#2C2C2C]">
          {/* Binder hole */}
          <div className="absolute top-3 left-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
          <div className="absolute top-3 right-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
          
          <div className="w-12 h-12 bg-red-100 border-2 border-[#2C2C2C] text-red-500 flex items-center justify-center rounded-xl mx-auto mb-5 shadow-[2px_2.5px_0_#2C2C2C]">
            <AlertCircle size={24} />
          </div>
          
          <h2 className="text-[#2C2C2C] text-2xl font-hand font-extrabold mb-3">
            {tokenStatus === "expired" ? "Demo Session Expired" : "Access Key Restricted"}
          </h2>
          
          <p className="text-xs font-marker text-[#5A5A5A] leading-relaxed mb-6">
            {tokenStatus === "expired" 
              ? "Your 5-minute chatbot preview session has elapsed. To request new access, click the 'Request Demo Output' button on our home page."
              : "Direct access to this workspace is restricted. Please go to the homepage and click 'Request Demo Output' to start a session."}
          </p>

          <Link
            href="/"
            className="btn-sketch w-full py-3 px-6 text-sm flex items-center justify-center"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] p-4 pt-20 md:pt-24 flex flex-col font-sans">
      
      {/* 1. ROW HEADER */}
      <header className="sketch-card bg-white p-4 flex flex-col md:flex-row md:items-center justify-between shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] mb-5 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 border-2 border-[#2C2C2C] rounded-xl bg-white hover:bg-[#FFF9C4] transition-all text-[#2C2C2C] shadow-[1.5px_2px_0_#2C2C2C] flex items-center justify-center">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="bg-[#FFF176] border-2 border-[#2C2C2C] p-2 rounded-xl shadow-[2px_2.5px_0_#2C2C2C]">
              <Brain size={18} className="text-[#2C2C2C]" />
            </div>
            <div>
              <h1 className="text-[#2C2C2C] text-lg md:text-xl font-hand font-extrabold leading-none">Advanced AI Customer Care Chatbot</h1>
              <p className="text-[10px] md:text-xs font-marker text-[#5A5A5A] mt-1">Unified Next.js RAG Portal & Real-time Console Monitor</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 marker-red border-2 border-[#2C2C2C] rounded-xl text-[#2C2C2C] font-marker font-bold shadow-[2px_2.5px_0_#2C2C2C] animate-pulse">
            <span>⏱️ EXPIRES IN: {formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-2 font-marker font-bold border-2 border-[#2C2C2C] bg-white rounded-xl px-2.5 py-1.5 shadow-[2px_2px_0_#2C2C2C]">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse border border-[#2C2C2C] shadow-[0_0_4px_#10b981]"></span>
            <span className="text-[#2C2C2C] tracking-wide">ENGINE: ACTIVE</span>
          </div>
          <button 
            onClick={() => {
              setDocuments(DEFAULT_DOCS);
              localStorage.setItem("shubdeep_chatbot_docs", JSON.stringify(DEFAULT_DOCS));
              addLog("[System] Knowledge base reset to default faq guidelines.", "info");
            }}
            className="btn-sketch py-1.5 px-3 text-xs flex items-center gap-1.5"
            title="Reset DB"
          >
            <RefreshCw size={12} />
            <span>Reset Guides</span>
          </button>
        </div>
      </header>

      {/* 2. CENTERED CHAT CANVAS */}
      <main className="flex justify-center flex-grow min-h-0 mb-6 h-[calc(100vh-180px)] md:h-[calc(100vh-220px)]">
        
        {/* CHAT CANVAS */}
        <section className="sketch-card bg-white flex flex-col overflow-hidden h-full w-full max-w-4xl shadow-[5px_6px_0_#2C2C2C] border-3 border-[#2C2C2C]">
          <div className="px-5 py-4 border-b-3 border-[#2C2C2C] flex justify-between items-center bg-[#FAF6EE]">
            <h2 className="text-[#2C2C2C] text-sm md:text-base font-marker font-bold flex items-center gap-2">
              <MessageSquare size={16} className="text-[#2C2C2C]" />
              <span>Customer Care Dialogue Workspace</span>
            </h2>
            <span className="text-[10px] text-[#5A5A5A] font-mono">NEXTJS ROUTE: /chatbot</span>
          </div>

          {/* Chat scroll box - ruled paper */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 notebook-ruled">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl p-3.5 text-sm shadow-[2px_3px_0_#2C2C2C] border-2 border-[#2C2C2C] ${
                  msg.sender === "user"
                    ? "bg-[#FFF9C4] text-[#2C2C2C] rounded-tr-none"
                    : msg.isError 
                      ? "bg-red-50 text-red-700 rounded-tl-none border-red-400"
                      : "bg-white text-[#2C2C2C] rounded-tl-none"
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap font-sans font-semibold">{msg.text}</p>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#2C2C2C]/10">
                      <span className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase tracking-wider mb-1.5">RETRIEVED CONTEXT REFERENCE:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, i) => (
                          <span key={i} className="text-[10px] font-marker font-bold px-2 py-0.5 marker-blue border border-[#2C2C2C] text-[#2C2C2C] rounded shadow-[1px_1px_0_#2C2C2C]">
                            📄 {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="block text-[9px] text-[#6A6A6A] font-mono mt-2 text-right">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-[#2C2C2C] rounded-xl rounded-tl-none p-3.5 shadow-[2px_3px_0_#2C2C2C]">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-[#2C2C2C] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#2C2C2C] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#2C2C2C] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Form Actions */}
          <div className="p-4 border-t-3 border-[#2C2C2C] bg-[#FAF6EE] flex flex-col gap-3">
            
            {/* Quick Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => handleQuickReply("What are the pricing plans?")} className="text-[10px] md:text-xs px-3 py-1 bg-white border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] text-[#2C2C2C] font-marker font-bold rounded-full transition-all shadow-[1px_2.5px_0_#2C2C2C] active:translate-y-0.5 active:shadow-[0px_0px_0_#2C2C2C]">
                💰 Pricing Tiers
              </button>
              <button onClick={() => handleQuickReply("How can I contact Shubdeep Labs?")} className="text-[10px] md:text-xs px-3 py-1 bg-white border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] text-[#2C2C2C] font-marker font-bold rounded-full transition-all shadow-[1px_2.5px_0_#2C2C2C] active:translate-y-0.5 active:shadow-[0px_0px_0_#2C2C2C]">
                📞 Call Coordinator
              </button>
              <button onClick={() => handleQuickReply("What is the revision policy?")} className="text-[10px] md:text-xs px-3 py-1 bg-white border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] text-[#2C2C2C] font-marker font-bold rounded-full transition-all shadow-[1px_2.5px_0_#2C2C2C] active:translate-y-0.5 active:shadow-[0px_0px_0_#2C2C2C]">
                🔄 Revisions policy
              </button>
              <button onClick={() => handleQuickReply("Do you guarantee refunds?")} className="text-[10px] md:text-xs px-3 py-1 bg-white border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] text-[#2C2C2C] font-marker font-bold rounded-full transition-all shadow-[1px_2.5px_0_#2C2C2C] active:translate-y-0.5 active:shadow-[0px_0px_0_#2C2C2C]">
                🛡️ Refund info
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Submit query to RAG agent (e.g. 'What is the price of the hard project?')..."
                className="flex-1 bg-white border-2 border-[#2C2C2C] rounded-xl px-3.5 py-2 text-sm text-[#2C2C2C] placeholder-slate-400 focus:outline-none focus:bg-[#FFF9C4]/10 transition-colors font-sans font-semibold"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isTyping}
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={isTyping || !inputValue.trim()}
                className="btn-sketch py-2 px-5 text-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send size={14} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
