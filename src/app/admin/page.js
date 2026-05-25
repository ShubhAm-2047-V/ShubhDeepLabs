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

  useEffect(() => {
    const unsubscribe = dbService.checkAdminAuth((userStatus) => {
      setIsLoggedIn(userStatus);
      if (userStatus) {
        fetchOrders();
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

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

        <div className="flex items-center space-x-2.5">
          <Link
            href="/admin/offers"
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5"
          >
            Manage Offers
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
            {/* Sketchy outline paths */}
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
          <div className="absolute top-2 right-4 text-xs text-[#1B5E20] flex items-center bg-[#C8E6C9] px-2.5 py-0.5 border border-[#1B5E20] rounded-full">
            <span className="w-2 h-2 bg-[#1B5E20] rounded-full mr-1.5 animate-ping" />
            REGISTRY SYNCHRONIZATION ESTABLISHED
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
                    
                    {/* Client details */}
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

                    {/* Scope details */}
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

                    {/* Deadline details */}
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

                    {/* Financial details */}
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

                    {/* Workflow status */}
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

                    {/* Coordination details */}
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

    </div>
  );
}
