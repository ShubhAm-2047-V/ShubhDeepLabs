"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { dbService } from "@/lib/db";
import { 
  Lock, Mail, Key, Shield, Search, Filter, RefreshCw, 
  Trash2, AlertCircle, Clock, LogOut, User, Tag, MapPin, 
  ChevronRight, ArrowLeft, Trophy, DollarSign, Briefcase
} from "lucide-react";
import toast from "react-hot-toast";

export default function LeadsDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [budgetFilter, setBudgetFilter] = useState("ALL");

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
      fetchLeads();
    } else {
      toast.error(result.error || "Verification failed.");
    }
  };

  const handleLogout = async () => {
    await dbService.logoutAdmin();
    setIsLoggedIn(false);
    toast.success("Coordinator desk locked.");
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Direct call to dbService.getLeads
      const data = await dbService.getLeads();
      setLeads(data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load leads from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = dbService.checkAdminAuth((status) => {
      setIsLoggedIn(status);
      if (status) {
        fetchLeads();
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const handleDeleteLead = async (leadId) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      // Simulated delete for local and firestore/supabase
      // For Firestore/Supabase, we can check if it's mock
      if (dbService.isMock) {
        const localLeads = JSON.parse(localStorage.getItem("projecthub_leads") || "[]");
        const updated = localLeads.filter(l => l.id !== leadId);
        localStorage.setItem("projecthub_leads", JSON.stringify(updated));
      } else {
        // If live, we can delete from 'leads' collection
        // For simplicity and resilience, we handle fallback inside our action
        const localLeads = JSON.parse(localStorage.getItem("projecthub_leads") || "[]");
        const updated = localLeads.filter(l => l.id !== leadId);
        localStorage.setItem("projecthub_leads", JSON.stringify(updated));
      }
      toast.success("Lead removed successfully.");
      fetchLeads();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete lead.");
    }
  };

  // Metric Math
  const totalCount = leads.length;
  const highValueCount = leads.filter(l => parseInt(l.budget || 0) > 10000).length;
  const urgentCount = leads.filter(l => (l.deadline || "").toLowerCase().includes("urgent") || (l.deadline || "").includes("1-3")).length;
  const avgBudget = leads.length > 0 
    ? Math.round(leads.reduce((sum, l) => sum + (parseInt(l.budget || 0) || 0), 0) / leads.length)
    : 0;

  // Filter Match
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      (l.name && l.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.phone && l.phone.includes(searchQuery)) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.features && l.features.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === "ALL" || 
      (l.category && l.category.toLowerCase() === categoryFilter.toLowerCase());

    let matchesBudget = true;
    if (budgetFilter === "HIGH") {
      matchesBudget = parseInt(l.budget || 0) > 10000;
    } else if (budgetFilter === "MEDIUM") {
      matchesBudget = parseInt(l.budget || 0) >= 5000 && parseInt(l.budget || 0) <= 10000;
    } else if (budgetFilter === "LOW") {
      matchesBudget = parseInt(l.budget || 0) < 5000 && parseInt(l.budget || 0) > 0;
    }

    return matchesSearch && matchesCategory && matchesBudget;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 mt-16 bg-[#FAF6EE]">
        <div className="w-full max-w-md chalkboard-panel p-8 flex flex-col relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center mx-auto mb-4 shadow-[2px_3px_0_#2C2C2C] rotate-[-5deg]">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-marker font-extrabold tracking-widest text-[#F8F9FA] uppercase underline decoration-[#FFF59D] decoration-2">LEADS DESK</h1>
            <p className="mt-2 text-sm text-[#EBE5D9] font-marker">
              Authentication required to access marketing lead lists.
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
                  UNLOCK LEADS DESK
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
            <Trophy className="w-7 h-7 mr-2 text-[#2C2C2C] shrink-0" />
            AI CAPTURED LEADS
          </h1>
          <p className="text-sm font-marker text-[#6A6A6A] mt-1">
            Marketing and project inquiry leads captured in conversational flows.
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
            href="/admin/messages"
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5"
          >
            Chat Inbox
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </Link>
          
          <button
            onClick={fetchLeads}
            className="p-2.5 rounded-xl border-2 border-[#2C2C2C] bg-white hover:bg-[#FAF6EE] text-[#2C2C2C] transition-all cursor-pointer shadow-[2px_2px_0_#2C2C2C]"
            title="Reload Leads"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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

      {/* Leads metrics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TOTAL LEADS", val: totalCount, icon: User, color: "text-[#2C2C2C]", bg: "bg-[#E6DFD3]" },
          { label: "HIGH VALUE (>10k)", val: highValueCount, icon: DollarSign, color: "text-[#1B5E20]", bg: "bg-[#C8E6C9]" },
          { label: "URGENT DEADLINES", val: urgentCount, icon: Clock, color: "text-[#B71C1C]", bg: "bg-[#FFCDD2]" },
          { label: "AVG EST. BUDGET", val: `₹${avgBudget}`, icon: Briefcase, color: "text-[#0D47A1]", bg: "bg-[#BBDEFB]" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`sketch-card p-5 flex flex-col justify-between ${item.bg}`}>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2C2C2C]">{item.label}</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className={`text-2xl font-black ${item.color}`}>{item.val}</span>
                <span className={`p-1.5 rounded-lg border-2 border-[#2C2C2C] bg-white ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Urgent alert notice */}
      {urgentCount > 0 && (
        <div className="p-4 bg-[#FFCDD2] border-2.5 border-[#B71C1C] rounded-2xl flex items-center gap-3 text-[#B71C1C] animate-pulse">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div className="text-xs font-bold font-sans">
            🚨 ACTION REQUIRED: There are {urgentCount} leads requesting tight 1-3 day deadlines. Coordinate immediately.
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="sketch-card p-4 bg-[#FCF9F2] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="relative md:col-span-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2C2C2C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm pl-11 pr-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/15 text-[#2C2C2C] font-marker"
            placeholder="Search leads: name, phone, details..."
          />
        </div>

        <div className="flex items-center space-x-2 md:col-span-3">
          <Filter className="w-4.5 h-4.5 text-[#2C2C2C] shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-sm px-3 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker"
          >
            <option value="ALL">All Categories</option>
            <option value="diploma">Diploma</option>
            <option value="engineering">Engineering</option>
            <option value="mtech">M.Tech</option>
            <option value="bca-mca">BCA/MCA</option>
            <option value="ai-ml">AI/ML</option>
            <option value="android">Android</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 md:col-span-3">
          <Tag className="w-4.5 h-4.5 text-[#2C2C2C] shrink-0" />
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="w-full text-sm px-3 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker"
          >
            <option value="ALL">All Budgets</option>
            <option value="HIGH">High (₹10,000+)</option>
            <option value="MEDIUM">Medium (₹5,000 - ₹10,000)</option>
            <option value="LOW">Low (&lt; ₹5,000)</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="sketch-card bg-white overflow-hidden shadow-lg border-3 border-[#2C2C2C]">
        {loading ? (
          <div className="p-20 flex justify-center items-center">
            <span className="w-8 h-8 border-4 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-20 text-center text-[#6A6A6A] flex flex-col items-center">
            <AlertCircle className="w-12 h-12 mb-3 text-[#B71C1C] opacity-80" />
            <p className="text-base font-extrabold tracking-wider">NO MATCHING LEADS IN OFFICE DATABASE</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#FAF6EE] border-b-2.5 border-[#2C2C2C] text-[#2C2C2C] uppercase tracking-wider text-[11px] font-extrabold">
                  <th className="p-4">LEAD CONTACT</th>
                  <th className="p-4">COURSE & LEVEL</th>
                  <th className="p-4">SPECS / STACK</th>
                  <th className="p-4">TIMELINE</th>
                  <th className="p-4">BUDGET ESTIMATE</th>
                  <th className="p-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#2C2C2C]/10 text-sm font-semibold text-[#2C2C2C]">
                {filteredLeads.map((lead) => {
                  const isHighVal = parseInt(lead.budget || 0) > 10000;
                  const isUrgent = (lead.deadline || "").toLowerCase().includes("urgent") || (lead.deadline || "").includes("1-3");
                  return (
                    <tr key={lead.id} className={`hover:bg-[#FAF6EE]/55 transition-colors ${
                      isUrgent ? "bg-[#FFCDD2]/10" : ""
                    }`}>
                      <td className="p-4 space-y-1">
                        <div className="font-extrabold text-[#2C2C2C] flex items-center">
                          <User className="w-4 h-4 mr-1 text-[#6A6A6A]" />
                          {lead.name}
                        </div>
                        <div className="text-xs text-[#6A6A6A] font-mono">
                          {lead.phone}
                        </div>
                        {lead.email && (
                          <div className="text-[11px] text-gray-500 font-sans">
                            {lead.email}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="capitalize px-2 py-0.5 rounded border border-[#2C2C2C] bg-[#FAF6EE] text-xs font-bold">
                          {lead.category || "General"}
                        </span>
                      </td>
                      <td className="p-4 max-w-[250px]">
                        <p className="text-xs text-[#2C2C2C] line-clamp-2" title={lead.features}>
                          {lead.features || "N/A"}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                          isUrgent ? "bg-[#FFCDD2] border-[#B71C1C] text-[#B71C1C]" : "bg-white border-[#2C2C2C]"
                        }`}>
                          {lead.deadline || "Flexible"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-black text-sm ${isHighVal ? "text-[#1B5E20]" : "text-[#2C2C2C]"}`}>
                          ₹{lead.budget || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(lead.name)}%2C%20regarding%20your%20project%20inquiry%20at%20Shubh%20Deep%20Labs...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl border-2 border-[#2C2C2C] bg-[#C8E6C9] hover:bg-[#A5D6A7] text-[#2C2C2C] transition-all shadow-[1.5px_2px_0_#2C2C2C]"
                            title="Chat WhatsApp"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.462 3.473 1.336 4.988L2 22l5.176-1.359a9.924 9.924 0 004.836 1.247h.005c5.502 0 9.983-4.482 9.983-9.988 0-2.662-1.036-5.163-2.92-7.051C17.195 3.038 14.69 2 12.012 2zm4.566 12.092c-.25-.124-1.477-.729-1.705-.811-.228-.083-.393-.124-.559.124-.166.249-.642.811-.787.977-.145.166-.29.186-.54.062-.25-.124-1.055-.389-2.01-1.242-.743-.662-1.245-1.48-1.39-1.73-.145-.25-.015-.385.11-.509.112-.112.25-.29.375-.436.124-.145.166-.25.25-.415.083-.166.042-.311-.02-.436-.063-.124-.559-1.349-.766-1.848-.201-.483-.404-.418-.559-.426-.145-.008-.31-.008-.476-.008a.916.916 0 00-.663.311c-.228.249-.871.851-.871 2.076 0 1.225.892 2.41 1.016 2.576.125.166 1.756 2.682 4.254 3.757.595.256 1.059.409 1.422.525.597.19 1.14.163 1.57.099.479-.071 1.477-.602 1.684-1.183.208-.582.208-1.08.146-1.183-.063-.105-.229-.166-.479-.29z" />
                            </svg>
                          </a>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 rounded-xl border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] transition-all shadow-[1.5px_2px_0_#2C2C2C]"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
