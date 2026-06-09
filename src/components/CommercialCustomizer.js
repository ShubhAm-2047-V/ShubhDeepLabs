"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone, Globe, Code, Layers, ShoppingCart, Cloud,
  LayoutDashboard, Lock, Users, Key, Fingerprint, CreditCard,
  ShoppingBag, Bell, MessageCircle, Video, Map, QrCode,
  Bluetooth, Heart, UploadCloud, FileText, Gamepad2, WifiOff,
  Moon, Languages, Link, BarChart, BookOpen, Camera,
  Shield, History, RefreshCw, ArrowRightLeft,
  Settings, Search, Brain, Headphones, 
  Download, Briefcase, Network, RefreshCcw,
  Mail, Box, ShieldCheck, Database,
  Zap, Clock, CalendarDays, Infinity as InfinityIcon,
  MessageSquare, ArrowRight
} from "lucide-react";
import { formatINR } from "./ProductCustomizer";

const PROJECT_OPTS = [
  { id: "app", label: "Mobile App", icon: Smartphone, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Native or Cross-platform", price: 19999 },
  { id: "website", label: "Website / Web App", icon: Globe, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "SaaS, E-commerce, Portals", price: 9999 },
];

const APP_PLATFORM_OPTS = [
  { id: "android", label: "Android Only", icon: Code, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "Play Store", price: 4999 },
  { id: "ios", label: "iOS Only", icon: Download, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", desc: "App Store", price: 9999 },
  { id: "both", label: "Cross-Platform", icon: Layers, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Flutter / React Native", price: 14999 },
];

const WEB_PLATFORM_OPTS = [
  { id: "ecommerce", label: "E-Commerce", icon: ShoppingCart, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", desc: "Online Store", price: 19999 },
  { id: "saas", label: "SaaS Platform", icon: Cloud, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Software as a Service", price: 39999 },
  { id: "dashboard", label: "Admin Dashboard", icon: LayoutDashboard, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "Internal Tools", price: 19999 },
  { id: "landing", label: "Landing Page", icon: Globe, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "Marketing Site", price: 4999 },
];

const APP_FEATURES_OPTS = [
  { id: "auth", label: "User Authentication", icon: Lock, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "Email/Password Login", price: 2999 },
  { id: "social_auth", label: "Social Login", icon: Users, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "Google, Apple, Facebook", price: 4999 },
  { id: "otp_verify", label: "OTP Verification", icon: Key, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "SMS / WhatsApp OTP", price: 3999 },
  { id: "biometrics", label: "Biometric Login", icon: Fingerprint, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", desc: "FaceID / TouchID", price: 5999 },
  { id: "payment", label: "Payment Gateway", icon: CreditCard, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", desc: "Stripe/Razorpay", price: 7999 },
  { id: "iap", label: "In-App Purchases", icon: ShoppingBag, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "Subscriptions & IAP", price: 12999 },
  { id: "push", label: "Push Notifications", icon: Bell, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "FCM/APNs Alerts", price: 3999 },
  { id: "chat", label: "Live Chat", icon: MessageCircle, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Real-time messaging", price: 9999 },
  { id: "video_call", label: "Video / Voice Calling", icon: Video, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", desc: "WebRTC / Agora", price: 14999 },
  { id: "maps", label: "Maps & Routing", icon: Map, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", desc: "GPS & Live Tracking", price: 7999 },
  { id: "qr_scanner", label: "QR / Barcode Scanner", icon: QrCode, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "Built-in scanner", price: 4999 },
  { id: "bluetooth", label: "Bluetooth / IoT", icon: Bluetooth, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "BLE & Hardware APIs", price: 14999 },
  { id: "health", label: "Health SDK Integration", icon: Heart, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "HealthKit/Google Fit", price: 14999 },
  { id: "file_upload", label: "Media Uploads", icon: UploadCloud, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", desc: "AWS S3/Cloudinary", price: 4999 },
  { id: "pdf_gen", label: "PDF Reports", icon: FileText, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", desc: "Generate & Export Docs", price: 4999 },
  { id: "gamification", label: "Gamification", icon: Gamepad2, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "Badges, Streaks & Points", price: 9999 },
  { id: "offline", label: "Offline Mode", icon: WifiOff, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "Local DB Sync (SQLite)", price: 9999 },
  { id: "dark_mode", label: "Dark Mode", icon: Moon, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Dynamic Theme Support", price: 2999 },
  { id: "multi_lang", label: "Multi-Language", icon: Languages, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", desc: "i18n Localization", price: 7999 },
  { id: "deep_link", label: "Deep Linking", icon: Link, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", desc: "Universal Links", price: 3999 },
  { id: "analytics", label: "Analytics SDK", icon: BarChart, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "Firebase / Mixpanel", price: 2999 },
  { id: "crm", label: "CRM Integration", icon: Briefcase, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "Salesforce/HubSpot", price: 12999 },
  { id: "camera", label: "Advanced Camera / AR", icon: Camera, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Custom UI/AR Elements", price: 19999 },
];

const WEB_FEATURES_OPTS = [
  { id: "auth", label: "User Authentication", icon: Lock, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "Email/Password Login", price: 2999 },
  { id: "sso", label: "Enterprise SSO", icon: Key, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "SAML / OAuth", price: 12999 },
  { id: "rbac", label: "Role-Based Access (RBAC)", icon: Users, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Complex Permissions", price: 9999 },
  { id: "payment", label: "Payment Gateway", icon: CreditCard, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", desc: "Stripe/Razorpay", price: 7999 },
  { id: "subscriptions", label: "Subscription Billing", icon: RefreshCw, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", desc: "SaaS Subscriptions", price: 12999 },
  { id: "multi_currency", label: "Multi-Currency", icon: ArrowRightLeft, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "Dynamic local pricing", price: 7999 },
  { id: "cms", label: "Admin CMS", icon: Settings, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "Content Management", price: 12999 },
  { id: "seo", label: "Advanced SEO", icon: Search, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Meta, Schema, Sitemap", price: 7999 },
  { id: "ai", label: "AI Integration", icon: Brain, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", desc: "OpenAI APIs", price: 19999 },
  { id: "advanced_search", label: "Smart Search", icon: Search, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", desc: "Lightning fast indexing", price: 7999 },
  { id: "chat", label: "Support Chatbot", icon: Headphones, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "AI/Live Agent Support", price: 4999 },
  { id: "analytics", label: "Analytics Dashboard", icon: BarChart, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "Custom Dashboards", price: 14999 },
  { id: "pwa", label: "PWA Support", icon: Download, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Installable Web App", price: 7999 },
  { id: "multi_tenant", label: "Multi-Tenant SaaS", icon: Building, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", desc: "SaaS Architecture", price: 29999 },
  { id: "webhooks", label: "Webhooks & APIs", icon: Network, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", desc: "Expose APIs to clients", price: 12999 },
  { id: "api", label: "Third-Party APIs", icon: Network, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "Zapier, Hubspot, etc.", price: 7999 },
  { id: "websockets", label: "Real-Time Features", icon: RefreshCcw, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "Real-time Live Data", price: 12999 },
  { id: "email", label: "Email Marketing", icon: Mail, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Mailchimp / Sendgrid", price: 4999 },
  { id: "inventory", label: "Inventory / WMS", icon: Box, color: "bg-[#F3E5F5]", border: "border-[#AB47BC]", accent: "#AB47BC", desc: "Warehouse Management", price: 19999 },
  { id: "affiliate", label: "Referral System", icon: Users, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", desc: "Affiliate tracking", price: 12999 },
  { id: "gdpr", label: "GDPR Compliance", icon: ShieldCheck, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "Cookie consent, export", price: 7999 },
  { id: "backups", label: "Auto Backups", icon: Cloud, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "Automated DB snapshots", price: 2999 },
  { id: "blog", label: "Blog / News Module", icon: FileText, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Content Marketing Hub", price: 7999 },
];

const TIMELINE_OPTS = [
  { id: "urgent", label: "1-2 Weeks", icon: Zap, color: "bg-[#FFEBEE]", border: "border-[#EF5350]", accent: "#EF5350", desc: "Express Delivery", price: 9999 },
  { id: "standard", label: "3-4 Weeks", icon: Clock, color: "bg-[#FFF9C4]", border: "border-[#FFCA28]", accent: "#FFCA28", desc: "Standard Delivery", price: 0 },
  { id: "flexible", label: "Flexible", icon: InfinityIcon, color: "bg-[#E1F5FE]", border: "border-[#42A5F5]", accent: "#42A5F5", desc: "Flexible Timeline", price: 0 },
  { id: "relaxed", label: "1-2 Months", icon: CalendarDays, color: "bg-[#E8F5E9]", border: "border-[#66BB6A]", accent: "#66BB6A", desc: "Relaxed Timeline", price: -5000 },
];

// Helper components
function OptionCard({ option, selected, onToggle, isBase = false }) {
  const isSelected = Array.isArray(selected) ? selected.includes(option.id) : selected === option.id;
  const actualPrice = option.price;
  
  const priceLabel = isBase
    ? `Starting at ${formatINR(actualPrice)}`
    : actualPrice === 0
    ? "Free 🌿"
    : actualPrice < 0
    ? `- ${formatINR(Math.abs(actualPrice))}`
    : `+ ${formatINR(actualPrice)}`;

  const Icon = option.icon;

  return (
    <button
      onClick={() => onToggle(option.id)}
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
    </button>
  );
}

export default function CommercialCustomizerWizard({ onBack, onReset }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({ projectType: null, platform: null, features: [], timeline: null });
  const [showSummary, setShowSummary] = useState(false);

  const calculateTotal = () => {
    let total = 0;
    if (selections.projectType) {
      total += PROJECT_OPTS.find(o => o.id === selections.projectType)?.price || 0;
    }
    if (selections.platform) {
      const list = selections.projectType === 'app' ? APP_PLATFORM_OPTS : WEB_PLATFORM_OPTS;
      total += list.find(o => o.id === selections.platform)?.price || 0;
    }
    if (selections.features.length > 0) {
      const list = selections.projectType === 'app' ? APP_FEATURES_OPTS : WEB_FEATURES_OPTS;
      selections.features.forEach(f => {
        total += list.find(o => o.id === f)?.price || 0;
      });
    }
    if (selections.timeline) {
      total += TIMELINE_OPTS.find(o => o.id === selections.timeline)?.price || 0;
    }
    return total;
  };

  const handleToggle = (stepId, optId, type) => {
    if (stepId === 'projectType') {
      if (selections.projectType !== optId) {
        setSelections({ projectType: optId, platform: null, features: [], timeline: null });
      } else {
        setSelections(p => ({ ...p, projectType: optId }));
      }
    } else if (stepId === 'platform') {
      setSelections(p => ({ ...p, platform: optId }));
    } else if (stepId === 'timeline') {
      setSelections(p => ({ ...p, timeline: optId }));
    } else if (stepId === 'features') {
      setSelections(p => {
        const arr = p.features;
        return { ...p, features: arr.includes(optId) ? arr.filter(x => x !== optId) : [...arr, optId] };
      });
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return !!selections.projectType;
    if (currentStep === 1) return !!selections.platform;
    if (currentStep === 2) return true; // features are optional
    if (currentStep === 3) return !!selections.timeline;
    return true;
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(p => p + 1);
    else setShowSummary(true);
  };

  const prevStep = () => {
    if (showSummary) setShowSummary(false);
    else if (currentStep > 0) setCurrentStep(p => p - 1);
    else onBack && onBack();
  };

  const getWaUrl = () => {
    const pt = PROJECT_OPTS.find(o => o.id === selections.projectType)?.label || "—";
    const plList = selections.projectType === 'app' ? APP_PLATFORM_OPTS : WEB_PLATFORM_OPTS;
    const pl = plList.find(o => o.id === selections.platform)?.label || "—";
    const featList = selections.projectType === 'app' ? APP_FEATURES_OPTS : WEB_FEATURES_OPTS;
    const feats = selections.features.map(f => featList.find(o => o.id === f)?.label).filter(Boolean).join(", ") || "None";
    const tl = TIMELINE_OPTS.find(o => o.id === selections.timeline)?.label || "—";
    
    const msg = `Hello ShubDeep Labs! 👋\n\nI used your Commercial Customizer and here is my requirement:\n\n💼 Project Type: ${pt}\n📱 Platform: ${pl}\n✨ Features: ${feats}\n⏱️ Timeline: ${tl}\n💰 My Estimate: ${formatINR(calculateTotal())}\n\nPlease confirm the final quote for my commercial project!`;
    return `https://wa.me/919028833275?text=${encodeURIComponent(msg)}`;
  };

  if (showSummary) {
    const pt = PROJECT_OPTS.find(o => o.id === selections.projectType)?.label || "—";
    const plList = selections.projectType === 'app' ? APP_PLATFORM_OPTS : WEB_PLATFORM_OPTS;
    const pl = plList.find(o => o.id === selections.platform)?.label || "—";
    const featList = selections.projectType === 'app' ? APP_FEATURES_OPTS : WEB_FEATURES_OPTS;
    const feats = selections.features.map(f => featList.find(o => o.id === f)?.label).filter(Boolean);
    const tl = TIMELINE_OPTS.find(o => o.id === selections.timeline)?.label || "—";

    return (
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col gap-4">
        <div className="text-center">
          <div className="inline-block bg-[#E1F5FE]/80 border border-dashed border-[#2C2C2C] px-4 py-1 text-[11px] font-marker uppercase rotate-[-1deg] text-[#2C2C2C]">
            Commercial Quote Summary 💼
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2 bg-[#FAF6EE] border border-dashed border-[#2C2C2C]/30 rounded-xl px-3 py-2">
            <span className="font-marker font-extrabold text-[#2C2C2C] shrink-0 text-xs">💼 Type</span>
            <span className="font-sans text-[#5A5A5A] text-xs leading-tight">{pt}</span>
          </div>
          <div className="flex gap-2 bg-[#FAF6EE] border border-dashed border-[#2C2C2C]/30 rounded-xl px-3 py-2">
            <span className="font-marker font-extrabold text-[#2C2C2C] shrink-0 text-xs">📱 Platform</span>
            <span className="font-sans text-[#5A5A5A] text-xs leading-tight">{pl}</span>
          </div>
          <div className="flex gap-2 bg-[#FAF6EE] border border-dashed border-[#2C2C2C]/30 rounded-xl px-3 py-2">
            <span className="font-marker font-extrabold text-[#2C2C2C] shrink-0 text-xs">✨ Features</span>
            <span className="font-sans text-[#5A5A5A] text-xs leading-tight">{feats.length ? feats.join(", ") : "None"}</span>
          </div>
          <div className="flex gap-2 bg-[#FAF6EE] border border-dashed border-[#2C2C2C]/30 rounded-xl px-3 py-2">
            <span className="font-marker font-extrabold text-[#2C2C2C] shrink-0 text-xs">⏱️ Timeline</span>
            <span className="font-sans text-[#5A5A5A] text-xs leading-tight">{tl}</span>
          </div>
        </div>
        <div className="bg-[#2C2C2C] rounded-2xl p-4 border-2 border-[#2C2C2C] shadow-[4px_5px_0_#42A5F5]">
          <div className="border-b border-[#FFF59D]/25 pb-3 flex justify-between items-center">
            <span className="font-marker font-extrabold text-[#FFF59D] text-sm">Total Estimate</span>
            <span className="font-marker font-extrabold text-[#FFF59D] text-xl">{formatINR(calculateTotal())}</span>
          </div>
          <p className="text-[9px] font-sans text-[#606060] text-center mt-2">
            * Estimate only. Send to WhatsApp for exact confirmed quote.
          </p>
        </div>
        <div className="border-t-2 border-dashed border-[#2C2C2C]/20 pt-3 space-y-2">
          <a href={getWaUrl()} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#81D4FA] border-2 border-[#2C2C2C] rounded-xl font-marker font-bold text-[#2C2C2C] text-sm shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all">
            <MessageSquare className="w-4 h-4 fill-[#2C2C2C]" /> Send to WhatsApp &amp; Get Quote <ArrowRight className="w-4 h-4" />
          </a>
          <div className="flex gap-2">
            <button onClick={prevStep} className="flex-1 py-2.5 px-3 border-2 border-[#2C2C2C]/40 rounded-xl font-marker text-xs text-[#5A5A5A] hover:border-[#2C2C2C] hover:bg-[#FAF6EE] transition-all">← Edit</button>
            <button onClick={() => { setSelections({ projectType: null, platform: null, features: [], timeline: null }); setCurrentStep(0); setShowSummary(false); }} className="flex-1 py-2.5 px-3 border-2 border-[#2C2C2C]/40 rounded-xl font-marker text-xs text-[#5A5A5A] hover:border-[#2C2C2C] hover:bg-[#FAF6EE] transition-all">🔄 Start Over</button>
          </div>
        </div>
      </motion.div>
    );
  }

  const stepsInfo = [
    { id: "projectType", title: "Project Type", emoji: "💼", hint: "Mobile App or Website?" },
    { id: "platform", title: "Platform", emoji: "📱", hint: "Choose target platform" },
    { id: "features", title: "Features", emoji: "✨", hint: "Select required features" },
    { id: "timeline", title: "Timeline", emoji: "⏱️", hint: "Choose development speed" }
  ];
  const step = stepsInfo[currentStep];
  
  let options = [];
  if (currentStep === 0) options = PROJECT_OPTS;
  else if (currentStep === 1) options = selections.projectType === 'app' ? APP_PLATFORM_OPTS : WEB_PLATFORM_OPTS;
  else if (currentStep === 2) options = selections.projectType === 'app' ? APP_FEATURES_OPTS : WEB_FEATURES_OPTS;
  else if (currentStep === 3) options = TIMELINE_OPTS;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar">
        <div className="text-center mb-6">
          <div className="inline-block bg-white border-2 border-[#2C2C2C] px-3 py-1 rounded-xl shadow-[2px_2px_0_#2C2C2C] rotate-[-2deg] mb-3">
            <span className="font-marker font-bold text-[#2C2C2C] text-sm">{step.emoji} {step.title}</span>
          </div>
          <p className="font-sans text-xs text-[#6A6A6A] px-4">{step.hint}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-8">
          {options.map((opt, i) => (
            <motion.div key={opt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <OptionCard
                option={opt}
                selected={selections[step.id]}
                onToggle={(id) => handleToggle(step.id, id, currentStep === 2 ? 'multi' : 'single')}
                isBase={currentStep === 0}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Sticky footer */}
      <div className="bg-white border-t-[3px] border-[#2C2C2C] p-4 flex items-center justify-between z-10 shrink-0">
        <button onClick={prevStep} className="p-3 bg-[#FAF6EE] border-2 border-[#2C2C2C]/50 rounded-xl text-[#5A5A5A] hover:text-[#2C2C2C] hover:border-[#2C2C2C] transition-colors"><ArrowRight className="w-5 h-5 rotate-180" /></button>
        <div className="flex items-center gap-2 bg-[#2C2C2C] text-[#FFF59D] px-4 py-2 rounded-xl border-2 border-[#2C2C2C] shadow-[2px_3px_0_#42A5F5]">
          <span className="text-[10px] font-marker font-bold text-[#A0A0A0] whitespace-nowrap">Est. Total</span>
          <span className="text-base font-marker font-extrabold whitespace-nowrap">{selections.projectType ? formatINR(calculateTotal()) : "—"}</span>
        </div>
        <button onClick={nextStep} disabled={!canProceed()} className="p-3 bg-[#A5D6A7] border-2 border-[#2C2C2C] rounded-xl text-[#2C2C2C] hover:bg-[#81C784] transition-colors shadow-[2px_3px_0_#2C2C2C] disabled:opacity-50 disabled:shadow-none"><ArrowRight className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
