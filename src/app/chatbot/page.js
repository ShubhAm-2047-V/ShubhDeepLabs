"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  MessageSquare, Send, Terminal, FileText, Plus, Trash2, 
  Sparkles, Clock, Database, RefreshCw, AlertCircle, ArrowLeft, Brain,
  Settings, Code, Copy, Check, CheckSquare, Sliders, Play, Lock, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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
  
  // Custom API Key & Settings
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [unlimitedMode, setUnlimitedMode] = useState(false);
  const [systemInstructions, setSystemInstructions] = useState(
    "You are a helpful customer support agent for Shubdeep Labs.\nAnswer the user's question using ONLY the factual context provided. If the context does not contain the answer, say \"I'm sorry, I don't have that information in my knowledge base. Please contact our support coordinators.\"\nStrictly avoid making up facts."
  );

  // Demo Expiry & Timer States
  const [tokenStatus, setTokenStatus] = useState("loading"); // loading, approved, expired, invalid
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300s)

  // Chat States
  const [messages, setMessages] = useState([
    { id: "msg-1", sender: "bot", text: "Hello! Welcome to your custom Shubdeep Labs Support Hub. I can answer questions about our pricing tiers, office schedule, refund policy, and revision limits.\n\nType a question in the chat console or use the Control Board on the right to input your Gemini API Key, manage custom RAG documents, and watch the real-time vector matches!", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Active View Tab on mobile/responsive layouts
  const [activePanel, setActivePanel] = useState("chat"); // chat, admin
  // Active Tab within the Admin control panel
  const [adminTab, setAdminTab] = useState("docs"); // docs, config, terminal

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

  // Verify token & keys on mount
  useEffect(() => {
    setMounted(true);
    
    // Load custom settings
    const localKey = localStorage.getItem("shubdeep_gemini_api_key") || "";
    const localUnlimited = localStorage.getItem("shubdeep_unlimited_mode") === "true";
    const localInstructions = localStorage.getItem("shubdeep_system_instructions");

    setGeminiApiKey(localKey);
    setUnlimitedMode(localUnlimited);
    if (localInstructions) setSystemInstructions(localInstructions);

    // Verify token or bypass if key or unlimited mode is active
    if (localKey || localUnlimited) {
      setTokenStatus("approved");
      setTimeLeft(86400); // Set high timer (unlimited feel)
    } else {
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
    }

    // Load documents from LocalStorage or seed defaults
    const local = localStorage.getItem("shubdeep_chatbot_docs");
    if (local) {
      setDocuments(JSON.parse(local));
    } else {
      setDocuments(DEFAULT_DOCS);
      localStorage.setItem("shubdeep_chatbot_docs", JSON.stringify(DEFAULT_DOCS));
    }

    addLog("=================================================================", "info");
    addLog("  Next.js Chatbot Custom Dashboard initialized.", "info");
    addLog("  Local RAG Cosine Vocabulary Matrix Online (Zero-Database).", "info");
    if (localKey) {
      addLog("  [Security] Custom GEMINI_API_KEY detected in local vault.", "info");
    } else {
      addLog("  [Security] No custom API key configured. Offline Sandbox simulation active.", "warn");
    }
    addLog("=================================================================", "info");
  }, []);

  // Timer interval countdown
  useEffect(() => {
    if (tokenStatus !== "approved") return;
    if (geminiApiKey || unlimitedMode) return; // Freeze timer if custom key or unlimited active

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
  }, [tokenStatus, geminiApiKey, unlimitedMode]);

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
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { timestamp, level, message }].slice(-120));
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
      .filter(r => r.score > 0.04)
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
      // 2. Query Next.js API Route with local custom key if present
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          context: contextText,
          history: messages,
          apiKey: geminiApiKey
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
        text: "I encountered a connection issue querying the backend route handler. Check your local dev server configs or ensure your API Key is correct.",
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
    toast.success("Document indexed successfully!");
  };

  const handleDeleteDocument = (id) => {
    const docToDelete = documents.find(d => d.id === id);
    if (!docToDelete) return;

    addLog(`[RAG Indexer] Removing document "${docToDelete.filename}"...`, "info");
    const filtered = documents.filter(d => d.id !== id);
    setDocuments(filtered);
    localStorage.setItem("shubdeep_chatbot_docs", JSON.stringify(filtered));
    addLog("[RAG Indexer] Document removed from active directory.", "info");
    toast.success("Document deleted.");
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem("shubdeep_gemini_api_key", geminiApiKey);
    localStorage.setItem("shubdeep_unlimited_mode", unlimitedMode ? "true" : "false");
    localStorage.setItem("shubdeep_system_instructions", systemInstructions);

    addLog("[Config] Saved key, system prompts, and unlimited policies into registry.", "info");

    if (geminiApiKey || unlimitedMode) {
      setTokenStatus("approved");
      setTimeLeft(86400); // 24hr display
    }

    toast.success("Chatbot settings saved successfully!", {
      className: "sketch-card text-[#2C2C2C] border-2 border-[#2C2C2C] bg-[#FAF6EE] rounded-xl font-marker"
    });
  };

  const formatTime = (seconds) => {
    if (geminiApiKey || unlimitedMode) return "UNLIMITED ⚡";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  // Render Loading State
  if (tokenStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] flex items-center justify-center font-sans p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-2.5 border-[#2C2C2C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold">Verifying Secure Access Token...</p>
        </div>
      </div>
    );
  }

  // Render Expired/Invalid Block State
  if (tokenStatus !== "approved") {
    return (
      <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] flex items-center justify-center font-sans p-4">
        <div className="sketch-card bg-white p-8 max-w-md w-full text-center relative shadow-[6px_8px_0px_#2C2C2C] border-3 border-[#2C2C2C] rounded-2xl">
          {/* Binder hole */}
          <div className="absolute top-3 left-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
          <div className="absolute top-3 right-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
          
          <div className="w-12 h-12 bg-red-100 border-2 border-[#2C2C2C] text-red-500 flex items-center justify-center rounded-xl mx-auto mb-5 shadow-[2px_2.5px_0_#2C2C2C]">
            <ShieldAlert size={24} />
          </div>
          
          <h2 className="text-[#2C2C2C] text-2xl font-hand font-extrabold mb-3">
            {tokenStatus === "expired" ? "Demo Session Expired" : "Access Key Restricted"}
          </h2>
          
          <p className="text-xs font-marker text-[#5A5A5A] leading-relaxed mb-6">
            {tokenStatus === "expired" 
              ? "Your 5-minute chatbot preview session has elapsed. To request new access, click the 'Request Demo Output' button on our home page or add a custom Gemini API Key below to bypass constraints."
              : "Direct access to this workspace is restricted. Please go to the homepage and click 'Request Demo Output' to start a session."}
          </p>

          {/* Quick config in block screen */}
          <div className="bg-[#FCF9F2] p-4 rounded-xl border-2 border-[#2C2C2C] text-left mb-6">
            <h3 className="font-marker font-bold text-xs text-[#2C2C2C] uppercase mb-2">🔑 bypass with your API Key</h3>
            <input 
              type="password"
              placeholder="Paste Gemini API Key (starts with AIzaSy)..."
              className="w-full text-xs px-3 py-2 border-2 border-[#2C2C2C] bg-white rounded-lg focus:outline-none"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
            />
            <button 
              onClick={(e) => {
                localStorage.setItem("shubdeep_gemini_api_key", geminiApiKey);
                setTokenStatus("approved");
                setTimeLeft(86400);
                toast.success("Bypass established successfully!");
              }}
              className="w-full mt-2.5 py-2 text-xs font-marker font-bold bg-[#A5D6A7] hover:bg-[#81C784] border-2 border-[#2C2C2C] text-[#2C2C2C] rounded-lg transition-all"
            >
              Verify & Enable Workspace
            </button>
          </div>

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
    <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] p-4 pt-20 md:pt-24 flex flex-col font-sans max-w-7xl mx-auto">
      
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
              <h1 className="text-[#2C2C2C] text-lg md:text-xl font-hand font-extrabold leading-none">Custom RAG Website Chatbot</h1>
              <p className="text-[10px] md:text-xs font-marker text-[#5A5A5A] mt-1">Split-Screen Dialogue Engine, Vector Search & Real-time Console Monitor</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs justify-end">
          {/* Mobile responsive toggle view */}
          <div className="flex md:hidden border-2 border-[#2C2C2C] rounded-xl overflow-hidden bg-white shadow-[2px_2px_0_#2C2C2C]">
            <button 
              onClick={() => setActivePanel("chat")}
              className={`px-3 py-1.5 font-marker font-bold text-xs transition-colors ${activePanel === "chat" ? "bg-[#2C2C2C] text-white" : "bg-white text-[#2C2C2C]"}`}
            >
              💬 Chat
            </button>
            <button 
              onClick={() => setActivePanel("admin")}
              className={`px-3 py-1.5 font-marker font-bold text-xs transition-colors ${activePanel === "admin" ? "bg-[#2C2C2C] text-white" : "bg-white text-[#2C2C2C]"}`}
            >
              🛠️ Control Board
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 marker-red border-2 border-[#2C2C2C] rounded-xl text-[#2C2C2C] font-marker font-bold shadow-[2px_2.5px_0_#2C2C2C]">
            <Clock size={12} className="animate-spin-slow" />
            <span className="uppercase tracking-wider">⏱️ Session: {formatTime(timeLeft)}</span>
          </div>

          <button 
            onClick={() => {
              setDocuments(DEFAULT_DOCS);
              localStorage.setItem("shubdeep_chatbot_docs", JSON.stringify(DEFAULT_DOCS));
              addLog("[System] Knowledge base reset to default faq guidelines.", "info");
              toast.success("Knowledge base reset to defaults.");
            }}
            className="btn-sketch py-1.5 px-3 text-xs flex items-center gap-1.5 shadow-[1.5px_2px_0_#2C2C2C]"
            title="Reset DB"
          >
            <RefreshCw size={12} />
            <span>Reset Files</span>
          </button>
        </div>
      </header>

      {/* 2. DUAL LAYOUT DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow min-h-0 h-[calc(100vh-190px)] md:h-[calc(100vh-230px)] mb-5">
        
        {/* LEFT COLUMN: DIALOGUE CHAT CANVAS (Show always on desktop, conditionally on mobile) */}
        <section className={`lg:col-span-8 sketch-card bg-white flex flex-col overflow-hidden h-full shadow-[5px_6px_0_#2C2C2C] border-3 border-[#2C2C2C] transition-all ${
          activePanel === "chat" ? "flex" : "hidden md:flex"
        }`}>
          <div className="px-5 py-3 border-b-3 border-[#2C2C2C] flex justify-between items-center bg-[#FAF6EE] shrink-0">
            <h2 className="text-[#2C2C2C] text-sm md:text-base font-marker font-bold flex items-center gap-2">
              <MessageSquare size={16} className="text-[#2C2C2C]" />
              <span>Support Dialogue Canvas</span>
            </h2>
            <span className="text-[10px] text-[#5A5A5A] font-mono">CLIENT RAG: {geminiApiKey ? "HYBRID (GEMINI)" : "LOCAL SIMULATOR"}</span>
          </div>

          {/* Chat scroll box - ruled notebook paper */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 notebook-ruled">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-[80%] rounded-xl p-3.5 text-sm shadow-[2px_3px_0_#2C2C2C] border-2 border-[#2C2C2C] ${
                  msg.sender === "user"
                    ? "bg-[#FFF9C4] text-[#2C2C2C] rounded-tr-none"
                    : msg.isError 
                      ? "bg-red-50 text-red-700 rounded-tl-none border-red-400"
                      : "bg-white text-[#2C2C2C] rounded-tl-none"
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap font-sans font-semibold text-xs md:text-sm">{msg.text}</p>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#2C2C2C]/10">
                      <span className="block text-[9px] font-marker font-bold text-[#6A6A6A] uppercase tracking-wider mb-1.5">CONCORDANT REFERENCES EXTACTED:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, i) => (
                          <span key={i} className="text-[9px] font-marker font-bold px-2 py-0.5 bg-[#E1F5FE] border border-[#2C2C2C] text-[#2C2C2C] rounded shadow-[1px_1.5px_0_#2C2C2C] flex items-center gap-1">
                            <span>📄</span> {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="block text-[8px] text-[#8A8A8A] font-mono mt-2 text-right">{msg.timestamp}</span>
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
          <div className="p-4 border-t-3 border-[#2C2C2C] bg-[#FAF6EE] flex flex-col gap-3 shrink-0">
            
            {/* Quick Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => handleQuickReply("What are the pricing plans?")} className="text-[10px] px-3 py-1 bg-white border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] text-[#2C2C2C] font-marker font-bold rounded-full transition-all shadow-[1px_2.5px_0_#2C2C2C] active:translate-y-0.5">
                💰 Pricing Tiers
              </button>
              <button onClick={() => handleQuickReply("How can I contact Shubdeep Labs?")} className="text-[10px] px-3 py-1 bg-white border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] text-[#2C2C2C] font-marker font-bold rounded-full transition-all shadow-[1px_2.5px_0_#2C2C2C] active:translate-y-0.5">
                📞 Contact Registry
              </button>
              <button onClick={() => handleQuickReply("What is the revision policy?")} className="text-[10px] px-3 py-1 bg-white border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] text-[#2C2C2C] font-marker font-bold rounded-full transition-all shadow-[1px_2.5px_0_#2C2C2C] active:translate-y-0.5">
                🔄 Revision Rules
              </button>
              <button onClick={() => handleQuickReply("Do you guarantee refunds?")} className="text-[10px] px-3 py-1 bg-white border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] text-[#2C2C2C] font-marker font-bold rounded-full transition-all shadow-[1px_2.5px_0_#2C2C2C] active:translate-y-0.5">
                🛡️ Refund policy
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={geminiApiKey ? "Submit query to Gemini... (e.g. 'Is PPT included in Easy project?')" : "Enter query (falling back to simulator)..."}
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

        {/* RIGHT COLUMN: DEVELOPER CONTROL PANEL (Show always on desktop, conditionally on mobile) */}
        <section className={`lg:col-span-4 sketch-card bg-white flex flex-col overflow-hidden h-full shadow-[5px_6px_0_#2C2C2C] border-3 border-[#2C2C2C] transition-all ${
          activePanel === "admin" ? "flex" : "hidden md:flex"
        }`}>
          {/* Dashboard Panel Tabs */}
          <div className="flex border-b-3 border-[#2C2C2C] bg-[#FAF6EE] shrink-0">
            <button 
              onClick={() => setAdminTab("docs")}
              className={`flex-1 py-3 font-marker font-bold text-xs border-r-2 border-[#2C2C2C] transition-all flex items-center justify-center gap-1.5
                ${adminTab === "docs" ? "bg-[#2C2C2C] text-[#FFF9C4]" : "bg-white/50 text-[#2C2C2C] hover:bg-white"}`}
            >
              <FileText size={13} />
              <span>Files</span>
            </button>
            <button 
              onClick={() => setAdminTab("config")}
              className={`flex-1 py-3 font-marker font-bold text-xs border-r-2 border-[#2C2C2C] transition-all flex items-center justify-center gap-1.5
                ${adminTab === "config" ? "bg-[#2C2C2C] text-[#FFF9C4]" : "bg-white/50 text-[#2C2C2C] hover:bg-white"}`}
            >
              <Settings size={13} />
              <span>Config</span>
            </button>
            <button 
              onClick={() => setAdminTab("terminal")}
              className={`flex-1 py-3 font-marker font-bold text-xs transition-all flex items-center justify-center gap-1.5
                ${adminTab === "terminal" ? "bg-[#2C2C2C] text-[#FFF9C4]" : "bg-white/50 text-[#2C2C2C] hover:bg-white"}`}
            >
              <Terminal size={13} />
              <span>Console</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col bg-[#FCF9F2]/30 min-h-0">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: KNOWLEDGE BASE DOCUMENTS */}
              {adminTab === "docs" && (
                <motion.div 
                  key="docs-panel"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 flex flex-col flex-1"
                >
                  <div className="flex justify-between items-center bg-[#FAF6EE] p-3 border-2 border-[#2C2C2C] rounded-xl shadow-[2px_2.5px_0_#2C2C2C]">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-[#3F51B5]" />
                      <span className="font-marker font-extrabold text-xs text-[#2C2C2C]">Active Knowledge Base</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-[#E6DFD3] px-2 py-0.5 border border-[#2C2C2C] rounded-full text-[#2C2C2C] shadow-[1px_1px_0_#2C2C2C]">
                      FILES: {analytics.documentsCount}
                    </span>
                  </div>

                  {/* List of custom RAG documents */}
                  <div className="space-y-2 flex-grow overflow-y-auto max-h-[250px] pr-1">
                    {documents.map((doc) => (
                      <div 
                        key={doc.id}
                        className="p-3 bg-white border-2 border-[#2C2C2C] rounded-xl shadow-[2px_2px_0_#2C2C2C]/10 flex justify-between items-start group hover:border-[#2C2C2C] transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-marker font-bold text-xs text-[#2C2C2C] truncate">📄 {doc.filename}</p>
                          <p className="text-[9px] font-sans text-[#6A6A6A] mt-0.5 line-clamp-2 leading-tight">
                            {doc.content}
                          </p>
                          <span className="text-[8px] font-mono font-bold mt-1 inline-block text-[#90A4AE]">
                            Tokens: {tokenize(doc.content).length} words
                          </span>
                        </div>
                        <button 
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1 rounded-lg hover:bg-red-50 text-red-500 border border-transparent hover:border-red-200 transition-colors shrink-0 ml-2"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Document Section */}
                  <div className="border-t-2 border-dashed border-[#2C2C2C]/20 pt-3 mt-auto">
                    {!showAddDoc ? (
                      <button 
                        onClick={() => setShowAddDoc(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#E1F5FE] border-2 border-[#2C2C2C] rounded-xl font-marker font-bold text-xs text-[#2C2C2C] shadow-[2.5px_3.0px_0_#2C2C2C] hover:bg-[#B3E5FC] transition-colors"
                      >
                        <Plus size={14} />
                        <span>Inject Custom File into RAG</span>
                      </button>
                    ) : (
                      <form onSubmit={handleIndexDocument} className="bg-white p-4 border-2 border-[#2C2C2C] rounded-xl shadow-[3px_4px_0_#2C2C2C] space-y-3 relative">
                        <h3 className="font-marker font-bold text-xs text-[#2C2C2C]">📄 Custom Knowledge Indexer</h3>
                        <div>
                          <label className="block text-[9px] font-marker font-bold uppercase text-[#6A6A6A] mb-1">File Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. syllabus_requirements.txt" 
                            className="w-full text-xs px-3 py-2 border-2 border-[#2C2C2C] rounded-lg focus:outline-none"
                            value={newDocName}
                            onChange={(e) => setNewDocName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-marker font-bold uppercase text-[#6A6A6A] mb-1">Text Guidelines / Context Content</label>
                          <textarea 
                            rows={4}
                            placeholder="Paste syllabus paragraphs, FAQ questions, pricing rules, or context content here..." 
                            className="w-full text-xs px-3 py-2 border-2 border-[#2C2C2C] rounded-lg focus:outline-none"
                            value={newDocContent}
                            onChange={(e) => setNewDocContent(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => setShowAddDoc(false)}
                            className="flex-1 py-2 border-2 border-[#2C2C2C]/50 rounded-lg text-xs font-marker text-[#6A6A6A] hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={isIndexing}
                            className="flex-1 py-2 bg-[#A5D6A7] hover:bg-[#81C784] text-[#2C2C2C] font-marker font-bold border-2 border-[#2C2C2C] rounded-lg text-xs flex items-center justify-center gap-1.5"
                          >
                            {isIndexing ? "Indexing..." : "Index Content"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: SYSTEM CONFIG & KEYS */}
              {adminTab === "config" && (
                <motion.div 
                  key="config-panel"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <form onSubmit={handleSaveConfig} className="space-y-4">
                    
                    {/* Gemini Key Config */}
                    <div className="bg-white p-3 border-2 border-[#2C2C2C] rounded-xl shadow-[2.5px_3.0px_0_#2C2C2C]">
                      <div className="flex items-center gap-2 mb-2">
                        <Key size={14} className="text-[#FBC02D]" />
                        <label className="block text-xs font-marker font-bold text-[#2C2C2C] uppercase">Gemini API Key</label>
                      </div>
                      <input 
                        type="password"
                        placeholder="Paste Gemini Key (starts with AIzaSy...)" 
                        className="w-full text-xs px-3 py-2 border-2 border-[#2C2C2C] rounded-lg focus:outline-none bg-slate-50/50"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                      />
                      <p className="text-[8px] text-[#7A7A7A] mt-1.5 leading-tight font-sans">
                        🔑 Injected client-side with every prompt payload. Saved inside your local browser storage vault.
                      </p>
                    </div>

                    {/* Developer Unlimited mode */}
                    <div className="bg-white p-3 border-2 border-[#2C2C2C] rounded-xl shadow-[2.5px_3.0px_0_#2C2C2C] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock size={14} className="text-[#3F51B5]" />
                        <div>
                          <label className="block text-xs font-marker font-bold text-[#2C2C2C] uppercase leading-none">Unlimited Mode</label>
                          <span className="text-[8px] text-[#7A7A7A] font-sans leading-tight mt-0.5 block">Disable 5m session timeout</span>
                        </div>
                      </div>
                      <input 
                        type="checkbox"
                        checked={unlimitedMode}
                        onChange={(e) => setUnlimitedMode(e.target.checked)}
                        className="w-4 h-4 border-2 border-[#2C2C2C] rounded cursor-pointer"
                      />
                    </div>

                    {/* System Prompt Instructions */}
                    <div className="bg-white p-3 border-2 border-[#2C2C2C] rounded-xl shadow-[2.5px_3.0px_0_#2C2C2C]">
                      <div className="flex items-center gap-2 mb-2">
                        <Sliders size={14} className="text-[#6A1B9A]" />
                        <label className="block text-xs font-marker font-bold text-[#2C2C2C] uppercase">System Instruction Prompt</label>
                      </div>
                      <textarea 
                        rows={5}
                        className="w-full text-xs px-3 py-2 border-2 border-[#2C2C2C] rounded-lg focus:outline-none bg-slate-50/50 font-sans"
                        value={systemInstructions}
                        onChange={(e) => setSystemInstructions(e.target.value)}
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-[#A5D6A7] hover:bg-[#81C784] border-2 border-[#2C2C2C] text-[#2C2C2C] font-marker font-extrabold text-xs rounded-xl shadow-[3px_4.5px_0_#2C2C2C] active:translate-y-0.5 active:shadow-[1px_1px_0_#2C2C2C] transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckSquare size={13} />
                      <span>Save Chatbot Settings</span>
                    </button>
                  </form>
                </motion.div>
              )}

              {/* TAB 3: VECTOR RAG CHALKBOARD TERMINAL */}
              {adminTab === "terminal" && (
                <motion.div 
                  key="terminal-panel"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3 flex flex-col flex-1"
                >
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-[#FFF9C4] bg-[#263238] border-2 border-[#2C2C2C] px-3 py-2 rounded-xl shadow-[2px_2px_0_#2C2C2C]">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping" /> CONSOLE MONITOR
                    </span>
                    <span>RAG V2.1</span>
                  </div>

                  {/* Chalkboard console output */}
                  <div 
                    ref={terminalBottomRef}
                    className="flex-grow min-h-[220px] max-h-[300px] chalkboard-panel p-3.5 rounded-xl font-mono text-[9.5px] text-[#A5D6A7] overflow-y-auto space-y-1.5 border-2 border-[#2C2C2C]"
                  >
                    {logs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed">
                        <span className="text-[#90A4AE] mr-1">[{log.timestamp}]</span>
                        <span className={
                          log.level === "error" 
                            ? "text-[#FF8A80]" 
                            : log.level === "warn" 
                            ? "text-[#FFE082]" 
                            : "text-[#B9F6CA]"
                        }>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 border-2 border-[#2C2C2C] bg-white rounded-xl">
                      <span className="text-[8px] font-marker font-extrabold uppercase text-[#7A7A7A] block">Total Inquiries</span>
                      <span className="font-marker font-black text-sm text-[#2C2C2C]">{analytics.queryCount}</span>
                    </div>
                    <div className="p-2 border-2 border-[#2C2C2C] bg-white rounded-xl">
                      <span className="text-[8px] font-marker font-extrabold uppercase text-[#7A7A7A] block">Avg Response</span>
                      <span className="font-marker font-black text-sm text-[#2C2C2C]">
                        {analytics.averageResponseTime === 0 ? "—" : `${analytics.averageResponseTime}ms`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </section>

      </div>
    </div>
  );
}
