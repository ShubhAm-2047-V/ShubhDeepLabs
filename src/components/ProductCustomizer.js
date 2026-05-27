"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, ChevronRight, ChevronLeft, CheckCircle2,
  Laptop, Code, Brain, Smartphone, Network, Database,
  Clock, FileText, Presentation, BookOpen, MessageSquare,
  Cpu, LayoutDashboard, ShieldCheck, Zap, ArrowRight,
  Globe, Flame, Eye, Link, Server,
} from "lucide-react";

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function formatINR(n) {
  if (n === 0) return "₹0";
  return "₹" + n.toLocaleString("en-IN");
}

// ─── DATA ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: "category",
    title: "Pick Your Field",
    emoji: "🎓",
    hint: "Choose the one matching your college course — sets your base price",
    type: "single",
    options: [
      { id: "diploma",     label: "Diploma",                  icon: Laptop,     color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", price: 1999 },
      { id: "engineering", label: "Engineering (B.E./B.Tech)", icon: Code,       color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", price: 6999 },
      { id: "mtech",       label: "M.Tech / Research",        icon: Cpu,        color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", price: 8999 },
      { id: "bca-mca",     label: "BCA / MCA",                icon: Database,   color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", price: 4999 },
      { id: "ai-ml",       label: "AI / ML",                  icon: Brain,      color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", price: 8999 },
      { id: "android",     label: "Android App",              icon: Smartphone, color: "bg-[#E8F5E9]", border: "border-[#26A69A]", accent: "#26A69A", price: 6499 },
    ],
  },
  {
    id: "tech",
    title: "Choose Stack",
    emoji: "⚙️",
    hint: "Select all that apply — each adds to your estimate",
    type: "multi",
    options: [
      { id: "html",           label: "HTML / CSS / JS",          icon: Globe,          color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", price: 899,  desc: "Websites & landing pages",
        tooltip: "The language of every website. HTML builds the page, CSS makes it look pretty, and JavaScript makes buttons work. 🧱\n\nBest for: College website, portfolio page, form-based project, simple admin panel." },
      { id: "python-flask",   label: "Python + Flask",           icon: Code,           color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", price: 999,  desc: "REST APIs & ML backends",
        tooltip: "Python is like giving instructions in plain English to a computer. Flask turns those instructions into a web server. 🐍\n\nBest for: Attendance system, login portal, data dashboard, anything that connects to a database." },
      { id: "react",          label: "React.js",                 icon: LayoutDashboard,color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", price: 1499, desc: "Interactive web dashboards",
        tooltip: "React makes websites feel like apps — pages change instantly without reloading. ⚡\n\nBest for: Dashboard, booking system, real-time tracker, admin panel with live updates." },
      { id: "nextjs",         label: "Next.js",                  icon: Zap,            color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", price: 1999, desc: "Full-stack SSR web apps",
        tooltip: "Next.js handles both the frontend (what users see) and backend (server) in one place. Loads super fast. 🚀\n\nBest for: E-commerce site, college portal, professional web app, SaaS platform." },
      { id: "mern",           label: "MERN Stack",               icon: Server,         color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", price: 2999, desc: "End-to-end JS portals",
        tooltip: "MERN = MongoDB + Express + React + Node.js. The full package — build both the website and the server using just JavaScript. 🏗️\n\nBest for: Social platform, hospital system, full-featured web app." },
      { id: "android-dev",    label: "Android (Java/Kotlin)",    icon: Smartphone,     color: "bg-[#E8F5E9]", border: "border-[#26A69A]", accent: "#26A69A", price: 3499, desc: "Native Android apps",
        tooltip: "Build a real app that gets installed on Android phones — just like apps on Play Store. 📱\n\nBest for: Attendance app, student tool, delivery tracker, anything your examiner can open on a phone." },
      { id: "firebase",       label: "Firebase Integration",     icon: Flame,          color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", price: 1399, desc: "Auth, real-time DB & hosting",
        tooltip: "Google's magic toolkit — adds login (Google/email), a real-time database, and file storage to any project without building a server from scratch. 🔥\n\nBest for: Adding user login, live chat, or data sync to web/Android projects." },
      { id: "db",             label: "MySQL / MongoDB",          icon: Database,       color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", price: 799,  desc: "Database design & queries",
        tooltip: "Every project needs a database — it's the filing cabinet of your app. MySQL stores data in tables (like Excel), MongoDB stores flexible data. 🗄️\n\nBest for: Student records, product lists, order history — basically any project that stores data." },
      { id: "ai-integration", label: "AI Integration",          icon: Brain,          color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", price: 2499, desc: "Gemini, GPT, Claude & more",
        tooltip: "Add a brain to your project! Connect ChatGPT, Google Gemini, or Claude via API — no need to train any model yourself. 🤖\n\nBest for: Chatbot, smart reply, AI assistant, resume analyser, content generator." },
      { id: "ml-model",       label: "ML Model",                 icon: Cpu,            color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", price: 3499, desc: "Predictions & classification",
        tooltip: "Train a computer to make smart decisions on its own using data. Uses Python libraries. 🧠\n\nBest for: Disease prediction, price forecasting, spam detection, student result analysis — data science projects." },
      { id: "opencv",         label: "OpenCV / Face Detection",  icon: Eye,            color: "bg-[#E8F5E9]", border: "border-[#26A69A]", accent: "#26A69A", price: 2999, desc: "Face & object recognition",
        tooltip: "Give your project eyes! Use a camera to detect faces, count people, read QR codes, or recognise objects. 👁️\n\nBest for: Face attendance system, security camera project, object detection, number plate reader." },
      { id: "fullstack",      label: "Full Stack + Deploy",      icon: Network,        color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", price: 4499, desc: "App + live cloud deployment",
        tooltip: "Build the complete app (frontend + backend) AND put it live on the internet so anyone with a link can use it. ☁️\n\nBest for: Projects that need to be live & accessible — demo-ready for viva or clients." },
      { id: "blockchain",     label: "Blockchain / Web3",        icon: Link,           color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", price: 5999, desc: "Smart contracts & DApps",
        tooltip: "Blockchain is a tamper-proof digital record. Build things that can never be faked or deleted — very unique for college projects! 🔗\n\nBest for: Digital certificates, voting system, supply chain tracker, NFT platform." },
    ],
  },
  {
    id: "addons",
    title: "Add-Ons",
    emoji: "✨",
    hint: "All options below are available as add-ons",
    type: "multi",
    options: [
      { id: "ppt",        label: "PPT Presentation",     icon: Presentation, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", price: 499  },
      { id: "report",     label: "Thesis Report",         icon: FileText,     color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", price: 699  },
      { id: "viva",       label: "Viva Guidance Sheet",   icon: BookOpen,     color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", price: 499  },
      { id: "remote",     label: "Remote Setup (Zoom)",   icon: ShieldCheck,  color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", price: 899  },
      { id: "deployment", label: "Cloud Deployment",      icon: Zap,          color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", price: 1699 },
      { id: "docs",       label: "Code Walkthrough Doc",  icon: Code,         color: "bg-[#E8F5E9]", border: "border-[#26A69A]", accent: "#26A69A", price: 599  },
    ],
  },
  {
    id: "timeline",
    title: "Deadline",
    emoji: "⏱️",
    hint: "Pick the closest deadline to yours",
    type: "single",
    options: [
      { id: "urgent",   label: "1–3 Days (Urgent)",    icon: Zap,          color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", price: 2799 },
      { id: "normal",   label: "4–7 Days (Standard)",  icon: Clock,        color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", price: 999  },
      { id: "relaxed",  label: "8–14 Days (Relaxed)",  icon: CheckCircle2, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", price: 499  },
      { id: "flexible", label: "Flexible / No Rush",   icon: Sparkles,     color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", price: 0    },
    ],
  },
];

// ─── PRICE CALCULATOR ─────────────────────────────────────────────────────────

function calculateTotal(selections) {
  const basePrice     = STEPS[0].options.find(o => o.id === selections.category)?.price || 0;
  const techPrice     = (selections.tech   || []).reduce((s, id) => s + (STEPS[1].options.find(o => o.id === id)?.price || 0), 0);
  const addonPrice    = (selections.addons || []).reduce((s, id) => s + (STEPS[2].options.find(o => o.id === id)?.price || 0), 0);
  const timelinePrice = STEPS[3].options.find(o => o.id === selections.timeline)?.price || 0;
  return { basePrice, techPrice, addonPrice, timelinePrice, total: basePrice + techPrice + addonPrice + timelinePrice };
}

function buildWhatsAppMessage(selections) {
  const cat    = STEPS[0].options.find(o => o.id === selections.category)?.label || "—";
  const techs  = (selections.tech   || []).map(id => STEPS[1].options.find(o => o.id === id)?.label).filter(Boolean).join(", ") || "—";
  const addons = (selections.addons || []).map(id => STEPS[2].options.find(o => o.id === id)?.label).filter(Boolean).join(", ") || "None";
  const time   = STEPS[3].options.find(o => o.id === selections.timeline)?.label || "—";
  const { total } = calculateTotal(selections);

  return encodeURIComponent(
    `Hello ShubDeep Labs! 👋\n\nI used your Project Customizer and here is my requirement:\n\n🎓 Level: ${cat}\n⚙️ Tech Stack: ${techs}\n✨ Add-Ons: ${addons}\n⏱️ Timeline: ${time}\n💰 My Estimate: ${formatINR(total)}\n\nPlease confirm the final quote for my custom project!`
  );
}

// ─── OPTION CARD ─────────────────────────────────────────────────────────────

function OptionCard({ option, selected, onToggle, isBase = false }) {
  const cardRef  = useRef(null);
  const [tipPos, setTipPos] = useState(null);
  const Icon     = option.icon;
  const isSelected = Array.isArray(selected) ? selected.includes(option.id) : selected === option.id;

  const priceLabel = isBase
    ? `from ${formatINR(option.price)}`
    : option.price === 0
    ? "Free 🌿"
    : `+ ${formatINR(option.price)}`;

  function handleMouseEnter() {
    if (!option.tooltip || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setTipPos({ x: r.left + r.width / 2, y: r.top });
  }

  return (
    <>
      {/* Fixed-position tooltip — escapes modal overflow clipping */}
      <AnimatePresence>
        {tipPos && option.tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[200] pointer-events-none"
            style={{ left: tipPos.x, top: tipPos.y, transform: "translate(-50%, calc(-100% - 12px))" }}
          >
            <div className="w-64 bg-[#1E1E1E] rounded-2xl p-4 border-2 border-[#FFF59D] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <p className="font-marker font-extrabold text-[#FFF59D] text-xs mb-2">
                {option.label}
              </p>
              {option.tooltip.split("\n\n").map((para, i) => (
                <p key={i} className={`font-sans text-[11px] leading-relaxed ${
                  i === 0 ? "text-[#E0E0E0] mb-2" : "text-[#A5D6A7] font-semibold"
                }`}>
                  {para}
                </p>
              ))}
            </div>
            {/* Caret arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
              style={{ borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "7px solid #1E1E1E" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={cardRef}
        id={`customizer-option-${option.id}`}
        onClick={() => onToggle(option.id)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setTipPos(null)}
        className={`w-full relative flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 transition-all duration-150 cursor-pointer select-none p-3
          ${isSelected
            ? `${option.color} ${option.border} shadow-[3px_3px_0_#2C2C2C] scale-[0.97] ring-2 ring-[#2C2C2C]`
            : "bg-white border-[#2C2C2C]/30 hover:border-[#2C2C2C] hover:shadow-[2px_2px_0_#2C2C2C] hover:scale-[0.98]"
          }`}
      >
        {isSelected && (
          <span className="absolute top-1 right-1.5 text-[10px] font-black text-[#2C2C2C]">✓</span>
        )}
        <Icon className="w-5 h-5 shrink-0" style={{ color: option.accent }} />
        <span className="font-marker font-bold text-[#2C2C2C] text-center leading-tight text-[11px]">
          {option.label}
        </span>
        {option.desc && (
          <span className={`text-[9px] font-sans text-center leading-tight px-1 transition-colors
            ${isSelected ? "text-[#2C2C2C]/70" : "text-[#8A8A8A]"}`}>
            {option.desc}
          </span>
        )}
        <span
          className={`text-[10px] font-bold font-mono rounded-full px-2 py-0.5 whitespace-nowrap transition-colors
            ${isSelected ? "bg-[#2C2C2C] text-[#FFF59D]" : "bg-[#F0F0F0] text-[#5A5A5A]"}`}
        >
          {priceLabel}
        </span>
        {option.tooltip && (
          <span className="absolute bottom-1 left-1.5 text-[8px] text-[#B0B0B0] font-sans">hold to know more</span>
        )}
      </button>
    </>
  );
}

// ─── LIVE PRICE TICKER ────────────────────────────────────────────────────────

function PriceTicker({ total, hasBase }) {
  return (
    <motion.div
      layout
      className="flex items-center gap-2 bg-[#2C2C2C] text-[#FFF59D] px-4 py-2 rounded-xl border-2 border-[#2C2C2C] shadow-[2px_3px_0_#66BB6A]"
    >
      <span className="text-[10px] font-marker font-bold text-[#A0A0A0] whitespace-nowrap">Est. Total</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={total}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{   y:  8,  opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-base font-marker font-extrabold whitespace-nowrap"
        >
          {hasBase ? formatINR(total) : "—"}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

// ─── SUMMARY SCREEN ───────────────────────────────────────────────────────────

function SummaryScreen({ selections, onBack, onReset }) {
  const cat    = STEPS[0].options.find(o => o.id === selections.category)?.label || "—";
  const techs  = (selections.tech   || []).map(id => STEPS[1].options.find(o => o.id === id)?.label).filter(Boolean);
  const addons = (selections.addons || []).map(id => STEPS[2].options.find(o => o.id === id)?.label).filter(Boolean);
  const time   = STEPS[3].options.find(o => o.id === selections.timeline)?.label || "—";
  const { basePrice, techPrice, addonPrice, timelinePrice, total } = calculateTotal(selections);
  const waUrl  = `https://wa.me/919028833275?text=${buildWhatsAppMessage(selections)}`;

  return (
    <motion.div
      key="summary"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="flex flex-col gap-4"
    >
      {/* Tape sticker header */}
      <div className="text-center">
        <div className="inline-block bg-[#FFF59D]/80 border border-dashed border-[#2C2C2C] px-4 py-1 text-[11px] font-marker uppercase rotate-[-1deg] text-[#2C2C2C]">
          Your Custom Order Summary 📋
        </div>
      </div>

      {/* Selection rows */}
      <div className="space-y-2">
        {[
          { label: "🎓 Level",    value: cat },
          { label: "⚙️ Stack",   value: techs.join(", ")  || "—" },
          { label: "✨ Add-Ons",  value: addons.length ? addons.join(", ") : "None" },
          { label: "⏱️ Timeline", value: time },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-2 bg-[#FAF6EE] border border-dashed border-[#2C2C2C]/30 rounded-xl px-3 py-2">
            <span className="font-marker font-extrabold text-[#2C2C2C] shrink-0 text-xs">{label}</span>
            <span className="font-sans text-[#5A5A5A] text-xs leading-tight">{value}</span>
          </div>
        ))}
      </div>

      {/* Price breakdown card */}
      <div className="bg-[#2C2C2C] rounded-2xl p-4 border-2 border-[#2C2C2C] shadow-[4px_5px_0_#FFCA28]">
        <p className="font-marker font-extrabold text-[#FFF59D] text-xs uppercase tracking-wider mb-3">
          💰 Price Breakdown
        </p>
        <div className="space-y-2">
          {[
            { label: "Base (Level)",  value: basePrice,     icon: "🎓" },
            { label: "Tech Stack",    value: techPrice,     icon: "⚙️" },
            { label: "Add-Ons",       value: addonPrice,    icon: "✨" },
            { label: "Timeline",      value: timelinePrice, icon: "⏱️" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="font-marker text-[#A0A0A0] text-xs">{icon} {label}</span>
              <span className="font-marker font-bold text-white text-xs">
                {value === 0 ? "Free 🌿" : formatINR(value)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#FFF59D]/25 mt-3 pt-3 flex justify-between items-center">
          <span className="font-marker font-extrabold text-[#FFF59D] text-sm">Total Estimate</span>
          <motion.span
            key={total}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="font-marker font-extrabold text-[#FFF59D] text-xl"
          >
            {formatINR(total)}
          </motion.span>
        </div>
        <p className="text-[9px] font-sans text-[#606060] text-center mt-2">
          * Estimate only. Send to WhatsApp for the exact confirmed quote.
        </p>
      </div>

      {/* Actions */}
      <div className="border-t-2 border-dashed border-[#2C2C2C]/20 pt-3 space-y-2">
        <a
          id="customizer-send-whatsapp"
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#A5D6A7] border-2 border-[#2C2C2C] rounded-xl font-marker font-bold text-[#2C2C2C] text-sm shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-[#2C2C2C]" />
          Send to WhatsApp &amp; Get Quote
          <ArrowRight className="w-4 h-4" />
        </a>
        <div className="flex gap-2">
          <button
            id="customizer-back-summary"
            onClick={onBack}
            className="flex-1 py-2.5 px-3 border-2 border-[#2C2C2C]/40 rounded-xl font-marker text-xs text-[#5A5A5A] hover:border-[#2C2C2C] hover:bg-[#FAF6EE] transition-all"
          >
            ← Edit
          </button>
          <button
            id="customizer-reset"
            onClick={onReset}
            className="flex-1 py-2.5 px-3 border-2 border-[#2C2C2C]/40 rounded-xl font-marker text-xs text-[#5A5A5A] hover:border-[#2C2C2C] hover:bg-[#FAF6EE] transition-all"
          >
            🔄 Start Over
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ProductCustomizer() {
  const [open, setOpen]               = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections]   = useState({ category: null, tech: [], addons: [], timeline: null });
  const [showSummary, setShowSummary] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showNudge, setShowNudge]     = useState(false);
  const panelRef = useRef(null);

  const step       = STEPS[currentStep];
  const totalSteps = STEPS.length;

  // Nudge tooltip after 5 s
  useEffect(() => {
    const t = setTimeout(() => { if (!open) setShowNudge(true); }, 5000);
    return () => clearTimeout(t);
  }, []);

  // Lock scroll when modal open
  useEffect(() => {
    if (open) {
      setShowNudge(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleToggle(id) {
    const key = step.id;
    if (step.type === "single") {
      setSelections(prev => ({ ...prev, [key]: id }));
    } else {
      setSelections(prev => {
        const arr = prev[key] || [];
        return { ...prev, [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] };
      });
    }
    setHasInteracted(true);
  }

  function canProceed() {
    const key = step.id;
    if (step.type === "single") return !!selections[key];
    return (selections[key] || []).length > 0;
  }

  function handleNext() {
    if (currentStep < totalSteps - 1) setCurrentStep(p => p + 1);
    else setShowSummary(true);
  }

  function handleBack() {
    if (showSummary) setShowSummary(false);
    else if (currentStep > 0) setCurrentStep(p => p - 1);
  }

  function handleReset() {
    setCurrentStep(0);
    setSelections({ category: null, tech: [], addons: [], timeline: null });
    setShowSummary(false);
    setHasInteracted(false);
  }

  const progress = showSummary ? 100 : (currentStep / totalSteps) * 100;
  const { total } = calculateTotal(selections);
  const hasBase    = !!selections.category;

  return (
    <>
      {/* ── FULL-SCREEN MODAL OVERLAY ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{ backgroundColor: "rgba(44,44,44,0.55)", backdropFilter: "blur(6px)" }}
          >
            {/* Modal card */}
            <motion.div
              key="panel"
              ref={panelRef}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="w-full max-w-2xl bg-[#FAF6EE] border-[3px] border-[#2C2C2C] rounded-2xl shadow-[8px_10px_0_#2C2C2C] overflow-hidden flex flex-col"
              style={{ maxHeight: "90vh" }}
            >
              {/* Header */}
              <div className="relative bg-[#FFF59D] border-b-[3px] border-[#2C2C2C] px-6 py-4 flex items-center justify-between shrink-0">
                <div className="absolute top-3 left-3 w-3 h-3 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
                <div className="absolute top-3 right-14 w-3 h-3 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <h2 className="font-marker font-extrabold text-[#2C2C2C] text-lg leading-none">
                      Project Customiser
                    </h2>
                    <p className="font-marker text-xs text-[#6A6A6A] mt-0.5">
                      Build your perfect academic project
                    </p>
                  </div>
                </div>
                <button
                  id="customizer-close"
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#FFCDD2] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress bar */}
              {!showSummary && (
                <div className="w-full h-2 bg-[#E0E0E0] shrink-0">
                  <motion.div
                    className="h-full bg-[#2C2C2C]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              {/* Step counter */}
              {!showSummary && (
                <div className="flex justify-between px-6 pt-3 pb-0 shrink-0">
                  {STEPS.map((s, i) => (
                    <div
                      key={s.id}
                      className={`flex items-center gap-1.5 text-xs font-marker font-bold transition-colors duration-200
                        ${i === currentStep ? "text-[#2C2C2C]" : i < currentStep ? "text-[#66BB6A]" : "text-[#C0C0C0]"}`}
                    >
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px]
                        ${i === currentStep ? "border-[#2C2C2C] bg-[#FFF59D]" : i < currentStep ? "border-[#66BB6A] bg-[#E8F5E9]" : "border-[#C0C0C0]"}`}>
                        {i < currentStep ? "✓" : i + 1}
                      </span>
                      <span className="hidden sm:inline">{s.emoji} {s.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-4 overflow-y-auto flex-1">
                <AnimatePresence mode="wait">
                  {showSummary ? (
                    <SummaryScreen
                      key="summary"
                      selections={selections}
                      onBack={handleBack}
                      onReset={handleReset}
                    />
                  ) : (
                    <motion.div
                      key={`step-${currentStep}`}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4"
                    >
                      {/* Step header */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{step.emoji}</span>
                          <h3 className="font-marker font-extrabold text-[#2C2C2C] text-xl">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-sm font-sans text-[#6A6A6A]">{step.hint}</p>
                      </div>

                      {/* Options grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {step.options.map(option => (
                          <OptionCard
                            key={option.id}
                            option={option}
                            selected={step.type === "single" ? selections[step.id] : selections[step.id] || []}
                            onToggle={handleToggle}
                            isBase={step.id === "category"}
                          />
                        ))}
                      </div>

                      {step.type === "multi" && (
                        <p className="text-xs font-marker text-[#6A6A6A] text-center">
                          Tap to select / deselect multiple options
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Nav */}
              {!showSummary && (
                <div className="px-6 py-4 border-t-2 border-dashed border-[#2C2C2C]/20 flex items-center justify-between gap-3 shrink-0">
                  <button
                    id="customizer-back"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1 text-sm font-marker font-bold text-[#5A5A5A] disabled:opacity-30 hover:text-[#2C2C2C] transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>

                  {/* Live price ticker */}
                  <PriceTicker total={total} hasBase={hasBase} />

                  <button
                    id="customizer-next"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 text-sm font-marker font-extrabold px-6 py-2.5 rounded-xl border-2 border-[#2C2C2C] transition-all
                      ${canProceed()
                        ? "bg-[#2C2C2C] text-[#FAF6EE] shadow-[2px_3px_0_#FAF6EE] hover:shadow-[3px_4px_0_#A5D6A7] hover:-translate-y-0.5 cursor-pointer"
                        : "bg-[#E0E0E0] text-[#A0A0A0] cursor-not-allowed opacity-60"
                      }`}
                  >
                    {currentStep === totalSteps - 1 ? (
                      <>See Summary <CheckCircle2 className="w-4 h-4" /></>
                    ) : (
                      <>Next <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB + NUDGE (fixed bottom-right) ── */}
      <div className="fixed bottom-[5.5rem] right-6 z-50 flex flex-col items-end gap-3">

        {/* Nudge tooltip */}
        <AnimatePresence>
          {showNudge && !open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              className="mr-1 pointer-events-none"
            >
              <div className="bg-[#FAF6EE] text-[#2C2C2C] px-3 py-1.5 rounded-xl text-sm font-marker font-semibold shadow-md whitespace-nowrap border-2 border-[#2C2C2C]">
                🎨 Customise Your Project!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger button */}
        <div className="flex items-center group font-marker">
          <div className="mr-3 scale-0 group-hover:scale-100 origin-right transition-transform duration-200 pointer-events-none">
            <div className="bg-[#FAF6EE] text-[#2C2C2C] px-3.5 py-1.5 rounded-xl text-sm font-semibold shadow-md whitespace-nowrap border-2 border-[#2C2C2C]">
              Customise Project!
            </div>
          </div>

          <motion.button
            id="customizer-fab"
            onClick={() => { setOpen(p => !p); setShowNudge(false); }}
            aria-label="Open Project Customiser"
            className={`w-14 h-14 rounded-full flex items-center justify-center text-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:shadow-[4px_5px_0_#2C2C2C] transition-all duration-200 border-2 border-[#2C2C2C] relative
              ${open ? "bg-[#FFCDD2]" : "bg-[#90CAF9]"}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: open ? 0 : [0, -6, 0] }}
            transition={{
              scale:   { delay: 1.2, duration: 0.3 },
              opacity: { delay: 1.2, duration: 0.3 },
              y: { repeat: open ? 0 : Infinity, duration: 3.5, ease: "easeInOut" },
            }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            {hasInteracted && !open && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#EF5350] rounded-full border border-[#2C2C2C] animate-ping" />
            )}
            {hasInteracted && !open && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#EF5350] rounded-full border border-[#2C2C2C]" />
            )}
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="w-6 h-6" />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Sparkles className="w-6 h-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </>
  );
}
