"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageSquare, Send, Bot, User, Sparkles, ArrowRight, CheckCircle2, RotateCcw, Download, Search, Paperclip, Calendar, FileText } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import toast from "react-hot-toast";

export default function StandaloneChatPage() {
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello! Welcome to ShubDeep Labs AI Business Consultant Desk. I can assist you with website pricing estimates, custom software architecture, AI agent development, mobile apps, and booking a technical consultation."
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "AI Business Consultant", href: "/chat" }
  ];

  const presetQueries = [
    "What is the cost to build a website for my business?",
    "How much does a full-stack SaaS web application cost?",
    "Can you build a custom mobile app for iOS and Android?",
    "What AI features can you integrate into my platform?"
  ];

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("shubdeeplabs_chat_history");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load chat history from localStorage:", e);
    }
  }, []);

  // Save chat history to localStorage on updates
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem("shubdeeplabs_chat_history", JSON.stringify(messages));
      }
    } catch (e) {
      console.error("Failed to save chat history:", e);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleClearHistory = () => {
    const welcome = [
      {
        id: "welcome-1",
        sender: "bot",
        text: "Hello! Welcome to ShubDeep Labs AI Business Consultant Desk. I can assist you with website pricing estimates, custom software architecture, AI agent development, mobile apps, and booking a technical consultation."
      }
    ];
    setMessages(welcome);
    localStorage.removeItem("shubdeeplabs_chat_history");
    toast.success("Chat session reset.");
  };

  const handleExportChat = () => {
    try {
      const exportContent = messages.map(m => `[${m.sender.toUpperCase()}]: ${m.text}`).join("\n\n");
      const blob = new Blob([exportContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ShubDeepLabs_AI_Consultation_${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Consultation log exported to file.");
    } catch (e) {
      toast.error("Failed to export chat transcript.");
    }
  };

  const handleFileUploadPlaceholder = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Attached "${file.name}" to consultation session. You can now describe your requirements!`, {
        duration: 5000
      });
    }
  };

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
          sessionId: "chat-page-session",
          contactName: "Direct Visitor"
        })
      });
      const data = await res.json();

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply || "Thank you for reaching out! For custom website and software development inquiries, standard packages start at ₹3,999. Please share your project specs or WhatsApp number for a free consultation."
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "I am ready to assist with your software project pricing, technology recommendations, and scheduling a discovery call. Please type your requirements below!"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredMessages = searchQuery.trim()
    ? messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-24 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold sage-badge mb-3">
            <Sparkles className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            SHUBDEEP LABS AI BUSINESS CONSULTANT
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#3B2818]">
            Interactive AI Project Consultant
          </h1>
          <p className="text-sm sm:text-base text-[#4A3525] font-medium mt-2">
            Ask anything about website development costs, custom software architecture, timelines, or technology stacks.
          </p>
        </header>

        {/* CHAT INTERFACE CONTAINER */}
        <div className="sand-dune-card p-4 sm:p-8 rounded-3xl border-2 border-[#2E3B2B] shadow-xl flex flex-col h-[700px] justify-between">
          
          {/* TOP ACTIONS BAR (Search & Export & Clear) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D5C4A6] mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#2E3B2B] animate-pulse" />
              <span className="text-xs font-bold text-[#3B2818]">AI Consultant Active</span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#4A3525] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chat..."
                  className="pl-8 pr-3 py-1 bg-white/80 border border-[#D5C4A6] rounded-xl text-xs text-[#3B2818] font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-[#2E3B2B]"
                  aria-label="Search conversation messages"
                />
              </div>

              {/* Export Chat Log */}
              <button
                onClick={handleExportChat}
                className="px-2.5 py-1.5 rounded-xl bg-[#EADCC6] hover:bg-[#CFE3D2] text-[#3B2818] text-xs font-bold transition-all border border-[#D5C4A6] flex items-center space-x-1"
                title="Export Consultation Transcript"
                aria-label="Export chat log transcript"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {/* Clear History */}
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-xl text-[#4A3525] hover:text-[#2E3B2B] hover:bg-[#EADCC6]/50 transition-all"
                title="Clear Session"
                aria-label="Clear chat session history"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-9 h-9 rounded-2xl bg-[#CFE3D2] text-[#2E3B2B] flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-[85%] text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-[#3B2818] text-[#FAF6EE] rounded-tr-none"
                      : "bg-white/90 text-[#3B2818] border border-[#D5C4A6] rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="w-9 h-9 rounded-2xl bg-[#EADCC6] text-[#3B2818] flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-xs font-bold text-[#4A3525] bg-white/70 p-3 rounded-2xl w-max">
                <Bot className="w-4 h-4 text-[#2E3B2B] animate-spin" />
                <span>AI Consultant is analyzing project scope...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK ACTION BUTTONS */}
          <div className="mb-4 pt-3 border-t border-[#D5C4A6]/50 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {presetQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(query)}
                  className="px-3 py-1 rounded-xl bg-[#EADCC6] hover:bg-[#CFE3D2] text-[#3B2818] text-xs font-bold transition-all border border-[#D5C4A6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E3B2B]"
                  aria-label={`Ask AI: ${query}`}
                >
                  {query}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href="/contact"
                className="px-3 py-1 rounded-xl bg-[#2E3B2B] text-white hover:bg-[#3B2818] text-xs font-bold transition-all flex items-center space-x-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Meeting</span>
              </Link>
            </div>
          </div>

          {/* INPUT FORM WITH FILE ATTACHMENT */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-3 border-t border-[#D5C4A6]"
          >
            <label
              htmlFor="spec-file-upload"
              className="p-3 bg-white border border-[#D5C4A6] rounded-2xl cursor-pointer hover:bg-[#CFE3D2]/50 text-[#3B2818] transition-all"
              title="Attach Project Specs (PDF/DOCX)"
            >
              <Paperclip className="w-4 h-4" />
              <input
                id="spec-file-upload"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUploadPlaceholder}
                className="hidden"
                aria-label="Upload project specification file"
              />
            </label>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about project pricing, tech stacks, or request a proposal..."
              className="flex-1 py-3 px-4 rounded-2xl bg-white border border-[#D5C4A6] text-sm text-[#3B2818] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E3B2B]"
              aria-label="Type your project question or specification"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="btn-sage-green py-3 px-6 text-sm font-extrabold flex items-center justify-center disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E3B2B]"
              aria-label="Send message to AI Consultant"
            >
              Send <Send className="w-4 h-4 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
