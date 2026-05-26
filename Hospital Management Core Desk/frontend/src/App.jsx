import { useState, useEffect, useRef } from "react";
import { 
  Stethoscope, Calendar, Receipt, FileText, Activity, AlertCircle, 
  RefreshCw, Trash2, Download, Clock, PlusCircle, Sparkles, Brain, ArrowLeft
} from "lucide-react";

export default function App() {
  const [backendUrl] = useState("http://localhost:5000");
  const [mounted, setMounted] = useState(false);
  
  // Tab control: appointments, invoices, prescriptions
  const [activeTab, setActiveTab] = useState("appointments");
  
  // Database states
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [logsConnected, setLogsConnected] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0,
    prescriptionsCount: 0,
    isMongo: false
  });

  // Session Expiry Simulation (5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Form Fields: Appointments
  const [aptPatient, setAptPatient] = useState("");
  const [aptDoctor, setAptDoctor] = useState("Dr. Mehta (Cardio)");
  const [aptTime, setAptTime] = useState("10:00 AM");
  const [aptReason, setAptReason] = useState("");

  // Form Fields: Invoices
  const [invPatient, setInvPatient] = useState("");
  const [invTreatment, setInvTreatment] = useState("");
  const [invConsult, setInvConsult] = useState("500");
  const [invMeds, setInvMeds] = useState("");

  // Form Fields: Prescriptions
  const [rxPatient, setRxPatient] = useState("");
  const [rxDiagnosis, setRxDiagnosis] = useState("");
  const [rxMeds, setRxMeds] = useState("");
  const [rxNotes, setRxNotes] = useState("");

  // AI Assistant States
  const [aiLoading, setAiLoading] = useState(false);

  const terminalBottomRef = useRef(null);

  // Fetch all initial data
  const fetchData = async () => {
    try {
      const aptRes = await fetch(`${backendUrl}/api/appointments`);
      if (aptRes.ok) {
        const aptData = await aptRes.json();
        setAppointments(aptData);
        setBackendOnline(true);
      }

      const invRes = await fetch(`${backendUrl}/api/invoices`);
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvoices(invData);
      }

      const rxRes = await fetch(`${backendUrl}/api/prescriptions`);
      if (rxRes.ok) {
        const rxData = await rxRes.json();
        setPrescriptions(rxData);
      }

      const statRes = await fetch(`${backendUrl}/api/analytics`);
      if (statRes.ok) {
        const statData = await statRes.json();
        setStats(statData);
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

  // Actions: Booking Appointment
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!aptPatient.trim() || !aptReason.trim()) {
      alert("Please enter patient name and reason.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: aptPatient.trim(),
          doctorName: aptDoctor,
          slot: aptTime,
          reason: aptReason.trim()
        })
      });

      if (response.ok) {
        setAptPatient("");
        setAptReason("");
        fetchData();
      }
    } catch (err) {
      alert("Failed to submit appointment.");
    }
  };

  // Actions: Toggle Appointment Status
  const handleToggleAptStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Scheduled" ? "Completed" : "Scheduled";
      const response = await fetch(`${backendUrl}/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Actions: Delete Appointment
  const handleDeleteApt = async (id, name) => {
    if (!confirm(`Cancel appointment for ${name}?`)) return;
    try {
      const response = await fetch(`${backendUrl}/api/appointments/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Actions: Creating Invoice
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!invPatient.trim()) {
      alert("Please enter patient name.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: invPatient.trim(),
          consultFee: invConsult,
          treatmentFee: invTreatment || 0,
          medFee: invMeds || 0
        })
      });

      if (response.ok) {
        setInvPatient("");
        setInvTreatment("");
        setInvMeds("");
        fetchData();
      }
    } catch (err) {
      alert("Failed to create invoice.");
    }
  };

  // Actions: Toggle Invoice Paid Status
  const handleToggleInvoiceStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
      const response = await fetch(`${backendUrl}/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Actions: Delete Invoice
  const handleDeleteInvoice = async (id, name) => {
    if (!confirm(`Delete invoice record for ${name}?`)) return;
    try {
      const response = await fetch(`${backendUrl}/api/invoices/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Actions: Adding Prescription
  const handleAddPrescription = async (e) => {
    e.preventDefault();
    if (!rxPatient.trim() || !rxDiagnosis.trim() || !rxMeds.trim()) {
      alert("Please fill in patient name, diagnosis, and medicine details.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: rxPatient.trim(),
          diagnosis: rxDiagnosis.trim(),
          medicines: rxMeds.trim(),
          notes: rxNotes.trim()
        })
      });

      if (response.ok) {
        setRxPatient("");
        setRxDiagnosis("");
        setRxMeds("");
        setRxNotes("");
        fetchData();
      }
    } catch (err) {
      alert("Failed to commit prescription.");
    }
  };

  // Actions: Delete Prescription
  const handleDeleteRx = async (id, name) => {
    if (!confirm(`Remove prescription record for ${name}?`)) return;
    try {
      const response = await fetch(`${backendUrl}/api/prescriptions/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Suggest Rx Helper
  const handleAiSuggestRx = async () => {
    if (!rxDiagnosis.trim()) {
      alert("Please enter a diagnosis first (e.g. Acute Gastritis, Flu, or Ankle Sprain) before asking the AI Clinical Assistant.");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/ai-diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosis: rxDiagnosis.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setRxMeds(data.medicines);
        setRxNotes(data.advice);
      } else {
        alert("AI Assistant failed to retrieve prescription suggestions.");
      }
    } catch (err) {
      alert("Failed to connect to the AI Clinical service.");
    } finally {
      setAiLoading(false);
    }
  };

  // Reset all databases
  const handleResetData = async () => {
    if (!confirm("Are you sure you want to reset all hospital desk records to seed defaults?")) return;
    try {
      const response = await fetch(`${backendUrl}/api/reset`, { method: "POST" });
      if (response.ok) {
        alert("Database flushed and re-seeded successfully!");
        fetchData();
      }
    } catch (err) {
      alert("Failed to reset database.");
    }
  };

  // Export current tab data to CSV
  const handleExportCSV = () => {
    let csvContent = "";
    let filename = "";

    if (activeTab === "appointments") {
      csvContent = [
        ["Appointment ID", "Patient Name", "Assigned Physician", "Date", "Slot Time", "Status", "Reason"],
        ...appointments.map(a => [a.id, a.patientName, a.doctorName, a.date, a.slot, a.status, a.reason])
      ]
        .map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
        .join("\n");
      filename = `Clinic_Appointments_${new Date().toISOString().split("T")[0]}.csv`;
    } else if (activeTab === "invoices") {
      csvContent = [
        ["Invoice ID", "Patient Name", "Consult Fee", "Treatment Fee", "Pharmacy Cost", "Tally Total", "Billing Status", "Date"],
        ...invoices.map(i => [i.id, i.patientName, i.consultFee, i.treatmentFee, i.medFee, i.total, i.status, i.date])
      ]
        .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      filename = `Billing_Ledger_${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      csvContent = [
        ["Prescription ID", "Patient Name", "Diagnosis", "Medicines Rx", "Special Instructions", "Date"],
        ...prescriptions.map(r => [r.id, r.patientName, r.diagnosis, r.medicines, r.notes, r.date])
      ]
        .map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
        .join("\n");
      filename = `Prescription_Vault_${new Date().toISOString().split("T")[0]}.csv`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
          <div style={{ backgroundColor: "#F97316", border: "2px solid #2C2C2C", padding: "8px", borderRadius: "12px", boxShadow: "2px 2.5px 0 #2C2C2C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Stethoscope size={20} style={{ color: "white" }} />
          </div>
          <div>
            <h1 className="font-hand" style={{ color: "#2C2C2C", fontSize: "24px", fontWeight: "black", margin: 0, lineHeight: 1.1 }}>Hospital Management Core Desk</h1>
            <p className="font-marker" style={{ fontSize: "12px", color: "#5A5A5A", margin: 0, marginTop: "2px" }}>Unified EHR Intake, Scheduling & Billing Administration Desk</p>
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
        
        {/* PANEL A: EHR ENTRY DESK (Left) */}
        <section className="sketch-card" style={{ backgroundColor: "white", display: "flex", flexDirection: "column", height: "100%", padding: "20px" }}>
          <h2 className="font-hand" style={{ color: "#2C2C2C", fontSize: "22px", fontWeight: "black", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", paddingBottom: "10px", borderBottom: "2px dashed rgba(44, 44, 44, 0.15)" }}>
            <Activity size={18} style={{ color: "#F97316" }} />
            <span>EHR Input Panel</span>
          </h2>
          
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px", maxHeight: "580px", paddingRight: "4px" }}>
            {/* BOOK APPOINTMENT FORM */}
            <div style={{ backgroundColor: "rgba(255, 249, 196, 0.15)", border: "2px solid #2C2C2C", padding: "16px", borderRadius: "12px", boxShadow: "2px 3px 0 #2C2C2C" }}>
              <h3 className="font-marker" style={{ fontSize: "14px", fontWeight: "black", color: "#F97316", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase" }}>
                <Calendar size={13} />
                <span>1. Schedule Appointment</span>
              </h3>
              <form onSubmit={handleBookAppointment} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Patient Name</label>
                  <input
                    type="text"
                    required
                    value={aptPatient}
                    onChange={(e) => setAptPatient(e.target.value)}
                    placeholder="e.g. Aman Verma"
                    style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px 10px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Physician</label>
                    <select 
                      value={aptDoctor} 
                      onChange={(e) => setAptDoctor(e.target.value)}
                      style={{ width: "100%", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                    >
                      <option>Dr. Mehta (Cardio)</option>
                      <option>Dr. Sharma (Ortho)</option>
                      <option>Dr. Joshi (Pedia)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Slot</label>
                    <select
                      value={aptTime}
                      onChange={(e) => setAptTime(e.target.value)}
                      style={{ width: "100%", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                    >
                      <option>10:00 AM</option>
                      <option>10:30 AM</option>
                      <option>11:45 AM</option>
                      <option>02:15 PM</option>
                      <option>04:00 PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Reason for Visit</label>
                  <input
                    type="text"
                    required
                    value={aptReason}
                    onChange={(e) => setAptReason(e.target.value)}
                    placeholder="e.g. Heart scan checkup"
                    style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px 10px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                  />
                </div>
                <button type="submit" className="btn-sketch" style={{ width: "100%", padding: "8px", fontSize: "13px" }}>
                  <PlusCircle size={12} />
                  <span>Book Appointment Slot</span>
                </button>
              </form>
            </div>

            {/* CREATE BILLING INVOICE FORM */}
            <div style={{ backgroundColor: "rgba(232, 245, 233, 0.3)", border: "2px solid #2C2C2C", padding: "16px", borderRadius: "12px", boxShadow: "2px 3px 0 #2C2C2C" }}>
              <h3 className="font-marker" style={{ fontSize: "14px", fontWeight: "black", color: "#065F46", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase" }}>
                <Receipt size={13} />
                <span>2. Generate Billing Invoice</span>
              </h3>
              <form onSubmit={handleCreateInvoice} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Patient Name</label>
                  <input
                    type="text"
                    required
                    value={invPatient}
                    onChange={(e) => setInvPatient(e.target.value)}
                    placeholder="e.g. Pooja Patel"
                    style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px 10px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "8px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "2px" }}>Consult (₹)</label>
                    <input
                      type="number"
                      required
                      value={invConsult}
                      onChange={(e) => setInvConsult(e.target.value)}
                      style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "4px 6px", fontSize: "12px", fontFamily: "sans-serif" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "8px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "2px" }}>Treat (₹)</label>
                    <input
                      type="number"
                      value={invTreatment}
                      onChange={(e) => setInvTreatment(e.target.value)}
                      placeholder="800"
                      style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "4px 6px", fontSize: "12px", fontFamily: "sans-serif" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "8px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "2px" }}>Pharmacy (₹)</label>
                    <input
                      type="number"
                      value={invMeds}
                      onChange={(e) => setInvMeds(e.target.value)}
                      placeholder="200"
                      style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "4px 6px", fontSize: "12px", fontFamily: "sans-serif" }}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-sketch" style={{ width: "100%", padding: "8px", fontSize: "13px", backgroundColor: "#E8F5E9", borderColor: "#10B981", color: "#065F46" }}>
                  <Receipt size={12} />
                  <span>Generate Invoice Tally</span>
                </button>
              </form>
            </div>

            {/* ADD DIGITAL PRESCRIPTION FORM */}
            <div style={{ backgroundColor: "rgba(225, 245, 254, 0.3)", border: "2px solid #2C2C2C", padding: "16px", borderRadius: "12px", boxShadow: "2px 3px 0 #2C2C2C" }}>
              <h3 className="font-marker" style={{ fontSize: "14px", fontWeight: "black", color: "#0369A1", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase" }}>
                <FileText size={13} />
                <span>3. Prescribe Digital Rx</span>
              </h3>
              <form onSubmit={handleAddPrescription} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Patient Name</label>
                  <input
                    type="text"
                    required
                    value={rxPatient}
                    onChange={(e) => setRxPatient(e.target.value)}
                    placeholder="e.g. Pooja Patel"
                    style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px 10px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <label style={{ fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", margin: 0 }}>Diagnosis</label>
                    <button
                      type="button"
                      onClick={handleAiSuggestRx}
                      disabled={aiLoading}
                      className="font-marker"
                      style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", backgroundColor: "#FFF9C4", border: "1.5px solid #2C2C2C", borderRadius: "6px", padding: "2px 6px", cursor: "pointer", boxShadow: "1px 1px 0 #2C2C2C", fontWeight: "bold" }}
                    >
                      {aiLoading ? (
                        <>
                          <div style={{ width: "8px", height: "8px", border: "1.5px border #2C2C2C", borderTopColor: "transparent", borderRadius: "50%", animation: "pulse 1s infinite" }}></div>
                          <span>Querying...</span>
                        </>
                      ) : (
                        <>
                          <Brain size={10} style={{ color: "#F59E0B" }} />
                          <span>AI Suggest Rx</span>
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={rxDiagnosis}
                    onChange={(e) => setRxDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Gastritis"
                    style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px 10px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Medicines & Dosage</label>
                  <textarea
                    required
                    rows={2}
                    value={rxMeds}
                    onChange={(e) => setRxMeds(e.target.value)}
                    placeholder="e.g. Tab Pantocid 40mg 1-0-0"
                    style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px 10px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600", resize: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "9px", fontFamily: "'Patrick Hand', sans-serif", fontWeight: "bold", color: "#5A5A5A", textTransform: "uppercase", marginBottom: "4px" }}>Physician Advice</label>
                  <input
                    type="text"
                    value={rxNotes}
                    onChange={(e) => setRxNotes(e.target.value)}
                    placeholder="e.g. Drink warm water, avoid spicy food"
                    style={{ width: "100%", boxSizing: "border-box", backgroundColor: "white", border: "2px solid #2C2C2C", borderRadius: "12px", padding: "6px 10px", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600" }}
                  />
                </div>
                <button type="submit" className="btn-sketch" style={{ width: "100%", padding: "8px", fontSize: "13px", backgroundColor: "#E1F5FE", borderColor: "#0284C7", color: "#0369A1" }}>
                  <FileText size={12} />
                  <span>Commit Rx to Vault</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* PANEL B: WORKSPACE MONITOR (Center) */}
        <section className="sketch-card" style={{ backgroundColor: "white", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          {/* TABS SELECTOR HEADER */}
          <div style={{ borderBottom: "3px solid #2C2C2C", backgroundColor: "#FAF6EE", display: "flex" }}>
            <button
              onClick={() => setActiveTab("appointments")}
              className="font-marker"
              style={{
                flex: 1,
                padding: "12px 8px",
                fontSize: "12px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                border: "none",
                borderRight: "3px solid #2C2C2C",
                cursor: "pointer",
                transition: "all 0.2s",
                backgroundColor: activeTab === "appointments" ? "white" : "transparent",
                borderBottom: activeTab === "appointments" ? "4px solid #F97316" : "none",
                color: activeTab === "appointments" ? "#2C2C2C" : "#6B7280"
              }}
            >
              <Calendar size={13} style={{ color: activeTab === "appointments" ? "#F97316" : "#6B7280" }} />
              <span>Appointments</span>
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className="font-marker"
              style={{
                flex: 1,
                padding: "12px 8px",
                fontSize: "12px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                border: "none",
                borderRight: "3px solid #2C2C2C",
                cursor: "pointer",
                transition: "all 0.2s",
                backgroundColor: activeTab === "invoices" ? "white" : "transparent",
                borderBottom: activeTab === "invoices" ? "4px solid #10B981" : "none",
                color: activeTab === "invoices" ? "#2C2C2C" : "#6B7280"
              }}
            >
              <Receipt size={13} style={{ color: activeTab === "invoices" ? "#10B981" : "#6B7280" }} />
              <span>Billing ledger</span>
            </button>
            <button
              onClick={() => setActiveTab("prescriptions")}
              className="font-marker"
              style={{
                flex: 1,
                padding: "12px 8px",
                fontSize: "12px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                backgroundColor: activeTab === "prescriptions" ? "white" : "transparent",
                borderBottom: activeTab === "prescriptions" ? "4px solid #0284C7" : "none",
                color: activeTab === "prescriptions" ? "#2C2C2C" : "#6B7280"
              }}
            >
              <FileText size={13} style={{ color: activeTab === "prescriptions" ? "#0284C7" : "#6B7280" }} />
              <span>Rx Vault</span>
            </button>
          </div>

          {/* ACTIVE GRID WORKSPACE */}
          <div style={{ flexGrow: 1, backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", padding: "16px", overflow: "hidden" }}>
            <div style={{ flexGrow: 1, overflowY: "auto", maxHeight: "500px", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
              
              {/* Tab Content: APPOINTMENTS */}
              {activeTab === "appointments" && (
                appointments.length === 0 ? (
                  <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", fontStyle: "italic", marginTop: "100px" }}>No clinic appointments scheduled today.</p>
                ) : (
                  appointments.map(apt => (
                    <div key={apt.id} className="notebook-ruled" style={{ border: "2px solid #2C2C2C", padding: "14px", borderRadius: "12px", boxShadow: "2px 2.5px 0 #2C2C2C", backgroundColor: "white", position: "relative" }}>
                      <span className="font-marker" style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        fontSize: "9px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        border: "1.5px solid #2C2C2C",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        backgroundColor: apt.status === "Completed" ? "#D1FAE5" : "#FEF3C7",
                        color: apt.status === "Completed" ? "#065F46" : "#92400E"
                      }}>
                        {apt.status}
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <h4 style={{ color: "#2C2C2C", fontWeight: "bold", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Activity size={14} style={{ color: "#F97316" }} />
                          <span>{apt.patientName}</span>
                        </h4>
                        <p style={{ fontSize: "10px", color: "#6B7280", fontFamily: "monospace", margin: 0 }}>Assigned Doctor: <span style={{ fontFamily: "sans-serif", fontWeight: "bold", color: "#2C2C2C" }}>{apt.doctorName}</span></p>
                        <p style={{ fontSize: "10px", color: "#6B7280", fontFamily: "monospace", margin: 0 }}>Slot Time: <span style={{ fontFamily: "sans-serif", fontWeight: "bold", color: "#2C2C2C" }}>{apt.slot}</span></p>
                        <p style={{ fontSize: "11px", color: "#4B5563", fontFamily: "sans-serif", fontStyle: "italic", backgroundColor: "#FCF9F2", padding: "6px", borderRadius: "4px", border: "1px solid rgba(44,44,44,0.05)", marginTop: "6px" }}>Reason: {apt.reason}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px", paddingTop: "14px", borderTop: "1px dashed rgba(44,44,44,0.1)", justifyContent: "end" }}>
                        <button 
                          onClick={() => handleToggleAptStatus(apt.id, apt.status)}
                          className="font-marker"
                          style={{
                            padding: "4px 10px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            border: "1.5px solid #2C2C2C",
                            borderRadius: "8px",
                            cursor: "pointer",
                            boxShadow: "1px 1.5px 0 #2C2C2C",
                            backgroundColor: apt.status === "Completed" ? "#FEF3C7" : "#D1FAE5"
                          }}
                        >
                          {apt.status === "Completed" ? "Mark Scheduled" : "Mark Completed"}
                        </button>
                        <button 
                          onClick={() => handleDeleteApt(apt.id, apt.patientName)}
                          style={{ color: "#EF4444", border: "1.5px solid #FCA5A5", backgroundColor: "#FEF2F2", padding: "4px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* Tab Content: INVOICES */}
              {activeTab === "invoices" && (
                invoices.length === 0 ? (
                  <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", fontStyle: "italic", marginTop: "100px" }}>No billing invoices raised today.</p>
                ) : (
                  invoices.map(inv => (
                    <div key={inv.id} style={{ border: "2px solid #2C2C2C", padding: "14px", borderRadius: "12px", boxShadow: "2px 2.5px 0 #2C2C2C", backgroundColor: "white" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                        <div>
                          <h4 style={{ color: "#2C2C2C", fontWeight: "bold", fontSize: "14px", margin: 0 }}>{inv.patientName}</h4>
                          <span style={{ fontSize: "8px", color: "#9CA3AF", fontFamily: "monospace" }}>Invoice Date: {inv.date}</span>
                        </div>
                        <span className="font-marker" style={{
                          fontSize: "9px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          border: "1.5px solid #2C2C2C",
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          backgroundColor: inv.status === "Paid" ? "#D1FAE5" : "#FEE2E2",
                          color: inv.status === "Paid" ? "#065F46" : "#991B1B"
                        }}>
                          {inv.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px", fontFamily: "monospace", color: "#6B7280", backgroundColor: "#FCF9F2", padding: "8px", borderRadius: "12px", border: "1px solid rgba(44,44,44,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Consult Fee:</span> <span style={{ fontFamily: "sans-serif", fontWeight: "bold", color: "#2C2C2C" }}>₹{inv.consultFee}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Treatment Fee:</span> <span style={{ fontFamily: "sans-serif", fontWeight: "bold", color: "#2C2C2C" }}>₹{inv.treatmentFee}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Medications:</span> <span style={{ fontFamily: "sans-serif", fontWeight: "bold", color: "#2C2C2C" }}>₹{inv.medFee}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(44,44,44,0.1)", paddingTop: "4px", fontSize: "12px", fontWeight: "bold", color: "#2C2C2C" }}>
                          <span>TALLY TOTAL:</span> <span>₹{inv.total}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px", justifyContent: "end" }}>
                        <button 
                          onClick={() => handleToggleInvoiceStatus(inv.id, inv.status)}
                          className="font-marker"
                          style={{
                            padding: "4px 10px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            border: "1.5px solid #2C2C2C",
                            borderRadius: "8px",
                            cursor: "pointer",
                            boxShadow: "1px 1.5px 0 #2C2C2C",
                            backgroundColor: inv.status === "Paid" ? "#FEE2E2" : "#D1FAE5"
                          }}
                        >
                          {inv.status === "Paid" ? "Mark Unpaid" : "Mark Paid"}
                        </button>
                        <button 
                          onClick={() => handleDeleteInvoice(inv.id, inv.patientName)}
                          style={{ color: "#EF4444", border: "1.5px solid #FCA5A5", backgroundColor: "#FEF2F2", padding: "4px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* Tab Content: PRESCRIPTIONS */}
              {activeTab === "prescriptions" && (
                prescriptions.length === 0 ? (
                  <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", fontStyle: "italic", marginTop: "100px" }}>No prescriptions committed to the vault today.</p>
                ) : (
                  prescriptions.map(rx => (
                    <div key={rx.id} className="notebook-ruled" style={{ border: "2px solid #2C2C2C", padding: "14px", borderRadius: "12px", boxShadow: "2px 2.5px 0 #2C2C2C", backgroundColor: "white" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px", borderBottom: "1px solid rgba(44,44,44,0.1)", paddingBottom: "6px" }}>
                        <div>
                          <h4 style={{ color: "#2C2C2C", fontWeight: "bold", fontSize: "14px", margin: 0 }}>{rx.patientName}</h4>
                          <p className="font-marker" style={{ fontSize: "10px", color: "#0284C7", margin: 0, marginTop: "2px" }}>Rx Diagnosis: {rx.diagnosis}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteRx(rx.id, rx.patientName)}
                          style={{ color: "#EF4444", border: "none", backgroundColor: "transparent", cursor: "pointer", padding: "4px" }}
                          title="Purge prescription"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#374151", marginTop: "8px", fontFamily: "sans-serif", fontWeight: "600" }}>
                        <p style={{ margin: 0 }}><span className="font-marker" style={{ fontSize: "10px", color: "#9CA3AF", display: "block", lineHeight: 1 }}>Medicines Prescribed:</span> {rx.medicines}</p>
                        <p style={{ margin: 0 }}><span className="font-marker" style={{ fontSize: "10px", color: "#9CA3AF", display: "block", lineHeight: 1 }}>Physician Advice:</span> <span style={{ fontStyle: "italic" }}>{rx.notes}</span></p>
                        <span style={{ display: "block", fontSize: "8px", textAlign: "right", color: "#9CA3AF", fontFamily: "monospace", marginTop: "4px" }}>Authorized on: {rx.date}</span>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </section>

        {/* PANEL C: STATS & TRANSACTION LOGS (Right) */}
        <section className="sketch-card" style={{ backgroundColor: "white", display: "flex", flexDirection: "column", height: "100%", padding: "20px" }}>
          <h2 className="font-hand" style={{ color: "#2C2C2C", fontSize: "22px", fontWeight: "black", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={18} style={{ color: "#F97316" }} />
            <span>Clinic Stats</span>
          </h2>
          <span style={{ display: "block", fontSize: "9px", fontFamily: "monospace", color: "#5A5A5A", marginBottom: "16px" }}>REAL-TIME CLINIC TELEMETRY</span>

          {/* Quick Metrics list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
            <div style={{ backgroundColor: "rgba(255, 249, 196, 0.2)", border: "2px solid #2C2C2C", padding: "12px", borderRadius: "12px", boxShadow: "1.5px 2px 0 #2C2C2C", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span className="font-marker" style={{ display: "block", fontSize: "9px", color: "#5A5A5A" }}>APPOINTMENTS</span>
                <span className="font-hand" style={{ fontSize: "20px", fontWeight: "black", color: "#2C2C2C" }}>
                  {stats.pendingAppointments} <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "sans-serif", fontWeight: "normal" }}>Pending</span> / {stats.completedAppointments} <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "sans-serif", fontWeight: "normal" }}>Done</span>
                </span>
              </div>
              <Calendar size={18} style={{ color: "#F97316" }} />
            </div>

            <div style={{ backgroundColor: "rgba(232, 245, 233, 0.4)", border: "2px solid #2C2C2C", padding: "12px", borderRadius: "12px", boxShadow: "1.5px 2px 0 #2C2C2C", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span className="font-marker" style={{ display: "block", fontSize: "9px", color: "#5A5A5A" }}>TOTAL REVENUE</span>
                <span className="font-hand" style={{ fontSize: "20px", fontWeight: "black", color: "#047857" }}>₹{stats.totalRevenue}</span>
              </div>
              <Receipt size={18} style={{ color: "#10B981" }} />
            </div>

            <div style={{ backgroundColor: "rgba(225, 245, 254, 0.4)", border: "2px solid #2C2C2C", padding: "12px", borderRadius: "12px", boxShadow: "1.5px 2px 0 #2C2C2C", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span className="font-marker" style={{ display: "block", fontSize: "9px", color: "#5A5A5A" }}>PRESCRIPTIONS VAULT</span>
                <span className="font-hand" style={{ fontSize: "20px", fontWeight: "black", color: "#0369A1" }}>{stats.prescriptionsCount} Records</span>
              </div>
              <FileText size={18} style={{ color: "#0284C7" }} />
            </div>
            
            <div style={{ border: "2px dashed #2C2C2C", padding: "8px", borderRadius: "10px", backgroundColor: "#FCF9F2", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <span className="font-marker" style={{ fontSize: "10px", fontWeight: "bold" }}>
                ACTIVE ENGINE: {stats.isMongo ? "☁️ MONGODB CLOUD" : "📂 LOCAL JSON FILE"}
              </span>
            </div>
          </div>

          {/* Actions & Console */}
          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "end", borderTop: "2px dashed rgba(44, 44, 44, 0.1)", paddingTop: "16px", gap: "12px", minHeight: "180px" }}>
            <button
              onClick={handleExportCSV}
              className="btn-sketch"
              style={{ width: "100%", padding: "10px", fontSize: "13px" }}
            >
              <Download size={13} />
              <span>Export {activeTab} to CSV</span>
            </button>

            <div style={{ flexGrow: 1, border: "2px solid #2C2C2C", backgroundColor: "#0F172A", color: "#10B981", fontFamily: "monospace", fontSize: "9px", padding: "10px", borderRadius: "12px", display: "flex", flexDirection: "column", height: "130px", maxHeight: "150px", overflow: "hidden" }}>
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
