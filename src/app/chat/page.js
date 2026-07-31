"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageSquare, Send, Bot, User, Sparkles, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function StandaloneChatPage() {
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello! Welcome to ShubDeep Labs AI Business Consultant Desk. I can assist you with website pricing estimates, custom software architecture, AI agent development, mobile apps, and booking a technical consultation."
    }
  ]);
  const [inputVal, setInputVal] = useState("");
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
        <div className="sand-dune-card p-4 sm:p-8 rounded-3xl border-2 border-[#2E3B2B] shadow-xl flex flex-col h-[650px] justify-between">
          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
            {messages.map((msg) => (
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

          {/* QUICK PRESETS */}
          <div className="mb-4">
            <p className="text-xs font-bold text-[#4A3525] mb-2">Suggested Consultation Inquiries:</p>
            <div className="flex flex-wrap gap-2">
              {presetQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(query)}
                  className="px-3 py-1.5 rounded-xl bg-[#EADCC6] hover:bg-[#CFE3D2] text-[#3B2818] text-xs font-bold transition-all border border-[#D5C4A6]"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-3 border-t border-[#D5C4A6]"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about project pricing, tech stacks, or request a quote..."
              className="flex-1 py-3 px-4 rounded-2xl bg-white border border-[#D5C4A6] text-sm text-[#3B2818] font-medium focus:outline-none focus:ring-2 focus:ring-[#2E3B2B]"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="btn-sage-green py-3 px-6 text-sm font-extrabold flex items-center justify-center disabled:opacity-50"
            >
              Send <Send className="w-4 h-4 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
