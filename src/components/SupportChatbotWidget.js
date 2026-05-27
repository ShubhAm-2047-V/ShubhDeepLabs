"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Brain, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Context database about Shubdeep Labs for custom RAG local fallback matching
const SUPPORT_CONTEXT = [
  {
    keywords: ["price", "pricing", "cost", "budget", "fees", "tier", "plan", "easy", "medium", "hard", "mtech", "diploma", "engineering", "bca", "mca", "ai", "ml", "android", "category", "categories"],
    content: `PROJECT CATEGORIES BASE PRICING:
- Diploma: Starting from ₹2499
- Engineering (B.E/B.Tech): Starting from ₹4999
- M.Tech / Research: Starting from ₹8999
- BCA / MCA: Starting from ₹3999
- AI / ML: Starting from ₹6999
- Android App: Starting from ₹5499

TECH STACK PRICING (Optional Add-ons):
- HTML / CSS / JavaScript: + ₹0
- Python + Flask: + ₹999
- React.js: + ₹1499
- Next.js: + ₹1999
- MERN Stack: + ₹2999
- Android (Java/Kotlin): + ₹3499
- Firebase Integration: + ₹999
- MySQL / MongoDB: + ₹799
- AI Integration (Gemini/OpenAI): + ₹2499
- Machine Learning Model: + ₹3499
- OpenCV / Face Detection: + ₹2999
- Full Stack + Deployment: + ₹4499
- Blockchain / Web3: + ₹5999`
  },
  {
    keywords: ["deliver", "deliverable", "include", "provide", "get", "ppt", "report", "slides", "viva", "setup", "remote", "what do i receive", "receive"],
    content: `WHAT STUDENTS WILL RECEIVE:
- Complete Source Code & Project Files
- Thesis Report & PPT Presentation Slides (Available separately as add-ons)
- Detailed Documentation & Setup Guidance
- Bouncing Demo Support & Basic Customization Support

ADD-ONS PRICING SHEET:
- PPT Presentation: + ₹499
- Thesis Report: + ₹999
- Viva Guidance Sheet: + ₹399
- Remote Setup (Zoom): + ₹699
- Cloud Deployment: + ₹1499
- Code Walkthrough Doc: + ₹599`
  },
  {
    keywords: ["deadline", "timeline", "charge", "days", "urgent", "standard", "relaxed", "flexible", "rush"],
    content: `DEADLINE CHARGES:
- 1–3 Days (Urgent): + ₹2499
- 4–7 Days (Standard): + ₹999
- 8–14 Days (Relaxed): + ₹0
- Flexible / No Rush: + ₹0`
  },
  {
    keywords: ["recommend", "suggestion", "ideas", "topic", "easy", "advanced", "list", "options", "suitable", "outline"],
    content: `EASY PROJECT RECOMMENDATIONS:
- AI Resume Analyzer
- Smart Notes Summarizer
- AI Background Remover
- Expense Tracker
- AI Color Palette Generator
- Portfolio Builder
- Mock Interview AI

ADVANCED PROJECT RECOMMENDATIONS:
- AI Plant Disease Detector
- Face Recognition Attendance System
- AI Customer Support Chatbot
- Hospital Management System
- RFID Attendance Portal
- Blockchain Voting System`
  },
  {
    keywords: ["faq", "viva", "source", "laptop", "run", "custom", "deploy", "unique", "support"],
    content: `COMMON FAQS:
- Q: Will source code be provided?
  A: Yes, complete source code is included.
- Q: Will the project run on my laptop?
  A: Yes, setup guidance will be provided.
- Q: Can the project be customized?
  A: Yes, features and UI can be customized.
- Q: Is deployment included?
  A: Deployment is optional and available as an add-on.
- Q: Will PPT and report be included?
  A: Available separately as add-ons.
- Q: Can I get urgent delivery?
  A: Yes, urgent delivery is available with additional charges.
- Q: Which technologies are used?
  A: Technologies depend on project requirements and selected stack.
- Q: Is this project unique?
  A: Yes, projects are customized based on requirements.
- Q: Will support be provided after delivery?
  A: Basic support and setup help will be provided.`
  }
];

// Helper function to render text with clickable links (supporting plain URLs and markdown style [label](url))
function renderMessageText(text, userQuery) {
  if (!text) return null;
  const regex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s]+?(?=[.,;!?']?(\s|$)))/g;
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (!part) return null;
    if (part.startsWith("[") && part.includes("](")) {
      const labelMatch = part.match(/\[([^\]]+)\]/);
      const urlMatch = part.match(/\(([^)]+)\)/);
      const label = labelMatch ? labelMatch[1] : part;
      let url = urlMatch ? urlMatch[1].replace(/[*\]\).,;!?']+$/, "") : "#";
      
      if (url.includes("wa.me") || url.includes("whatsapp")) {
        const prefix = "Hi! I would like to consult about my project: ";
        const fullText = prefix + (userQuery || "");
        url = `https://api.whatsapp.com/send?phone=919028833275&text=${encodeURIComponent(fullText)}`;
      }
      return (
        <a 
          key={index} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-800 underline font-bold transition-colors"
        >
          {label}
        </a>
      );
    } else if (part.startsWith("http://") || part.startsWith("https://")) {
      const cleanUrl = part.replace(/[*\]\).,;!?']+$/, "");
      let hrefUrl = cleanUrl;
      if (cleanUrl.includes("wa.me") || cleanUrl.includes("whatsapp")) {
        const prefix = "Hi! I would like to consult about my project: ";
        const fullText = prefix + (userQuery || "");
        hrefUrl = `https://api.whatsapp.com/send?phone=919028833275&text=${encodeURIComponent(fullText)}`;
      }
      return (
        <a 
          key={index} 
          href={hrefUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-800 underline font-bold transition-colors"
        >
          {cleanUrl}
        </a>
      );
    } else {
      return <span key={index}>{part}</span>;
    }
  }).filter(Boolean);
}

export default function SupportChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: "support-msg-1", 
      sender: "bot", 
      text: "👋 Hello! I'm the Shubdeep Labs Support Assistant. Ask me anything about our academic project services, pricing tiers, deliverables, or policies!" 
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Show a floating nudge bubble after 8 seconds
    const t = setTimeout(() => {
      if (!isOpen) setShowNudge(true);
    }, 8000);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Lock body scroll when chatbot modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowNudge(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, messages]);

  const handleQuickReply = (text) => {
    handleSendMessage(text);
  };

  const localRAGLookup = (query) => {
    const qLower = query.toLowerCase();
    let bestMatch = "";
    let highestScore = 0;

    SUPPORT_CONTEXT.forEach((item) => {
      let score = 0;
      item.keywords.forEach((word) => {
        if (qLower.includes(word)) score += 1;
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item.content;
      }
    });

    return bestMatch;
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    if (!textToSend) setInputVal("");

    // Add user message
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // 1. Perform local RAG context extraction
    const matchedContext = localRAGLookup(query);

    try {
      // 2. Query Gemini Support Handler
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          context: matchedContext,
          history: messages.map(m => ({ sender: m.sender, text: m.text })).slice(-4)
        })
      });

      if (!response.ok) throw new Error("Connection failed");

      const data = await response.json();
      
      const rawText = data.reply || "";
      const customizerMatch = rawText.match(/\[CUSTOMIZER:\s*({[\s\S]*?})\s*\]/);
      let selections = null;
      let cleanReplyText = rawText;
      
      if (customizerMatch) {
        try {
          selections = JSON.parse(customizerMatch[1]);
          cleanReplyText = rawText.replace(/\[CUSTOMIZER:\s*({[\s\S]*?})\s*\]/, "").trim();
        } catch (e) {
          console.error("Failed to parse customizer selections:", e);
        }
      }
      
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: cleanReplyText,
        selections: selections
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Fallback: If network or Gemini is not configured, deliver matching static RAG content
      setTimeout(() => {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: matchedContext 
            ? `Based on our guidelines, here is what I found:\n\n${matchedContext}\n\nCan I help you with anything else?`
            : "I'm sorry, I'm having trouble connecting to my AI core right now. Feel free to ask about project pricing, deliverables, or call our coordinator directly at +91 90288 33275!"
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 800);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="font-marker">
      
      {/* ── CENTERED DIALOG MODAL ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="support-chatbot-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(44,44,44,0.55)", backdropFilter: "blur(6px)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-[460px] h-[580px] max-h-[85vh] bg-white border-3 border-[#2C2C2C] rounded-2xl shadow-[6px_8px_0_#2C2C2C] overflow-hidden flex flex-col relative"
            >
              {/* Whiteboard Header */}
              <div className="bg-[#FFF59D] border-b-3 border-[#2C2C2C] p-3 flex justify-between items-center relative shrink-0">
                {/* Notebook binding styling */}
                <div className="absolute top-1 left-4 flex gap-1.5 pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FAF6EE] border border-[#2C2C2C]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FAF6EE] border border-[#2C2C2C]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FAF6EE] border border-[#2C2C2C]" />
                </div>

                <div className="flex items-center gap-2.5 pl-14">
                  <div className="w-7 h-7 bg-[#FFF176] rounded-lg border-1.5 border-[#2C2C2C] flex items-center justify-center shadow-[1px_1.5px_0_#2C2C2C]">
                    <Brain size={14} className="text-[#2C2C2C]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-marker font-extrabold text-[#2C2C2C] leading-none">Support Desk AI</h3>
                    <span className="text-[8px] font-sans font-bold text-[#6A6A6A] leading-none">Online &amp; Active</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg border border-[#2C2C2C]/20 hover:border-[#2C2C2C] hover:bg-white/80 transition-all text-[#2C2C2C]"
                >
                  <X size={14} />
                </button>
              </div>

              {/* RAG Rule Sheet messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 notebook-ruled">
                {messages.map((msg, index) => {
                  let associatedUserMsg = "";
                  if (msg.sender === "bot") {
                    for (let i = index - 1; i >= 0; i--) {
                      if (messages[i].sender === "user") {
                        associatedUserMsg = messages[i].text;
                        break;
                      }
                    }
                  }
                  return (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-xl p-3 text-xs shadow-[1.5px_2px_0_#2C2C2C] border border-[#2C2C2C] ${
                        msg.sender === "user" 
                          ? "bg-[#FFF9C4] text-[#2C2C2C] rounded-tr-none" 
                          : "bg-white text-[#2C2C2C] rounded-tl-none"
                      }`}>
                        <p className="font-sans font-semibold whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                          {renderMessageText(msg.text, associatedUserMsg)}
                        </p>
                        {msg.selections && (
                          <div className="mt-3 pt-2.5 border-t border-[#2C2C2C]/10 flex flex-col gap-1.5">
                            <button
                              onClick={() => {
                                const customEvent = new CustomEvent("open-customizer", {
                                  detail: {
                                    category: msg.selections.category,
                                    tech: msg.selections.tech,
                                    addons: msg.selections.addons,
                                    timeline: msg.selections.timeline || "normal",
                                    showSummary: false
                                  }
                                });
                                window.dispatchEvent(customEvent);
                              }}
                              className="w-full py-1.5 px-3 bg-[#90CAF9] hover:bg-[#64B5F6] border-2 border-[#2C2C2C] rounded-xl font-marker font-bold text-[#2C2C2C] text-xs shadow-[1.5px_2px_0_#2C2C2C] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                            >
                              <Sparkles size={11} className="text-[#2C2C2C]" />
                              🎨 Customise Project Now!
                            </button>
                            <span className="text-[9px] font-sans text-center text-[#6A6A6A]">
                              Pre-selected: {msg.selections.category ? msg.selections.category.toUpperCase() : ""}{" "}
                              {msg.selections.tech && msg.selections.tech.length > 0 
                                ? `+ [${msg.selections.tech.map(t => t.toUpperCase()).join(", ")}]` 
                                : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start">
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

              {/* Dialog Footer Actions */}
              <div className="p-3 border-t-2.5 border-[#2C2C2C] bg-[#FAF6EE] flex flex-col gap-2 shrink-0">
                {/* Quick reply pills representing Starter Messages */}
                <div className="flex flex-wrap gap-1">
                  <button 
                    onClick={() => handleQuickReply("Need help selecting your project?")}
                    className="text-[9px] px-2 py-0.5 bg-white border border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-full shadow-[1px_1px_0_#2C2C2C] transition-all font-bold"
                  >
                    🚀 Need Selection Help?
                  </button>
                  <button 
                    onClick={() => handleQuickReply("Get instant project pricing.")}
                    className="text-[9px] px-2 py-0.5 bg-white border border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-full shadow-[1px_1px_0_#2C2C2C] transition-all font-bold"
                  >
                    💰 Project Costing
                  </button>
                  <button 
                    onClick={() => handleQuickReply("Choose your project category to continue.")}
                    className="text-[9px] px-2 py-0.5 bg-white border border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-full shadow-[1px_1px_0_#2C2C2C] transition-all font-bold"
                  >
                    🎓 Course Level
                  </button>
                  <button 
                    onClick={() => handleQuickReply("Need urgent delivery? Ask for quick pricing.")}
                    className="text-[9px] px-2 py-0.5 bg-white border border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-full shadow-[1px_1px_0_#2C2C2C] transition-all font-bold"
                  >
                    ⚡ Urgent Delivery
                  </button>
                  <button 
                    onClick={() => handleQuickReply("Looking for easy but impressive final year projects?")}
                    className="text-[9px] px-2 py-0.5 bg-white border border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-full shadow-[1px_1px_0_#2C2C2C] transition-all font-bold"
                  >
                    💡 Easy Project Ideas
                  </button>
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    className="flex-1 bg-white border-2 border-[#2C2C2C] rounded-lg px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none focus:bg-[#FFF9C4]/5 font-sans font-semibold"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isTyping}
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={isTyping || !inputVal.trim()}
                    className="btn-sketch py-1 px-3 text-xs inline-flex items-center justify-center shadow-[1.5px_2.0px_0_#2C2C2C]"
                  >
                    <Send size={11} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-[8px] text-[#8A8A8A] font-sans pt-1">
                  <span>Direct consultation active</span>
                  <a 
                    href="https://wa.me/919028833275"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-marker font-bold text-[#2C2C2C] flex items-center gap-0.5 hover:underline"
                  >
                    WhatsApp Support <ArrowRight size={8} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING TRIGGER BUTTON CONTAINER (fixed bottom-right) ── */}
      <div className="fixed bottom-[10rem] right-6 z-40 flex flex-col items-end gap-3">
        {/* FLOAT NUDGE CALLOUT */}
        <AnimatePresence>
          {showNudge && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="mb-1 bg-[#FFF59D] border-2 border-[#2C2C2C] px-3 py-1.5 rounded-xl shadow-[2px_3px_0_#2C2C2C] text-[11px] font-bold text-[#2C2C2C] text-right pointer-events-none"
            >
              🤖 Need help choosing a project? Ask me!
            </motion.div>
          )}
        </AnimatePresence>

        {/* TRIGGER BUTTON */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-[#FFF59D] rounded-full flex items-center justify-center text-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:bg-[#FFF9C4] hover:shadow-[4px_5px_0_#2C2C2C] transition-all border-2.5 border-[#2C2C2C] cursor-pointer"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 animate-fade-in" />
          ) : (
            <MessageSquare className="w-6 h-6 animate-fade-in text-[#2C2C2C]" />
          )}
        </motion.button>
      </div>

    </div>
  );
}
