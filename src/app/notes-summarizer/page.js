"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  FileText, ArrowLeft, PlusCircle, Trash2, Download, AlertCircle, 
  RefreshCw, Sparkles, Brain, CheckSquare, BookOpen, HelpCircle
} from "lucide-react";

const SEED_NOTES = `The JavaScript Event Loop is a mechanism that allows JavaScript to perform non-blocking I/O operations, despite being single-threaded. 

1. Call Stack: JavaScript executes code line-by-line using a Call Stack. Functions are pushed onto the stack when invoked and popped off when they return.
2. Web APIs: Asynchronous operations (like setTimeout, fetch, DOM events) are handed off to the browser's Web APIs.
3. Task Queue (Callback Queue): Once an async operation completes, its callback is pushed to the Task Queue.
4. Job Queue (Microtask Queue): Reserved for promises. Microtasks have higher priority than macrotasks (Task Queue).
5. Event Loop: The Event Loop continuously checks if the Call Stack is empty. If the stack is empty, it takes the first task from the Job Queue (Microtasks) or Task Queue and pushes it onto the Call Stack for execution.`;

export default function NotesSummarizer() {
  const [mounted, setMounted] = useState(false);
  
  // App states
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [concepts, setConcepts] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  // Flip card states (keeps track of flipped cards by index)
  const [flippedCards, setFlippedCards] = useState({});

  // Session Token States
  const [tokenStatus, setTokenStatus] = useState("loading"); // loading, approved, expired, invalid
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // System Log helper
  const addSystemLog = (message, level = "info") => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSystemLogs(prev => [{ timestamp, level, message }, ...prev].slice(0, 50));
  };

  // Mount logic
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

    addSystemLog("=======================================================", "info");
    addSystemLog("  Smart Notes Summarizer Workspace Database Online.", "info");
    addSystemLog("  Ready to process and splice unstructured study logs.", "info");
    addSystemLog("=======================================================", "info");
  }, []);

  // Expiry Timer countdown
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
        addSystemLog("[System] Demo Session Expired. Workspace locked.", "warn");
      } else {
        setTimeLeft(Math.floor(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tokenStatus]);

  // Load Seed Note
  const handleLoadSeed = () => {
    setNotes(SEED_NOTES);
    addSystemLog("[Notepad] Injected pre-configured JavaScript Event Loop study sheet.", "info");
  };

  // Actions: Clear Notes
  const handleClearNotes = () => {
    setNotes("");
    setSummary("");
    setConcepts("");
    setFlashcards([]);
    setFlippedCards({});
    addSystemLog("[Notepad] Cleared notes and analysis cache.", "warn");
  };

  // Actions: Summarize Notes
  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      alert("Please enter or paste your study notes first.");
      return;
    }

    setLoading(true);
    setSummary("");
    setConcepts("");
    setFlashcards([]);
    setFlippedCards({});
    addSystemLog("[LLM Gate] Sending study notes to NLP reasoning agent...", "info");

    try {
      const response = await fetch("/api/notes-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notesText: notes.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
        setConcepts(data.concepts);
        setFlashcards(data.flashcards || []);
        
        // Append backend logs if returned
        if (data.logs) {
          data.logs.forEach(log => {
            addSystemLog(log.message, log.level);
          });
        }
      } else {
        addSystemLog("[LLM Gate Error] Failed to generate summary models.", "error");
        setSummary("Failed to compile study summary. Check console logs.");
      }
    } catch (err) {
      addSystemLog(`[LLM Gate Error] Handshake failed: ${err.message}`, "error");
      setSummary("Failed to establish secure connection with AI NLP service.");
    } finally {
      setLoading(false);
    }
  };

  // Actions: Toggle flip card
  const handleCardFlip = (idx) => {
    setFlippedCards(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Actions: Export CSV
  const handleExportCSV = () => {
    if (!summary && flashcards.length === 0) {
      alert("No summaries or flashcards generated to export.");
      return;
    }

    const csvContent = [
      ["Type", "Question/Section", "Answer/Content"],
      ["Summary", "Study Guide Summary", summary.replace(/\n/g, " ")],
      ["Concepts", "Core Concepts Overview", concepts.replace(/\n/g, " ")],
      ...flashcards.map((c, i) => [`Flashcard ${i + 1}`, c.question, c.answer])
    ]
      .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Study_Notes_Guide_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addSystemLog("Exported study sheets and Q&A flashcards to CSV.", "info");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate quick stats
  const charCount = notes.length;
  const wordCount = notes.split(/\s+/).filter(Boolean).length;
  const paragraphCount = notes.split("\n").filter(Boolean).length;

  if (!mounted) return null;

  // Render Expired Lock View
  if (tokenStatus !== "approved") {
    return (
      <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] flex items-center justify-center font-sans p-4">
        <div className="sketch-card bg-white p-8 max-w-md w-full text-center relative shadow-[6px_8px_0px_#2C2C2C] border-3 border-[#2C2C2C]">
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
              ? "Your 5-minute preview session has elapsed. To request new access, click the 'Request Demo Output' button on our home page."
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
      
      {/* 1. HEADER CONTROL ROW */}
      <header className="sketch-card bg-white p-4 flex flex-col md:flex-row md:items-center justify-between shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] mb-5 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 border-2 border-[#2C2C2C] rounded-xl bg-white hover:bg-[#FFF9C4] transition-all text-[#2C2C2C] shadow-[1.5px_2px_0_#2C2C2C] flex items-center justify-center">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="bg-red-400 border-2 border-[#2C2C2C] p-2 rounded-xl shadow-[2px_2.5px_0_#2C2C2C]">
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-[#2C2C2C] text-lg md:text-xl font-hand font-extrabold leading-none">Smart Notes Summarizer</h1>
              <p className="text-[10px] md:text-xs font-marker text-[#5A5A5A] mt-1">Study Guide Generator, Bullet Highlights & Click-to-Flip Flashcard Decks</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 marker-red border-2 border-[#2C2C2C] rounded-xl text-[#2C2C2C] font-marker font-bold shadow-[2px_2.5px_0_#2C2C2C] animate-pulse">
            <span>⏱️ EXPIRES IN: {formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={handleClearNotes}
            className="btn-sketch py-1.5 px-3 text-xs flex items-center gap-1.5"
          >
            <RefreshCw size={12} />
            <span>Reset Canvas</span>
          </button>
        </div>
      </header>

      {/* 2. THREE-PANEL CORE GRID */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-grow min-h-0 mb-6">
        
        {/* PANEL A: NOTEPAD INTAKE (Left - 4 Cols) */}
        <section className="lg:col-span-4 sketch-card bg-white flex flex-col h-full shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] p-5">
          <h2 className="text-[#2C2C2C] text-lg font-hand font-extrabold mb-4 flex items-center justify-between pb-2 border-b-2 border-dashed border-[#2C2C2C]/15">
            <span className="flex items-center gap-2">
              <BookOpen size={18} className="text-red-500" />
              <span>Study Notepad</span>
            </span>
            <button 
              onClick={handleLoadSeed}
              className="font-marker text-[10px] bg-red-50 hover:bg-red-100 text-red-700 border-2 border-[#2C2C2C] rounded px-2 py-0.5 shadow-[1px_1.5px_0_#2C2C2C]"
            >
              Load Demo Note
            </button>
          </h2>

          <form onSubmit={handleSummarize} className="flex-1 flex flex-col gap-4">
            <div className="flex-1 min-h-[300px] relative notebook-ruled p-3.5 border-2 border-[#2C2C2C] rounded-xl shadow-[2px_3px_0_#2C2C2C]">
              <div className="spiral-binder" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type or paste unstructured lecture notes, text guides, or code summaries here. The NLP model will analyze key sentences, generate flashcards, and compile structured study guidelines..."
                className="w-full h-full bg-transparent resize-none border-none focus:outline-none pl-6 text-xs font-sans font-semibold text-[#2C2C2C] leading-7"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !notes.trim()}
              className="btn-sketch w-full py-2.5 text-sm flex items-center justify-center gap-1.5 bg-red-50 border-red-500 text-red-800 hover:bg-red-100"
            >
              <Sparkles size={14} className="text-red-500 animate-spin" />
              <span>{loading ? "Splicing study notes..." : "Generate AI Study Sheets"}</span>
            </button>
          </form>
        </section>

        {/* PANEL B: STUDY SHEETS & TABS (Center - 5 Cols) */}
        <section className="lg:col-span-5 sketch-card bg-white flex flex-col h-full shadow-[5px_6px_0_#2C2C2C] border-3 border-[#2C2C2C] overflow-hidden">
          {/* TABS HEADER */}
          <div className="border-b-3 border-[#2C2C2C] bg-[#FAF6EE] flex">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex-1 py-3 px-2 font-marker font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 border-r-3 border-[#2C2C2C] hover:bg-[#FFF9C4]/20 transition-all ${activeTab === "summary" ? "bg-white border-b-4 border-b-red-500 text-[#2C2C2C]" : "text-gray-500"}`}
            >
              <FileText size={13} className={activeTab === "summary" ? "text-red-500" : ""} />
              <span>1. AI Summary</span>
            </button>
            <button
              onClick={() => setActiveTab("concepts")}
              className={`flex-1 py-3 px-2 font-marker font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 border-r-3 border-[#2C2C2C] hover:bg-[#FFF9C4]/20 transition-all ${activeTab === "concepts" ? "bg-white border-b-4 border-b-yellow-500 text-[#2C2C2C]" : "text-gray-500"}`}
            >
              <Brain size={13} className={activeTab === "concepts" ? "text-yellow-600" : ""} />
              <span>2. Core Concepts</span>
            </button>
            <button
              onClick={() => setActiveTab("flashcards")}
              className={`flex-1 py-3 px-2 font-marker font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 hover:bg-[#FFF9C4]/20 transition-all ${activeTab === "flashcards" ? "bg-white border-b-4 border-b-blue-500 text-[#2C2C2C]" : "text-gray-500"}`}
            >
              <HelpCircle size={13} className={activeTab === "flashcards" ? "text-blue-500" : ""} />
              <span>3. Flip Flashcards</span>
            </button>
          </div>

          <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col p-4">
            <div className="flex-grow overflow-y-auto max-h-[460px] space-y-4 pr-1">
              
              {/* Tab Content: SUMMARY */}
              {activeTab === "summary" && (
                !summary ? (
                  <div className="text-center text-xs text-gray-400 italic mt-24">Write notes on the left and submit to generate.</div>
                ) : (
                  <div className="border-2 border-[#2C2C2C] p-4 rounded-xl shadow-[2px_2.5px_0_#2C2C2C] bg-white text-xs font-sans leading-relaxed space-y-2">
                    {summary.split("\n").map((line, idx) => {
                      if (line.startsWith("##")) {
                        return <h3 key={idx} className="font-hand font-black text-sm text-red-800 mt-2 mb-1">{line.replace("##", "")}</h3>;
                      }
                      if (line.startsWith("###")) {
                        return <h4 key={idx} className="font-marker font-extrabold text-xs text-[#2C2C2C] mt-2 mb-1">{line.replace("###", "")}</h4>;
                      }
                      if (line.startsWith("*")) {
                        return <p key={idx} className="font-sans font-semibold text-[#5A5A5A] pl-2">{line}</p>;
                      }
                      return <p key={idx} className="font-sans font-semibold">{line}</p>;
                    })}
                  </div>
                )
              )}

              {/* Tab Content: CONCEPTS */}
              {activeTab === "concepts" && (
                !concepts ? (
                  <div className="text-center text-xs text-gray-400 italic mt-24">Write notes on the left and submit to generate.</div>
                ) : (
                  <div className="border-2 border-[#2C2C2C] p-4 rounded-xl shadow-[2px_2.5px_0_#2C2C2C] bg-[#FFF9C4]/20 text-xs font-sans leading-relaxed space-y-2">
                    <h3 className="font-hand font-black text-sm text-yellow-800 mb-2">Core Extract Concepts</h3>
                    {concepts.split("\n").map((line, idx) => (
                      <p key={idx} className="font-sans font-semibold">{line}</p>
                    ))}
                  </div>
                )
              )}

              {/* Tab Content: FLASHCARDS */}
              {activeTab === "flashcards" && (
                flashcards.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 italic mt-24">Write notes on the left and submit to generate.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <span className="text-[10px] font-marker text-gray-500 uppercase block mb-1 text-center">💡 Click cards below to reveal answer flips</span>
                    {flashcards.map((card, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleCardFlip(idx)}
                        className="sketch-card p-4 bg-white cursor-pointer relative min-h-[100px] flex flex-col justify-between"
                      >
                        {/* Binder hole element */}
                        <div className="absolute top-2 left-2 w-2 h-2 bg-[#FAF6EE] border border-[#2C2C2C] rounded-full" />
                        
                        <div>
                          <span className="font-marker text-[9px] text-[#0284C7] tracking-wider uppercase block border-b border-[#2C2C2C]/10 pb-1 mb-2">
                            Study Flashcard {idx + 1}
                          </span>
                          
                          {flippedCards[idx] ? (
                            <p className="font-sans font-bold text-xs text-emerald-700 animate-pulse">
                              A: {card.answer}
                            </p>
                          ) : (
                            <p className="font-sans font-bold text-xs text-slate-800">
                              Q: {card.question}
                            </p>
                          )}
                        </div>

                        <span className="text-[8px] font-mono text-gray-400 text-right mt-3 block select-none">
                          {flippedCards[idx] ? "Showing Answer (Click to Flip)" : "Showing Question (Click to Flip)"}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* PANEL C: STATS & TRANSACTION LOGS (Right - 3 Cols) */}
        <section className="lg:col-span-3 sketch-card bg-white flex flex-col h-full shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] p-5">
          <h2 className="text-[#2C2C2C] text-lg font-hand font-extrabold mb-1 flex items-center gap-2">
            <Brain size={18} className="text-red-500" />
            <span>Document Stats</span>
          </h2>
          <span className="block text-[9px] font-mono text-[#5A5A5A] mb-4">NLP TEXT STRUCTURE METRICS</span>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 gap-3.5 mb-5 flex-grow-0">
            <div className="bg-[#FFF9C4]/20 border-2 border-[#2C2C2C] p-3 rounded-xl shadow-[1.5px_2px_0_#2C2C2C] flex items-center justify-between">
              <div>
                <span className="block text-[9px] font-marker text-[#5A5A5A]">CHARACTER COUNT</span>
                <span className="text-xl font-hand font-black text-[#2C2C2C]">{charCount} Chars</span>
              </div>
              <FileText size={18} className="text-red-500" />
            </div>

            <div className="bg-[#E8F5E9]/40 border-2 border-[#2C2C2C] p-3 rounded-xl shadow-[1.5px_2px_0_#2C2C2C] flex items-center justify-between">
              <div>
                <span className="block text-[9px] font-marker text-[#5A5A5A]">WORD COUNT</span>
                <span className="text-xl font-hand font-black text-[#2C2C2C]">{wordCount} Words</span>
              </div>
              <Brain size={18} className="text-yellow-600" />
            </div>

            <div className="bg-[#E1F5FE]/40 border-2 border-[#2C2C2C] p-3 rounded-xl shadow-[1.5px_2px_0_#2C2C2C] flex items-center justify-between">
              <div>
                <span className="block text-[9px] font-marker text-[#5A5A5A]">PARAGRAPHS</span>
                <span className="text-xl font-hand font-black text-[#2C2C2C]">{paragraphCount} Lines</span>
              </div>
              <BookOpen size={18} className="text-blue-500" />
            </div>
          </div>

          {/* Actions & Console */}
          <div className="flex-1 flex flex-col justify-end min-h-[180px] border-t-2 border-dashed border-[#2C2C2C]/10 pt-4 space-y-3">
            <button
              onClick={handleExportCSV}
              disabled={!summary && flashcards.length === 0}
              className="btn-sketch w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <Download size={13} />
              <span>Export Guide to CSV</span>
            </button>

            <div className="flex-1 border-2 border-[#2C2C2C] bg-slate-900 text-[#10B981] font-mono text-[9px] p-2.5 rounded-xl flex flex-col min-h-[110px] max-h-[140px]">
              <span className="block text-[8px] text-[#94A3B8] font-bold border-b border-[#334155] mb-1 pb-0.5 select-none">Real-Time Console Monitor</span>
              <div className="flex-1 overflow-y-auto space-y-0.5 flex flex-col-reverse max-h-[100px]">
                {systemLogs.map((log, idx) => (
                  <p key={idx} className={log.level === "error" ? "text-red-400" : log.level === "warn" ? "text-yellow-400" : log.level === "success" ? "text-emerald-400" : "text-slate-300"}>
                    [{log.timestamp}] {log.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
