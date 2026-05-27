"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, ChevronRight, ChevronLeft, CheckCircle2,
  Laptop, Code, Brain, Smartphone, Network, Database,
  Clock, FileText, Presentation, BookOpen, MessageSquare,
  Cpu, LayoutDashboard, ShieldCheck, Zap, ArrowRight, Send
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: "category",
    title: "Pick Your Field",
    emoji: "📚",
    question: "What's your academic level?",
    hint: "Choose the one matching your college course",
    type: "single",
    options: [
      { id: "diploma", label: "Diploma", icon: Laptop, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28" },
      { id: "engineering", label: "Engineering (B.E./B.Tech)", icon: Code, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A" },
      { id: "mtech", label: "M.Tech / Research", icon: Cpu, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5" },
      { id: "bca-mca", label: "BCA / MCA", icon: Database, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC" },
      { id: "ai-ml", label: "AI / ML", icon: Brain, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350" },
      { id: "android", label: "Android App", icon: Smartphone, color: "bg-[#E8F5E9]", border: "border-[#26A69A]", accent: "#26A69A" },
    ],
  },
  {
    id: "tech",
    title: "Choose Stack",
    emoji: "⚙️",
    question: "What technology interest you?",
    hint: "Select all that apply to your project",
    type: "multi",
    options: [
      { id: "react", label: "React / Next.js", icon: LayoutDashboard, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5" },
      { id: "node", label: "Node.js / Express", icon: Zap, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A" },
      { id: "python", label: "Python / FastAPI", icon: Brain, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350" },
      { id: "android-dev", label: "Android (Java/Kotlin)", icon: Smartphone, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28" },
      { id: "iot", label: "IoT (Arduino/ESP32)", icon: Network, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC" },
      { id: "db", label: "Database (SQL / NoSQL)", icon: Database, color: "bg-[#E8F5E9]", border: "border-[#26A69A]", accent: "#26A69A" },
    ],
  },
  {
    id: "addons",
    title: "Add-Ons",
    emoji: "✨",
    question: "What extras do you need?",
    hint: "All options below are available as add-ons",
    type: "multi",
    options: [
      { id: "ppt", label: "PPT Presentation", icon: Presentation, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28" },
      { id: "report", label: "Thesis Report", icon: FileText, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A" },
      { id: "viva", label: "Viva Guidance Sheet", icon: BookOpen, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5" },
      { id: "remote", label: "Remote Setup (Zoom)", icon: ShieldCheck, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350" },
      { id: "deployment", label: "Cloud Deployment", icon: Zap, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC" },
      { id: "docs", label: "Code Walkthrough Doc", icon: Code, color: "bg-[#E8F5E9]", border: "border-[#26A69A]", accent: "#26A69A" },
    ],
  },
  {
    id: "timeline",
    title: "Deadline",
    emoji: "⏱️",
    question: "When do you need it?",
    hint: "Pick the closest deadline to yours",
    type: "single",
    options: [
      { id: "urgent", label: "1–3 Days (Urgent)", icon: Zap, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350" },
      { id: "normal", label: "4–7 Days (Standard)", icon: Clock, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28" },
      { id: "relaxed", label: "8–14 Days (Relaxed)", icon: CheckCircle2, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A" },
      { id: "flexible", label: "Flexible / No Rush", icon: Sparkles, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5" },
    ],
  },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function buildWhatsAppMessage(selections) {
  const cat = STEPS[0].options.find((o) => o.id === selections.category)?.label || "—";
  const techs = (selections.tech || [])
    .map((id) => STEPS[1].options.find((o) => o.id === id)?.label)
    .filter(Boolean)
    .join(", ") || "—";
  const addons = (selections.addons || [])
    .map((id) => STEPS[2].options.find((o) => o.id === id)?.label)
    .filter(Boolean)
    .join(", ") || "None";
  const time = STEPS[3].options.find((o) => o.id === selections.timeline)?.label || "—";

  return encodeURIComponent(
    `Hello ShubDeep Labs! 👋\n\nI used your Project Customizer and here is my requirement:\n\n📚 Level: ${cat}\n⚙️ Tech Stack: ${techs}\n✨ Add-Ons: ${addons}\n⏱️ Timeline: ${time}\n\nPlease share a quote for my custom project!`
  );
}

// ─── STEP OPTION CARD ─────────────────────────────────────────────────────────

function OptionCard({ option, selected, onToggle, small = false }) {
  const Icon = option.icon;
  const isSelected = Array.isArray(selected)
    ? selected.includes(option.id)
    : selected === option.id;

  return (
    <button
      id={`customizer-option-${option.id}`}
      onClick={() => onToggle(option.id)}
      className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 transition-all duration-150 cursor-pointer select-none
        ${small ? "p-2.5 text-[11px]" : "p-3 text-xs"}
        ${isSelected
          ? `${option.color} ${option.border} shadow-[3px_3px_0_#2C2C2C] scale-[0.97] ring-2 ring-[#2C2C2C]`
          : "bg-white border-[#2C2C2C]/30 hover:border-[#2C2C2C] hover:shadow-[2px_2px_0_#2C2C2C] hover:scale-[0.98]"
        }`}
    >
      {isSelected && (
        <span className="absolute top-1 right-1.5 text-[10px] font-black text-[#2C2C2C]">✓</span>
      )}
      <Icon
        className={`${small ? "w-4 h-4" : "w-5 h-5"} shrink-0`}
        style={{ color: option.accent }}
      />
      <span className="font-marker font-bold text-[#2C2C2C] text-center leading-tight">
        {option.label}
      </span>
    </button>
  );
}

// ─── SUMMARY SCREEN ───────────────────────────────────────────────────────────

function SummaryScreen({ selections, onBack, onReset }) {
  const cat = STEPS[0].options.find((o) => o.id === selections.category)?.label || "—";
  const techs = (selections.tech || []).map((id) => STEPS[1].options.find((o) => o.id === id)?.label).filter(Boolean);
  const addons = (selections.addons || []).map((id) => STEPS[2].options.find((o) => o.id === id)?.label).filter(Boolean);
  const time = STEPS[3].options.find((o) => o.id === selections.timeline)?.label || "—";
  const waUrl = `https://wa.me/919028833275?text=${buildWhatsAppMessage(selections)}`;

  return (
    <motion.div
      key="summary"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="flex flex-col gap-4"
    >
      {/* Tape header sticker */}
      <div className="relative text-center mb-1">
        <div className="inline-block bg-[#FFF59D]/80 border border-dashed border-[#2C2C2C] px-4 py-1 text-[11px] font-marker uppercase rotate-[-1deg] text-[#2C2C2C]">
          Your Custom Order Summary 📋
        </div>
      </div>

      <div className="space-y-2.5 text-sm">
        {[
          { label: "📚 Level", value: cat },
          { label: "⚙️ Stack", value: techs.join(", ") || "—" },
          { label: "✨ Add-Ons", value: addons.length ? addons.join(", ") : "None" },
          { label: "⏱️ Timeline", value: time },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex gap-2 bg-[#FAF6EE] border border-dashed border-[#2C2C2C]/30 rounded-xl px-3 py-2"
          >
            <span className="font-marker font-extrabold text-[#2C2C2C] shrink-0 text-xs">{label}</span>
            <span className="font-sans text-[#5A5A5A] text-xs leading-tight">{value}</span>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-dashed border-[#2C2C2C]/20 pt-3 space-y-2">
        <a
          id="customizer-send-whatsapp"
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#A5D6A7] border-2 border-[#2C2C2C] rounded-xl font-marker font-bold text-[#2C2C2C] text-sm shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-[#2C2C2C]" />
          Send to WhatsApp & Get Quote
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
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({ category: null, tech: [], addons: [], timeline: null });
  const [showSummary, setShowSummary] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const panelRef = useRef(null);

  const step = STEPS[currentStep];
  const totalSteps = STEPS.length;

  // Show tooltip nudge after 5 seconds on first visit
  const [showNudge, setShowNudge] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open) setShowNudge(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
      setSelections((prev) => ({ ...prev, [key]: id }));
    } else {
      setSelections((prev) => {
        const arr = prev[key] || [];
        return {
          ...prev,
          [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
        };
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
    if (currentStep < totalSteps - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      setShowSummary(true);
    }
  }

  function handleBack() {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
    }
  }

  function handleReset() {
    setCurrentStep(0);
    setSelections({ category: null, tech: [], addons: [], timeline: null });
    setShowSummary(false);
    setHasInteracted(false);
  }

  const progress = showSummary ? 100 : ((currentStep) / totalSteps) * 100;

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
                {/* Binder holes */}
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
                        {step.options.map((option) => (
                          <OptionCard
                            key={option.id}
                            option={option}
                            selected={
                              step.type === "single"
                                ? selections[step.id]
                                : selections[step.id] || []
                            }
                            onToggle={handleToggle}
                            small={false}
                          />
                        ))}
                      </div>

                      {/* Multi-select hint */}
                      {step.type === "multi" && (
                        <p className="text-xs font-marker text-[#6A6A6A] text-center">
                          Tap to select / deselect multiple options
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Nav (only shown when not in summary) */}
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

                  <div className="text-xs font-marker text-[#C0C0C0]">
                    Step {currentStep + 1} of {totalSteps}
                  </div>

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
                      <>
                        See Summary
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </>
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

        {/* ── NUDGE TOOLTIP ── */}
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

        {/* ── TRIGGER BUTTON ── */}
        <div className="flex items-center group font-marker">
          {/* Text badge shown on hover */}
          <div className="mr-3 scale-0 group-hover:scale-100 origin-right transition-transform duration-200 pointer-events-none">
            <div className="bg-[#FAF6EE] text-[#2C2C2C] px-3.5 py-1.5 rounded-xl text-sm font-semibold shadow-md whitespace-nowrap border-2 border-[#2C2C2C]">
              Customise Project!
            </div>
          </div>

          <motion.button
            id="customizer-fab"
            onClick={() => { setOpen((p) => !p); setShowNudge(false); }}
            aria-label="Open Project Customiser"
            className={`w-14 h-14 rounded-full flex items-center justify-center text-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:shadow-[4px_5px_0_#2C2C2C] transition-all duration-200 border-2 border-[#2C2C2C] relative
              ${open ? "bg-[#FFCDD2]" : "bg-[#90CAF9]"}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: open ? 0 : [0, -6, 0],
            }}
            transition={{
              scale: { delay: 1.2, duration: 0.3 },
              opacity: { delay: 1.2, duration: 0.3 },
              y: {
                repeat: open ? 0 : Infinity,
                duration: 3.5,
                ease: "easeInOut",
              },
            }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Ping dot when has selection */}
            {hasInteracted && !open && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#EF5350] rounded-full border border-[#2C2C2C] animate-ping" />
            )}
            {hasInteracted && !open && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#EF5350] rounded-full border border-[#2C2C2C]" />
            )}

            <AnimatePresence mode="wait">
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
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
