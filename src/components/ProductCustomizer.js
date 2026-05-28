"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, ChevronRight, ChevronLeft, CheckCircle2,
  Laptop, Code, Brain, Smartphone, Network, Database,
  Clock, FileText, Presentation, BookOpen, MessageSquare,
  Cpu, LayoutDashboard, ShieldCheck, Zap, ArrowRight,
  Globe, Flame, Eye, Link, Server,
  Gift, Tag, Star, AlertCircle, RefreshCw, Copy, Check,
} from "lucide-react";
import { dbService } from "@/lib/supabase";

// ─── HELPERS ───────────────────────────────────────────────────────────────────

export function formatINR(n) {
  if (n === 0) return "₹0";
  return "₹" + n.toLocaleString("en-IN");
}

// ─── DATA ──────────────────────────────────────────────────────────────────────

export const STEPS = [
  {
    id: "category",
    title: "Pick Your Field",
    emoji: "🎓",
    hint: "Choose the one matching your college course — sets your base price",
    type: "single",
    options: [
      { id: "diploma",     label: "Diploma",                  icon: Laptop,     color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", price: 1999 },
      { id: "engineering", label: "Engineering (B.E./B.Tech)", icon: Code,       color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", price: 4999 },
      { id: "mtech",       label: "M.Tech / Research",        icon: Cpu,        color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", price: 8999 },
      { id: "bca-mca",     label: "BCA / MCA",                icon: Database,   color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", price: 3999 },
      { id: "ai-ml",       label: "AI / ML",                  icon: Brain,      color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", price: 6999 },
      { id: "android",     label: "Android App",              icon: Smartphone, color: "bg-[#E8F5E9]", border: "border-[#26A69A]", accent: "#26A69A", price: 5499 },
    ],
  },
  {
    id: "tech",
    title: "Choose Stack",
    emoji: "⚙️",
    hint: "Select all that apply — each adds to your estimate",
    type: "multi",
    options: [
      { id: "html",           label: "HTML / CSS / JS",          icon: Globe,          color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", price: 0,    desc: "Websites & landing pages",
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
      { id: "firebase",       label: "Firebase Integration",     icon: Flame,          color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", price: 999,  desc: "Auth, real-time DB & hosting",
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
      { id: "report",     label: "Thesis Report",         icon: FileText,     color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", price: 999  },
      { id: "viva",       label: "Viva Guidance Sheet",   icon: BookOpen,     color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", price: 399  },
      { id: "remote",     label: "Remote Setup (Zoom)",   icon: ShieldCheck,  color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", price: 699  },
      { id: "deployment", label: "Cloud Deployment",      icon: Zap,          color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", price: 1499 },
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
      { id: "urgent",   label: "1–3 Days (Urgent)",    icon: Zap,          color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", price: 2499 },
      { id: "normal",   label: "4–7 Days (Standard)",  icon: Clock,        color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", price: 999  },
      { id: "relaxed",  label: "8–14 Days (Relaxed)",  icon: CheckCircle2, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", price: 0    },
      { id: "flexible", label: "Flexible / No Rush",   icon: Sparkles,     color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", price: 0    },
    ],
  },
];

// ─── PRICE CALCULATOR ─────────────────────────────────────────────────────────

export function calculateTotal(selections, customPrices = {}) {
  const isDiploma = selections.category === "diploma";
  const getVal = (id, def) => (customPrices[id] !== undefined ? customPrices[id] : def);

  const categoryOpt = STEPS[0].options.find(o => o.id === selections.category);
  const basePrice = categoryOpt ? getVal(categoryOpt.id, categoryOpt.price) : 0;
  
  const techPrice     = (selections.tech   || []).reduce((s, id) => {
    const opt = STEPS[1].options.find(o => o.id === id);
    if (!opt) return s;
    const origPrice = getVal(opt.id, opt.price);
    const price = isDiploma ? Math.floor(origPrice / 2) : origPrice;
    return s + price;
  }, 0);
  
  const addonPrice    = (selections.addons || []).reduce((s, id) => {
    const opt = STEPS[2].options.find(o => o.id === id);
    if (!opt) return s;
    const origPrice = getVal(opt.id, opt.price);
    const price = isDiploma ? Math.floor(origPrice / 2) : origPrice;
    return s + price;
  }, 0);
  
  const timelinePrice = (() => {
    const opt = STEPS[3].options.find(o => o.id === selections.timeline);
    if (!opt) return 0;
    const origPrice = getVal(opt.id, opt.price);
    return isDiploma ? Math.floor(origPrice / 2) : origPrice;
  })();
  
  return { basePrice, techPrice, addonPrice, timelinePrice, total: basePrice + techPrice + addonPrice + timelinePrice };
}

export function buildWhatsAppMessage(selections, customPrices) {
  const cat    = STEPS[0].options.find(o => o.id === selections.category)?.label || "—";
  const techs  = (selections.tech   || []).map(id => STEPS[1].options.find(o => o.id === id)?.label).filter(Boolean).join(", ") || "—";
  const addons = (selections.addons || []).map(id => STEPS[2].options.find(o => o.id === id)?.label).filter(Boolean).join(", ") || "None";
  const time   = STEPS[3].options.find(o => o.id === selections.timeline)?.label || "—";
  const { total } = calculateTotal(selections, customPrices);

  return encodeURIComponent(
    `Hello ShubDeep Labs! 👋\n\nI used your Project Customizer and here is my requirement:\n\n🎓 Level: ${cat}\n⚙️ Tech Stack: ${techs}\n✨ Add-Ons: ${addons}\n⏱️ Timeline: ${time}\n💰 My Estimate: ${formatINR(total)}\n\nPlease confirm the final quote for my custom project!`
  );
}

// ─── OPTION CARD ─────────────────────────────────────────────────────────────

function OptionCard({ option, selected, onToggle, isBase = false, displayPrice }) {
  const cardRef  = useRef(null);
  const [tipPos, setTipPos] = useState(null);
  const Icon     = option.icon;
  const isSelected = Array.isArray(selected) ? selected.includes(option.id) : selected === option.id;

  const actualPrice = displayPrice !== undefined ? displayPrice : option.price;

  const priceLabel = isBase
    ? `from ${formatINR(actualPrice)}`
    : actualPrice === 0
    ? "Free 🌿"
    : `+ ${formatINR(actualPrice)}`;

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
          <span className="absolute bottom-1 left-1.5 text-[8px] text-[#B0B0B0] font-sans hidden sm:block">hold to know more</span>
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

function SummaryScreen({ selections, onBack, onReset, customPrices }) {
  const cat    = STEPS[0].options.find(o => o.id === selections.category)?.label || "—";
  const techs  = (selections.tech   || []).map(id => STEPS[1].options.find(o => o.id === id)?.label).filter(Boolean);
  const addons = (selections.addons || []).map(id => STEPS[2].options.find(o => o.id === id)?.label).filter(Boolean);
  const time   = STEPS[3].options.find(o => o.id === selections.timeline)?.label || "—";
  const { basePrice, techPrice, addonPrice, timelinePrice, total } = calculateTotal(selections, customPrices);
  const waUrl  = `https://wa.me/919028833275?text=${buildWhatsAppMessage(selections, customPrices)}`;

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

// ─── OFFERS PANEL ─────────────────────────────────────────────────────────────

function OffersPanel({ selections = {}, customPrices = {} }) {
  const [activeOffer, setActiveOffer] = useState({
    title: "First 8 Special Students of Diploma get 30% OFF + Assured Free Gift!",
    subtext: "* T&C apply. Connect on WhatsApp to reserve your discount spot.",
    ribbon: "Special Offer!",
    emoji: "🎁",
  });
  const [offers, setOffers]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [copied, setCopied]     = useState(false);

  // Scratch card states
  const canvasRef = useRef(null);
  const [isRevealed,  setIsRevealed]  = useState(false);
  const [isDrawing,   setIsDrawing]   = useState(false);
  const [lastPos,     setLastPos]     = useState({ x: 0, y: 0 });
  const [erasedPct,   setErasedPct]   = useState(0);
  const [boosterCode, setBoosterCode] = useState("STUDENT5EXTRA");
  const [scratchCfg,  setScratchCfg]  = useState({ discountPercent: 5, codes: ["STUDENT5EXTRA", "COUPON5HUB", "VIVABOOST5", "FINAL5PASS"] });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const active = await dbService.getActiveOffer();
      if (active) setActiveOffer(active);
      const all = await dbService.getOffers();
      setOffers(all);
      const cfg = await dbService.getScratchSettings();
      if (cfg) {
        setScratchCfg(cfg);
        const codes = cfg.codes || ["STUDENT5EXTRA"];
        let code = codes[Math.floor(Math.random() * codes.length)];
        code = code.replace(/\d+/g, String(cfg.discountPercent || 5));
        setBoosterCode(code);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (!isRevealed) setTimeout(initCanvas, 60);
  }, [isRevealed, boosterCode, loading]);

  function initCanvas() {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;
    c.width    = (rect.width  || 280) * dpr;
    c.height   = (rect.height || 140) * dpr;
    c.style.width  = `${rect.width}px`;
    c.style.height = `${rect.height}px`;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#263238";
    ctx.fillRect(0, 0, rect.width, rect.height);
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = Math.random() > 0.4 ? "#1E272C" : "#37474F";
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 2, Math.random() * 2);
    }
    ctx.strokeStyle = "#FFF59D"; ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
    ctx.strokeRect(10, 10, rect.width - 20, rect.height - 20);
    ctx.setLineDash([]);
    ctx.font = "22px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🔥", rect.width / 2, rect.height / 2 - 22);
    ctx.fillStyle = "#FFF9C4"; ctx.font = "bold 16px sans-serif";
    ctx.fillText("SCRATCH TO REVEAL CODE", rect.width / 2, rect.height / 2 + 4);
    ctx.fillStyle = "#ECEFF1"; ctx.font = "bold 10px sans-serif";
    ctx.fillText("✏️ Click & drag to scratch!", rect.width / 2, rect.height / 2 + 24);
    setErasedPct(0);
  }

  function coords(e) {
    const r = canvasRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - r.left, y: cy - r.top };
  }
  function scratchAt(x, y) {
    const ctx = canvasRef.current?.getContext("2d"); if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fill();
  }
  function scratchLine(x1, y1, x2, y2) {
    const ctx = canvasRef.current?.getContext("2d"); if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.lineWidth = 36; ctx.lineCap = "round"; ctx.stroke();
  }
  function checkPct() {
    const c = canvasRef.current; if (!c) return;
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let t = 0; for (let i = 3; i < d.length; i += 4) if (d[i] === 0) t++;
    const p = Math.round((t / (d.length / 4)) * 100);
    setErasedPct(p);
    if (p >= 35 && !isRevealed) setIsRevealed(true);
  }

  function handleStart(e) { if (isRevealed) return; const p = coords(e); setIsDrawing(true); setLastPos(p); scratchAt(p.x, p.y); }
  function handleMove(e)  { if (!isDrawing || isRevealed) return; if (e.cancelable) e.preventDefault(); const p = coords(e); scratchLine(lastPos.x, lastPos.y, p.x, p.y); setLastPos(p); }
  function handleEnd()    { if (!isDrawing) return; setIsDrawing(false); checkPct(); }

  function copyCode() {
    navigator.clipboard?.writeText(boosterCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const waOfferUrl = (() => {
    const hasCategory = selections && !!selections.category;
    if (!hasCategory) {
      return `https://wa.me/919028833275?text=${encodeURIComponent(`Hello ShubDeep Labs! 👋\n\nI want to claim the Daily Special: "${activeOffer.title}" + Booster Code: ${boosterCode}`)}`;
    }
    
    const cat    = STEPS[0].options.find(o => o.id === selections.category)?.label || "—";
    const techs  = (selections.tech   || []).map(id => STEPS[1].options.find(o => o.id === id)?.label).filter(Boolean).join(", ") || "—";
    const addons = (selections.addons || []).map(id => STEPS[2].options.find(o => o.id === id)?.label).filter(Boolean).join(", ") || "None";
    const time   = STEPS[3].options.find(o => o.id === selections.timeline)?.label || "—";
    const { total } = calculateTotal(selections, customPrices);
    
    return `https://wa.me/919028833275?text=${encodeURIComponent(
      `Hello ShubDeep Labs! 👋\n\nI want to claim the Daily Special: "${activeOffer.title}"\n🎟️ Booster Code: ${boosterCode}\n\nMy Project Requirement:\n🎓 Level: ${cat}\n⚙️ Tech Stack: ${techs}\n✨ Add-Ons: ${addons}\n⏱️ Timeline: ${time}\n💰 My Estimate: ${formatINR(total)}\n\nPlease confirm the final combo quote for my custom project!`
    )}`;
  })();

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <RefreshCw className="w-8 h-8 animate-spin text-[#2C2C2C]" />
      <p className="font-marker text-sm text-[#6A6A6A]">Fetching latest offers...</p>
    </div>
  );

  return (
    <motion.div
      key="offers-panel"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-5"
    >
      {/* ── ACTIVE DEAL BANNER ── */}
      <div className="relative bg-[#FFF9C4] border-2 border-[#2C2C2C] rounded-2xl p-4 shadow-[4px_5px_0_#2C2C2C] overflow-hidden">
        {/* Live badge */}
        <span className="absolute top-2 right-2 bg-[#81C784] border border-[#2C2C2C] font-marker font-bold text-[9px] px-2 py-0.5 rounded-full shadow-[1px_1px_0_#2C2C2C] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-ping" /> LIVE
        </span>
        <div className="flex items-start gap-3">
          <span className="text-3xl shrink-0">{activeOffer.emoji || "🎁"}</span>
          <div className="flex-1 min-w-0">
            <span className="inline-block bg-[#EF5350] text-white font-marker font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider mb-1">
              {activeOffer.ribbon || "Special Offer!"}
            </span>
            <h3 className="font-marker font-extrabold text-[#2C2C2C] text-sm leading-tight">
              {activeOffer.title}
            </h3>
            <p className="font-sans text-[10px] text-[#6A6A6A] mt-1 leading-tight">
              {activeOffer.subtext}
            </p>
          </div>
        </div>
        <a
          href={waOfferUrl}
          target="_blank" rel="noopener noreferrer"
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-[#A5D6A7] border-2 border-[#2C2C2C] rounded-xl font-marker font-bold text-[#2C2C2C] text-xs shadow-[2px_3px_0_#2C2C2C] hover:shadow-[3px_4px_0_#2C2C2C] hover:-translate-y-0.5 transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-[#2C2C2C]" />
          Claim this deal on WhatsApp
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* ── SCRATCH COUPON ── */}
      <div className="bg-white border-2 border-[#2C2C2C] rounded-2xl p-4 shadow-[4px_5px_0_#2C2C2C] text-center">
        <p className="font-marker font-extrabold text-[#2C2C2C] text-sm mb-0.5">✏️ Scratch &amp; Get Extra {scratchCfg.discountPercent}% OFF</p>
        <p className="font-sans text-[10px] text-[#6A6A6A] mb-3">Scratch the card below to reveal your secret booster code!</p>

        {/* Canvas scratch area */}
        <div className="relative w-full h-36 border-2 border-[#2C2C2C] rounded-xl overflow-hidden bg-[#FFF9C4] shadow-inner">
          {/* Revealed code */}
          {isRevealed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-0">
              <p className="text-[9px] font-marker font-bold text-[#7B1FA2] uppercase tracking-widest animate-bounce">★ Code Revealed! ★</p>
              <div className="bg-white border-2 border-dashed border-[#2C2C2C] px-4 py-2 rounded-lg shadow-[2px_2px_0_#2C2C2C] rotate-[-1deg]">
                <span className="font-mono font-bold text-xl text-[#2C2C2C] tracking-widest select-all">{boosterCode}</span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 text-[10px] font-marker font-bold px-3 py-1 bg-[#FFF59D] border border-[#2C2C2C] rounded-full shadow-[1px_1px_0_#2C2C2C] hover:bg-[#FFCA28] transition-colors"
              >
                {copied ? <><Check className="w-3 h-3 text-green-600" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy code</>}
              </button>
            </div>
          )}
          {/* Scratch canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleEnd}
            onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none select-none rounded-xl z-10 transition-opacity duration-500"
            style={{ opacity: isRevealed ? 0 : 1, pointerEvents: isRevealed ? "none" : "auto" }}
          />
          {!isRevealed && erasedPct > 0 && (
            <div className="absolute bottom-1 right-2 pointer-events-none">
              <span className="text-[9px] font-sans font-bold text-[#6A6A6A] bg-white/70 px-1.5 py-0.5 rounded">{erasedPct}% scratched</span>
            </div>
          )}
        </div>

        {isRevealed && (
          <a
            href={waOfferUrl}
            target="_blank" rel="noopener noreferrer"
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-[#E1BEE7] border-2 border-[#2C2C2C] rounded-xl font-marker font-bold text-[#2C2C2C] text-xs shadow-[2px_3px_0_#2C2C2C] hover:bg-[#CE93D8] hover:-translate-y-0.5 transition-all"
          >
            Apply Combo Code on WhatsApp <ArrowRight className="w-3 h-3" />
          </a>
        )}
        <p className="text-[9px] font-sans text-[#A0A0A0] mt-2">Valid with active daily deal. Combo discount applies.</p>
      </div>

      {/* ── ALL OFFERS LIST ── */}
      {offers.length > 0 && (
        <div className="space-y-2">
          <p className="font-marker font-extrabold text-[#2C2C2C] text-xs uppercase tracking-wider">📋 All Running Campaigns</p>
          {offers.map(o => (
            <div key={o.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 ${
              o.isActive ? "bg-[#F1F8E9] border-[#66BB6A]" : "bg-white border-[#2C2C2C]/20 opacity-70"
            }`}>
              <span className="text-xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-marker font-bold text-[10px] text-[#2C2C2C]">{o.ribbon}</span>
                  {o.isActive && <span className="text-[8px] bg-[#A5D6A7] text-[#1B5E20] font-bold px-1.5 rounded-full">★ ACTIVE</span>}
                </div>
                <p className="font-marker font-bold text-[#2C2C2C] text-xs leading-tight">{o.title}</p>
                <p className="font-sans text-[9px] text-[#6A6A6A] mt-0.5 leading-tight">{o.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      )}
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
  const [showOffers, setShowOffers]   = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [customPrices, setCustomPrices] = useState({});
  const panelRef = useRef(null);

  // Load initial selections from localStorage to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("shubdeeplabs_selections");
      if (local) {
        try {
          setSelections(JSON.parse(local));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Save selections to localStorage and dispatch update event
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shubdeeplabs_selections", JSON.stringify(selections));
      const ev = new CustomEvent("customizer-selections-changed", { detail: selections });
      window.dispatchEvent(ev);
    }
  }, [selections]);

  useEffect(() => {
    async function loadPrices() {
      try {
        const prices = await dbService.getCustomizerPrices();
        if (prices) setCustomPrices(prices);
      } catch (e) {
        console.error(e);
      }
    }
    loadPrices();
  }, [open]);

  // Broadcast customizer open state
  useEffect(() => {
    const ev = new CustomEvent("customizer-state", { detail: { open } });
    window.dispatchEvent(ev);
    window.__customizerOpen = open;
  }, [open]);

  // Listen to chatbot state
  useEffect(() => {
    setIsChatbotOpen(!!window.__chatbotOpen);
    const handleChatbotState = (e) => {
      setIsChatbotOpen(e.detail.open);
      if (e.detail.open && typeof window !== "undefined" && window.innerWidth < 1024) {
        setOpen(false);
      }
    };
    window.addEventListener("chatbot-state", handleChatbotState);
    return () => window.removeEventListener("chatbot-state", handleChatbotState);
  }, []);

  // Listen for custom event to open the customizer with pre-selected choices from the chatbot
  useEffect(() => {
    const handleOpenCustomizer = (e) => {
      const { category, tech, addons, timeline, showSummary: forceSummary } = e.detail || {};

      const newSelections = {
        category: category || null,
        tech: Array.isArray(tech) ? tech : [],
        addons: Array.isArray(addons) ? addons : [],
        timeline: timeline || null
      };

      // Apply selections first
      setSelections(newSelections);
      setHasInteracted(true);
      setShowOffers(false);
      setOpen(true);
      setShowNudge(false);

      // Defer summary/step navigation so selections are committed to state first
      setTimeout(() => {
        if (forceSummary && newSelections.category) {
          // Only jump to summary if we have at least a category selected
          setShowSummary(true);
        } else {
          setShowSummary(false);
          // Fast-forward to tech step if category is known
          setCurrentStep(category ? 1 : 0);
        }
      }, 50);
    };

    window.addEventListener("open-customizer", handleOpenCustomizer);
    return () => window.removeEventListener("open-customizer", handleOpenCustomizer);
  }, []);

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
  const { total } = calculateTotal(selections, customPrices);
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
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 transition-all duration-300 ${
              isChatbotOpen ? "lg:justify-end lg:pr-16" : ""
            }`}
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
              className={`w-full ${
                isChatbotOpen ? "lg:max-w-lg xl:max-w-xl" : "max-w-2xl"
              } bg-[#FAF6EE] border-[3px] border-[#2C2C2C] rounded-2xl shadow-[8px_10px_0_#2C2C2C] overflow-hidden flex flex-col transition-all duration-300`}
              style={{ maxHeight: "90vh" }}
            >
              {/* Header */}
              <div className="relative bg-[#FFF59D] border-b-[3px] border-[#2C2C2C] px-4 py-3 flex items-center justify-between shrink-0">
                <div className="absolute top-3 left-3 w-3 h-3 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full hidden sm:block" />
                <div className="absolute top-3 right-14 w-3 h-3 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full hidden sm:block" />

                {/* Tab switcher */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowOffers(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-marker font-bold text-xs transition-all
                      ${ !showOffers ? "bg-[#2C2C2C] text-[#FFF59D] border-[#2C2C2C] shadow-[2px_2px_0_#FAF6EE]" : "bg-white/60 text-[#2C2C2C] border-[#2C2C2C]/30 hover:border-[#2C2C2C]" }`}
                  >
                    🎨 Customise
                  </button>
                  <button
                    onClick={() => setShowOffers(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-marker font-bold text-xs transition-all relative
                      ${ showOffers ? "bg-[#EF5350] text-white border-[#2C2C2C] shadow-[2px_2px_0_#2C2C2C]" : "bg-white/60 text-[#2C2C2C] border-[#2C2C2C]/30 hover:border-[#EF5350]" }`}
                  >
                    🔥 Offers
                    <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-[#EF5350] border border-[#2C2C2C] rounded-full animate-ping" />
                    <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-[#EF5350] border border-[#2C2C2C] rounded-full" />
                  </button>
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
              {!showSummary && !showOffers && (
                <div className="w-full h-2 bg-[#E0E0E0] shrink-0">
                  <motion.div
                    className="h-full bg-[#2C2C2C]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              {/* Step counter */}
              {!showSummary && !showOffers && (
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
                  {showOffers ? (
                    <OffersPanel key="offers" selections={selections} customPrices={customPrices} />
                  ) : showSummary ? (
                    <SummaryScreen
                      key="summary"
                      selections={selections}
                      onBack={handleBack}
                      onReset={handleReset}
                      customPrices={customPrices}
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
                        {step.options.map(option => {
                          const isDiploma = selections.category === "diploma";
                          const basePrice = customPrices[option.id] !== undefined ? customPrices[option.id] : option.price;
                          const displayPrice = (step.id !== "category" && isDiploma)
                            ? Math.floor(basePrice / 2)
                            : basePrice;
                          return (
                            <OptionCard
                              key={option.id}
                              option={option}
                              displayPrice={displayPrice}
                              selected={step.type === "single" ? selections[step.id] : selections[step.id] || []}
                              onToggle={handleToggle}
                              isBase={step.id === "category"}
                            />
                          );
                        })}
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
              {!showSummary && !showOffers && (
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
      <div className="flex flex-col items-end gap-3">

        {/* Nudge tooltip */}
        <AnimatePresence>
          {showNudge && !open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              className="mr-1 pointer-events-none"
            >
              <div className="bg-[#FAF6EE] text-[#2C2C2C] px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-xs sm:text-sm font-marker font-semibold shadow-md whitespace-nowrap border-2 border-[#2C2C2C]">
                🎨 Customise Your Project!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger button */}
        <div className="flex items-center group font-marker">
          <div className="mr-3 scale-0 group-hover:scale-100 origin-right transition-transform duration-200 pointer-events-none hidden sm:block">
            <div className="bg-[#FAF6EE] text-[#2C2C2C] px-3.5 py-1.5 rounded-xl text-sm font-semibold shadow-md whitespace-nowrap border-2 border-[#2C2C2C]">
              Customise Project!
            </div>
          </div>

          <motion.button
            id="customizer-fab"
            onClick={() => { setOpen(p => !p); setShowNudge(false); }}
            aria-label="Open Project Customiser"
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:shadow-[4px_5px_0_#2C2C2C] transition-all duration-200 border-2 border-[#2C2C2C] relative
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
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </>
  );
}
