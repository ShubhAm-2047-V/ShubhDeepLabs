"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Wallet, ArrowLeft, PlusCircle, Trash2, Download, AlertCircle, 
  RefreshCw, Sparkles, Brain, CheckSquare, TrendingUp, TrendingDown,
  FileText
} from "lucide-react";

// Default seed transactions
const DEFAULT_EXPENSES = [
  { id: "exp-1", description: "Monthly Apartment Rent", amount: 8000, category: "Rent", type: "Expense", date: new Date().toLocaleDateString() },
  { id: "exp-2", description: "Software Developer Salary", amount: 25000, category: "Salary", type: "Income", date: new Date().toLocaleDateString() },
  { id: "exp-3", description: "Starbucks Coffee & Snacks", amount: 450, category: "Food", type: "Expense", date: new Date().toLocaleDateString() },
  { id: "exp-4", description: "Uber office commute", amount: 350, category: "Travel", type: "Expense", date: new Date().toLocaleDateString() }
];

export default function ExpenseTracker() {
  const [mounted, setMounted] = useState(false);
  
  // Database states
  const [transactions, setTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(15000);
  const [systemLogs, setSystemLogs] = useState([]);
  const [aiReport, setAiReport] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);
  
  // Session Token States
  const [tokenStatus, setTokenStatus] = useState("loading"); // loading, approved, expired, invalid
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // Form Fields
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState("Expense");

  const logsEndRef = useRef(null);

  // System Log helper
  const addSystemLog = (message, level = "info") => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSystemLogs(prev => [{ timestamp, level, message }, ...prev].slice(0, 50));
  };

  // Mount logic
  useEffect(() => {
    setMounted(true);

    const localExpiry = localStorage.getItem("shubdeep_demo_expiry");
    if (!localExpiry) {
      setTokenStatus("invalid");
      return;
    }

    const expiryTime = parseInt(localExpiry, 10);
    const remaining = expiryTime - Date.now();
    
    if (remaining > 0) {
      setTokenStatus("approved");
      setTimeLeft(Math.floor(remaining / 1000));
    } else {
      setTokenStatus("expired");
    }

    // Load Transactions
    const localTx = localStorage.getItem("shubdeep_expense_tx");
    if (localTx) {
      setTransactions(JSON.parse(localTx));
    } else {
      setTransactions(DEFAULT_EXPENSES);
      localStorage.setItem("shubdeep_expense_tx", JSON.stringify(DEFAULT_EXPENSES));
    }

    // Load Budget
    const localBudget = localStorage.getItem("shubdeep_expense_budget");
    if (localBudget) {
      setMonthlyBudget(parseInt(localBudget, 10));
    }

    addSystemLog("=======================================================", "info");
    addSystemLog("  Expense Insights Database Online (Offline SQLite Mock).", "info");
    addSystemLog("  Budget trackers & transaction logs loaded successfully.", "info");
    addSystemLog("=======================================================", "info");
  }, []);

  // Expiry Timer countdown
  useEffect(() => {
    if (tokenStatus !== "approved") return;

    const timer = setInterval(() => {
      const localExpiry = localStorage.getItem("shubdeep_demo_expiry");
      if (!localExpiry) {
        setTokenStatus("invalid");
        clearInterval(timer);
        return;
      }
      const expiryTime = parseInt(localExpiry, 10);
      const remaining = expiryTime - Date.now();

      if (remaining <= 0) {
        clearInterval(timer);
        setTokenStatus("expired");
        setTimeLeft(0);
        addSystemLog("[System] Demo Session Expired. System dashboard locked.", "warn");
      } else {
        setTimeLeft(Math.floor(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tokenStatus]);

  // Auto-category-tagging check
  const handleDescChange = (val) => {
    setDesc(val);
    const text = val.toLowerCase();
    
    // Keyword matching
    if (text.includes("pizza") || text.includes("burger") || text.includes("mcdonald") || text.includes("starbucks") || text.includes("food") || text.includes("cafe") || text.includes("lunch") || text.includes("dinner")) {
      setCategory("Food");
      setType("Expense");
    } else if (text.includes("uber") || text.includes("bus") || text.includes("fuel") || text.includes("ola") || text.includes("train") || text.includes("flight") || text.includes("travel") || text.includes("cab")) {
      setCategory("Travel");
      setType("Expense");
    } else if (text.includes("netflix") || text.includes("cinema") || text.includes("spotify") || text.includes("movie") || text.includes("game") || text.includes("show")) {
      setCategory("Entertainment");
      setType("Expense");
    } else if (text.includes("rent") || text.includes("apartment") || text.includes("pg") || text.includes("room") || text.includes("hostel")) {
      setCategory("Rent");
      setType("Expense");
    } else if (text.includes("salary") || text.includes("bonus") || text.includes("intern") || text.includes("dividend")) {
      setCategory("Salary");
      setType("Income");
    } else if (text.includes("light") || text.includes("electricity") || text.includes("water") || text.includes("wifi") || text.includes("gas") || text.includes("bill")) {
      setCategory("Utilities");
      setType("Expense");
    }
  };

  // Actions: Add Transaction
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!desc.trim() || !amount) {
      alert("Please enter description and amount.");
      return;
    }

    const newTx = {
      id: `exp-${Date.now()}`,
      description: desc.trim(),
      amount: parseFloat(amount),
      category: category,
      type: type,
      date: new Date().toLocaleDateString()
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem("shubdeep_expense_tx", JSON.stringify(updated));

    addSystemLog(`[DB Write] Added transaction: "${newTx.description}" (₹${newTx.amount}) as ${newTx.type}`, "success");
    
    // Reset Form
    setDesc("");
    setAmount("");
  };

  // Actions: Delete Transaction
  const handleDeleteTransaction = (id, description) => {
    if (!confirm(`Remove transaction entry for "${description}"?`)) return;
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem("shubdeep_expense_tx", JSON.stringify(updated));
    addSystemLog(`[DB Delete] Deleted transaction: "${description}"`, "warn");
  };

  // Actions: Update Budget Limit
  const handleBudgetChange = (val) => {
    const amt = parseInt(val, 10) || 0;
    setMonthlyBudget(amt);
    localStorage.setItem("shubdeep_expense_budget", amt.toString());
    addSystemLog(`[DB Update] Monthly budget limit updated to ₹${amt}`, "success");
  };

  // Actions: Get AI Insights Report
  const handleGetAiReport = async () => {
    setLoadingReport(true);
    setAiReport("");
    addSystemLog("[LLM Gate] Dispatching transaction logs to AI advisor...", "info");

    try {
      const response = await fetch("/api/expense-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expenses: transactions,
          monthlyBudget: monthlyBudget
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiReport(data.reply);
        
        // Append backend logs if returned
        if (data.logs) {
          data.logs.forEach(log => {
            addSystemLog(log.message, log.level);
          });
        }
      } else {
        addSystemLog("[LLM Gate Error] Failed to generate AI insights report.", "error");
        setAiReport("Failed to generate financial analysis. Check your backend console.");
      }
    } catch (err) {
      addSystemLog(`[LLM Gate Error] Handshake failed: ${err.message}`, "error");
      setAiReport("Failed to establish secure connection with AI service.");
    } finally {
      setLoadingReport(false);
    }
  };

  // Actions: Reset Data
  const handleResetData = () => {
    if (!confirm("Are you sure you want to reset all tracker records to seed defaults?")) return;
    setTransactions(DEFAULT_EXPENSES);
    setMonthlyBudget(15000);
    setAiReport("");
    localStorage.setItem("shubdeep_expense_tx", JSON.stringify(DEFAULT_EXPENSES));
    localStorage.setItem("shubdeep_expense_budget", "15000");
    addSystemLog("Cleared active data. Reloaded ledger collections.", "warn");
  };

  // Actions: Export CSV
  const handleExportCSV = () => {
    const csvContent = [
      ["Transaction ID", "Date", "Description", "Category", "Amount (INR)", "Type"],
      ...transactions.map(t => [t.id, t.date, t.description, t.category, t.amount, t.type])
    ]
      .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Expense_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addSystemLog("Exported spending ledger to local CSV spreadsheet.", "info");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Stats
  const totalSpent = transactions
    .filter(t => t.type === "Expense")
    .reduce((sum, current) => sum + current.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === "Income")
    .reduce((sum, current) => sum + current.amount, 0);

  const netBalance = totalIncome - totalSpent;

  // Categories breakdowns
  const categoryTotals = {};
  transactions.forEach(t => {
    if (t.type === "Expense") {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  const maxCategoryLimit = Math.max(...Object.values(categoryTotals), 1);

  // Budget progress checks
  const budgetRatio = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const budgetBarColor = budgetRatio > 100 ? "bg-red-500" : budgetRatio > 75 ? "bg-amber-500" : "bg-emerald-500";

  if (!mounted) return null;

  // Render Loading Token State
  if (tokenStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#070A13] text-[#94A3B8] flex items-center justify-center font-sans p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-2.5 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold">Verifying Secure Access Token...</p>
        </div>
      </div>
    );
  }

  // Render Expired Lock View
  if (tokenStatus !== "approved") {
    return (
      <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] flex items-center justify-center font-sans p-4">
        <div className="sketch-card bg-white p-8 max-w-md w-full text-center relative shadow-[6px_8px_0px_#2C2C2C] border-3 border-[#2C2C2C]">
          <div className="absolute top-3 left-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
          <div className="absolute top-3 right-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
          
          <div className="w-12 h-12 bg-red-100 border-2 border-[#2C2C2C] text-red-500 flex items-center justify-center rounded-xl mx-auto mb-5 shadow-[2px_2.5px_0_#2C2C2C]">
            <AlertCircle size={24} />
          </div>
          
          <h2 className="text-[#2C2C2C] text-2xl font-hand font-extrabold mb-3">
            {tokenStatus === "expired" ? "Demo Session Expired" : "Access Key Restricted"}
          </h2>
          
          <p className="text-xs font-marker text-[#5A5A5A] leading-relaxed mb-6">
            {tokenStatus === "expired" 
              ? "Your 5-minute preview session has elapsed. To request new access, click the 'Request Demo Output' button on our home page."
              : "Direct access to this workspace is restricted. Please go to the homepage and click 'Request Demo Output' to start a session."}
          </p>

          <Link
            href="/"
            className="btn-sketch w-full py-3 px-6 text-sm flex items-center justify-center"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] p-4 pt-20 md:pt-24 flex flex-col font-sans">
      
      {/* 1. HEADER CONTROL ROW */}
      <header className="sketch-card bg-white p-4 flex flex-col md:flex-row md:items-center justify-between shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] mb-5 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 border-2 border-[#2C2C2C] rounded-xl bg-white hover:bg-[#FFF9C4] transition-all text-[#2C2C2C] shadow-[1.5px_2px_0_#2C2C2C] flex items-center justify-center">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="bg-yellow-400 border-2 border-[#2C2C2C] p-2 rounded-xl shadow-[2px_2.5px_0_#2C2C2C]">
              <Wallet size={18} className="text-[#2C2C2C]" />
            </div>
            <div>
              <h1 className="text-[#2C2C2C] text-lg md:text-xl font-hand font-extrabold leading-none">Expense Tracker with AI Insights</h1>
              <p className="text-[10px] md:text-xs font-marker text-[#5A5A5A] mt-1">Transaction Ledger, Auto-Tagging & AI Saving Recommendation Desk</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 marker-red border-2 border-[#2C2C2C] rounded-xl text-[#2C2C2C] font-marker font-bold shadow-[2px_2.5px_0_#2C2C2C] animate-pulse">
            <span>⏱️ EXPIRES IN: {formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={handleResetData}
            className="btn-sketch py-1.5 px-3 text-xs flex items-center gap-1.5"
          >
            <RefreshCw size={12} />
            <span>Reset Database</span>
          </button>
        </div>
      </header>

      {/* 2. THREE-PANEL CORE GRID */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-grow min-h-0 mb-6">
        
        {/* PANEL A: TRANSACTION ENTRY (Left - 4 Cols) */}
        <section className="lg:col-span-4 sketch-card bg-white flex flex-col h-full shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] p-5">
          <h2 className="text-[#2C2C2C] text-lg font-hand font-extrabold mb-5 flex items-center gap-2 pb-2.5 border-b-2 border-dashed border-[#2C2C2C]/15">
            <PlusCircle size={18} className="text-yellow-500" />
            <span>Intake Desk</span>
          </h2>
          
          <div className="flex-grow space-y-6">
            {/* ADD TRANSACTION FORM */}
            <div className="bg-[#FFF9C4]/15 border-2 border-[#2C2C2C] p-4 rounded-xl shadow-[2px_3px_0_#2C2C2C]">
              <h3 className="text-xs font-marker font-extrabold text-yellow-600 mb-3 flex items-center gap-1.5 uppercase">
                <Wallet size={13} />
                <span>1. Log Transaction</span>
              </h3>
              <form onSubmit={handleAddTransaction} className="space-y-3">
                <div>
                  <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Description (supports Auto-Tag)</label>
                  <input
                    type="text"
                    required
                    value={desc}
                    onChange={(e) => handleDescChange(e.target.value)}
                    placeholder="e.g. Starbucks coffee, Uber ride, Salary"
                    className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="450"
                      className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                    >
                      <option value="Expense">Expense</option>
                      <option value="Income">Income</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                  >
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Salary">Salary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button type="submit" className="btn-sketch w-full py-2 text-xs flex items-center justify-center gap-1.5 bg-yellow-50 border-yellow-500 text-yellow-800 hover:bg-yellow-100">
                  <PlusCircle size={12} />
                  <span>Commit Log</span>
                </button>
              </form>
            </div>

            {/* SET BUDGET LIMIT LIMIT BOX */}
            <div className="bg-[#E1F5FE]/30 border-2 border-[#2C2C2C] p-4 rounded-xl shadow-[2px_3px_0_#2C2C2C]">
              <h3 className="text-xs font-marker font-extrabold text-[#0284C7] mb-3 flex items-center gap-1.5 uppercase">
                <CheckSquare size={13} />
                <span>2. Target Monthly Budget</span>
              </h3>
              <div>
                <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Monthly Budget Limit (₹)</label>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PANEL B: WORKSPACE MONITOR (Center - 5 Cols) */}
        <section className="lg:col-span-5 sketch-card bg-white flex flex-col h-full shadow-[5px_6px_0_#2C2C2C] border-3 border-[#2C2C2C] overflow-hidden">
          
          <div className="p-4 border-b-3 border-[#2C2C2C] bg-[#FAF6EE] flex items-center justify-between">
            <h2 className="text-[#2C2C2C] text-base font-hand font-extrabold flex items-center gap-1.5">
              <Sparkles size={16} className="text-yellow-500" />
              <span>Interactive Balance Sheet</span>
            </h2>
            <button 
              onClick={handleExportCSV}
              className="btn-sketch py-1 px-2.5 text-[10px] flex items-center gap-1"
            >
              <Download size={10} />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col p-4">
            
            {/* BUDGET PACING PROGRESS GAUGE */}
            <div className="border-2 border-[#2C2C2C] p-3 rounded-xl shadow-[2px_2.5px_0_#2C2C2C] bg-white mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-marker font-bold text-gray-500 uppercase">Budget Utilization Gauge</span>
                <span className="text-[10px] font-mono font-bold text-[#2C2C2C]">
                  ₹{totalSpent} Spent / ₹{monthlyBudget} Budget
                </span>
              </div>
              <div className="w-full h-3 border-2 border-[#2C2C2C] bg-slate-100 rounded-full overflow-hidden relative">
                <div 
                  className={`h-full border-r border-[#2C2C2C] ${budgetBarColor} transition-all duration-300`}
                  style={{ width: `${Math.min(budgetRatio, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[8px] font-mono text-gray-400">
                <span>0%</span>
                <span>{budgetRatio.toFixed(0)}% Utilized</span>
                <span>100%+</span>
              </div>
            </div>

            {/* TRANSACTIONS SCROLLABLE GRID */}
            <div className="flex-grow overflow-y-auto max-h-[350px] space-y-3 pr-1">
              {transactions.length === 0 ? (
                <p className="text-center text-xs text-gray-400 italic mt-20">No transactions recorded in this log.</p>
              ) : (
                transactions.map(tx => (
                  <div key={tx.id} className="border-2 border-[#2C2C2C] p-3 rounded-xl shadow-[2px_2.5px_0_#2C2C2C] bg-white flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="text-[#2C2C2C] font-extrabold text-sm flex items-center gap-1.5">
                        {tx.type === "Income" ? (
                          <TrendingUp size={14} className="text-emerald-500" />
                        ) : (
                          <TrendingDown size={14} className="text-red-500" />
                        )}
                        <span>{tx.description}</span>
                      </h4>
                      <div className="flex gap-2 text-[9px] font-mono text-gray-400">
                        <span>Tag: <span className="font-sans font-bold text-gray-700 bg-gray-100 border border-gray-200 px-1 rounded">{tx.category}</span></span>
                        <span>Date: {tx.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-hand font-black ${tx.type === "Income" ? "text-emerald-600" : "text-red-600"}`}>
                        {tx.type === "Income" ? "+" : "-"}₹{tx.amount}
                      </span>
                      <button 
                        onClick={() => handleDeleteTransaction(tx.id, tx.description)}
                        className="text-red-500 hover:text-red-700 p-1 border border-red-200 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* PANEL C: AI ADVISOR & LOGS (Right - 3 Cols) */}
        <section className="lg:col-span-4 sketch-card bg-white flex flex-col h-full shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] p-5">
          <h2 className="text-[#2C2C2C] text-lg font-hand font-extrabold mb-3 flex items-center gap-2 pb-2.5 border-b-2 border-dashed border-[#2C2C2C]/15">
            <Brain size={18} className="text-purple-500" />
            <span>AI Advisor</span>
          </h2>

          {/* AI Advisor Output Frame */}
          <div className="flex-1 overflow-y-auto max-h-[300px] border-2 border-[#2C2C2C] bg-[#FCF9F2] rounded-xl p-3.5 shadow-[1.5px_2px_0_#2C2C2C] mb-4">
            {loadingReport ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <div className="w-8 h-8 border-2.5 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-[11px] font-marker text-[#5A5A5A]">Gemini compiling cost-cutting reports...</p>
              </div>
            ) : aiReport ? (
              <div className="text-xs font-sans leading-relaxed text-[#2C2C2C] markdown-body space-y-2">
                {aiReport.split("\n").map((line, idx) => {
                  if (line.startsWith("##")) {
                    return <h3 key={idx} className="font-hand font-black text-sm text-purple-800 mt-2 mb-1">{line.replace("##", "")}</h3>;
                  }
                  if (line.startsWith("###")) {
                    return <h4 key={idx} className="font-marker font-extrabold text-xs text-[#2C2C2C] mt-2 mb-1">{line.replace("###", "")}</h4>;
                  }
                  if (line.startsWith("*")) {
                    return <p key={idx} className="font-sans font-semibold text-[#5A5A5A] pl-2">{line}</p>;
                  }
                  return <p key={idx} className="font-sans font-semibold">{line}</p>;
                })}
              </div>
            ) : (
              <div className="text-center text-xs text-gray-400 italic py-16">
                Click the recommendation button below to generate a Gemini AI report.
              </div>
            )}
          </div>

          <button
            onClick={handleGetAiReport}
            disabled={loadingReport || transactions.length === 0}
            className="btn-sketch w-full py-2.5 text-xs flex items-center justify-center gap-1.5 mb-4"
          >
            <Sparkles size={13} className="text-yellow-600" />
            <span>Generate AI Report</span>
          </button>

          {/* Quick Metrics & Logs Console */}
          <div className="space-y-3 mt-auto">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-600 bg-slate-50 p-2 rounded-xl border border-gray-200">
              <div className="flex justify-between"><span>Income:</span> <span className="font-sans font-bold text-emerald-600">₹{totalIncome}</span></div>
              <div className="flex justify-between"><span>Expenses:</span> <span className="font-sans font-bold text-red-600">₹{totalSpent}</span></div>
            </div>

            {/* Retro logs Console */}
            <div className="border-2 border-[#2C2C2C] bg-slate-900 text-[#10B981] font-mono text-[9px] p-2.5 rounded-xl flex flex-col h-[100px] overflow-hidden">
              <span className="block text-[8px] text-[#94A3B8] font-bold border-b border-[#334155] mb-1 pb-0.5 select-none">Real-Time Console Monitor</span>
              <div className="flex-1 overflow-y-auto space-y-0.5 flex flex-col-reverse max-h-[80px]">
                {systemLogs.map((log, idx) => (
                  <p key={idx} className={log.level === "error" ? "text-red-400" : log.level === "warn" ? "text-yellow-400" : log.level === "success" ? "text-emerald-400" : "text-slate-300"}>
                    [{log.timestamp}] {log.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
