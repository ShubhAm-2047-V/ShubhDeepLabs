"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Brain, ArrowRight, Check, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { dbService } from "@/lib/db";

const CATEGORIES = [
  { id: "diploma", label: "Diploma", price: 0 },
  { id: "engineering", label: "Engineering (B.Tech)", price: 3999 },
  { id: "mtech", label: "M.Tech / Research", price: 7499 },
  { id: "bca-mca", label: "BCA/MCA", price: 2999 },
  { id: "ai-ml", label: "AI/ML Specialized", price: 5999 },
  { id: "android", label: "Android App", price: 4999 }
];

const TECH_STACKS = [
  { id: "html", label: "HTML/CSS/JS", price: 0 },
  { id: "react", label: "React.js", price: 2499 },
  { id: "nextjs", label: "Next.js", price: 2999 },
  { id: "mern", label: "MERN Stack", price: 4499 },
  { id: "python-flask", label: "Python + Flask", price: 1999 },
  { id: "firebase", label: "Firebase", price: 1499 },
  { id: "db", label: "Database (SQL/Mongo)", price: 1499 },
  { id: "ai-integration", label: "AI Integration (Gemini)", price: 1999 },
  { id: "ml-model", label: "Machine Learning Model", price: 6999 },
  { id: "opencv", label: "OpenCV / Face Detection", price: 2999 }
];

const ADDONS = [
  { id: "ppt", label: "PPT Presentation", price: 699 },
  { id: "report", label: "Thesis Report", price: 1299 },
  { id: "viva", label: "Viva Guidance Sheet", price: 499 },
  { id: "deployment", label: "Cloud Deployment", price: 1499 },
  { id: "docs", label: "Code Walkthrough Doc", price: 599 },
  { id: "success", label: "Project Success Pack", price: 1999 }
];

const DEADLINES = [
  { id: "urgent", label: "1–3 Days (Urgent)", price: 1999 },
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
  const [dbPrices, setDbPrices] = useState({});

  // Fetch prices dynamically on open / mount
  useEffect(() => {
    async function loadPrices() {
      try {
        const prices = await dbService.getCustomizerPrices();
        if (prices && Object.keys(prices).length > 0) {
          setDbPrices(prices);
        }
      } catch (e) {
        console.error("Failed to load dynamic prices in chatbot:", e);
      }
    }
    loadPrices();
  }, [isOpen]);

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
  const [showNudge, setShowNudge] = useState(false);
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__chatbotOpen = isOpen;
      const ev = new CustomEvent("chatbot-state", { detail: { open: isOpen } });
      window.dispatchEvent(ev);
    }
  }, [isOpen]);

  useEffect(() => {
    // Show a floating nudge bubble after 8 seconds
    const t = setTimeout(() => {
      if (!isOpen) setShowNudge(true);
    }, 8500);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Pricing math calculator
  const calculateTotal = () => {
    let total = 0;
    const isDiploma = selectedCategory === "diploma";

    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    if (cat) {
      const price = dbPrices[cat.id] !== undefined ? dbPrices[cat.id] : cat.price;
      total += price;
    }

    selectedTech.forEach(tId => {
      const tech = TECH_STACKS.find(t => t.id === tId);
      if (tech) {
        const basePrice = dbPrices[tech.id] !== undefined ? dbPrices[tech.id] : tech.price;
        const price = isDiploma ? Math.floor(basePrice / 2) : basePrice;
        total += price;
      }
    });

    const dl = DEADLINES.find(d => d.id === selectedDeadline);
    if (dl) {
      const basePrice = dbPrices[dl.id] !== undefined ? dbPrices[dl.id] : dl.price;
      const price = isDiploma ? Math.floor(basePrice / 2) : basePrice;
      total += price;
    }

    selectedAddons.forEach(aId => {
      const addon = ADDONS.find(a => a.id === aId);
      if (addon) {
        const basePrice = dbPrices[addon.id] !== undefined ? dbPrices[addon.id] : addon.price;
        const price = isDiploma ? Math.floor(basePrice / 2) : basePrice;
        total += price;
      }
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

      // If selections are returned, automatically open the customizer side-by-side with these preselected choices!
      if (data.selections) {
        const ev = new CustomEvent("open-customizer", { 
          detail: { 
            category: data.selections.category,
            tech: data.selections.tech || [],
            addons: data.selections.addons || [],
            timeline: data.selections.timeline || null,
            showSummary: true 
          } 
        });
        window.dispatchEvent(ev);
      }
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
    <div className="font-marker select-none">
      
      {/* ── CENTERED DIALOG MODAL (Whiteboard theme!) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="support-chatbot-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-[460px] h-[580px] max-h-[85vh] bg-white border-3 border-[#2C2C2C] rounded-2xl shadow-[6px_8px_0_#2C2C2C] overflow-hidden flex flex-col relative pointer-events-auto"
            >
              {/* Whiteboard Header */}
              <div className="bg-[#FFF59D] border-b-3 border-[#2C2C2C] p-3.5 flex justify-between items-center relative shrink-0">
                {/* Notebook binding styling */}
                <div className="absolute top-1 left-4 hidden sm:flex gap-1.5 pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FAF6EE] border border-[#2C2C2C]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FAF6EE] border border-[#2C2C2C]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FAF6EE] border border-[#2C2C2C]" />
                </div>

                <div className="flex items-center gap-2.5 pl-3 sm:pl-14">
                  <div className="w-7 h-7 rounded-lg border-1.5 border-[#2C2C2C] overflow-hidden flex items-center justify-center shadow-[1px_1.5px_0_#2C2C2C] bg-white">
                    <img src="/logo.jpg" alt="Shubdeep Labs Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs font-marker font-extrabold text-[#2C2C2C] leading-none">Support Desk AI</h3>
                    <span className="text-[8px] font-sans font-bold text-[#6A6A6A] leading-none">Online &amp; Active</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg border border-[#2C2C2C]/20 hover:border-[#2C2C2C] hover:bg-white/80 transition-all text-[#2C2C2C] cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Mode Tab Bar — clearly visible below header */}
              <div className="flex border-b-3 border-[#2C2C2C] shrink-0">
                <button
                  onClick={() => setMode("guided")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-extrabold transition-all cursor-pointer border-r-2 border-[#2C2C2C] ${
                    mode === "guided"
                      ? "bg-[#2C2C2C] text-[#FFF59D]"
                      : "bg-white text-[#6A6A6A] hover:bg-[#FFF9C4] hover:text-[#2C2C2C]"
                  }`}
                >
                  <span className="text-sm">🧭</span>
                  Guided
                  {mode === "guided" && (
                    <span className="text-[8px] bg-[#FFF59D] text-[#2C2C2C] px-1.5 py-0.5 rounded-full font-black leading-none">ACTIVE</span>
                  )}
                </button>
                <button
                  onClick={() => setMode("chat")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
                    mode === "chat"
                      ? "bg-[#FFF59D] text-[#2C2C2C]"
                      : "bg-white text-[#6A6A6A] hover:bg-[#FFF9C4] hover:text-[#2C2C2C]"
                  }`}
                >
                  <span className="text-sm">🤖</span>
                  Ask AI
                  {mode === "chat" && (
                    <span className="text-[8px] bg-[#2C2C2C] text-[#FFF59D] px-1.5 py-0.5 rounded-full font-black leading-none">ACTIVE</span>
                  )}
                </button>
              </div>

              {/* RAG Rule Sheet messages / calculator */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white notebook-ruled flex flex-col justify-between">
                
                {/* Guided State Machine */}
                {mode === "guided" && (
                  <div className="flex-1 flex flex-col justify-between h-full">
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
                            <div className="p-4 rounded-xl bg-white border-2 border-[#2C2C2C] shadow-[2px_3px_0_#2C2C2C]">
                              <p className="text-xs sm:text-sm text-[#2C2C2C] leading-relaxed font-bold">
                                Hi 👋 Welcome to Shubh Deep Labs. <br />
                                Need help selecting your project, calculating pricing, or placing custom orders?
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5 pt-2">
                              <button
                                onClick={() => setStep(2)}
                                className="w-full p-3.5 text-left rounded-xl bg-white border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] text-[#2C2C2C] text-xs font-bold transition-all flex justify-between items-center group cursor-pointer shadow-[2px_2.5px_0_#2C2C2C]"
                              >
                                <span>🚀 Select Project Category</span>
                                <ArrowRight size={14} className="text-[#2C2C2C]" />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedCategory("ai-ml");
                                  setStep(3);
                                }}
                                className="w-full p-3.5 text-left rounded-xl bg-white border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] text-[#2C2C2C] text-xs font-bold transition-all flex justify-between items-center group cursor-pointer shadow-[2px_2.5px_0_#2C2C2C]"
                              >
                                <span>💡 Recommend AI/ML Projects</span>
                                <ArrowRight size={14} className="text-[#2C2C2C]" />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedDeadline("urgent");
                                  setStep(2);
                                }}
                                className="w-full p-3.5 text-left rounded-xl bg-white border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] text-[#2C2C2C] text-xs font-bold transition-all flex justify-between items-center group cursor-pointer shadow-[2px_2.5px_0_#2C2C2C]"
                              >
                                <span>⚡ Urgent 1-3 Day Delivery</span>
                                <ArrowRight size={14} className="text-[#2C2C2C]" />
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
                            <h4 className="text-[11px] font-extrabold uppercase text-[#6A6A6A] tracking-wider">Step 1 of 6: Course Level Selection</h4>
                            <p className="text-xs text-[#2C2C2C] font-semibold">Choose the category of project required:</p>
                            
                            <div className="grid grid-cols-2 gap-2.5">
                              {CATEGORIES.map(cat => {
                                const price = dbPrices[cat.id] !== undefined ? dbPrices[cat.id] : cat.price;
                                return (
                                  <button
                                    key={cat.id}
                                    onClick={() => {
                                      setSelectedCategory(cat.id);
                                      setStep(3);
                                    }}
                                    className={`p-3 text-left rounded-xl border-2 transition-all cursor-pointer shadow-[2px_2.5px_0_#2C2C2C] ${
                                      selectedCategory === cat.id 
                                        ? "bg-[#FFF9C4] border-[#2C2C2C] font-bold text-[#2C2C2C]" 
                                        : "bg-white border-[#2C2C2C]/25 hover:border-[#2C2C2C] text-[#6A6A6A]"
                                    }`}
                                  >
                                    <div className="text-xs font-bold truncate">{cat.label}</div>
                                    <div className="text-[10px] text-[#2C2C2C] font-extrabold mt-1">₹{price.toLocaleString()}</div>
                                  </button>
                                );
                              })}
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
                            <h4 className="text-[11px] font-extrabold uppercase text-[#6A6A6A] tracking-wider">Step 2 of 6: Stack & Technologies</h4>
                            <p className="text-xs text-[#2C2C2C] font-semibold">Select stack modules (choose multiple):</p>

                            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                              {TECH_STACKS.map(tech => {
                                const selected = selectedTech.includes(tech.id);
                                const basePrice = dbPrices[tech.id] !== undefined ? dbPrices[tech.id] : tech.price;
                                const isDiploma = selectedCategory === "diploma";
                                const price = isDiploma ? Math.floor(basePrice / 2) : basePrice;
                                return (
                                  <button
                                    key={tech.id}
                                    onClick={() => handleToggleTech(tech.id)}
                                    className={`p-2.5 text-left rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer shadow-[1.5px_2px_0_#2C2C2C] ${
                                      selected 
                                        ? "bg-[#FFF9C4] border-[#2C2C2C] font-bold text-[#2C2C2C]" 
                                        : "bg-white border-[#2C2C2C]/25 hover:border-[#2C2C2C] text-[#6A6A6A]"
                                    }`}
                                  >
                                    <div className="min-w-0">
                                      <div className="text-[10px] font-bold truncate leading-none">{tech.label}</div>
                                      <div className="text-[9px] text-[#2C2C2C] mt-1 font-bold leading-none">
                                        {price === 0 ? "Free" : `+ ₹${price}`}
                                      </div>
                                    </div>
                                    {selected && <Check size={12} className="text-[#2C2C2C] shrink-0 ml-1" />}
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              onClick={() => setStep(4)}
                              className="w-full py-2.5 bg-[#FFF59D] hover:bg-white text-[#2C2C2C] border-2 border-[#2C2C2C] rounded-xl font-bold text-xs shadow-[2px_3px_0_#2C2C2C] active:translate-y-0.5 transition-all mt-4 cursor-pointer"
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
                            <h4 className="text-[11px] font-extrabold uppercase text-[#6A6A6A] tracking-wider">Step 3 of 6: Target Timeline</h4>
                            <p className="text-xs text-[#2C2C2C] font-semibold">Select your required delivery deadline:</p>

                            <div className="grid grid-cols-1 gap-2.5">
                              {DEADLINES.map(dl => {
                                const basePrice = dbPrices[dl.id] !== undefined ? dbPrices[dl.id] : dl.price;
                                const isDiploma = selectedCategory === "diploma";
                                const price = isDiploma ? Math.floor(basePrice / 2) : basePrice;
                                return (
                                  <button
                                    key={dl.id}
                                    onClick={() => {
                                      setSelectedDeadline(dl.id);
                                      setStep(5);
                                    }}
                                    className={`p-3 text-left rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer shadow-[2px_2.5px_0_#2C2C2C] ${
                                      selectedDeadline === dl.id 
                                        ? "bg-[#FFF9C4] border-[#2C2C2C] font-bold text-[#2C2C2C]" 
                                        : "bg-white border-[#2C2C2C]/25 hover:border-[#2C2C2C] text-[#6A6A6A]"
                                    }`}
                                  >
                                    <div>
                                      <div className="text-xs font-bold">{dl.label}</div>
                                      <div className="text-[10px] text-slate-500 mt-1 font-sans font-semibold">Standard setup review</div>
                                    </div>
                                    <span className="text-xs font-extrabold text-[#2C2C2C]">
                                      {price === 0 ? "No charges" : `+ ₹${price}`}
                                    </span>
                                  </button>
                                );
                              })}
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
                            <h4 className="text-[11px] font-extrabold uppercase text-[#6A6A6A] tracking-wider">Step 4 of 6: Documentation Add-ons</h4>
                            <p className="text-xs text-[#2C2C2C] font-semibold">Choose additional deliverables (choose multiple):</p>

                            <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                              {ADDONS.map(addon => {
                                const selected = selectedAddons.includes(addon.id);
                                const basePrice = dbPrices[addon.id] !== undefined ? dbPrices[addon.id] : addon.price;
                                const isDiploma = selectedCategory === "diploma";
                                const price = isDiploma ? Math.floor(basePrice / 2) : basePrice;
                                return (
                                  <button
                                    key={addon.id}
                                    onClick={() => handleToggleAddon(addon.id)}
                                    className={`p-3 text-left rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer shadow-[2px_2.5px_0_#2C2C2C] ${
                                      selected 
                                        ? "bg-[#FFF9C4] border-[#2C2C2C] font-bold text-[#2C2C2C]" 
                                        : "bg-white border-[#2C2C2C]/25 hover:border-[#2C2C2C] text-[#6A6A6A]"
                                    }`}
                                  >
                                    <div>
                                      <div className="text-xs font-bold leading-none">{addon.label}</div>
                                      <div className="text-[9px] text-[#6A6A6A] mt-1.5 leading-none">Complete documentation ready</div>
                                    </div>
                                    <span className="text-xs font-extrabold text-[#2C2C2C] shrink-0 ml-2">
                                      + ₹{price}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              onClick={() => setStep(6)}
                              className="w-full py-2.5 bg-[#FFF59D] hover:bg-white text-[#2C2C2C] border-2 border-[#2C2C2C] rounded-xl font-bold text-xs shadow-[2px_3px_0_#2C2C2C] active:translate-y-0.5 transition-all mt-4 cursor-pointer"
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
                            <h4 className="text-[11px] font-extrabold uppercase text-[#6A6A6A] tracking-wider">Step 5 of 6: Topic recommendations</h4>
                            <p className="text-xs text-[#2C2C2C] font-semibold">Choose a sample title or type custom requirements:</p>

                            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                              {(IDEAS_BY_CATEGORY[selectedCategory] || []).map(idea => (
                                <button
                                  key={idea}
                                  onClick={() => setCustomTitle(idea)}
                                  className={`w-full p-2.5 text-left rounded-xl border-2 text-xs transition-all truncate cursor-pointer shadow-[1.5px_2px_0_#2C2C2C] ${
                                    customTitle === idea 
                                      ? "bg-[#FFF9C4] border-[#2C2C2C] font-bold text-[#2C2C2C]" 
                                      : "bg-white border-[#2C2C2C]/25 hover:border-[#2C2C2C] text-[#6A6A6A]"
                                  }`}
                                >
                                  💡 {idea}
                                </button>
                              ))}
                            </div>

                            <div className="pt-2">
                              <label className="block text-[9px] text-[#6A6A6A] font-extrabold uppercase mb-1">Custom specifications</label>
                              <input
                                type="text"
                                placeholder="Type customized project concept title..."
                                className="w-full p-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl text-xs text-[#2C2C2C] focus:outline-none focus:bg-[#FFF9C4]/5"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                              />
                            </div>

                            <button
                              onClick={() => setStep(7)}
                              className="w-full py-2.5 bg-[#FFF59D] hover:bg-white text-[#2C2C2C] border-2 border-[#2C2C2C] rounded-xl font-bold text-xs shadow-[2px_3px_0_#2C2C2C] active:translate-y-0.5 transition-all mt-4 cursor-pointer"
                            >
                              Generate Summary Quote
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
                            <h4 className="text-[11px] font-extrabold uppercase text-[#6A6A6A] tracking-wider">Step 6 of 6: Blueprint Summary</h4>

                            {/* Whiteboard Summary Card */}
                            <div className="relative rounded-2xl border-2 border-[#2C2C2C] bg-white p-4 space-y-3 shadow-[3px_4px_0_#2C2C2C] overflow-hidden">
                              <div className="border-b border-[#2C2C2C]/10 pb-2 flex justify-between items-start">
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-[#6A6A6A] tracking-wider">Project Concept</span>
                                  <h5 className="text-xs font-bold text-[#2C2C2C] leading-snug mt-0.5">{getSummaryObject().project}</h5>
                                </div>
                                <span className="text-[10px] font-bold bg-[#FFF9C4] text-[#2C2C2C] px-2 py-0.5 rounded-full border border-[#2C2C2C]">
                                  {getSummaryObject().category}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#2C2C2C]">
                                <div>
                                  <span className="text-[8px] text-[#6A6A6A] uppercase font-bold block">Selected Tech Stack</span>
                                  <span className="font-semibold text-[#2C2C2C] mt-0.5 block truncate" title={getSummaryObject().stack}>
                                    {getSummaryObject().stack}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[8px] text-[#6A6A6A] uppercase font-bold block">Add-ons Selected</span>
                                  <span className="font-semibold text-[#2C2C2C] mt-0.5 block truncate" title={getSummaryObject().addons.join(" + ") || "None"}>
                                    {getSummaryObject().addons.join(" + ") || "None"}
                                  </span>
                                </div>
                                <div className="col-span-2 pt-1 border-t border-[#2C2C2C]/10 flex justify-between items-center">
                                  <div>
                                    <span className="text-[8px] text-[#6A6A6A] uppercase font-bold">Timeline</span>
                                    <span className="font-bold text-[#2C2C2C] block">{getSummaryObject().deadline}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[8px] text-[#6A6A6A] uppercase font-bold block">Sum Total</span>
                                    <span className="text-sm font-black text-[#2C2C2C]">₹{getSummaryObject().estimatedPrice.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Continue on WhatsApp */}
                            <div className="space-y-2">
                              <button
                                onClick={handleWhatsAppRedirect}
                                className="w-full py-3.5 bg-[#C8E6C9] hover:bg-[#A5D6A7] text-[#2C2C2C] border-2 border-[#2C2C2C] rounded-xl font-extrabold text-xs shadow-[3px_4px_0_#2C2C2C] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <MessageCircle size={15} />
                                Continue on WhatsApp
                              </button>
                              
                              <p className="text-[9px] text-slate-500 font-sans text-center leading-normal">
                                * Clicking will store the lead in office records and redirect you to WhatsApp for direct human deal-closing.
                              </p>

                              <button
                                onClick={resetGuidedFlow}
                                className="w-full text-center text-[10px] font-bold text-blue-600 hover:underline pt-1.5 cursor-pointer block"
                              >
                                ← Restart Dynamic Calculator
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Progress navigation */}
                    {step > 1 && (
                      <div className="shrink-0 pt-3 border-t border-[#2C2C2C]/10 flex justify-between items-center bg-white">
                        <button
                          onClick={() => setStep(prev => Math.max(1, prev - 1))}
                          className="text-[10px] font-bold text-[#6A6A6A] hover:text-[#2C2C2C] cursor-pointer select-none"
                        >
                          ← Back
                        </button>
                        <div className="flex gap-1">
                          {[2, 3, 4, 5, 6, 7].map(sIdx => (
                            <div
                              key={sIdx}
                              className={`w-3.5 h-1.5 rounded-full border border-[#2C2C2C] transition-all ${
                                step === sIdx ? "bg-[#FFF59D] w-5" : step > sIdx ? "bg-[#2C2C2C]" : "bg-white"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Free Text Ask AI View (Notebook layout unchanged!) */}
                {mode === "chat" && (
                  <div className="flex-1 flex flex-col justify-between h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
                          {msg.sender === "bot" && (
                            <div className="w-6 h-6 rounded-full border border-[#2C2C2C] overflow-hidden shrink-0 shadow-[1px_1.5px_0_#2C2C2C] bg-white mb-0.5">
                              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className={`max-w-[80%] rounded-xl p-3 text-xs border border-[#2C2C2C] shadow-[1.5px_2px_0_#2C2C2C] ${
                            msg.sender === "user" 
                              ? "bg-[#FFF9C4] text-[#2C2C2C] rounded-tr-none" 
                              : "bg-white text-[#2C2C2C] rounded-tl-none"
                          }`}>
                            <p className="font-sans font-semibold leading-relaxed text-xs sm:text-sm whitespace-pre-line">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start items-end gap-2">
                          <div className="w-6 h-6 rounded-full border border-[#2C2C2C] overflow-hidden shrink-0 shadow-[1px_1.5px_0_#2C2C2C] bg-white mb-0.5">
                            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                          </div>
                          <div className="bg-white border border-[#2C2C2C] rounded-xl rounded-tl-none p-2.5 shadow-[1.5px_2px_0_#2C2C2C]">
                            <div className="flex gap-1 items-center">
                              <span className="w-1.5 h-1.5 bg-[#2C2C2C] rounded-full animate-bounce"></span>
                              <span className="w-1.5 h-1.5 bg-[#2C2C2C] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                              <span className="w-1.5 h-1.5 bg-[#2C2C2C] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Question Input Footer */}
                    <div className="p-3 border-t border-[#2C2C2C]/10 bg-white flex flex-col gap-2 shrink-0">
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
                            className="text-[9px] bg-white hover:bg-[#FFF9C4] text-[#2C2C2C] border border-[#2C2C2C] px-2 py-0.5 rounded-full shadow-[1px_1px_0_#2C2C2C] font-bold truncate max-w-[175px]"
                          >
                            {faq}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-1.5 pt-1">
                        <input
                          type="text"
                          placeholder="Ask a question..."
                          className="flex-1 bg-white border-2 border-[#2C2C2C] rounded-lg px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none focus:bg-[#FFF9C4]/5 font-sans font-semibold placeholder:text-slate-400"
                          value={inputVal}
                          onChange={(e) => setInputVal(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          disabled={isTyping}
                        />
                        <button 
                          onClick={() => handleSendMessage()}
                          disabled={isTyping || !inputVal.trim()}
                          className="bg-[#FFF59D] hover:bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] p-2.5 rounded-xl flex items-center justify-center cursor-pointer shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5"
                        >
                          <Send size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger button (matching whiteboard aesthetics) */}
      <div className="flex flex-col items-end gap-3">
        {/* Nudge */}
        <AnimatePresence>
          {showNudge && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="mb-1 bg-[#FFF59D] border-2 border-[#2C2C2C] px-3 py-1.5 rounded-xl shadow-[2px_3px_0_#2C2C2C] text-[10px] sm:text-xs font-bold text-[#2C2C2C] text-right pointer-events-none"
            >
              🤖 Need help choosing a project? Ask me!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FFF59D] rounded-full flex items-center justify-center text-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:bg-[#FFF9C4] hover:shadow-[4px_5px_0_#2C2C2C] transition-all border-2.5 border-[#2C2C2C] cursor-pointer overflow-hidden"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          {isOpen ? (
            <X size={20} />
          ) : (
            <img src="/logo.jpg" alt="Shubdeep Labs Logo" className="w-full h-full object-cover" />
          )}
        </motion.button>
      </div>

    </div>
  );
}
