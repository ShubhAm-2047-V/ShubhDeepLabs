"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Brain, ArrowRight, Check, ShoppingCart, MessageCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "diploma", label: "Diploma", price: 2499 },
  { id: "engineering", label: "Engineering (B.Tech)", price: 4999 },
  { id: "mtech", label: "M.Tech / Research", price: 8999 },
  { id: "bca-mca", label: "BCA/MCA", price: 3999 },
  { id: "ai-ml", label: "AI/ML Specialized", price: 6999 },
  { id: "android", label: "Android App", price: 5499 }
];

const TECH_STACKS = [
  { id: "html", label: "HTML/CSS/JS", price: 0 },
  { id: "react", label: "React.js", price: 1499 },
  { id: "nextjs", label: "Next.js", price: 1999 },
  { id: "mern", label: "MERN Stack", price: 2999 },
  { id: "python-flask", label: "Python + Flask", price: 999 },
  { id: "firebase", label: "Firebase", price: 999 },
  { id: "db", label: "Database (SQL/Mongo)", price: 799 },
  { id: "ai-integration", label: "AI Integration (Gemini)", price: 2499 },
  { id: "ml-model", label: "Machine Learning Model", price: 3499 },
  { id: "opencv", label: "OpenCV / Face Detection", price: 2999 }
];

const ADDONS = [
  { id: "ppt", label: "PPT Presentation", price: 499 },
  { id: "report", label: "Thesis Report", price: 999 },
  { id: "viva", label: "Viva Guidance Sheet", price: 399 },
  { id: "deployment", label: "Cloud Deployment", price: 1499 },
  { id: "docs", label: "Code Walkthrough Doc", price: 599 }
];

const DEADLINES = [
  { id: "urgent", label: "1–3 Days (Urgent)", price: 2499 },
  { id: "normal", label: "4–7 Days (Standard)", price: 999 },
  { id: "relaxed", label: "8–14 Days (Relaxed)", price: 0 }
];

const IDEAS_BY_CATEGORY = {
  "diploma": ["Expense Tracker", "AI Color Palette Generator", "Portfolio Builder"],
  "engineering": ["AI Resume Analyzer", "Smart Notes Summarizer", "RFID Attendance Portal"],
  "mtech": ["AI Plant Disease Detector", "Face Recognition Attendance System", "Blockchain Voting System"],
  "bca-mca": ["Hospital Management System", "Mock Interview AI", "AI Background Remover"],
  "ai-ml": ["AI Customer Support Chatbot", "AI Plant Disease Detector", "Smart Notes Summarizer"],
  "android": ["RFID Attendance Portal", "Hospital Management System", "Expense Tracker"]
};

export default function SupportChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("guided"); // "guided" or "chat"
  
  // Guided state steps
  const [step, setStep] = useState(1); // 1 to 7
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [customTitle, setCustomTitle] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);

  // Chat state
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([
    { 
      id: "support-msg-1", 
      sender: "bot", 
      text: "👋 Welcome to Shubh Deep Labs. Ask me anything about our academic projects, tech stacks, pricing, or timelines!" 
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Load or create sessionId
  useEffect(() => {
    if (typeof window !== "undefined") {
      let localId = localStorage.getItem("shubhdeeplabs_chat_session_id");
      if (!localId) {
        localId = `web-sess-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem("shubhdeeplabs_chat_session_id", localId);
      }
      setSessionId(localId);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, messages, step]);

  // Pricing math calculator
  const calculateTotal = () => {
    let total = 0;
    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    if (cat) total += cat.price;

    selectedTech.forEach(tId => {
      const t = TECH_STACKS.find(tech => tech.id === tId);
      if (t) total += t.price;
    });

    const dl = DEADLINES.find(d => d.id === selectedDeadline);
    if (dl) total += dl.price;

    selectedAddons.forEach(aId => {
      const a = ADDONS.find(add => add.id === aId);
      if (a) total += a.price;
    });

    return total;
  };

  const getSummaryObject = () => {
    const catLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label || "Custom";
    const stackLabel = selectedTech.map(tId => TECH_STACKS.find(t => t.id === tId)?.label).filter(Boolean).join(" + ") || "HTML/CSS/JS";
    const addonsList = selectedAddons.map(aId => ADDONS.find(a => a.id === aId)?.label).filter(Boolean);
    const deadlineLabel = DEADLINES.find(d => d.id === selectedDeadline)?.label || "8-14 Days";

    return {
      project: customTitle || "Custom Academic Project",
      category: catLabel,
      stack: stackLabel,
      addons: addonsList,
      deadline: deadlineLabel,
      estimatedPrice: calculateTotal()
    };
  };

  // WhatsApp Redirect link generator
  const handleWhatsAppRedirect = async () => {
    const summary = getSummaryObject();

    // Format prefilled WhatsApp message
    const message = `Hi 👋

I want to place this project inquiry:

Project:
${summary.project}

Category:
${summary.category}

Selected Stack:
${summary.stack}

Add-ons:
${summary.addons.length > 0 ? summary.addons.join(" + ") : "None"}

Deadline:
${summary.deadline}

Estimated Price:
₹${summary.estimatedPrice.toLocaleString()}`;

    // 1. Save lead to database
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Website Visitor",
          whatsapp: "Pending Direct Message",
          email: "",
          name: "Website Visitor",
          phone: "WhatsApp Redirect",
          project: summary.project,
          category: summary.category,
          stack: summary.stack,
          addons: summary.addons.join(", ") || "None",
          deadline: summary.deadline,
          budget: summary.estimatedPrice.toString(),
          timestamp: new Date().toISOString(),
          techRequired: summary.stack,
          features: `Addons: ${summary.addons.join(", ") || "none"}. Project Title: ${summary.project}.`
        })
      });
      setLeadSaved(true);
    } catch (e) {
      console.error("Failed to store lead automatically:", e);
    }

    // 2. Open WhatsApp link (redirects to coordination phone)
    const waUrl = `https://wa.me/919028833275?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  // Chat queries handler
  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || inputVal;
    if (!queryText.trim()) return;

    if (!textToSend) setInputVal("");

    const userMsg = { id: `usr-${Date.now()}`, sender: "user", text: queryText };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          sessionId: sessionId,
          contactName: "Website Visitor"
        })
      });
      const data = await res.json();
      
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply || "Failed to get reply."
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: "I'm designed specifically for project recommendations, pricing, and development services. Please let me know how I can help with your academic project!"
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleTech = (techId) => {
    setSelectedTech(prev => 
      prev.includes(techId) ? prev.filter(id => id !== techId) : [...prev, techId]
    );
  };

  const handleToggleAddon = (addonId) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const resetGuidedFlow = () => {
    setStep(1);
    setSelectedCategory(null);
    setSelectedTech([]);
    setSelectedDeadline(null);
    setSelectedAddons([]);
    setCustomTitle("");
    setLeadSaved(false);
  };

  return (
    <div className="font-sans antialiased">
      {/* Glow Pulse Trigger Button */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer relative"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="fixed bottom-24 right-6 w-full max-w-[420px] h-[640px] max-h-[80vh] z-[100] rounded-3xl border-2 border-transparent bg-slate-950/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
            style={{
              borderImage: "linear-gradient(to bottom, #06b6d4, #8b5cf6, #ec4899) 1"
            }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-950 to-slate-900/90 border-b border-white/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Brain size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide leading-none">Shubh Deep Labs AI</h3>
                  <span className="text-[10px] text-cyan-400 font-medium">Automatic Sales Consultant</span>
                </div>
              </div>
              
              {/* Tab Selector */}
              <div className="flex bg-slate-900 border border-white/5 rounded-lg p-0.5">
                <button
                  onClick={() => setMode("guided")}
                  className={`text-[10px] px-2.5 py-1 rounded-md font-semibold transition-all ${
                    mode === "guided" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Guided
                </button>
                <button
                  onClick={() => setMode("chat")}
                  className={`text-[10px] px-2.5 py-1 rounded-md font-semibold transition-all ${
                    mode === "chat" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Ask AI
                </button>
              </div>
            </div>

            {/* Guided Mode content */}
            {mode === "guided" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-between">
                
                {/* Step contents */}
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                          <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                            Hi 👋 Welcome to Shubh Deep Labs. <br />
                            Need help selecting your project, calculating prices, or placing custom requests?
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 pt-2">
                          <button
                            onClick={() => setStep(2)}
                            className="w-full p-3.5 text-left rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-white/10 hover:border-cyan-500 text-slate-200 text-xs font-bold transition-all flex justify-between items-center group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                          >
                            <span>🚀 Calculate Project Cost</span>
                            <ArrowRight size={14} className="text-slate-500 group-hover:text-cyan-400 transition-all" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedCategory("ai-ml");
                              setStep(3);
                            }}
                            className="w-full p-3.5 text-left rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-white/10 hover:border-purple-500 text-slate-200 text-xs font-bold transition-all flex justify-between items-center group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                          >
                            <span>🤖 Recommend AI/ML Projects</span>
                            <ArrowRight size={14} className="text-slate-500 group-hover:text-purple-400 transition-all" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedDeadline("urgent");
                              setStep(2);
                            }}
                            className="w-full p-3.5 text-left rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-white/10 hover:border-pink-500 text-slate-200 text-xs font-bold transition-all flex justify-between items-center group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                          >
                            <span>⚡ Urgent Delivery (1-3 Days)</span>
                            <ArrowRight size={14} className="text-slate-500 group-hover:text-pink-400 transition-all" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-3"
                      >
                        <h4 className="text-xs font-extrabold uppercase text-cyan-400 tracking-wider">Step 1 of 6: Select Course Level</h4>
                        <p className="text-xs text-slate-400 leading-normal">What is the level or category of the required project?</p>
                        
                        <div className="grid grid-cols-2 gap-2.5">
                          {CATEGORIES.map(cat => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setSelectedCategory(cat.id);
                                setStep(3);
                              }}
                              className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                                selectedCategory === cat.id 
                                  ? "bg-gradient-to-tr from-cyan-900/50 to-blue-900/50 border-cyan-500 text-white" 
                                  : "bg-slate-900/50 border-white/5 hover:border-white/20 text-slate-300"
                              }`}
                            >
                              <div className="text-xs font-bold truncate">{cat.label}</div>
                              <div className="text-[10px] text-cyan-400 font-extrabold mt-1">₹{cat.price.toLocaleString()}</div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-3"
                      >
                        <h4 className="text-xs font-extrabold uppercase text-cyan-400 tracking-wider">Step 2 of 6: Choose Technologies</h4>
                        <p className="text-xs text-slate-400 leading-normal">Select the modules/stack requirements (choose multiple):</p>

                        <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                          {TECH_STACKS.map(tech => {
                            const selected = selectedTech.includes(tech.id);
                            return (
                              <button
                                key={tech.id}
                                onClick={() => handleToggleTech(tech.id)}
                                className={`p-2.5 text-left rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                                  selected 
                                    ? "bg-gradient-to-tr from-cyan-900/30 to-blue-900/30 border-cyan-500 text-white" 
                                    : "bg-slate-900/50 border-white/5 hover:border-white/10 text-slate-400"
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="text-[11px] font-bold truncate leading-none">{tech.label}</div>
                                  <div className="text-[9px] text-cyan-400 mt-1 font-bold leading-none">
                                    {tech.price === 0 ? "Free" : `+ ₹${tech.price}`}
                                  </div>
                                </div>
                                {selected && <Check size={12} className="text-cyan-400 shrink-0 ml-1" />}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setStep(4)}
                          className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 transition-all mt-4 cursor-pointer"
                        >
                          Next: Delivery Timeline
                        </button>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-3"
                      >
                        <h4 className="text-xs font-extrabold uppercase text-cyan-400 tracking-wider">Step 3 of 6: Choose Deadline</h4>
                        <p className="text-xs text-slate-400 leading-normal">What is your project submission schedule deadline?</p>

                        <div className="grid grid-cols-1 gap-2.5">
                          {DEADLINES.map(dl => (
                            <button
                              key={dl.id}
                              onClick={() => {
                                setSelectedDeadline(dl.id);
                                setStep(5);
                              }}
                              className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                                selectedDeadline === dl.id 
                                  ? "bg-gradient-to-tr from-cyan-900/40 to-blue-900/40 border-cyan-500 text-white" 
                                  : "bg-slate-900/50 border-white/5 hover:border-white/15 text-slate-350"
                              }`}
                            >
                              <div>
                                <div className="text-xs font-bold">{dl.label}</div>
                                <div className="text-[10px] text-slate-400 mt-1 font-medium">Standard academic timeline</div>
                              </div>
                              <span className="text-xs text-cyan-400 font-extrabold">
                                {dl.price === 0 ? "No charge" : `+ ₹${dl.price}`}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {step === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-3"
                      >
                        <h4 className="text-xs font-extrabold uppercase text-cyan-400 tracking-wider">Step 4 of 6: Optional Add-ons</h4>
                        <p className="text-xs text-slate-400 leading-normal">Do you require document reports or prepare assistance (choose multiple):</p>

                        <div className="grid grid-cols-1 gap-2 max-h-[260px] overflow-y-auto pr-1">
                          {ADDONS.map(addon => {
                            const selected = selectedAddons.includes(addon.id);
                            return (
                              <button
                                key={addon.id}
                                onClick={() => handleToggleAddon(addon.id)}
                                className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                                  selected 
                                    ? "bg-gradient-to-tr from-cyan-900/30 to-blue-900/30 border-cyan-500 text-white" 
                                    : "bg-slate-900/50 border-white/5 hover:border-white/10 text-slate-400"
                                }`}
                              >
                                <div>
                                  <div className="text-xs font-bold leading-none">{addon.label}</div>
                                  <div className="text-[10px] text-slate-500 mt-1.5 leading-none">Comprehensive files ready</div>
                                </div>
                                <span className="text-xs text-cyan-400 font-bold shrink-0 ml-2">
                                  + ₹{addon.price}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setStep(6)}
                          className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 transition-all mt-4 cursor-pointer"
                        >
                          Next: Choose Topic Ideas
                        </button>
                      </motion.div>
                    )}

                    {step === 6 && (
                      <motion.div
                        key="step6"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-3"
                      >
                        <h4 className="text-xs font-extrabold uppercase text-cyan-400 tracking-wider">Step 5 of 6: Project Title/Topic</h4>
                        <p className="text-xs text-slate-400 leading-normal">Choose one of our recommended topics or type your own concept:</p>

                        <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                          {(IDEAS_BY_CATEGORY[selectedCategory] || []).map(idea => (
                            <button
                              key={idea}
                              onClick={() => setCustomTitle(idea)}
                              className={`w-full p-2.5 text-left rounded-xl border text-xs transition-all truncate cursor-pointer ${
                                customTitle === idea 
                                  ? "bg-gradient-to-tr from-cyan-950/40 to-blue-950/40 border-cyan-500 text-white font-bold" 
                                  : "bg-slate-900/50 border-white/5 hover:border-white/10 text-slate-350"
                              }`}
                            >
                              💡 {idea}
                            </button>
                          ))}
                        </div>

                        <div className="pt-2">
                          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Custom Title Details</label>
                          <input
                            type="text"
                            placeholder="Type custom project idea title here..."
                            className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                          />
                        </div>

                        <button
                          onClick={() => setStep(7)}
                          className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 transition-all mt-4 cursor-pointer"
                        >
                          Generate Quote Summary
                        </button>
                      </motion.div>
                    )}

                    {step === 7 && (
                      <motion.div
                        key="step7"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-4"
                      >
                        <h4 className="text-xs font-extrabold uppercase text-cyan-400 tracking-wider">Step 6 of 6: Project Inquiry Summary</h4>

                        {/* Glassmorphic Summary Card */}
                        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl space-y-3 shadow-inner overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />
                          
                          <div className="border-b border-white/5 pb-2.5 flex justify-between items-start">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Project Concept</span>
                              <h5 className="text-xs font-bold text-slate-100 leading-snug mt-0.5">{getSummaryObject().project}</h5>
                            </div>
                            <span className="text-[10px] font-bold bg-cyan-950/40 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-800/40">
                              {getSummaryObject().category}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-350">
                            <div>
                              <span className="text-[8px] text-slate-500 uppercase font-bold block">Selected Tech Stack</span>
                              <span className="font-semibold text-slate-200 mt-0.5 block truncate" title={getSummaryObject().stack}>
                                {getSummaryObject().stack}
                              </span>
                            </div>
                            <div>
                              <span className="text-[8px] text-slate-500 uppercase font-bold block">Add-ons Selected</span>
                              <span className="font-semibold text-slate-200 mt-0.5 block truncate" title={getSummaryObject().addons.join(" + ") || "None"}>
                                {getSummaryObject().addons.join(" + ") || "None"}
                              </span>
                            </div>
                            <div className="col-span-2 pt-1 border-t border-white/5 flex justify-between items-center">
                              <div>
                                <span className="text-[8px] text-slate-500 uppercase font-bold">Delivery Deadline</span>
                                <span className="font-bold text-slate-200 block">{getSummaryObject().deadline}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] text-slate-500 uppercase font-bold block">Estimated Price</span>
                                <span className="text-sm font-black text-cyan-400">₹{getSummaryObject().estimatedPrice.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Continue on WhatsApp Callout Button */}
                        <div className="space-y-2">
                          <button
                            onClick={handleWhatsAppRedirect}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-xl font-extrabold text-xs shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.5)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/20"
                          >
                            <MessageCircle size={15} />
                            Continue on WhatsApp
                          </button>
                          
                          <p className="text-[9px] text-slate-500 font-sans text-center leading-normal">
                            * Clicking redirects you to official WhatsApp to review files and close deal with human developer. Leads saved in secure office storage.
                          </p>

                          <button
                            onClick={resetGuidedFlow}
                            className="w-full text-center text-[10px] font-bold text-cyan-400 hover:underline pt-1.5 cursor-pointer block"
                          >
                            ← Restart Dynamic Calculator
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Progress Indicators */}
                {step > 1 && (
                  <div className="shrink-0 pt-3 border-t border-white/5 flex justify-between items-center">
                    <button
                      onClick={() => setStep(prev => Math.max(1, prev - 1))}
                      className="text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer select-none"
                    >
                      ← Back
                    </button>
                    <div className="flex gap-1">
                      {[2, 3, 4, 5, 6, 7].map(sIdx => (
                        <div
                          key={sIdx}
                          className={`w-4 h-1.5 rounded-full transition-all ${
                            step === sIdx ? "bg-cyan-500 w-6" : step > sIdx ? "bg-cyan-900" : "bg-slate-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Ask AI Mode */}
            {mode === "chat" && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                {/* Chat window viewport */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-xl p-3 text-xs border ${
                        msg.sender === "user" 
                          ? "bg-gradient-to-tr from-cyan-950/40 to-blue-950/40 border-cyan-500/30 text-slate-100 rounded-tr-none" 
                          : "bg-slate-900/80 border-white/5 text-slate-300 rounded-tl-none"
                      }`}>
                        <p className="font-sans font-semibold leading-relaxed text-xs sm:text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-900/50 border border-white/5 rounded-xl rounded-tl-none p-2.5">
                        <div className="flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Question input */}
                <div className="p-3 border-t border-white/10 bg-slate-950 flex flex-col gap-2 shrink-0">
                  {/* Suggestions */}
                  <div className="flex flex-wrap gap-1 max-h-[50px] overflow-y-auto pr-1">
                    {[
                      "Will source code be provided?",
                      "Will the project run on my laptop?",
                      "Can the project be customized?",
                      "Is deployment included?"
                    ].map(faq => (
                      <button
                        key={faq}
                        onClick={() => handleSendMessage(faq)}
                        className="text-[9px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 hover:border-white/15 px-2 py-0.5 rounded-full font-bold truncate max-w-[170px]"
                      >
                        {faq}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1.5 pt-1.5">
                    <input
                      type="text"
                      placeholder="Ask project helper..."
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans font-semibold placeholder:text-slate-600"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={isTyping}
                    />
                    <button 
                      onClick={() => handleSendMessage()}
                      disabled={isTyping || !inputVal.trim()}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-2.5 rounded-xl flex items-center justify-center cursor-pointer shadow-md"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
