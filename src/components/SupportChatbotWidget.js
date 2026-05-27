"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Brain, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Context database about Shubdeep Labs for custom RAG local fallback matching
const SUPPORT_CONTEXT = [
  {
    keywords: ["price", "pricing", "cost", "budget", "fees", "tier", "plan", "easy", "medium", "hard", "mtech", "diploma"],
    content: "Shubdeep Labs offers 3 pricing tiers depending on complexity:\n1. Easy Project Plan (₹1999): Simple logic utility, clean UI, draft PPT slides, complete source code.\n2. Medium Project Plan (₹3499): Relational database models, multi-feature UI, PPT, comprehensive thesis report draft, and 2 code revisions.\n3. Hard Project Plan (₹4599): Advanced algorithms (AI/ML/Deep Learning/OpenCV), secure auth dashboards, thesis reports, 3 revisions, Zoom remote setup support, and 1-on-1 code walkthrough explanation."
  },
  {
    keywords: ["deliver", "deliverable", "include", "provide", "get", "ppt", "report", "slides", "viva", "setup", "remote"],
    content: "Every project (Medium and Hard) includes:\n- 100% Original Codebase: Structured freshly for your guidelines.\n- PowerPoint Presentation (PPT) Slides: Draft outlining core logic, database design, and architecture charts.\n- Comprehensive Thesis Report Draft: Dynamic explanation of data flow diagrams (DFD), requirements, system design, testing phases, and conclusion.\n- Viva Preparation Guidance Sheet: Prep guides explaining exact controllers and logic.\n- Remote Installation Support: Guided compiler & database deployment support over Zoom or AnyDesk."
  },
  {
    keywords: ["contact", "phone", "number", "call", "whatsapp", "email", "mail", "office", "hour", "timing", "address"],
    content: "You can contact our Coordinator Registry Office:\n- Phone/WhatsApp: +91 90288 33275\n- Email support: shubdeeplabs@gmail.com\n- Office Timings: Monday to Saturday, 9:30 AM to 7:00 PM."
  },
  {
    keywords: ["refund", "guarantee", "cancel", "money", "revision", "change", "modify", "edit"],
    content: "Policies:\n- Revisions: 2 free revisions for Medium, 3 revisions for Hard. Must align with initial scope.\n- Refund Guarantee: 100% full money-back guarantee if our engineering team fails to deliver or compile your project. No refunds are granted once the final compiled source code is handed over."
  },
  {
    keywords: ["service", "project", "degree", "diploma", "bca", "mca", "tech", "cs", "it", "ai", "ml", "iot", "blockchain"],
    content: "We custom build academic final year and mini-semester projects for Diploma, B.E., B.Tech, M.Tech, BCA, and MCA students. Study areas include: AI/ML pipelines, Full-Stack Web Development, Native Android Apps, IoT prototyping, OpenCV computer vision, Blockchain, and Python Flask REST APIs."
  }
];

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
      
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply
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
              className="w-full max-w-[380px] h-[500px] bg-white border-3 border-[#2C2C2C] rounded-2xl shadow-[6px_8px_0_#2C2C2C] overflow-hidden flex flex-col relative"
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
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl p-3 text-xs shadow-[1.5px_2px_0_#2C2C2C] border border-[#2C2C2C] ${
                      msg.sender === "user" 
                        ? "bg-[#FFF9C4] text-[#2C2C2C] rounded-tr-none" 
                        : "bg-white text-[#2C2C2C] rounded-tl-none"
                    }`}>
                      <p className="font-sans font-semibold whitespace-pre-line leading-relaxed text-xs sm:text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}

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
                {/* Quick reply pills */}
                <div className="flex flex-wrap gap-1">
                  <button 
                    onClick={() => handleQuickReply("What are your pricing plans?")}
                    className="text-[9px] px-2 py-0.5 bg-white border border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-full shadow-[1px_1px_0_#2C2C2C] transition-all font-bold"
                  >
                    💰 Pricing
                  </button>
                  <button 
                    onClick={() => handleQuickReply("What features do I get?")}
                    className="text-[9px] px-2 py-0.5 bg-white border border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-full shadow-[1px_1px_0_#2C2C2C] transition-all font-bold"
                  >
                    ✨ Stacks &amp; Stuffs
                  </button>
                  <button 
                    onClick={() => handleQuickReply("How can I call you?")}
                    className="text-[9px] px-2 py-0.5 bg-white border border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-full shadow-[1px_1px_0_#2C2C2C] transition-all font-bold"
                  >
                    📞 Contact
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
