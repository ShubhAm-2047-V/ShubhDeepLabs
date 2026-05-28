"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { dbService } from "@/lib/supabase";
import { 
  Lock, Mail, Key, Shield, Search, Filter, RefreshCw, 
  Trash2, CheckCircle, TrendingUp, AlertCircle, Clock, 
  LogOut, ClipboardList, MapPin, User, Tag, Terminal, Cpu, FileText
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [branchFilter, setBranchFilter] = useState("ALL");

  const [activeTab, setActiveTab] = useState("ledger");
  const [chats, setChats] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [inboxLoading, setInboxLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Custom Website Editor State
  const [siteSettings, setSiteSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchSiteSettings = async () => {
    setSettingsLoading(true);
    try {
      const data = await dbService.getSiteSettings();
      setSiteSettings(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load site layout configuration.");
    } finally {
      setSettingsLoading(false);
    }
  };

  const updateHeroField = (key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          [key]: val
        }
      };
    });
  };

  const updateContactField = (key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        contact: {
          ...prev.contact,
          [key]: val
        }
      };
    });
  };

  const updateFeature = (index, key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.features];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, features: updated };
    });
  };

  const updateCategory = (index, key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.categories];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, categories: updated };
    });
  };

  const addCategory = () => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: [...prev.categories, { title: "New Study Area", desc: "Brief description of syllabus compliance.", icon: "Laptop", href: "/order", border: "border-t-[#FFCA28]" }]
      };
    });
  };

  const deleteCategory = (index) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.filter((_, idx) => idx !== index)
      };
    });
  };

  const updateBlueprint = (index, key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.portfolio];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, portfolio: updated };
    });
  };

  const addBlueprint = () => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        portfolio: [...prev.portfolio, { title: "New Project Blueprint", tech: "React, Node.js, MongoDB", desc: "Detailed explanation of core logic systems.", markerColor: "marker-green" }]
      };
    });
  };

  const deleteBlueprint = (index) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        portfolio: prev.portfolio.filter((_, idx) => idx !== index)
      };
    });
  };

  const updateTestimonial = (index, key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.testimonials];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, testimonials: updated };
    });
  };

  const addTestimonial = () => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        testimonials: [...prev.testimonials, { name: "Student Name", role: "MCA/CS Student", review: "The solution was built perfectly compliance-ready...", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" }]
      };
    });
  };

  const deleteTestimonial = (index) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        testimonials: prev.testimonials.filter((_, idx) => idx !== index)
      };
    });
  };

  const updateFAQ = (index, key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, faqs: updated };
    });
  };

  const addFAQ = () => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        faqs: [...prev.faqs, { q: "New Question?", a: "Answer details go here." }]
      };
    });
  };

  const deleteFAQ = (index) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        faqs: prev.faqs.filter((_, idx) => idx !== index)
      };
    });
  };

  const updateAssurance = (index, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.hero.assurances];
      updated[index] = val;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          assurances: updated
        }
      };
    });
  };

  const addAssurance = () => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          assurances: [...prev.hero.assurances, "✓ New Assurance Title"]
        }
      };
    });
  };

  const deleteAssurance = (index) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          assurances: prev.hero.assurances.filter((_, idx) => idx !== index)
        }
      };
    });
  };

  const handleSaveSiteSettings = async () => {
    if (!siteSettings) return;
    setSaveLoading(true);
    try {
      await dbService.saveSiteSettings(siteSettings);
      toast.success("Site layout settings published successfully!", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to publish layout settings.");
    } finally {
      setSaveLoading(false);
    }
  };

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
      toast.success("ID key verified! Coordination desk active.", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
      });
      fetchOrders();
    } else {
      toast.error(result.error || "Verification failed. Check credentials.");
    }
  };

  const handleLogout = async () => {
    await dbService.logoutAdmin();
    setIsLoggedIn(false);
    toast.success("Coordinator desk locked.", {
      className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
    });
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await dbService.getOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to read database ledger.");
    } finally {
      setOrdersLoading(false);
    }
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
        fetchChats();
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
    const unsubscribe = dbService.checkAdminAuth((userStatus) => {
      setIsLoggedIn(userStatus);
      if (userStatus) {
        fetchOrders();
        fetchChats();
        fetchSiteSettings();
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "inbox" || !selectedSessionId) return;
    const interval = setInterval(() => {
      fetchMessages(selectedSessionId);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab, selectedSessionId]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await dbService.updateOrderStatus(orderId, newStatus);
      toast.success(`Workflow changed: ${newStatus}`);
      fetchOrders();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status.");
    }
  };

  const handleUpdatePayment = async (orderId, newPayment) => {
    try {
      await dbService.updatePaymentStatus(orderId, newPayment);
      toast.success(`Financial record updated: ${newPayment}`);
      fetchOrders();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update payment.");
    }
  };

  const handleDelete = (orderId) => {
    setConfirmModal({
      isOpen: true,
      message: "Permanent deletion of this student ledger record. Proceed?",
      onConfirm: async () => {
        try {
          await dbService.deleteOrder(orderId);
          toast.success("Ledger record expunged.");
          fetchOrders();
        } catch (e) {
          console.error(e);
          toast.error("Deletion failed.");
        }
      }
    });
  };

  // Analytics Math
  const metrics = {
    total: orders.length,
    pending: orders.filter(o => o.projectStatus === "Pending").length,
    inProgress: orders.filter(o => o.projectStatus === "In Progress").length,
    delivered: orders.filter(o => o.projectStatus === "Delivered").length,
    revenue: orders.reduce((sum, o) => sum + (parseInt(o.budget) || 0), 0)
  };

  // Filter Matching
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      (order.fullName && order.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.collegeName && order.collegeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.projectTitle && order.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.techRequired && order.techRequired.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || order.projectStatus === statusFilter;
    
    const matchesBranch = branchFilter === "ALL" || 
      (order.branch && order.branch.toLowerCase().includes(branchFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesBranch;
  });

  const uniqueBranches = ["ALL", ...new Set(orders.map(o => o.branch).filter(Boolean))];

  // -------------------------------------------------------------
  // SECURE CHALKBOARD LOCKSCREEN
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 mt-16 bg-[#FAF6EE]">
        <div className="w-full max-w-md chalkboard-panel p-8 flex flex-col relative overflow-hidden">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center mx-auto mb-4 shadow-[2px_3px_0_#2C2C2C] rotate-[-5deg]">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-marker font-extrabold tracking-widest text-[#F8F9FA] uppercase underline decoration-[#FFF59D] decoration-2">COORDINATOR DESK</h1>
            <p className="mt-2 text-sm text-[#EBE5D9] font-marker">
              Office auth required. Enter your coordinator credentials to access the desk.
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
                  UNLOCK DESK LEDGER
                  <Lock className="w-4 h-4 ml-1.5 text-[#2C2C2C]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SECURE WHITEBOARD OFFICE DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 mt-16 bg-[#FAF6EE] text-[#2C2C2C] font-marker">
      
      {/* Console Topbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2.5 border-[#2C2C2C]/10 pb-5">
        <div>
          <h1 className="text-3xl font-hand font-extrabold text-[#2C2C2C] flex items-center">
            <Cpu className="w-7 h-7 mr-2 text-[#2C2C2C] shrink-0" />
            PROJECTS COORDINATOR DESK
          </h1>
          <p className="text-sm font-marker text-[#6A6A6A] mt-1">
            Real-time active student registries, blueprints costing, and ledger files.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/offers"
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5"
          >
            Manage Offers
          </Link>

          <Link
            href="/admin/prices"
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#2C2C2C] bg-[#E1F5FE] border-2 border-[#2C2C2C] hover:bg-[#B3E5FC] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5"
          >
            Manage Prices
          </Link>

          <Link
            href="/admin/leads"
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#2C2C2C] bg-[#C8E6C9] border-2 border-[#2C2C2C] hover:bg-[#A5D6A7] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5"
          >
            Leads Board
          </Link>

          <Link
            href="/admin/messages"
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#2C2C2C] bg-[#E3F2FD] border-2 border-[#2C2C2C] hover:bg-[#BBDEFB] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5"
          >
            Chats Inbox
          </Link>
          
          <button
            onClick={fetchOrders}
            className="p-2.5 rounded-xl border-2 border-[#2C2C2C] bg-white hover:bg-[#FAF6EE] text-[#2C2C2C] transition-all cursor-pointer shadow-[2px_2px_0_#2C2C2C]"
            title="Reload Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${ordersLoading ? "animate-spin" : ""}`} />
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

      {/* Tab Control */}
      <div className="flex gap-2 border-b-2 border-[#2C2C2C]/20 pb-0 shrink-0">
        <button
          onClick={() => setActiveTab("ledger")}
          className={`px-5 py-2.5 rounded-t-xl font-marker font-bold text-sm border-2 border-[#2C2C2C] border-b-0 -mb-[2px] transition-all cursor-pointer ${
            activeTab === "ledger"
              ? "bg-white text-[#2C2C2C] shadow-[0_2px_0_white]"
              : "bg-[#FAF6EE] text-[#6A6A6A] hover:bg-white/50"
          }`}
        >
          📜 Ledger Registry
        </button>
        <button
          onClick={() => {
            setActiveTab("inbox");
            fetchChats();
          }}
          className={`px-5 py-2.5 rounded-t-xl font-marker font-bold text-sm border-2 border-[#2C2C2C] border-b-0 -mb-[2px] transition-all cursor-pointer ${
            activeTab === "inbox"
              ? "bg-white text-[#2C2C2C] shadow-[0_2px_0_white]"
              : "bg-[#FAF6EE] text-[#6A6A6A] hover:bg-white/50"
          }`}
        >
          💬 Chat Inbox
        </button>
        <button
          onClick={() => {
            setActiveTab("customize");
            fetchSiteSettings();
          }}
          className={`px-5 py-2.5 rounded-t-xl font-marker font-bold text-sm border-2 border-[#2C2C2C] border-b-0 -mb-[2px] transition-all cursor-pointer ${
            activeTab === "customize"
              ? "bg-white text-[#2C2C2C] shadow-[0_2px_0_white]"
              : "bg-[#FAF6EE] text-[#6A6A6A] hover:bg-white/50"
          }`}
        >
          🎨 Customize Website
        </button>
      </div>

      {activeTab === "ledger" && (
        <>
          {/* Chalkboard statistics items (styled as sketch notes) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "QUEUED STACKS", val: metrics.total, icon: ClipboardList, color: "text-[#2C2C2C]", bg: "bg-[#E6DFD3]" },
              { label: "QUEUED CHECKS", val: metrics.pending, icon: AlertCircle, color: "text-[#B71C1C]", bg: "bg-[#FFCDD2]" },
              { label: "ACTIVE COMPILES", val: metrics.inProgress, icon: Clock, color: "text-[#6A1B9A]", bg: "bg-[#E1BEE7]" },
              { label: "DELIVERED SYSTEMS", val: metrics.delivered, icon: CheckCircle, color: "text-[#1B5E20]", bg: "bg-[#C8E6C9]" },
              { label: "TOTAL ESTIMATE REVENUE", val: `₹${metrics.revenue}`, icon: TrendingUp, color: "text-[#0D47A1]", bg: "bg-[#BBDEFB]", span: "col-span-2 lg:col-span-1" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`sketch-card p-5 flex flex-col justify-between ${item.bg} ${item.span || ""}`}
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2C2C2C]">{item.label}</span>
                  <div className="flex items-baseline justify-between mt-3">
                    <span className={`text-3xl font-black ${item.color}`}>{item.val}</span>
                    <span className={`p-1.5 rounded-lg border-2 border-[#2C2C2C] bg-white ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Workload Pencil graph */}
          <div className="sketch-card border-3 border-[#2C2C2C] p-6 rounded-2xl bg-white">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#6A6A6A]">HAND-PLOTTED ACTIVE WORKLOAD PIPELINE</span>
            <div className="h-28 w-full mt-4 relative">
              <svg className="w-full h-full text-[#2C2C2C]" viewBox="0 0 500 100" preserveAspectRatio="none">
                <path
                  d="M 0 80 Q 85 30 170 60 T 340 20 T 470 50 L 500 50 L 500 100 L 0 100 Z"
                  fill="url(#chart-grad)"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="opacity-70"
                />
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2C2C2C" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-2 left-4 text-[10px] font-mono text-[#6A6A6A]">LEDGER_LOAD: ACTIVE</div>
              <div className="absolute top-2 right-4 text-[9px] sm:text-xs text-[#1B5E20] flex items-center bg-[#C8E6C9] px-2.5 py-0.5 border border-[#1B5E20] rounded-full whitespace-nowrap">
                <span className="w-2 h-2 bg-[#1B5E20] rounded-full mr-1.5 animate-ping shrink-0" />
                <span className="hidden sm:inline">REGISTRY SYNCHRONIZATION ESTABLISHED</span>
                <span className="inline sm:hidden">REGISTRY SYNCED</span>
              </div>
            </div>
          </div>

          {/* Query filters */}
          <div className="sketch-card p-4 bg-[#FCF9F2] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="relative md:col-span-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2C2C2C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-11 pr-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/15 text-[#2C2C2C] font-marker"
                placeholder="Search details: student, college, branch, specs..."
              />
            </div>

            <div className="flex items-center space-x-2 md:col-span-3">
              <Filter className="w-4.5 h-4.5 text-[#2C2C2C] shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-sm px-3 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker"
              >
                <option value="ALL">All Project Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 md:col-span-3">
              <Tag className="w-4.5 h-4.5 text-[#2C2C2C] shrink-0" />
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full text-sm px-3 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker"
              >
                <option value="ALL">All Specializations</option>
                {uniqueBranches.filter(b => b !== "ALL").map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ledger sheet table */}
          <div className="sketch-card bg-white overflow-hidden shadow-lg border-3 border-[#2C2C2C]">
            {ordersLoading ? (
              <div className="p-20 flex justify-center items-center">
                <span className="w-8 h-8 border-4 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-20 text-center text-[#6A6A6A] flex flex-col items-center">
                <AlertCircle className="w-12 h-12 mb-3 text-[#B71C1C] opacity-80" />
                <p className="text-base font-extrabold tracking-wider">NO MATCHING ENTRIES IN OFFICE LEDGER</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] border-b-2.5 border-[#2C2C2C] text-[#2C2C2C] uppercase tracking-wider text-[11px] font-extrabold">
                      <th className="p-4">STUDENT LEDGER DATA</th>
                      <th className="p-4">SPECIFICATIONS & SCOPE</th>
                      <th className="p-4">SCHEDULE DEADLINE</th>
                      <th className="p-4">PRICE BUDGET</th>
                      <th className="p-4">WORKFLOW</th>
                      <th className="p-4 text-center">COORDINATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[#2C2C2C]/10 text-sm font-semibold text-[#2C2C2C]">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#FAF6EE]/55 transition-colors">
                        <td className="p-4 space-y-1.5 max-w-[200px]">
                          <div className="font-extrabold text-[#2C2C2C] flex items-center">
                            <User className="w-4 h-4 mr-1 text-[#6A6A6A]" />
                            {order.fullName}
                          </div>
                          <div className="text-xs text-[#6A6A6A] flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-[#6A6A6A]" />
                            {order.collegeName}
                          </div>
                          <div className="text-[11px] text-[#6A6A6A]">
                            {order.branch} ({order.year || "N/A"})
                          </div>
                        </td>
                        <td className="p-4 space-y-1.5 max-w-[280px]">
                          <div className="font-extrabold text-[#2C2C2C] leading-tight">
                            {order.projectTitle}
                          </div>
                          <div className="inline-block bg-[#FAF6EE] text-[#2C2C2C] px-2.5 py-0.5 rounded-lg border-1.5 border-[#2C2C2C] text-xs">
                            {order.techRequired}
                          </div>
                          {order.description && (
                            <p className="text-xs text-[#6A6A6A] truncate max-w-[260px]" title={order.description}>
                              {order.description}
                            </p>
                          )}
                        </td>
                        <td className="p-4 space-y-2">
                          <div className="font-extrabold text-[#2C2C2C] flex items-center">
                            <Clock className="w-4.5 h-4.5 mr-1.5 stroke-2" />
                            {order.deadline}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {order.needPPT && (
                              <span className="bg-[#E1BEE7] border border-[#2C2C2C] px-1.5 py-0.5 rounded text-[10px] font-bold">PPT</span>
                            )}
                            {order.needReport && (
                              <span className="bg-[#BBDEFB] border border-[#2C2C2C] px-1.5 py-0.5 rounded text-[10px] font-bold">Report</span>
                            )}
                            {order.needVivaGuidance && (
                              <span className="bg-[#FFCDD2] border border-[#2C2C2C] px-1.5 py-0.5 rounded text-[10px] font-bold">Viva</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-black text-[#2C2C2C] text-base">
                            ₹{order.budget}
                          </div>
                          <div className="mt-1.5">
                            <select
                              value={order.paymentStatus || "Unpaid"}
                              onChange={(e) => handleUpdatePayment(order.id, e.target.value)}
                              className={`text-xs font-bold px-2 py-1 rounded-lg border-2 border-[#2C2C2C] focus:outline-none cursor-pointer shadow-[1px_1.5px_0_#2C2C2C] ${
                                order.paymentStatus === "Paid"
                                  ? "bg-[#C8E6C9]"
                                  : order.paymentStatus === "Partial"
                                  ? "bg-[#FFE082]"
                                  : "bg-[#FFCDD2]"
                              }`}
                            >
                              <option value="Unpaid">Unpaid</option>
                              <option value="Partial">Partial</option>
                              <option value="Paid">Paid</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.projectStatus || "Pending"}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border-2 border-[#2C2C2C] focus:outline-none cursor-pointer shadow-[1px_1.5px_0_#2C2C2C] ${
                              order.projectStatus === "Delivered"
                                ? "bg-[#C8E6C9]"
                                : order.projectStatus === "In Progress"
                                ? "bg-[#BBDEFB]"
                                : "bg-[#FFE082]"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <a
                              href={`https://wa.me/919028833275?text=Hello%20${encodeURIComponent(order.fullName)}%2C%20regarding%20your%20project%20order%20"${encodeURIComponent(order.projectTitle)}"...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl border-2 border-[#2C2C2C] bg-[#C8E6C9] hover:bg-[#A5D6A7] text-[#2C2C2C] transition-all shadow-[1.5px_2px_0_#2C2C2C]"
                              title="Contact WhatsApp"
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.462 3.473 1.336 4.988L2 22l5.176-1.359a9.924 9.924 0 004.836 1.247h.005c5.502 0 9.983-4.482 9.983-9.988 0-2.662-1.036-5.163-2.92-7.051C17.195 3.038 14.69 2 12.012 2zm4.566 12.092c-.25-.124-1.477-.729-1.705-.811-.228-.083-.393-.124-.559.124-.166.249-.642.811-.787.977-.145.166-.29.186-.54.062-.25-.124-1.055-.389-2.01-1.242-.743-.662-1.245-1.48-1.39-1.73-.145-.25-.015-.385.11-.509.112-.112.25-.29.375-.436.124-.145.166-.25.25-.415.083-.166.042-.311-.02-.436-.063-.124-.559-1.349-.766-1.848-.201-.483-.404-.418-.559-.426-.145-.008-.31-.008-.476-.008a.916.916 0 00-.663.311c-.228.249-.871.851-.871 2.076 0 1.225.892 2.41 1.016 2.576.125.166 1.756 2.682 4.254 3.757.595.256 1.059.409 1.422.525.597.19 1.14.163 1.57.099.479-.071 1.477-.602 1.684-1.183.208-.582.208-1.08.146-1.183-.063-.105-.229-.166-.479-.29z" />
                              </svg>
                            </a>
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="p-2 rounded-xl border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] transition-all shadow-[1.5px_2px_0_#2C2C2C]"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "inbox" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] mt-2">
          {/* Left panel: Chat sessions list */}
          <div className="lg:col-span-4 bg-white border-3 border-[#2C2C2C] rounded-2xl p-4 shadow-[4px_5px_0_#2C2C2C] flex flex-col h-full overflow-hidden">
            <h3 className="text-lg font-marker font-extrabold mb-3 pb-2 border-b-2 border-[#2C2C2C]/10 flex justify-between items-center text-[#2C2C2C]">
              <span>Active Chats</span>
              <button 
                onClick={fetchChats}
                className="p-2.5 rounded-xl border-2 border-[#2C2C2C] bg-white hover:bg-[#FAF6EE] text-[#2C2C2C] shadow-[1.5px_1.5px_0_#2C2C2C]"
                title="Refresh Chats"
              >
                <RefreshCw size={12} className={inboxLoading ? "animate-spin" : ""} />
              </button>
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {inboxLoading ? (
                <div className="py-20 text-center">
                  <span className="w-6 h-6 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin inline-block"></span>
                </div>
              ) : chats.length === 0 ? (
                <p className="text-center text-xs text-gray-500 py-10">No discussions logged.</p>
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

          {/* Right panel: Chat messages and reply panel */}
          <div className="lg:col-span-8 bg-white border-3 border-[#2C2C2C] rounded-2xl shadow-[4px_5px_0_#2C2C2C] flex flex-col h-full overflow-hidden">
            {selectedSessionId ? (
              (() => {
                const session = chats.find(c => c.id === selectedSessionId);
                const isWhatsApp = session?.session_type === "whatsapp" || session?.sessionType === "whatsapp";
                const isManual = session?.status === "Manual Intervention";
                
                return (
                  <>
                    {/* Chat Detail Header */}
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

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCF9F2]/30 notebook-ruled flex flex-col">
                      {messagesLoading && chatMessages.length === 0 ? (
                        <div className="py-20 text-center m-auto">
                          <span className="w-8 h-8 border-4 border-[#2C2C2C] border-t-transparent rounded-full animate-spin inline-block"></span>
                        </div>
                      ) : chatMessages.length === 0 ? (
                        <div className="text-center text-xs text-gray-500 py-20 m-auto">No messages logged in this discussion.</div>
                      ) : (
                        chatMessages.map((m) => {
                          const isAdmin = m.sender === "admin";
                          const isBot = m.sender === "bot";
                          return (
                            <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[80%] rounded-xl p-2.5 text-xs border border-[#2C2C2C] shadow-[1px_1.5px_0_#2C2C2C] ${
                                isAdmin 
                                  ? "bg-[#FFF59D] text-[#2C2C2C] rounded-tr-none font-sans" 
                                  : isBot
                                  ? "bg-white text-[#6A6A6A] rounded-tl-none italic font-sans"
                                  : "bg-[#E1F5FE] text-[#2C2C2C] rounded-tl-none font-sans"
                              }`}>
                                <span className="font-marker font-bold block text-[8px] uppercase tracking-wider text-[#6A6A6A] mb-0.5">
                                  {isAdmin ? "Coordinator" : isBot ? "AI Agent" : "Student"}
                                </span>
                                <p className="font-semibold text-xs leading-relaxed whitespace-pre-wrap">{m.message_text || m.messageText}</p>
                                <span className="text-[7px] text-[#8A8A8A] block text-right mt-1 font-mono">
                                  {new Date(m.created_at || m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Admin Message Reply panel */}
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
                            className="text-[9px] bg-white hover:bg-[#FFF9C4] text-[#2C2C2C] px-2 py-0.5 border border-[#2C2C2C] rounded-full shadow-[1px_1px_0_#2C2C2C] transition-all cursor-pointer font-bold"
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
                <h4 className="font-marker font-extrabold text-sm text-gray-500">NO CHAT SELECTED</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs leading-normal">Select a student discussion from the left panel to review or manually message.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "customize" && (
        <div className="space-y-8 animate-fade-in">
          {/* Top action header */}
          <div className="sketch-card p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 border-3 border-[#2C2C2C]">
            <div>
              <h3 className="text-xl font-hand font-extrabold text-[#2C2C2C]">
                🎨 DRAFT & PUBLISH LIVE WEBSITE LAYOUTS
              </h3>
              <p className="text-xs text-[#6A6A6A] font-marker mt-1">
                Modify title copy, catalog directories, student reviews, and FAQs dynamically. Click Publish to persist modifications.
              </p>
            </div>
            
            <button
              onClick={handleSaveSiteSettings}
              disabled={saveLoading || settingsLoading || !siteSettings}
              className="inline-flex items-center px-6 py-3 font-marker font-bold tracking-widest text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-xl shadow-[3px_4px_0_#2C2C2C] active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {saveLoading ? (
                <span className="w-5 h-5 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "PUBLISH DRAFT TO LIVE SITE"
              )}
            </button>
          </div>

          {settingsLoading ? (
            <div className="sketch-card bg-white p-20 flex justify-center items-center border-3 border-[#2C2C2C]">
              <span className="w-8 h-8 border-4 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : !siteSettings ? (
            <div className="sketch-card bg-white p-20 text-center border-3 border-[#2C2C2C] text-[#6A6A6A]">
              <p>Failed to sync website draft schema registry.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
              
              {/* Left Column: Core Sections (Hero, Contact, Assurances, Features) */}
              <div className="lg:col-span-6 space-y-8">
                
                {/* 1. HERO SECTION EDIT */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <h4 className="text-lg font-hand font-extrabold border-b-2 border-[#2C2C2C]/10 pb-2 text-[#3F51B5] uppercase">
                    1. Hero Section Content
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Left Word 1</label>
                      <input 
                        type="text" 
                        value={siteSettings.hero.titleYour || ""} 
                        onChange={(e) => updateHeroField("titleYour", e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                        placeholder="e.g. Your"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Left Word 2</label>
                      <input 
                        type="text" 
                        value={siteSettings.hero.titleOur || ""} 
                        onChange={(e) => updateHeroField("titleOur", e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                        placeholder="e.g. Our"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Right Word 1 (roject)</label>
                      <input 
                        type="text" 
                        value={siteSettings.hero.titleProject || ""} 
                        onChange={(e) => updateHeroField("titleProject", e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                        placeholder="e.g. roject"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Right Word 2 (assion)</label>
                      <input 
                        type="text" 
                        value={siteSettings.hero.titlePassion || ""} 
                        onChange={(e) => updateHeroField("titlePassion", e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                        placeholder="e.g. assion"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Badge Tagline Subtext</label>
                    <input 
                      type="text" 
                      value={siteSettings.hero.tagline || ""} 
                      onChange={(e) => updateHeroField("tagline", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                      placeholder="e.g. SIMPLE PROJECTS. SMART SOLUTIONS."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Description Paragraph</label>
                    <textarea 
                      rows={4}
                      value={siteSettings.hero.description || ""} 
                      onChange={(e) => updateHeroField("description", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                      placeholder="Describe what Shubdeep Labs does..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">WhatsApp Chat Discussion Seed Text</label>
                    <input 
                      type="text" 
                      value={siteSettings.hero.whatsappText || ""} 
                      onChange={(e) => updateHeroField("whatsappText", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                      placeholder="Seed message students send when tapping WhatsApp Hero button..."
                    />
                  </div>
                </div>

                {/* 2. CORE CONTACT DETAILS */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <h4 className="text-lg font-hand font-extrabold border-b-2 border-[#2C2C2C]/10 pb-2 text-[#CE93D8] uppercase">
                    2. Primary Contact Details
                  </h4>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Desk Mobile Number</label>
                    <input 
                      type="text" 
                      value={siteSettings.contact.phone || ""} 
                      onChange={(e) => updateContactField("phone", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                      placeholder="e.g. +91 90288 33275"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Desk Office Email</label>
                    <input 
                      type="email" 
                      value={siteSettings.contact.email || ""} 
                      onChange={(e) => updateContactField("email", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                      placeholder="e.g. shubdeeplabs@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Desk Office Address Location</label>
                    <input 
                      type="text" 
                      value={siteSettings.contact.address || ""} 
                      onChange={(e) => updateContactField("address", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                      placeholder="e.g. Solapur, Maharashtra"
                    />
                  </div>
                </div>

                {/* 3. ASSURANCES CHECKLIST */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#2C2C2C]/10 pb-2">
                    <h4 className="text-lg font-hand font-extrabold text-[#66BB6A] uppercase">
                      3. Student Assurances List
                    </h4>
                    <button 
                      onClick={addAssurance}
                      className="text-[10px] bg-[#C8E6C9] hover:bg-[#A5D6A7] border-2 border-[#2C2C2C] px-3 py-1 rounded-lg font-bold font-marker"
                    >
                      + Add Check
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {siteSettings.hero.assurances?.map((ass, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={ass} 
                          onChange={(e) => updateAssurance(index, e.target.value)}
                          className="flex-1 text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                          placeholder="e.g. ✓ 100% Original Work"
                        />
                        <button 
                          onClick={() => deleteAssurance(index)}
                          className="p-2.5 text-xs font-bold border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-lg transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. FEATURE CARDS */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <h4 className="text-lg font-hand font-extrabold border-b-2 border-[#2C2C2C]/10 pb-2 text-[#FFA726] uppercase">
                    4. Core Features Checklist
                  </h4>
                  
                  <div className="space-y-6">
                    {siteSettings.features?.map((feat, index) => (
                      <div key={index} className="p-4 bg-[#FAF6EE]/30 border-2 border-dashed border-[#2C2C2C]/20 rounded-xl space-y-3">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Feature Title</label>
                            <input 
                              type="text" 
                              value={feat.title || ""} 
                              onChange={(e) => updateFeature(index, "title", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                          <div className="w-24">
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Icon Name</label>
                            <input 
                              type="text" 
                              value={feat.icon || ""} 
                              onChange={(e) => updateFeature(index, "icon", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                              placeholder="e.g. Code"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Description Paragraph</label>
                          <textarea 
                            rows={2}
                            value={feat.desc || ""} 
                            onChange={(e) => updateFeature(index, "desc", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Advanced Sections (Categories, Blueprints, Testimonials, FAQs) */}
              <div className="lg:col-span-6 space-y-8">
                
                {/* 5. ACADEMIC DIRECTORIES / CATEGORIES */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#2C2C2C]/10 pb-2">
                    <h4 className="text-lg font-hand font-extrabold text-[#42A5F5] uppercase">
                      5. Syllabus Study Areas
                    </h4>
                    <button 
                      onClick={addCategory}
                      className="text-[10px] bg-[#E1F5FE] hover:bg-[#B3E5FC] border-2 border-[#2C2C2C] px-2 py-1 rounded-lg font-bold font-marker"
                    >
                      + Add Area
                    </button>
                  </div>

                  <div className="space-y-6">
                    {siteSettings.categories?.map((cat, index) => (
                      <div key={index} className="p-4 bg-[#FCF9F2] border-2 border-[#2C2C2C] rounded-xl space-y-3 relative">
                        <button
                          onClick={() => deleteCategory(index)}
                          className="absolute top-2 right-2 p-1.5 text-[10px] font-bold border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-lg"
                          title="Delete area"
                        >
                          ✕
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Area Title</label>
                            <input 
                              type="text" 
                              value={cat.title || ""} 
                              onChange={(e) => updateCategory(index, "title", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Icon Name</label>
                            <input 
                              type="text" 
                              value={cat.icon || ""} 
                              onChange={(e) => updateCategory(index, "icon", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Route Href</label>
                            <input 
                              type="text" 
                              value={cat.href || ""} 
                              onChange={(e) => updateCategory(index, "href", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Card Border Class</label>
                            <input 
                              type="text" 
                              value={cat.border || ""} 
                              onChange={(e) => updateCategory(index, "border", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Description text</label>
                          <textarea 
                            rows={2}
                            value={cat.desc || ""} 
                            onChange={(e) => updateCategory(index, "desc", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. PORTFOLIO BLUEPRINTS */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#2C2C2C]/10 pb-2">
                    <h4 className="text-lg font-hand font-extrabold text-[#AB47BC] uppercase">
                      6. Showcase Blueprints
                    </h4>
                    <button 
                      onClick={addBlueprint}
                      className="text-[10px] bg-[#F3E5F5] hover:bg-[#E1BEE7] border-2 border-[#2C2C2C] px-2 py-1 rounded-lg font-bold font-marker"
                    >
                      + Add Project
                    </button>
                  </div>

                  <div className="space-y-6">
                    {siteSettings.portfolio?.map((proj, index) => (
                      <div key={index} className="p-4 bg-[#FCF9F2] border-2 border-[#2C2C2C] rounded-xl space-y-3 relative">
                        <button
                          onClick={() => deleteBlueprint(index)}
                          className="absolute top-2 right-2 p-1.5 text-[10px] font-bold border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-lg"
                          title="Delete blueprint"
                        >
                          ✕
                        </button>
                        
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Project Name</label>
                          <input 
                            type="text" 
                            value={proj.title || ""} 
                            onChange={(e) => updateBlueprint(index, "title", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Technology Specifications</label>
                            <input 
                              type="text" 
                              value={proj.tech || ""} 
                              onChange={(e) => updateBlueprint(index, "tech", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Marker Ribbon Color</label>
                            <input 
                              type="text" 
                              value={proj.markerColor || ""} 
                              onChange={(e) => updateBlueprint(index, "markerColor", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                              placeholder="e.g. marker-green, marker-blue"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Brief description</label>
                          <textarea 
                            rows={3}
                            value={proj.desc || ""} 
                            onChange={(e) => updateBlueprint(index, "desc", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. STUDENT REVIEWS / TESTIMONIALS */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#2C2C2C]/10 pb-2">
                    <h4 className="text-lg font-hand font-extrabold text-[#EF5350] uppercase">
                      7. Student Testimonial Sheets
                    </h4>
                    <button 
                      onClick={addTestimonial}
                      className="text-[10px] bg-[#FFEBEE] hover:bg-[#FFCDD2] border-2 border-[#2C2C2C] px-2 py-1 rounded-lg font-bold font-marker"
                    >
                      + Add Review
                    </button>
                  </div>

                  <div className="space-y-6">
                    {siteSettings.testimonials?.map((test, index) => (
                      <div key={index} className="p-4 bg-[#FCF9F2] border-2 border-[#2C2C2C] rounded-xl space-y-3 relative">
                        <button
                          onClick={() => deleteTestimonial(index)}
                          className="absolute top-2 right-2 p-1.5 text-[10px] font-bold border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-lg"
                          title="Delete review"
                        >
                          ✕
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Student Name</label>
                            <input 
                              type="text" 
                              value={test.name || ""} 
                              onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Academic Degree/Role</label>
                            <input 
                              type="text" 
                              value={test.role || ""} 
                              onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Avatar Image link (Unsplash or URL)</label>
                          <input 
                            type="text" 
                            value={test.avatar || ""} 
                            onChange={(e) => updateTestimonial(index, "avatar", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Feedback Review copy</label>
                          <textarea 
                            rows={3}
                            value={test.review || ""} 
                            onChange={(e) => updateTestimonial(index, "review", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 8. FAQ ACCORDIONS */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#2C2C2C]/10 pb-2">
                    <h4 className="text-lg font-hand font-extrabold text-[#795548] uppercase">
                      8. Common Doubts (FAQs)
                    </h4>
                    <button 
                      onClick={addFAQ}
                      className="text-[10px] bg-[#EFEBE9] hover:bg-[#D7CCC8] border-2 border-[#2C2C2C] px-2 py-1 rounded-lg font-bold font-marker"
                    >
                      + Add FAQ
                    </button>
                  </div>

                  <div className="space-y-6">
                    {siteSettings.faqs?.map((faq, index) => (
                      <div key={index} className="p-4 bg-[#FCF9F2] border-2 border-[#2C2C2C] rounded-xl space-y-3 relative">
                        <button
                          onClick={() => deleteFAQ(index)}
                          className="absolute top-2 right-2 p-1.5 text-[10px] font-bold border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-lg"
                          title="Delete FAQ"
                        >
                          ✕
                        </button>
                        
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Question Title</label>
                          <input 
                            type="text" 
                            value={faq.q || ""} 
                            onChange={(e) => updateFAQ(index, "q", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Answer text explanation</label>
                          <textarea 
                            rows={3}
                            value={faq.a || ""} 
                            onChange={(e) => updateFAQ(index, "a", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Bottom actions header */}
          <div className="sketch-card p-6 bg-white flex items-center justify-between border-3 border-[#2C2C2C] mt-8">
            <span className="text-xs font-bold font-marker text-[#6A6A6A]">Verify all segments before publishing draft.</span>
            <button
              onClick={handleSaveSiteSettings}
              disabled={saveLoading || settingsLoading || !siteSettings}
              className="inline-flex items-center px-6 py-3 font-marker font-bold tracking-widest text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-xl shadow-[3px_4px_0_#2C2C2C] active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {saveLoading ? (
                <span className="w-5 h-5 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "PUBLISH DRAFT TO LIVE SITE"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Custom Hand-Drawn Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-[#2C2C2C]/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-sm sketch-border bg-[#FCF9F2] p-6 shadow-[5px_6px_0px_#2C2C2C] relative overflow-hidden notebook-ruled">
            <div className="spiral-binder" />
            <div className="pl-6 sm:pl-10 space-y-5 text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#FFCDD2] border-2 border-[#2C2C2C] text-[#B71C1C] flex items-center justify-center mx-auto shadow-[2px_2.5px_0_#2C2C2C] rotate-[-5deg] animate-sketch-float">
                <AlertCircle className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-hand font-extrabold text-[#2C2C2C] tracking-wide uppercase underline decoration-2 decoration-[#EF9A9A]">
                Confirm Action
              </h3>
              
              <p className="text-sm font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                {confirmModal.message}
              </p>
              
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={() => {
                    setConfirmModal({ isOpen: false, message: "", onConfirm: null });
                  }}
                  className="px-4 py-2 text-xs font-bold font-marker border-2 border-[#2C2C2C] bg-white hover:bg-[#FAF6EE] text-[#2C2C2C] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (confirmModal.onConfirm) {
                      await confirmModal.onConfirm();
                    }
                    setConfirmModal({ isOpen: false, message: "", onConfirm: null });
                  }}
                  className="px-4 py-2 text-xs font-bold font-marker border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
