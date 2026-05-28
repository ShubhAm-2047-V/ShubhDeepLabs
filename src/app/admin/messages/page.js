"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { dbService } from "@/lib/db";
import { 
  Lock, Mail, Key, Shield, Search, Filter, RefreshCw, 
  Trash2, AlertCircle, Clock, LogOut, User, Tag, MapPin, 
  ChevronRight, ArrowLeft, Cpu, Send
} from "lucide-react";
import toast from "react-hot-toast";

export default function MessagesDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [chats, setChats] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [inboxLoading, setInboxLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoginLoading(true);
    const result = await dbService.loginAdmin(email, password);
    setLoginLoading(false);

    if (result.success) {
      setIsLoggedIn(true);
      toast.success("Coordinator desk unlocked.");
      fetchChats();
    } else {
      toast.error(result.error || "Verification failed.");
    }
  };

  const handleLogout = async () => {
    await dbService.logoutAdmin();
    setIsLoggedIn(false);
    toast.success("Coordinator desk locked.");
  };

  const fetchChats = async () => {
    setInboxLoading(true);
    try {
      const res = await fetch("/api/admin/chat");
      if (res.ok) {
        const data = await res.json();
        setChats(data.sessions || []);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to read active discussions.");
    } finally {
      setInboxLoading(false);
    }
  };

  const fetchMessages = async (sessionId) => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/admin/chat?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load message registry.");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendAdminReply = async () => {
    if (!replyText.trim() || !selectedSessionId) return;

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          messageText: replyText
        })
      });

      if (res.ok) {
        setReplyText("");
        fetchMessages(selectedSessionId);
        toast.success("Manual reply dispatched.");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to dispatch reply.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error dispatching manual reply.");
    }
  };

  const handleToggleBotStatus = async (sessionId, currentStatus) => {
    const nextStatus = currentStatus === "AI Bot" ? "Manual Intervention" : "AI Bot";
    try {
      const res = await fetch("/api/admin/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          status: nextStatus
        })
      });

      if (res.ok) {
        toast.success(`Session workflow set to: ${nextStatus}`);
        setChats(prev => prev.map(c => c.id === sessionId ? { ...c, status: nextStatus } : c));
      } else {
        toast.error("Failed to update session status.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error updating chat status.");
    }
  };

  useEffect(() => {
    const unsubscribe = dbService.checkAdminAuth((status) => {
      setIsLoggedIn(status);
      if (status) {
        fetchChats();
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!selectedSessionId || !isLoggedIn) return;
    const interval = setInterval(() => {
      fetchMessages(selectedSessionId);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedSessionId, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 mt-16 bg-[#FAF6EE]">
        <div className="w-full max-w-md chalkboard-panel p-8 flex flex-col relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center mx-auto mb-4 shadow-[2px_3px_0_#2C2C2C] rotate-[-5deg]">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-marker font-extrabold tracking-widest text-[#F8F9FA] uppercase underline decoration-[#FFF59D] decoration-2">CHATS DESK</h1>
            <p className="mt-2 text-sm text-[#EBE5D9] font-marker">
              Office auth required. Enter your coordinator credentials to unlock active sessions.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-marker text-[#F8F9FA] uppercase mb-1 tracking-widest">COORDINATOR ID (EMAIL)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#EBE5D9]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-base pl-11 pr-4 py-3 bg-[#FAF6EE]/10 border-2 border-[#FAF6EE] rounded-xl focus:outline-none focus:bg-[#FAF6EE]/20 text-[#FFF59D] font-marker"
                  placeholder="admin@shubdeeplabs.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-marker text-[#F8F9FA] uppercase mb-1 tracking-widest">ACCESS KEY PASSPHRASE</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#EBE5D9]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-base pl-11 pr-4 py-3 bg-[#FAF6EE]/10 border-2 border-[#FAF6EE] rounded-xl focus:outline-none focus:bg-[#FAF6EE]/20 text-[#FFF59D] font-marker"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full inline-flex items-center justify-center px-4 py-4 text-base font-marker font-bold tracking-widest text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF] rounded-xl shadow-[3px_4px_0_#2C2C2C] hover:translate-y-0.5 active:translate-y-1.5 transition-all cursor-pointer"
            >
              {loginLoading ? (
                <span className="w-5 h-5 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  UNLOCK CHATS DESK
                  <Lock className="w-4 h-4 ml-1.5 text-[#2C2C2C]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 mt-16 bg-[#FAF6EE] text-[#2C2C2C] font-marker">
      
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2.5 border-[#2C2C2C]/10 pb-5">
        <div>
          <h1 className="text-3xl font-hand font-extrabold text-[#2C2C2C] flex items-center">
            <Cpu className="w-7 h-7 mr-2 text-[#2C2C2C] shrink-0" />
            CHATS INBOX
          </h1>
          <p className="text-sm font-marker text-[#6A6A6A] mt-1">
            Manual takeover and live conversation logging with visitors and WhatsApp clients.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#2C2C2C] bg-white border-2 border-[#2C2C2C] hover:bg-[#FAF6EE] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Ledger
          </Link>

          <Link
            href="/admin/leads"
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5"
          >
            Leads Board
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </Link>
          
          <button
            onClick={fetchChats}
            className="p-2.5 rounded-xl border-2 border-[#2C2C2C] bg-white hover:bg-[#FAF6EE] text-[#2C2C2C] transition-all cursor-pointer shadow-[2px_2px_0_#2C2C2C]"
            title="Reload Inbox"
          >
            <RefreshCw className={`w-4 h-4 ${inboxLoading ? "animate-spin" : ""}`} />
          </button>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#B71C1C] bg-[#FFCDD2] border-2 border-[#2C2C2C] hover:bg-[#EF9A9A] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5"
          >
            LOCK DESK
            <LogOut className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px] mt-2">
        {/* Left Panel: Chat Sessions */}
        <div className="lg:col-span-4 bg-white border-3 border-[#2C2C2C] rounded-2xl p-4 shadow-[4px_5px_0_#2C2C2C] flex flex-col h-full overflow-hidden">
          <h3 className="text-lg font-marker font-extrabold mb-3 pb-2 border-b-2 border-[#2C2C2C]/10 flex justify-between items-center text-[#2C2C2C]">
            <span>Active Discussions</span>
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {inboxLoading ? (
              <div className="py-20 text-center">
                <span className="w-6 h-6 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin inline-block"></span>
              </div>
            ) : chats.length === 0 ? (
              <p className="text-center text-xs text-gray-500 py-10 font-sans">No discussions logged.</p>
            ) : (
              chats.map((c) => {
                const isSelected = selectedSessionId === c.id;
                const isWhatsApp = c.session_type === "whatsapp" || c.sessionType === "whatsapp";
                const status = c.status;
                const updatedAtStr = c.updated_at || c.updatedAt;
                const updatedTime = updatedAtStr 
                  ? new Date(updatedAtStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : "N/A";
                
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedSessionId(c.id);
                      fetchMessages(c.id);
                    }}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex justify-between items-start cursor-pointer ${
                      isSelected
                        ? "bg-[#FFF9C4] border-[#2C2C2C] shadow-[2px_2.5px_0_#2C2C2C]"
                        : "bg-white border-[#2C2C2C]/20 hover:border-[#2C2C2C] hover:bg-[#FAF6EE]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[#2C2C2C]/30 text-white ${
                          isWhatsApp ? "bg-[#2E7D32]" : "bg-[#1565C0]"
                        }`}>
                          {isWhatsApp ? "WhatsApp" : "Web Chat"}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[#2C2C2C]/30 ${
                          status === "Manual Intervention" ? "bg-[#FFCDD2] text-[#C62828]" : "bg-[#E8F5E9] text-[#2E7D32]"
                        }`}>
                          {status === "Manual Intervention" ? "Manual" : "AI Bot"}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs truncate text-[#2C2C2C]">
                        {c.contact_name || c.contactName || "Anonymous Visitor"}
                      </h4>
                      <p className="text-[10px] text-[#6A6A6A] truncate font-mono">
                        {c.session_key || c.sessionKey}
                      </p>
                    </div>
                    <span className="text-[9px] text-[#8A8A8A] shrink-0 ml-2 mt-1">{updatedTime}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Chat viewport */}
        <div className="lg:col-span-8 bg-white border-3 border-[#2C2C2C] rounded-2xl shadow-[4px_5px_0_#2C2C2C] flex flex-col h-full overflow-hidden">
          {selectedSessionId ? (
            (() => {
              const session = chats.find(c => c.id === selectedSessionId);
              const isWhatsApp = session?.session_type === "whatsapp" || session?.sessionType === "whatsapp";
              const isManual = session?.status === "Manual Intervention";
              
              return (
                <>
                  {/* Viewport Header */}
                  <div className="bg-[#FAF6EE] border-b-2.5 border-[#2C2C2C] p-3.5 flex justify-between items-center shrink-0 flex-wrap gap-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#2C2C2C] flex items-center gap-1.5">
                        {session?.contact_name || session?.contactName || "Visitor"}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border border-[#2C2C2C]/20 ${
                          isWhatsApp ? "bg-[#C8E6C9] text-[#2E7D32]" : "bg-[#BBDEFB] text-[#1565C0]"
                        }`}>
                          {isWhatsApp ? "WhatsApp Contact" : "Website Client"}
                        </span>
                      </h3>
                      <p className="text-[10px] text-[#6A6A6A] font-mono">
                        Key: {session?.session_key || session?.sessionKey}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleBotStatus(session.id, session.status)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border-2 border-[#2C2C2C] shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 transition-all cursor-pointer ${
                        isManual ? "bg-[#FFCDD2] text-[#B71C1C]" : "bg-[#C8E6C9] text-[#1B5E20]"
                      }`}
                    >
                      {isManual ? "🤖 Enable AI Response" : "🙋 Take Over Chat (Disable AI)"}
                    </button>
                  </div>

                  {/* Chat Messages Rule list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCF9F2]/30 notebook-ruled flex flex-col">
                    {messagesLoading && chatMessages.length === 0 ? (
                      <div className="py-20 text-center m-auto">
                        <span className="w-8 h-8 border-4 border-[#2C2C2C] border-t-transparent rounded-full animate-spin inline-block"></span>
                      </div>
                    ) : chatMessages.length === 0 ? (
                      <div className="text-center text-xs text-gray-500 py-20 m-auto">No messages logged.</div>
                    ) : (
                      chatMessages.map((m) => {
                        const isAdmin = m.sender === "admin";
                        const isBot = m.sender === "bot";
                        return (
                          <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] rounded-xl p-2.5 text-xs border border-[#2C2C2C] shadow-[1px_1.5px_0_#2C2C2C] ${
                              isAdmin 
                                ? "bg-[#FFF59D] text-[#2C2C2C] rounded-tr-none font-sans font-semibold" 
                                : isBot
                                ? "bg-white text-[#6A6A6A] rounded-tl-none italic font-sans"
                                : "bg-[#E1F5FE] text-[#2C2C2C] rounded-tl-none font-sans font-semibold"
                            }`}>
                              <span className="font-marker block text-[8px] uppercase tracking-wider text-[#6A6A6A] mb-0.5">
                                {isAdmin ? "Coordinator" : isBot ? "AI Agent" : "Student"}
                              </span>
                              <p className="leading-relaxed whitespace-pre-wrap">{m.message_text || m.messageText}</p>
                              <span className="text-[7px] text-[#8A8A8A] block text-right mt-1 font-mono">
                                {new Date(m.created_at || m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input Panel */}
                  <div className="p-3 bg-[#FAF6EE] border-t-2.5 border-[#2C2C2C] shrink-0 space-y-2">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[8px] font-bold text-[#6A6A6A] uppercase mr-1">Templates:</span>
                      {[
                        { label: "Portfolio Links", text: "Here is our demo offers page to check out latest projects: https://shubdeeplabs.com/offers" },
                        { label: "Customizer", text: "Please use our interactive builder to specify your category, stack, and features: https://shubdeeplabs.com/order" },
                        { label: "Viva Guidance", text: "Yes, we offer comprehensive Viva preparation docs and custom walkthroughs to ensure you clear your viva successfully!" },
                        { label: "Request details", text: "Could you please tell me your college syllabus requirements, required timeline, and approximate budget?" }
                      ].map((t) => (
                        <button
                          key={t.label}
                          onClick={() => setReplyText(prev => prev ? prev + " " + t.text : t.text)}
                          className="text-[9px] bg-white hover:bg-[#FFF9C4] text-[#2C2C2C] px-2 py-0.5 border border-[#2C2C2C] rounded-full shadow-[1px_1px_0_#2C2C2C] transition-all cursor-pointer font-bold font-marker"
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <textarea
                        placeholder={isManual ? "Type your reply to send to the student..." : "Switch to manual mode to send replies..."}
                        disabled={!isManual}
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 bg-white border-2 border-[#2C2C2C] rounded-xl p-2.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                      />
                      <button
                        onClick={handleSendAdminReply}
                        disabled={!isManual || !replyText.trim()}
                        className="px-4 py-2 bg-[#FFF59D] hover:bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed border-2 border-[#2C2C2C] rounded-xl font-marker font-bold text-xs text-[#2C2C2C] shadow-[2px_3px_0_#2C2C2C] active:translate-y-0.5 shrink-0 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        Send
                        <Send size={12} />
                      </button>
                    </div>
                    <p className="text-[8px] text-[#8A8A8A] font-sans text-center">
                      {isWhatsApp 
                        ? "Manual replies are delivered directly to the user's WhatsApp number." 
                        : "Replies are saved to the website session. The visitor will see them automatically."}
                    </p>
                  </div>
                </>
              );
            })()
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 m-auto">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-3">
                💬
              </div>
              <h4 className="font-marker font-extrabold text-sm text-gray-500">NO ACTIVE CHAT SELECTED</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xs leading-normal">Select a conversation thread from the left list to start messaging.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
