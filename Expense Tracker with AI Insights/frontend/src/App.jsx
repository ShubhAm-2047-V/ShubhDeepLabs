import { useState, useEffect, useRef } from "react";
import { 
  Wallet, ArrowLeft, PlusCircle, Trash2, Download, AlertCircle, 
  RefreshCw, Sparkles, Brain, CheckSquare, TrendingUp, TrendingDown
} from "lucide-react";

export default function App() {
  const [backendUrl] = useState("http://localhost:5000");
  const [mounted, setMounted] = useState(false);
  
  // Database states
  const [transactions, setTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(15000);
  const [systemLogs, setSystemLogs] = useState([]);
  const [aiReport, setAiReport] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [logsConnected, setLogsConnected] = useState(false);

  // Session Expiry Simulation (5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Form Fields
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState("Expense");

  const terminalBottomRef = useRef(null);

  // Fetch initial database items
  const fetchData = async () => {
    try {
      const txRes = await fetch(`${backendUrl}/api/transactions`);
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
        setBackendOnline(true);
      }

      const budgetRes = await fetch(`${backendUrl}/api/budget`);
      if (budgetRes.ok) {
        const budgetData = await budgetRes.json();
        setMonthlyBudget(budgetData.limit);
      }
    } catch (e) {
      console.error("Backend offline:", e);
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();

    // Setup SSE EventSource stream listener for real-time logs
    const eventSource = new EventSource(`${backendUrl}/api/logs`);
    
    eventSource.onopen = () => {
      setLogsConnected(true);
      setBackendOnline(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const logEntry = JSON.parse(event.data);
        setSystemLogs((prev) => [logEntry, ...prev].slice(0, 50));
      } catch (err) {
        console.error("Failed to parse log event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Logs SSE event stream error:", err);
      setLogsConnected(false);
      eventSource.close();
    };

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setSessionExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      eventSource.close();
      clearInterval(timer);
    };
  }, []);

  // Auto scroll logs
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollTop = terminalBottomRef.current.scrollHeight;
    }
  }, [systemLogs]);

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
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!desc.trim() || !amount) {
      alert("Please enter description and amount.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: desc.trim(),
          amount: parseFloat(amount),
          category: category,
          type: type
        })
      });

      if (response.ok) {
        setDesc("");
        setAmount("");
        fetchData();
      }
    } catch (err) {
      alert("Failed to submit transaction.");
    }
  };

  // Actions: Delete Transaction
  const handleDeleteTransaction = async (id, description) => {
    if (!confirm(`Remove transaction entry for "${description}"?`)) return;
    try {
      const response = await fetch(`${backendUrl}/api/transactions/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Actions: Update Budget Limit
  const handleBudgetChange = async (val) => {
    const amt = parseInt(val, 10) || 0;
    setMonthlyBudget(amt);

    try {
      await fetch(`${backendUrl}/api/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: amt })
      });
      fetchData();
    } catch (err) {
      console.error("Failed to sync budget:", err);
    }
  };

  // Actions: Get AI Insights Report
  const handleGetAiReport = async () => {
    setLoadingReport(true);
    setAiReport("");

    try {
      const response = await fetch(`${backendUrl}/api/expense-insights`, {
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
      } else {
        setAiReport("Failed to generate financial analysis. Check your backend console.");
      }
    } catch (err) {
      setAiReport("Failed to establish secure connection with AI service.");
    } finally {
      setLoadingReport(false);
    }
  };

  // Reset all databases
  const handleResetData = async () => {
    if (!confirm("Are you sure you want to reset all records to seed defaults?")) return;
    try {
      const response = await fetch(`${backendUrl}/api/reset`, { method: "POST" });
      if (response.ok) {
        alert("Database flushed and re-seeded successfully!");
        setAiReport("");
        fetchData();
      }
    } catch (err) {
      alert("Failed to reset database.");
    }
  };

  // Export current tab data to CSV
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

  // Budget progress checks
  const budgetRatio = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const budgetBarColor = budgetRatio > 100 ? "red" : budgetRatio > 75 ? "orange" : "green";

  if (!mounted) return null;

  // Render Expired Lock View
  if (sessionExpired) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAF6EE", color: "#2C2C2C", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", padding: "16px" }}>
        <div className="sketch-card" style={{ backgroundColor: "white", padding: "32px", maxWidth: "440px", width: "100%", textAlign: "center", position: "relative" }}>
          <div className="absolute top-3 left-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
          <div className="absolute top-3 right-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
          
          <div style={{ width: "48px", height: "48px", backgroundColor: "#FEE2E2", border: "2px solid #2C2C2C", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", margin: "0 auto 20px" }}>
            <AlertCircle size={24} />
          </div>
          
          <h2 className="font-hand" style={{ color: "#2C2C2C", fontSize: "28px", fontWeight: "black", marginBottom: "12px" }}>
            Demo Session Expired
          </h2>
          
          <p className="font-marker" style={{ fontSize: "14px", color: "#5A5A5A", lineHeight: 1.6, marginBottom: "24px" }}>
            Your 5-minute preview session has elapsed. To restart the session, reload this browser window.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="btn-sketch"
            style={{ width: "100%", padding: "12px" }}
          >
            Restart Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF6EE", color: "#2C2C2C", padding: "16px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
      
      {/* 1. HEADER CONTROL ROW */}
      <header className="sketch-card" style={{ backgroundColor: "white", padding: "16px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "between", marginBottom: "20px", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
          <div style={{ backgroundColor: "#FBBF24", border: "2px solid #2C2C2C", padding: "8px", borderRadius: "12px", boxShadow: "2px 2.5px 0 #2C2C2C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wallet size={20} style={{ color: "#2C2C2C" }} />
          </div>
          <div>
            <h1 className="font-hand" style={{ color: "#2C2C2C", fontSize: "24px", fontWeight: "black", margin: 0, lineHeight: 1.1 }}>Expense Tracker with AI Insights</h1>
            <p className="font-marker" style={{ fontSize: "12px", color: "#5A5A5A", margin: 0, marginTop: "2px" }}>Transaction Ledger, Auto-Tagging & AI Spending Recommendation Desk</p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px", fontSize: "12px" }}>
          <div className="font-marker animate-pulse" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "#EF9A9A", border: "2px solid #2C2C2C", borderRadius: "12px", color: "#2C2C2C", fontWeight: "bold", boxShadow: "2px 2.5px 0 #2C2C2C" }}>
            <span>⏱️ EXPIRES IN: {formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={handleResetData}
            className="btn-sketch"
            style={{ padding: "6px 12px", fontSize: "12px" }}
          >
            <RefreshCw size={12} />
            <span>Reset Database</span>
          </button>
        </div>
      </header>

      {/* 2. THREE-PANEL CORE GRID */}
      <main style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", flexGrow: 1, minHeight: 0, marginBottom: "24px" }}>
        
        {/* PANEL A: TRANSACTION ENTRY (Left) */}
        <section className="sketch-card" style={{ backgroundColor: "white", display: "flex", flexDirection: "column", height: "100%", padding: "20px" }}>
          <h2 className="font-hand" style={{ color: "#2C2C2C", fontSize: "22px", fontWeight: "black", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", paddingBottom: "10px", borderBottom: "2px dashed rgba(44, 44, 44, 0.15)" }}>
            <PlusCircle size={18} style={{ color: "#FBBF24" }} />
            <span>Intake Panel</span>
          </h2>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* LOG TRANSACTION FORM */}
            <div style={{ backgroundColor: "rgba(255, 249, 196, 0.15)", border: "2px solid #2C2C2C", padding: "16px", borderRadius: "12px", boxShadow: "2px 3px 0 #2C2C2C" }}>
              <h3 className="font-marker" style={{ fontSize: "14px", fontWeight: "black", color: "#D97706", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase" }}>
                <Wallet size={13} />
                <span>1. Log Transaction</span>
              </h3>
              <form onSubmit={handleAddTransaction} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Description</label>
                  <input
                    type="text"
                    required
                    value={desc}
                    onChange={(e) => handleDescChange(e.target.value)}
                    placeholder="e.g. Starbucks coffee, Rent, salary"
                    style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px 10px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="450"
                      style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px 10px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      style={{ width: "100%", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                    >
                      <option value="Expense">Expense</option>
                      <option value="Income">Income</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
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
                <button type="submit" className="btn-sketch" style={{ width: "100%", padding: "8px", fontSize: "13px" }}>
                  <PlusCircle size={12} />
                  <span>Commit Log</span>
                </button>
              </form>
            </div>

            {/* TARGET BUDGET FORM */}
            <div style={{ backgroundColor: "rgba(225, 245, 254, 0.3)", border: "2px solid #2C2C2C", padding: "16px", borderRadius: "12px", boxShadow: "2px 3px 0 #2C2C2C" }}>
              <h3 className="font-marker" style={{ fontSize: "14px", fontWeight: "black", color: "#0369A1", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase" }}>
                <CheckSquare size={13} />
                <span>2. Target Monthly Budget</span>
              </h3>
              <div>
                <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Budget Limit (₹)</label>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px 10px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* PANEL B: WORKSPACE MONITOR (Center) */}
        <section className="sketch-card" style={{ backgroundColor: "white", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          
          <div style={{ padding: "14px", borderBottom: "3px solid #2C2C2C", backgroundColor: "#FAF6EE", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 className="font-hand" style={{ color: "#2C2C2C", fontSize: "20px", fontWeight: "black", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={16} style={{ color: "#FBBF24" }} />
              <span>Interactive Balance Sheet</span>
            </h2>
            <button 
              onClick={handleExportCSV}
              className="btn-sketch"
              style={{ padding: "4px 8px", fontSize: "10px" }}
            >
              <Download size={10} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* ACTIVE GRID WORKSPACE */}
          <div style={{ flexGrow: 1, backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", padding: "16px", overflow: "hidden" }}>
            
            {/* BUDGET PACING PROGRESS GAUGE */}
            <div style={{ border: "2px solid #2C2C2C", padding: "12px", borderRadius: "12px", boxShadow: "2px 2.5px 0 #2C2C2C", backgroundColor: "white", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className="font-marker" style={{ fontSize: "10px", fontWeight: "bold", color: "#6B7280" }}>Budget Utilization Gauge</span>
                <span style={{ fontSize: "10px", fontFamily: "monospace", fontWeight: "bold", color: "#2C2C2C" }}>
                  ₹{totalSpent} Spent / ₹{monthlyBudget} Budget
                </span>
              </div>
              <div style={{ width: "100%", height: "12px", border: "2px solid #2C2C2C", backgroundColor: "#F1F5F9", borderRadius: "9999px", overflow: "hidden", position: "relative" }}>
                <div 
                  style={{ 
                    height: "100%", 
                    backgroundColor: budgetBarColor === "red" ? "#EF4444" : budgetBarColor === "orange" ? "#F59E0B" : "#10B981", 
                    width: `${Math.min(budgetRatio, 100)}%`,
                    borderRight: "1px solid #2C2C2C",
                    transition: "width 0.3s ease"
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "8px", fontFamily: "monospace", color: "#9CA3AF" }}>
                <span>0%</span>
                <span>{budgetRatio.toFixed(0)}% Utilized</span>
                <span>100%+</span>
              </div>
            </div>

            <div style={{ flexGrow: 1, overflowY: "auto", maxHeight: "400px", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
              {transactions.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", fontStyle: "italic", marginTop: "100px" }}>No transactions logged in this ledger.</p>
              ) : (
                transactions.map(tx => (
                  <div key={tx.id} className="notebook-ruled" style={{ border: "2px solid #2C2C2C", padding: "12px", borderRadius: "12px", boxShadow: "2px 2.5px 0 #2C2C2C", backgroundColor: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <h4 style={{ color: "#2C2C2C", fontWeight: "bold", fontSize: "14px", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                        {tx.type === "Income" ? (
                          <TrendingUp size={14} style={{ color: "#10B981" }} />
                        ) : (
                          <TrendingDown size={14} style={{ color: "#EF4444" }} />
                        )}
                        <span>{tx.description}</span>
                      </h4>
                      <div style={{ display: "flex", gap: "8px", fontSize: "9px", fontFamily: "monospace", color: "#9CA3AF" }}>
                        <span>Tag: <span style={{ fontFamily: "sans-serif", fontWeight: "bold", color: "#4B5563", backgroundColor: "#F3F4F6", border: "1px solid #E5E7EB", padding: "1px 4px", borderRadius: "4px" }}>{tx.category}</span></span>
                        <span>Date: {tx.date}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className="font-hand" style={{ fontSize: "16px", fontWeight: "black", color: tx.type === "Income" ? "#059669" : "#DC2626" }}>
                        {tx.type === "Income" ? "+" : "-"}₹{tx.amount}
                      </span>
                      <button 
                        onClick={() => handleDeleteTransaction(tx.id, tx.description)}
                        style={{ color: "#EF4444", border: "1.5px solid #FCA5A5", backgroundColor: "#FEF2F2", padding: "4px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
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

        {/* PANEL C: AI ADVISOR & TRANSACTION LOGS (Right) */}
        <section className="sketch-card" style={{ backgroundColor: "white", display: "flex", flexDirection: "column", height: "100%", padding: "20px" }}>
          <h2 className="font-hand" style={{ color: "#2C2C2C", fontSize: "22px", fontWeight: "black", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", paddingBottom: "10px", borderBottom: "2px dashed rgba(44, 44, 44, 0.15)" }}>
            <Brain size={18} style={{ color: "#8B5CF6" }} />
            <span>AI Advisor</span>
          </h2>

          {/* AI Report Card */}
          <div style={{ flexGrow: 1, overflowY: "auto", maxHeight: "280px", border: "2px solid #2C2C2C", backgroundColor: "#FCF9F2", padding: "12px", borderRadius: "12px", boxShadow: "1.5px 2.5px 0 #2C2C2C", marginBottom: "14px" }}>
            {loadingReport ? (
              <div style={{ display: "flex", flexDirection: "column", itemsCenter: "center", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                <div style={{ width: "24px", height: "24px", border: "2.5px solid #8B5CF6", borderTopColor: "transparent", borderRadius: "50%", animation: "pulse 1.2s infinite" }}></div>
                <p className="font-marker" style={{ fontSize: "11px", color: "#5A5A5A", marginTop: "8px" }}>Gemini compiling cost-cutting reports...</p>
              </div>
            ) : aiReport ? (
              <div className="font-sans" style={{ fontSize: "11px", lineHeight: "1.6" }}>
                {aiReport.split("\n").map((line, idx) => {
                  if (line.startsWith("##")) {
                    return <h3 key={idx} className="font-hand" style={{ color: "#6D28D9", fontSize: "14px", fontWeight: "black", margin: "8px 0 4px" }}>{line.replace("##", "")}</h3>;
                  }
                  if (line.startsWith("###")) {
                    return <h4 key={idx} className="font-marker" style={{ color: "#2C2C2C", fontSize: "12px", fontWeight: "bold", margin: "6px 0 2px" }}>{line.replace("###", "")}</h4>;
                  }
                  if (line.startsWith("*")) {
                    return <p key={idx} style={{ color: "#4B5563", margin: "2px 0 2px 6px", fontWeight: "600" }}>{line}</p>;
                  }
                  return <p key={idx} style={{ margin: "2px 0", fontWeight: "600" }}>{line}</p>;
                })}
              </div>
            ) : (
              <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", fontStyle: "italic", paddingTop: "50px" }}>Click generate to view your Gemini spending report.</p>
            )}
          </div>

          <button
            onClick={handleGetAiReport}
            disabled={loadingReport || transactions.length === 0}
            className="btn-sketch"
            style={{ width: "100%", padding: "10px", fontSize: "13px", marginBottom: "14px" }}
          >
            <Sparkles size={13} style={{ color: "#F59E0B" }} />
            <span>Generate AI Report</span>
          </button>

          {/* Quick Metrics & Logs Console */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
            {/* Quick Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "6px 10px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "10px", fontFamily: "monospace" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Income:</span> <span style={{ fontFamily: "sans-serif", fontWeight: "bold", color: "#10B981" }}>₹{totalIncome}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Spent:</span> <span style={{ fontFamily: "sans-serif", fontWeight: "bold", color: "#EF4444" }}>₹{totalSpent}</span></div>
            </div>

            {/* Retro logs Console */}
            <div style={{ border: "2px solid #2C2C2C", backgroundColor: "#0F172A", color: "#10B981", fontFamily: "monospace", fontSize: "9px", padding: "10px", borderRadius: "12px", display: "flex", flexDirection: "column", height: "100px", overflow: "hidden" }}>
              <span style={{ display: "block", fontSize: "8px", color: "#94A3B8", fontWeight: "bold", borderBottom: "1px solid #334155", marginBottom: "4px", paddingBottom: "2px", userSelect: "none" }}>Real-Time Console Monitor</span>
              <div ref={terminalBottomRef} style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column-reverse", gap: "3px" }}>
                {systemLogs.length === 0 ? (
                  <p style={{ color: "#64748B", fontStyle: "italic", margin: 0 }}>Console broadcast connected. Monitor stream...</p>
                ) : (
                  systemLogs.map((log, idx) => (
                    <p key={idx} style={{ margin: 0, color: log.level === "error" ? "#F87171" : log.level === "warn" ? "#FBBF24" : log.level === "success" ? "#34D399" : "#CBD5E1" }}>
                      [{log.timestamp ? log.timestamp.split('T')[1].substring(0, 8) : ''}] {log.message}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
