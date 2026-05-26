"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Stethoscope, Calendar, Receipt, FileText, Activity, AlertCircle, 
  RefreshCw, Trash2, CheckCircle2, ArrowLeft, Download, Clock, PlusCircle
} from "lucide-react";

// Default seed appointments
const DEFAULT_APPOINTMENTS = [
  { id: "apt-1", patientName: "Aman Verma", doctorName: "Dr. Mehta (Cardio)", date: new Date().toLocaleDateString(), slot: "10:30 AM", status: "Scheduled", reason: "General heart checkup" },
  { id: "apt-2", patientName: "Pooja Patel", doctorName: "Dr. Sharma (Ortho)", date: new Date().toLocaleDateString(), slot: "11:45 AM", status: "Completed", reason: "Post-fracture consultation" },
  { id: "apt-3", patientName: "Rahul Sen", doctorName: "Dr. Joshi (Pedia)", date: new Date().toLocaleDateString(), slot: "02:15 PM", status: "Scheduled", reason: "Seasonal flu review" }
];

// Default seed invoices
const DEFAULT_INVOICES = [
  { id: "inv-1", patientName: "Aman Verma", treatmentFee: 1200, consultFee: 500, medFee: 350, total: 2050, status: "Paid", date: new Date().toLocaleDateString() },
  { id: "inv-2", patientName: "Pooja Patel", treatmentFee: 800, consultFee: 500, medFee: 200, total: 1500, status: "Unpaid", date: new Date().toLocaleDateString() }
];

// Default seed prescriptions
const DEFAULT_PRESCRIPTIONS = [
  { id: "rx-1", patientName: "Pooja Patel", diagnosis: "Ankle Sprain Recovery", medicines: "Tab Combiflam 1-0-1, Crepe Bandage", notes: "Apply ice packs 3 times daily. Keep foot elevated.", date: new Date().toLocaleDateString() }
];

export default function HospitalDeskWorkspace() {
  const [mounted, setMounted] = useState(false);
  
  // Tab control: appointments, invoices, prescriptions
  const [activeTab, setActiveTab] = useState("appointments");
  
  // Database states
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);

  // Session Token States
  const [tokenStatus, setTokenStatus] = useState("loading"); // loading, approved, expired, invalid
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

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

    // Load Appointments
    const localApts = localStorage.getItem("shubdeep_hospital_apts");
    if (localApts) {
      setAppointments(JSON.parse(localApts));
    } else {
      setAppointments(DEFAULT_APPOINTMENTS);
      localStorage.setItem("shubdeep_hospital_apts", JSON.stringify(DEFAULT_APPOINTMENTS));
    }

    // Load Invoices
    const localInvs = localStorage.getItem("shubdeep_hospital_invs");
    if (localInvs) {
      setInvoices(JSON.parse(localInvs));
    } else {
      setInvoices(DEFAULT_INVOICES);
      localStorage.setItem("shubdeep_hospital_invs", JSON.stringify(DEFAULT_INVOICES));
    }

    // Load Prescriptions
    const localRxs = localStorage.getItem("shubdeep_hospital_rxs");
    if (localRxs) {
      setPrescriptions(JSON.parse(localRxs));
    } else {
      setPrescriptions(DEFAULT_PRESCRIPTIONS);
      localStorage.setItem("shubdeep_hospital_rxs", JSON.stringify(DEFAULT_PRESCRIPTIONS));
    }

    addSystemLog("=======================================================", "info");
    addSystemLog("  Hospital Core Desk Database Online (SQLite Mock).", "info");
    addSystemLog("  Digital prescribing & billing logs loaded securely.", "info");
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

  // Actions: Booking Appointment
  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!aptPatient.trim() || !aptReason.trim()) {
      alert("Please enter patient name and reason.");
      return;
    }

    const newApt = {
      id: `apt-${Date.now()}`,
      patientName: aptPatient.trim(),
      doctorName: aptDoctor,
      date: new Date().toLocaleDateString(),
      slot: aptTime,
      status: "Scheduled",
      reason: aptReason.trim()
    };

    const updated = [...appointments, newApt];
    setAppointments(updated);
    localStorage.setItem("shubdeep_hospital_apts", JSON.stringify(updated));
    
    addSystemLog(`[DB Write] Scheduled appointment for ${newApt.patientName} with ${newApt.doctorName}`, "success");
    
    // Reset Form
    setAptPatient("");
    setAptReason("");
  };

  // Actions: Toggle Appointment Status
  const handleToggleAptStatus = (id) => {
    const updated = appointments.map(apt => {
      if (apt.id === id) {
        const nextStatus = apt.status === "Scheduled" ? "Completed" : "Scheduled";
        addSystemLog(`[DB Update] Changed Appointment ${id} status to ${nextStatus}`, "success");
        return { ...apt, status: nextStatus };
      }
      return apt;
    });
    setAppointments(updated);
    localStorage.setItem("shubdeep_hospital_apts", JSON.stringify(updated));
  };

  // Actions: Delete Appointment
  const handleDeleteApt = (id, name) => {
    if (!confirm(`Cancel appointment for ${name}?`)) return;
    const updated = appointments.filter(apt => apt.id !== id);
    setAppointments(updated);
    localStorage.setItem("shubdeep_hospital_apts", JSON.stringify(updated));
    addSystemLog(`[DB Delete] Cancelled appointment ${id} for ${name}`, "warn");
  };

  // Actions: Creating Invoice
  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!invPatient.trim()) {
      alert("Please enter patient name.");
      return;
    }

    const treat = parseFloat(invTreatment) || 0;
    const consult = parseFloat(invConsult) || 0;
    const meds = parseFloat(invMeds) || 0;
    const total = treat + consult + meds;

    const newInv = {
      id: `inv-${Date.now()}`,
      patientName: invPatient.trim(),
      treatmentFee: treat,
      consultFee: consult,
      medFee: meds,
      total: total,
      status: "Unpaid",
      date: new Date().toLocaleDateString()
    };

    const updated = [...invoices, newInv];
    setInvoices(updated);
    localStorage.setItem("shubdeep_hospital_invs", JSON.stringify(updated));

    addSystemLog(`[DB Write] Created invoice of ₹${total} for ${newInv.patientName}`, "success");

    // Reset Form
    setInvPatient("");
    setInvTreatment("");
    setInvMeds("");
  };

  // Actions: Toggle Invoice Paid Status
  const handleToggleInvoiceStatus = (id, name, total) => {
    const updated = invoices.map(inv => {
      if (inv.id === id) {
        const nextStatus = inv.status === "Paid" ? "Unpaid" : "Paid";
        addSystemLog(`[DB Update] Invoice ${id} of ₹${total} marked as ${nextStatus}`, "success");
        return { ...inv, status: nextStatus };
      }
      return inv;
    });
    setInvoices(updated);
    localStorage.setItem("shubdeep_hospital_invs", JSON.stringify(updated));
  };

  // Actions: Delete Invoice
  const handleDeleteInvoice = (id, name) => {
    if (!confirm(`Delete invoice for ${name}?`)) return;
    const updated = invoices.filter(inv => inv.id !== id);
    setInvoices(updated);
    localStorage.setItem("shubdeep_hospital_invs", JSON.stringify(updated));
    addSystemLog(`[DB Delete] Removed invoice record ${id} for ${name}`, "warn");
  };

  // Actions: Adding Prescription
  const handleAddPrescription = (e) => {
    e.preventDefault();
    if (!rxPatient.trim() || !rxDiagnosis.trim() || !rxMeds.trim()) {
      alert("Please fill in patient name, diagnosis, and medicine details.");
      return;
    }

    const newRx = {
      id: `rx-${Date.now()}`,
      patientName: rxPatient.trim(),
      diagnosis: rxDiagnosis.trim(),
      medicines: rxMeds.trim(),
      notes: rxNotes.trim() || "No extra precautions.",
      date: new Date().toLocaleDateString()
    };

    const updated = [...prescriptions, newRx];
    setPrescriptions(updated);
    localStorage.setItem("shubdeep_hospital_rxs", JSON.stringify(updated));

    addSystemLog(`[DB Write] Uploaded prescription for ${newRx.patientName} (Rx: ${newRx.diagnosis})`, "success");

    // Reset Form
    setRxPatient("");
    setRxDiagnosis("");
    setRxMeds("");
    setRxNotes("");
  };

  // Actions: Delete Prescription
  const handleDeleteRx = (id, name) => {
    if (!confirm(`Remove prescription record for ${name}?`)) return;
    const updated = prescriptions.filter(rx => rx.id !== id);
    setPrescriptions(updated);
    localStorage.setItem("shubdeep_hospital_rxs", JSON.stringify(updated));
    addSystemLog(`[DB Delete] Purged prescription record ${id} for ${name}`, "warn");
  };

  // Reset all databases
  const handleResetData = () => {
    if (!confirm("Are you sure you want to reset all hospital desk records to seed defaults?")) return;
    setAppointments(DEFAULT_APPOINTMENTS);
    setInvoices(DEFAULT_INVOICES);
    setPrescriptions(DEFAULT_PRESCRIPTIONS);

    localStorage.setItem("shubdeep_hospital_apts", JSON.stringify(DEFAULT_APPOINTMENTS));
    localStorage.setItem("shubdeep_hospital_invs", JSON.stringify(DEFAULT_INVOICES));
    localStorage.setItem("shubdeep_hospital_rxs", JSON.stringify(DEFAULT_PRESCRIPTIONS));

    addSystemLog("Cleared active data. Reloaded clinic databases.", "warn");
    alert("Hospital data tables reset to defaults!");
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
    addSystemLog(`Exported clinic ${activeTab} records to CSV sheet.`, "info");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper stats calculations
  const totalRevenue = invoices
    .filter(i => i.status === "Paid")
    .reduce((sum, current) => sum + current.total, 0);

  const pendingApts = appointments.filter(a => a.status === "Scheduled").length;
  const completedApts = appointments.filter(a => a.status === "Completed").length;

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
            <div className="bg-[#F97316] border-2 border-[#2C2C2C] p-2 rounded-xl shadow-[2px_2.5px_0_#2C2C2C]">
              <Stethoscope size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-[#2C2C2C] text-lg md:text-xl font-hand font-extrabold leading-none">Hospital Management Core Desk</h1>
              <p className="text-[10px] md:text-xs font-marker text-[#5A5A5A] mt-1">Unified EHR Intake, Scheduling & Billing Administration Desk</p>
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
        
        {/* PANEL A: EHR ENTRY DESK (Left - 4 Cols) */}
        <section className="lg:col-span-4 sketch-card bg-white flex flex-col h-full shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] p-5">
          <h2 className="text-[#2C2C2C] text-lg font-hand font-extrabold mb-5 flex items-center gap-2 pb-2.5 border-b-2 border-dashed border-[#2C2C2C]/15">
            <Activity size={18} className="text-[#F97316]" />
            <span>EHR Input Panel</span>
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 max-h-[500px]">
            {/* BOOK APPOINTMENT FORM */}
            <div className="bg-[#FFF9C4]/15 border-2 border-[#2C2C2C] p-4 rounded-xl shadow-[2px_3px_0_#2C2C2C]">
              <h3 className="text-xs font-marker font-extrabold text-[#F97316] mb-3 flex items-center gap-1.5 uppercase">
                <Calendar size={13} />
                <span>1. Schedule Appointment</span>
              </h3>
              <form onSubmit={handleBookAppointment} className="space-y-3">
                <div>
                  <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={aptPatient}
                    onChange={(e) => setAptPatient(e.target.value)}
                    placeholder="e.g. Aman Verma"
                    className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Physician</label>
                    <select 
                      value={aptDoctor} 
                      onChange={(e) => setAptDoctor(e.target.value)}
                      className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                    >
                      <option>Dr. Mehta (Cardio)</option>
                      <option>Dr. Sharma (Ortho)</option>
                      <option>Dr. Joshi (Pedia)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Slot</label>
                    <select
                      value={aptTime}
                      onChange={(e) => setAptTime(e.target.value)}
                      className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
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
                  <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Reason for Visit</label>
                  <input
                    type="text"
                    value={aptReason}
                    onChange={(e) => setAptReason(e.target.value)}
                    placeholder="e.g. Heart scan checkup"
                    className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                  />
                </div>
                <button type="submit" className="btn-sketch w-full py-2 text-xs flex items-center justify-center gap-1.5">
                  <PlusCircle size={12} />
                  <span>Book Appointment Slot</span>
                </button>
              </form>
            </div>

            {/* CREATE BILLING INVOICE FORM */}
            <div className="bg-[#E8F5E9]/30 border-2 border-[#2C2C2C] p-4 rounded-xl shadow-[2px_3px_0_#2C2C2C]">
              <h3 className="text-xs font-marker font-extrabold text-emerald-700 mb-3 flex items-center gap-1.5 uppercase">
                <Receipt size={13} />
                <span>2. Generate Billing Invoice</span>
              </h3>
              <form onSubmit={handleCreateInvoice} className="space-y-3">
                <div>
                  <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={invPatient}
                    onChange={(e) => setInvPatient(e.target.value)}
                    placeholder="e.g. Pooja Patel"
                    className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <label className="block text-[8px] font-marker font-bold text-[#5A5A5A] uppercase mb-0.5">Consult (₹)</label>
                    <input
                      type="number"
                      value={invConsult}
                      onChange={(e) => setInvConsult(e.target.value)}
                      className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2 py-1 text-xs text-[#2C2C2C] focus:outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-marker font-bold text-[#5A5A5A] uppercase mb-0.5">Treatment (₹)</label>
                    <input
                      type="number"
                      value={invTreatment}
                      onChange={(e) => setInvTreatment(e.target.value)}
                      placeholder="800"
                      className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2 py-1 text-xs text-[#2C2C2C] focus:outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-marker font-bold text-[#5A5A5A] uppercase mb-0.5">Medication (₹)</label>
                    <input
                      type="number"
                      value={invMeds}
                      onChange={(e) => setInvMeds(e.target.value)}
                      placeholder="200"
                      className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2 py-1 text-xs text-[#2C2C2C] focus:outline-none font-sans"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-sketch w-full py-2 text-xs flex items-center justify-center gap-1.5 bg-emerald-100 border-emerald-500 text-emerald-800 hover:bg-emerald-200">
                  <Receipt size={12} />
                  <span>Generate Invoice Tally</span>
                </button>
              </form>
            </div>

            {/* ADD DIGITAL PRESCRIPTION FORM */}
            <div className="bg-[#E1F5FE]/30 border-2 border-[#2C2C2C] p-4 rounded-xl shadow-[2px_3px_0_#2C2C2C]">
              <h3 className="text-xs font-marker font-extrabold text-[#0284C7] mb-3 flex items-center gap-1.5 uppercase">
                <FileText size={13} />
                <span>3. Prescribe Digital Rx</span>
              </h3>
              <form onSubmit={handleAddPrescription} className="space-y-3">
                <div>
                  <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={rxPatient}
                    onChange={(e) => setRxPatient(e.target.value)}
                    placeholder="e.g. Pooja Patel"
                    className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Diagnosis</label>
                  <input
                    type="text"
                    value={rxDiagnosis}
                    onChange={(e) => setRxDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Gastritis"
                    className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Medicines & Dosage</label>
                  <input
                    type="text"
                    value={rxMeds}
                    onChange={(e) => setRxMeds(e.target.value)}
                    placeholder="e.g. Tab Pantocid 40mg 1-0-0"
                    className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-marker font-bold text-[#5A5A5A] uppercase mb-1">Physician Advice</label>
                  <input
                    type="text"
                    value={rxNotes}
                    onChange={(e) => setRxNotes(e.target.value)}
                    placeholder="e.g. Drink warm water, avoid spicy food"
                    className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none font-sans font-semibold"
                  />
                </div>
                <button type="submit" className="btn-sketch w-full py-2 text-xs flex items-center justify-center gap-1.5 bg-sky-100 border-sky-500 text-sky-800 hover:bg-sky-200">
                  <FileText size={12} />
                  <span>Commit Rx to Vault</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* PANEL B: WORKSPACE MONITOR (Center - 5 Cols) */}
        <section className="lg:col-span-5 sketch-card bg-white flex flex-col h-full shadow-[5px_6px_0_#2C2C2C] border-3 border-[#2C2C2C] overflow-hidden">
          {/* TABS SELECTOR HEADER */}
          <div className="border-b-3 border-[#2C2C2C] bg-[#FAF6EE] flex">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex-1 py-3 px-2 font-marker font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 border-r-3 border-[#2C2C2C] hover:bg-[#FFF9C4]/20 transition-all ${activeTab === "appointments" ? "bg-white border-b-4 border-b-[#F97316] text-[#2C2C2C] select-none" : "text-gray-500"}`}
            >
              <Calendar size={13} className={activeTab === "appointments" ? "text-[#F97316]" : ""} />
              <span>Appointments</span>
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`flex-1 py-3 px-2 font-marker font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 border-r-3 border-[#2C2C2C] hover:bg-[#FFF9C4]/20 transition-all ${activeTab === "invoices" ? "bg-white border-b-4 border-b-emerald-500 text-[#2C2C2C] select-none" : "text-gray-500"}`}
            >
              <Receipt size={13} className={activeTab === "invoices" ? "text-emerald-500" : ""} />
              <span>Billing ledger</span>
            </button>
            <button
              onClick={() => setActiveTab("prescriptions")}
              className={`flex-1 py-3 px-2 font-marker font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 hover:bg-[#FFF9C4]/20 transition-all ${activeTab === "prescriptions" ? "bg-white border-b-4 border-b-[#0284C7] text-[#2C2C2C] select-none" : "text-gray-500"}`}
            >
              <FileText size={13} className={activeTab === "prescriptions" ? "text-[#0284C7]" : ""} />
              <span>Rx Vault</span>
            </button>
          </div>

          {/* ACTIVE GRID WORKSPACE */}
          <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col p-4">
            <div className="flex-grow overflow-y-auto max-h-[460px] space-y-3 pr-1">
              
              {/* Tab Content: APPOINTMENTS */}
              {activeTab === "appointments" && (
                appointments.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 italic mt-24">No clinic appointments scheduled today.</p>
                ) : (
                  appointments.map(apt => (
                    <div key={apt.id} className={`border-2 border-[#2C2C2C] p-3.5 rounded-xl shadow-[2px_2.5px_0_#2C2C2C] transition-all bg-white relative`}>
                      <span className={`absolute top-2.5 right-2.5 text-[9px] font-marker font-extrabold uppercase border px-2 py-0.5 rounded-full ${apt.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-amber-50 text-amber-700 border-amber-300 animate-pulse"}`}>
                        {apt.status}
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-[#2C2C2C] font-extrabold text-sm flex items-center gap-1.5">
                          <Activity size={14} className="text-[#F97316]" />
                          <span>{apt.patientName}</span>
                        </h4>
                        <p className="text-[10px] text-gray-500 font-mono">Assigned Doctor: <span className="font-sans font-bold text-[#2C2C2C]">{apt.doctorName}</span></p>
                        <p className="text-[10px] text-gray-500 font-mono">Slot Time: <span className="font-sans font-bold text-[#2C2C2C]">{apt.slot}</span></p>
                        <p className="text-[11px] text-gray-600 font-sans italic bg-[#FAF6EE] p-1.5 rounded border border-[#2C2C2C]/5 mt-1.5">Reason: {apt.reason}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-3.5 pt-3 border-t border-dashed border-[#2C2C2C]/10 justify-end">
                        <button 
                          onClick={() => handleToggleAptStatus(apt.id)}
                          className={`px-2.5 py-1 text-[10px] font-marker font-bold border border-[#2C2C2C] rounded-lg transition-all shadow-[1px_1.5px_0_#2C2C2C] ${apt.status === "Completed" ? "bg-amber-100 hover:bg-amber-200" : "bg-emerald-100 hover:bg-emerald-200"}`}
                        >
                          {apt.status === "Completed" ? "Mark Scheduled" : "Mark Completed"}
                        </button>
                        <button 
                          onClick={() => handleDeleteApt(apt.id, apt.patientName)}
                          className="text-red-500 hover:text-red-700 p-1 border border-red-200 hover:bg-red-50 rounded-lg"
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
                  <p className="text-center text-xs text-gray-400 italic mt-24">No billing invoices raised today.</p>
                ) : (
                  invoices.map(inv => (
                    <div key={inv.id} className="border-2 border-[#2C2C2C] p-3.5 rounded-xl shadow-[2px_2.5px_0_#2C2C2C] bg-white">
                      <div className="flex justify-between items-start mb-2.5">
                        <div>
                          <h4 className="text-[#2C2C2C] font-extrabold text-sm">{inv.patientName}</h4>
                          <span className="text-[8px] text-gray-400 font-mono">Invoice Date: {inv.date}</span>
                        </div>
                        <span className={`text-[9px] font-marker font-extrabold uppercase border px-2 py-0.5 rounded-full ${inv.status === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-red-50 text-red-700 border-red-300 animate-pulse"}`}>
                          {inv.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-[11px] font-mono text-gray-500 bg-[#FAF6EE] p-2 rounded-xl border border-[#2C2C2C]/5">
                        <div className="flex justify-between"><span>Consult Fee:</span> <span className="font-sans font-bold text-[#2C2C2C]">₹{inv.consultFee}</span></div>
                        <div className="flex justify-between"><span>Treatment Fee:</span> <span className="font-sans font-bold text-[#2C2C2C]">₹{inv.treatmentFee}</span></div>
                        <div className="flex justify-between"><span>Medications:</span> <span className="font-sans font-bold text-[#2C2C2C]">₹{inv.medFee}</span></div>
                        <div className="flex justify-between border-t border-dashed border-[#2C2C2C]/10 pt-1 text-xs font-bold text-[#2C2C2C]">
                          <span>TALLY TOTAL:</span> <span>₹{inv.total}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3.5 justify-end">
                        <button 
                          onClick={() => handleToggleInvoiceStatus(inv.id, inv.patientName, inv.total)}
                          className={`px-2.5 py-1 text-[10px] font-marker font-bold border border-[#2C2C2C] rounded-lg transition-all shadow-[1px_1.5px_0_#2C2C2C] ${inv.status === "Paid" ? "bg-red-100 hover:bg-red-200" : "bg-emerald-100 hover:bg-emerald-200"}`}
                        >
                          {inv.status === "Paid" ? "Mark Unpaid" : "Mark Paid"}
                        </button>
                        <button 
                          onClick={() => handleDeleteInvoice(inv.id, inv.patientName)}
                          className="text-red-500 hover:text-red-700 p-1 border border-red-200 hover:bg-red-50 rounded-lg"
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
                  <p className="text-center text-xs text-gray-400 italic mt-24">No prescriptions committed to the vault today.</p>
                ) : (
                  prescriptions.map(rx => (
                    <div key={rx.id} className="border-2 border-[#2C2C2C] p-3.5 rounded-xl shadow-[2px_2.5px_0_#2C2C2C] bg-white notebook-ruled">
                      <div className="flex justify-between items-start mb-2 border-b border-[#2C2C2C]/10 pb-1.5">
                        <div>
                          <h4 className="text-[#2C2C2C] font-extrabold text-sm">{rx.patientName}</h4>
                          <p className="text-[10px] text-[#0284C7] font-marker">Rx Diagnosis: {rx.diagnosis}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteRx(rx.id, rx.patientName)}
                          className="text-red-500 hover:text-red-700 p-1.5"
                          title="Purge prescription"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-700 mt-2 font-sans font-semibold">
                        <p><span className="text-[10px] font-marker text-slate-400 block leading-none">Medicines Prescribed:</span> {rx.medicines}</p>
                        <p><span className="text-[10px] font-marker text-slate-400 block leading-none">Physician Advice:</span> <span className="italic">{rx.notes}</span></p>
                        <span className="block text-[8px] text-right text-gray-400 font-mono mt-1">Authorized on: {rx.date}</span>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </section>

        {/* PANEL C: STATS & TRANSACTION LOGS (Right - 3 Cols) */}
        <section className="lg:col-span-3 sketch-card bg-white flex flex-col h-full shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] p-5">
          <h2 className="text-[#2C2C2C] text-lg font-hand font-extrabold mb-1 flex items-center gap-2">
            <Activity size={18} className="text-[#F97316]" />
            <span>Clinic Stats</span>
          </h2>
          <span className="block text-[9px] font-mono text-[#5A5A5A] mb-4">REAL-TIME CLINIC TELEMETRY</span>

          {/* Quick Metrics grid */}
          <div className="grid grid-cols-1 gap-3.5 mb-5 flex-grow-0">
            <div className="bg-[#FFF9C4]/20 border-2 border-[#2C2C2C] p-3 rounded-xl shadow-[1.5px_2px_0_#2C2C2C] flex items-center justify-between">
              <div>
                <span className="block text-[9px] font-marker text-[#5A5A5A]">APPOINTMENTS</span>
                <span className="text-xl font-hand font-black text-[#2C2C2C]">
                  {pendingApts} <span className="text-xs text-gray-500 font-sans">Pending</span> / {completedApts} <span className="text-xs text-gray-500 font-sans">Done</span>
                </span>
              </div>
              <Calendar size={18} className="text-[#F97316]" />
            </div>

            <div className="bg-[#E8F5E9]/40 border-2 border-[#2C2C2C] p-3 rounded-xl shadow-[1.5px_2px_0_#2C2C2C] flex items-center justify-between">
              <div>
                <span className="block text-[9px] font-marker text-[#5A5A5A]">TOTAL REVENUE</span>
                <span className="text-xl font-hand font-black text-emerald-700">₹{totalRevenue}</span>
              </div>
              <Receipt size={18} className="text-emerald-500" />
            </div>

            <div className="bg-[#E1F5FE]/40 border-2 border-[#2C2C2C] p-3 rounded-xl shadow-[1.5px_2px_0_#2C2C2C] flex items-center justify-between">
              <div>
                <span className="block text-[9px] font-marker text-[#5A5A5A]">PRESCRIPTIONS VAULT</span>
                <span className="text-xl font-hand font-black text-[#0284C7]">{prescriptions.length} Records</span>
              </div>
              <FileText size={18} className="text-[#0284C7]" />
            </div>
          </div>

          {/* Actions & Console */}
          <div className="flex-1 flex flex-col justify-end min-h-[180px] border-t-2 border-dashed border-[#2C2C2C]/10 pt-4 space-y-3">
            <button
              onClick={handleExportCSV}
              className="btn-sketch w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <Download size={13} />
              <span>Export {activeTab} to CSV</span>
            </button>

            <div className="flex-1 border-2 border-[#2C2C2C] bg-slate-900 text-[#10B981] font-mono text-[9px] p-2.5 rounded-xl flex flex-col min-h-[110px] max-h-[160px]">
              <span className="block text-[8px] text-[#94A3B8] font-bold border-b border-[#334155] mb-1 pb-0.5 select-none">Real-Time Console Monitor</span>
              <div className="flex-1 overflow-y-auto space-y-0.5 flex flex-col-reverse max-h-[110px]">
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
