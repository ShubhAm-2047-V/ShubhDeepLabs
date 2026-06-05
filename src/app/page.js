"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Laptop, Code, Cpu, Database, Brain, Sparkles, CheckSquare, 
  Smartphone, Network, ShieldCheck, Clock, Award, FileText, 
  HeartHandshake, ChevronDown, Phone, Mail, Send, ArrowRight, MessageSquare, BookOpen, Star, HelpCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { dbService } from "@/lib/supabase";
import ThreeWorld from "@/components/ThreeWorld";
import { STEPS, calculateTotal, formatINR } from "@/components/ProductCustomizer";

const ICON_MAP = {
  Laptop, Code, Cpu, Database, Brain, Sparkles, CheckSquare, 
  Smartphone, Network, ShieldCheck, Clock, Award, FileText, 
  HeartHandshake, ChevronDown, Phone, Mail, Send, ArrowRight, MessageSquare, BookOpen, Star, HelpCircle
};

const getIcon = (iconName) => {
  if (!iconName) return HelpCircle;
  if (typeof iconName !== "string") return iconName;
  return ICON_MAP[iconName] || HelpCircle;
};

export default function Home() {
  // Contact Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Request Demo Handler
  const handleRequestDemo = (title) => {
    const expiry = Date.now() + 5 * 60 * 1000;
    localStorage.setItem("shubdeep_demo_expiry", expiry.toString());
    
    let targetRoute = "/chatbot";
    let targetName = "Chatbot";
    if (title === "Face Recognition Attendance system") {
      targetRoute = "/face-attendance";
      targetName = "Face Attendance Portal";
    } else if (title === "Hospital Management Core Desk") {
      targetRoute = "/hospital-desk";
      targetName = "Hospital Core Desk";
    } else if (title === "Expense Tracker with AI Insights") {
      targetRoute = "/expense-tracker";
      targetName = "Expense Tracker Dashboard";
    } else if (title === "Smart Notes Summarizer") {
      targetRoute = "/notes-summarizer";
      targetName = "Smart Notes Summarizer";
    }

    toast.success(`Demo access granted! Opening ${targetName}...`, {
      className: "sketch-card text-[#2C2C2C] border-2 border-[#2C2C2C] bg-[#FAF6EE] rounded-xl font-marker text-sm"
    });
    setTimeout(() => {
      window.location.href = targetRoute;
    }, 800);
  };

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Active Daily Offer State
  const [activeOffer, setActiveOffer] = useState({
    title: "First 8 Special Students of diploma get 30% OFF + Assured Free Gift!",
    subtext: "* Terms & conditions apply. Connect on WhatsApp to reserve code discount spots.",
    ribbon: "Special Offer!",
    emoji: "🎁",
  });

  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const settings = await dbService.getSiteSettings();
        if (settings) {
          setSiteSettings(settings);
        }
      } catch (e) {
        console.error("Failed to load site settings:", e);
      }
    };
    loadSiteSettings();
  }, []);

  const [selections, setSelections] = useState({ category: null, tech: [], addons: [], timeline: null });
  const [customPrices, setCustomPrices] = useState({});

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

  useEffect(() => {
    const handleSelectionsChange = (e) => {
      setSelections(e.detail);
    };
    window.addEventListener("customizer-selections-changed", handleSelectionsChange);
    return () => window.removeEventListener("customizer-selections-changed", handleSelectionsChange);
  }, []);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const prices = await dbService.getCustomizerPrices();
        if (prices) setCustomPrices(prices);
      } catch (e) {
        console.error(e);
      }
    };
    loadPrices();
  }, []);

  useEffect(() => {
    const fetchActiveOffer = async () => {
      try {
        const active = await dbService.getActiveOffer();
        if (active) {
          setActiveOffer(active);
        }
      } catch (e) {
        console.error("Failed to load active offer:", e);
      }
    };
    fetchActiveOffer();
  }, []);

  const heroData = siteSettings?.hero || {
    titleYour: "Your",
    titleOur: "Our",
    titleProject: "roject",
    titlePassion: "assion",
    tagline: "SIMPLE PROJECTS. SMART SOLUTIONS.",
    description: "From Idea to Implementation, We Build Intelligent Academic Solutions. Next-generation web portals, machine learning algorithms, and IoT prototypes built with clean, premium codebases. Complete with PPT slides, comprehensive thesis reports, and mock viva tutoring.",
    assurances: [
      "✓ Simple Projects",
      "✓ Smart Solutions",
      "✓ Done with Focus & Care",
      "✓ For Diploma & Degree Only"
    ],
    whatsappText: "Hello, ShubDeep I want to discuss my academic project."
  };

  const contactData = siteSettings?.contact || {
    phone: "+91 90288 33275",
    email: "shubdeeplabs@gmail.com",
    address: "Solapur, Maharashtra"
  };

  const waOfferUrl = (() => {
    const hasCategory = selections && !!selections.category;
    const phoneNo = contactData.phone.replace(/[^0-9]/g, "");
    if (!hasCategory) {
      return `https://wa.me/${phoneNo}?text=${encodeURIComponent(
        `Hello ShubDeep Labs! 👋\n\nI want to claim the Daily Special Deal: "${activeOffer.title}"!`
      )}`;
    }
    
    const cat    = STEPS[0].options.find(o => o.id === selections.category)?.label || "—";
    const techs  = (selections.tech   || []).map(id => STEPS[1].options.find(o => o.id === id)?.label).filter(Boolean).join(", ") || "—";
    const addons = (selections.addons || []).map(id => STEPS[2].options.find(o => o.id === id)?.label).filter(Boolean).join(", ") || "None";
    const time   = STEPS[3].options.find(o => o.id === selections.timeline)?.label || "—";
    const { total } = calculateTotal(selections, customPrices);
    
    return `https://wa.me/${phoneNo}?text=${encodeURIComponent(
      `Hello ShubDeep Labs! 👋\n\nI want to claim the Daily Special Deal: "${activeOffer.title}"!\n\nMy Project Requirement:\n🎓 Level: ${cat}\n⚙️ Tech Stack: ${techs}\n✨ Add-Ons: ${addons}\n⏱️ Timeline: ${time}\n💰 My Estimate: ${formatINR(total)}\n\nPlease confirm the final quote for my custom project!`
    )}`;
  })();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill in all details.");
      return;
    }

    setLoading(true);
    try {
      await dbService.addOrder({
        fullName: formData.name,
        collegeName: "Inquiry Sketch Desk",
        branch: "General Inquiry",
        year: "N/A",
        projectTitle: "General Contact Request",
        techRequired: "N/A",
        deadline: new Date().toISOString().split('T')[0],
        budget: "0",
        description: formData.message,
        needPPT: false,
        needReport: false,
        needVivaGuidance: false,
        projectStatus: "Pending",
        paymentStatus: "Unpaid"
      });

      localStorage.setItem("shubhdeeplabs_user_email", formData.email);
      localStorage.setItem("shubhdeeplabs_user_name", formData.name);

      toast.success("Inquiry filed! We will call you soon.", {
        className: "sketch-card border-3 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker text-lg"
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to log inquiry.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { title: "Diploma Projects", icon: Laptop, desc: "Syllabus-compliant, core-logic driven applications scaled perfectly for diploma review parameters.", href: "/diploma", bg: "bg-[#FFF9C4]", border: "border-t-[#FFCA28]" },
    { title: "Engineering Projects", icon: Code, desc: "Full-stack architectures, neat database structures, and comprehensive data flows built for B.E. / B.Tech.", href: "/engineering", bg: "bg-[#E8F5E9]", border: "border-t-[#66BB6A]" },
    { title: "M.Tech Projects", icon: Cpu, desc: "High-grade algorithm modeling, data analysis, and advanced codebase executions for research thesis.", href: "/mtech", bg: "bg-[#E1F5FE]", border: "border-t-[#42A5F5]" },
    { title: "BCA / MCA Projects", icon: Database, desc: "Interactive management portals, dashboard consoles, cloud databases, and clean system layouts.", href: "/bca-mca", bg: "bg-[#F3E5F5]", border: "border-t-[#AB47BC]" },
    { title: "AI / ML Projects", icon: Brain, desc: "TensorFlow / PyTorch models, visual scans, NLP conversational bots, and predictive analytics pipelines.", href: "/ai-ml", bg: "bg-[#FFEBEE]", border: "border-t-[#EF5350]" },
    { title: "Web Projects", icon: Sparkles, desc: "Stunning responsive portals, custom dashboards, single page interfaces, and rich administrative panels.", href: "/web-dev", bg: "bg-[#FFF3E0]", border: "border-t-[#FFA726]" },
    { title: "Android Projects", icon: Smartphone, desc: "Mobile applications, local SQLite databases, customizable API links, and fully functional Android packages.", href: "/android", bg: "bg-[#E8F5E9]", border: "border-t-[#66BB6A]" },
    { title: "IoT Projects", icon: Network, desc: "Smart automation designs, hardware controller mapping (Arduino/ESP32), and interactive dashboards.", href: "/iot", bg: "bg-[#E1F5FE]", border: "border-t-[#42A5F5]" }
  ];

  const features = [
    { title: "100% Original Work", desc: "No copy-pasted templates. Every codebase is structured freshly according to your specific college needs.", icon: CheckSquare, marker: "marker-green", border: "border-t-[#66BB6A]" },
    { title: "On-Time Delivery", desc: "We are extremely strict with dates. Get your complete setup, reports, and slides well before your final submit day.", icon: Clock, marker: "marker-blue", border: "border-t-[#42A5F5]" },
    { title: "PPT & Reports Ready", desc: "Syllabus-compliant, fully formatted presentation drafts and comprehensive project reports included.", icon: FileText, marker: "marker-yellow", border: "border-t-[#FFCA28]" },
    { title: "Clean Documented Code", desc: "Neat model structures, clean controllers, and comprehensive code comments that make logic review easy.", icon: Code, marker: "marker-red", border: "border-t-[#EF5350]" }
  ];

  const pricing = [
    {
      name: "EASY PROJECT",
      price: "1999",
      desc: "Perfect for basic requirements, simple utilities, or mini-semester submissions.",
      features: [
        "Basic Clean UI Layout",
        "Simple Core functionality",
        "PPT + Draft Report",
        "1 Free logic revision",
        "Complete Source Code & Guide"
      ],
      highlightColor: "marker-green",
      textColor: "text-[#1B5E20]",
      accentColor: "#A5D6A7"
    },
    {
      name: "MEDIUM PROJECT",
      price: "3499",
      desc: "Best for final year projects requiring database integrations or custom interactive modules.",
      features: [
        "Database integration (SQL/NoSQL)",
        "Premium Responsive UI",
        "Multiple functional features",
        "PPT + Complete Project Report",
        "2 Free logic revisions",
        "Detailed Viva prep guidance"
      ],
      highlightColor: "marker-blue",
      textColor: "text-[#0D47A1]",
      accentColor: "#90CAF9"
    },
    {
      name: "HARD PROJECT",
      price: "4599",
      desc: "Engineered for advanced AI/ML models, intensive custom APIs, or high-grade thesis dashboards.",
      features: [
        "Advanced Logic (AI/ML/Complex APIs)",
        "Secure user authentication & dashboard",
        "Thesis-grade PPT + Full Project Report",
        "3 Free code revisions",
        "Direct Remote Installation support",
        "Deep 1-on-1 Viva code walkthrough"
      ],
      highlightColor: "marker-red",
      textColor: "text-[#B71C1C]",
      accentColor: "#EF9A9A"
    },
  ];

  const portfolio = [
    { title: "AI Plant Disease Detector", tech: "Python, Next.js, TensorFlow, FastAPI", desc: "A neural-network visual scanning web application detecting agricultural leaf diseases with detailed metric analytics.", markerColor: "marker-green" },
    { title: "Advanced AI Customer Care Chatbot", tech: "React, Node.js, Express, OpenAI API", desc: "Intelligent messaging center with customizable document indexing (RAG) and interactive dashboard console log views.", markerColor: "marker-purple" },
    { title: "Face Recognition Attendance system", tech: "Python, OpenCV, Tkinter, SQLite", desc: "Real-time face detection tracker featuring automated CSV sheets generation and attendance log exports.", markerColor: "marker-blue" },
    { title: "Hospital Management Core Desk", tech: "Next.js, MongoDB, Tailwind, Node.js", desc: "Full clinic portal with scheduling grids, active invoice trackers, and secure digital prescription vaults.", markerColor: "marker-orange" },
    { title: "Expense Tracker with AI Insights", tech: "React, Node.js, MongoDB, Gemini API", desc: "Personal finance portal offering automated category tagging, monthly budget forecasting, and AI-driven spending recommendations.", markerColor: "marker-yellow" },
    { title: "Smart Notes Summarizer", tech: "React, FastAPI, Python, Hugging Face", desc: "Collaborative document pad that auto-generates structured summaries, highlights action items, and generates flashcards using NLP.", markerColor: "marker-red" }
  ];

  const testimonials = [
    { name: "Saurabh Deshmukh", role: "B.Tech CS Student", review: "The Shubdeep Labs team is amazing! They delivered my IoT project well before my college presentation. The explanation guidelines sheet made my viva exams simple. Highly recommend their Medium package!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
    { name: "Priyanka Naik", role: "MCA Final Year Student", review: "I ordered the AI leaf scanner project. The beautiful dashboard layout completely wowed the external examiner! Having the structured report draft included saved me from college revision loops.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
    { name: "Aditya Verma", role: "Diploma Computer Engineering", review: "Fast execution and wonderful support. Setting up database configurations on Windows can be frustrating, but they configured it for me over Zoom. Got full grades in our semester reviews!", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" }
  ];

  const faqs = [
    { q: "How long does delivery take?", a: "Simple/Easy projects are typically delivered within 3-5 days. Medium projects take 5-7 days, while Advanced/Hard projects requiring deep integrations take 8-12 days. Urgent timelines can be arranged on inquiry!" },
    { q: "Do we receive the full source code?", a: "Yes, absolutely! You receive 100% full ownership of the source code, database structures, assets, installation guides, and presentation documents." },
    { q: "Is viva guidance included?", a: "Yes, our Medium and Hard project plans include detailed viva prep sheets. Hard projects also feature a dedicated 1-on-1 code walkthrough session to explain exact controllers and database interactions." },
    { q: "Can we request custom modifications?", a: "Definitely. We customize logic modules, database structures, interface styling, and third-party APIs to suit your specific syllabus requirements." },
    { q: "Do you provide remote system setup support?", a: "Yes! The Hard package includes direct deployment support. We can connect via Zoom or AnyDesk to compile and set up backend runtimes on your machine." }
  ];

  const currentFeatures = siteSettings?.features || features;
  const currentCategories = siteSettings?.categories || categories;
  const currentPortfolio = siteSettings?.portfolio || portfolio;
  const currentTestimonials = siteSettings?.testimonials || testimonials;
  const currentFaqs = siteSettings?.faqs || faqs;

  return (
    <div className="space-y-24 pb-20 relative overflow-hidden bg-transparent">
      
      {/* 3D Background */}
      <ThreeWorld />
      
      {/* 1. WHIMSICAL HAND-SKETCHED HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ruled paper grid overlay */}
        <div className="ruled-paper absolute bottom-0 left-0 right-0 h-[22vh] opacity-40 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          {/* Hero text */}
          <div className="lg:col-span-7 flex flex-col space-y-7 text-center lg:text-left pt-4 relative">
            
            {/* Cartoon Lightbulb Sketch sticker (Gives immediate visual wow!) */}
            <div className="absolute -top-12 -left-8 w-16 h-16 pointer-events-none animate-sketch-float hidden sm:block">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-[#FFEB3B] stroke-[#2C2C2C] stroke-[4px]">
                {/* Lightbulb glass outline */}
                <path d="M 50,15 A 25,25 0 0,0 25,40 C 25,52 32,58 37,64 L 37,75 L 63,75 L 63,64 C 68,58 75,52 75,40 A 25,25 0 0,0 50,15 Z" />
                {/* Bulb base */}
                <path d="M 37,75 L 63,75 M 40,80 L 60,80 M 44,85 L 56,85" strokeWidth="6" />
                {/* Glowing Rays */}
                <line x1="50" y1="5" x2="50" y2="10" strokeWidth="4" />
                <line x1="20" y1="20" x2="25" y2="25" strokeWidth="4" />
                <line x1="80" y1="20" x2="75" y2="25" strokeWidth="4" />
                <line x1="10" y1="40" x2="18" y2="40" strokeWidth="4" />
                <line x1="90" y1="40" x2="82" y2="40" strokeWidth="4" />
              </svg>
            </div>

             {/* Playful Sketch Tag */}
            <div className="inline-flex items-center self-center lg:self-start px-4 py-1.5 rounded-xl text-sm font-marker bg-[#FFF59D] border-2.5 border-[#2C2C2C] shadow-[2.5px_3.0px_0px_#2C2C2C] rotate-[-1.5deg]">
              <Star className="w-4.5 h-4.5 mr-1.5 fill-[#FFCA28] stroke-[#2C2C2C] shrink-0 animate-spin-slow" />
              {heroData.tagline}
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6.5xl font-marker font-black text-[#2C2C2C] leading-none select-none my-6 flex items-center justify-center lg:justify-start">
              {/* Left Column: Your & Our */}
              <div className="flex flex-col items-end text-[#3F51B5] tracking-wide text-right leading-none mr-3 sm:mr-4">
                <span className="h-10 sm:h-18 lg:h-24 flex items-center text-3xl sm:text-5xl lg:text-[4.2rem]">{heroData.titleYour}</span>
                <span className="h-10 sm:h-18 lg:h-24 flex items-center text-3xl sm:text-5xl lg:text-[4.2rem]">{heroData.titleOur}</span>
              </div>

              {/* Middle: Common large P */}
              <div className="flex items-center justify-center shrink-0 w-12 sm:w-22 lg:w-30 h-20 sm:h-36 lg:h-48">
                <span className="text-7xl sm:text-9.5xl lg:text-[13rem] font-black text-[#2C2C2C] leading-none select-none">
                  P
                </span>
              </div>

              {/* Right Column: roject & assion */}
              <div className="flex flex-col items-start leading-none text-left ml-2 sm:ml-3">
                <span className="h-10 sm:h-18 lg:h-24 flex items-center text-[#2C2C2C]">
                  <span className="underline decoration-[#A5D6A7] decoration-4 text-2.5xl sm:text-4.5xl lg:text-[3.5rem]">{heroData.titleProject}</span>
                </span>
                <span className="h-10 sm:h-18 lg:h-24 flex items-center text-[#2C2C2C]">
                  <span className="underline decoration-[#EF9A9A] decoration-4 text-2.5xl sm:text-4.5xl lg:text-[3.5rem]">{heroData.titlePassion}</span>
                </span>
              </div>
            </h1>
            
            <p className="text-base sm:text-lg text-[#5A5A5A] max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-semibold">
              {heroData.description}
            </p>

            {/* Dynamic Sketch Buttons & Arrow */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-2 relative">
              <Link
                href="/order"
                className="btn-sketch w-full sm:w-auto text-lg text-center py-4 px-8 inline-flex items-center justify-center"
              >
                Let&apos;s Build It!
                <ArrowRight className="w-5 h-5 ml-2 text-[#2C2C2C]" />
              </Link>
              
              <a
                href={`https://wa.me/${contactData.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(heroData.whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-base font-marker bg-white text-[#2C2C2C] border-3 border-[#2C2C2C] rounded-xl px-8 py-4 flex items-center justify-center shadow-[4px_5px_0px_#2C2C2C] hover:bg-[#FAF6EE] hover:translate-y-0.5 hover:shadow-[3px_3px_0px_#2C2C2C] transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 mr-2 text-[#2C2C2C] fill-[#A5D6A7]" />
                WhatsApp Discussion
              </a>

              {/* Hand-drawn sketchy curved arrow pointing from text to CTA button */}
              <div className="absolute -bottom-14 left-44 w-20 h-10 pointer-events-none hidden lg:block opacity-65">
                <svg viewBox="0 0 100 50" className="w-full h-full stroke-[#2C2C2C] stroke-[3px] fill-none">
                  {/* Curved dashed line */}
                  <path d="M 10,10 C 35,45 65,45 80,25" strokeDasharray="4 4" />
                  {/* Arrow Head */}
                  <path d="M 70,25 L 80,25 L 80,35" fill="none" strokeLinecap="round" />
                </svg>
                <div className="absolute right-0 bottom-0 text-[10px] font-hand font-extrabold text-[#2C2C2C] rotate-[-5deg]">build now</div>
              </div>
            </div>

            {/* Student assurances list */}
            <div className="pt-10 border-t-2 border-dashed border-[#2C2C2C]/10 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm font-marker text-[#6A6A6A]">
              {heroData.assurances?.map((ass, i) => (
                <span key={i}>{ass}</span>
              ))}
            </div>
          </div>

          {/* Right layout illustration space */}
          <div className="hidden lg:block lg:col-span-5 h-[350px] relative pointer-events-none">
            {/* Hanging folder tag / sketchy card drawing */}
            <div className="absolute top-4 left-6 bg-[#FCF9F2] border-2.5 border-[#2C2C2C] p-4 rounded shadow-[2px_3px_0_#2C2C2C] rotate-[4deg] font-hand font-extrabold text-lg text-[#2C2C2C] z-10 animate-sketch-float">
              📎 3D drafting active
            </div>
          </div>
        </div>
      </section>

      {/* 2. RULED PAPER ASSURANCES CHECKLIST */}
      <section className="relative z-10 py-16 paper-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-hand font-extrabold text-[#2C2C2C] underline decoration-[#A5D6A7] decoration-4">
              Why Students Trust Us
            </h2>
            <p className="mt-3 text-base font-marker text-[#6A6A6A]">
              We supply top-grade code resources alongside explanation tools to help you verify logic.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentFeatures.map((feature, i) => {
              const Icon = getIcon(feature.icon);
              return (
                <div
                  key={feature.title || i}
                  className={`sketch-card p-6 bg-white relative overflow-hidden group border-t-[6px] ${feature.border || "border-t-[#FAF6EE]"}`}
                >
                  {/* Small binder hole on top card left corner */}
                  <div className="absolute top-2.5 left-2.5 w-3 h-3 bg-[#FAF6EE] border border-[#2C2C2C] rounded-full" />
                  
                  <div className="w-12 h-12 rounded-xl bg-[#FFF59D] border-2.5 border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center mb-5 shadow-[3px_3px_0_#2C2C2C] group-hover:rotate-[6deg] transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] mb-2 tracking-wide">
                    <span className={`${feature.marker || "marker-blue"} px-1.5`}>{feature.title}</span>
                  </h3>
                  <p className="text-sm font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SKETCHY CATEGORIES TABLE */}
      <section id="categories" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-hand font-extrabold text-[#2C2C2C]">
            Academic Study Areas
          </h2>
          <p className="mt-3 text-base font-marker text-[#6A6A6A]">
            Select your syllabus level or technology stack. We fully customize logic structures based on college reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentCategories.map((cat, i) => {
            const Icon = getIcon(cat.icon);
            return (
              <div
                key={cat.title || i}
                className={`sketch-card p-5 flex flex-col justify-between h-[245px] bg-white hover:bg-[#FFFDF6] border-t-[5px] ${cat.border || "border-t-[#FAF6EE]"}`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${cat.bg || "bg-[#FAF6EE]"} border-2 border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center mb-4 shadow-[2px_2px_0_#2C2C2C]`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-[#2C2C2C]/10 flex items-center justify-end mt-auto">
                  <Link
                    href={cat.href}
                    className="inline-flex items-center text-sm font-marker font-bold text-[#2C2C2C] hover:underline"
                  >
                    Select 
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PREMIUM COSTING SHEET */}
      <section id="pricing" className="relative z-10 py-20 paper-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-hand font-extrabold text-[#2C2C2C]">
              Custom Project Consultation
            </h2>
            <p className="mt-3 text-base font-marker text-[#6A6A6A]">
              We design structured solutions tailored specifically to your college review requirements.
            </p>
          </div>

          {/* Highlight sticker callout */}
          <div className="max-w-2xl mx-auto mb-12 text-center relative">
            <div className="inline-block sketch-border bg-[#FFF59D] px-6 py-4 shadow-[4px_5px_0_#2C2C2C] rotate-[-1deg]">
              <span className="font-hand font-extrabold text-2xl sm:text-3xl text-[#2C2C2C] flex items-center justify-center">
                <CheckSquare className="w-6.5 h-6.5 mr-2 stroke-[#2C2C2C] fill-[#A5D6A7] animate-bounce" />
                PPT AND REPORT ARE INCLUDED IN ALL PLANS!
              </span>
            </div>
          </div>

          {/* Custom Quote Layout */}
          <div className="max-w-3xl mx-auto">
            <div className="sketch-card p-8 md:p-10 bg-white relative overflow-hidden text-center shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] rounded-2xl">
              {/* Binder hole */}
              <div className="absolute top-3 left-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
              <div className="absolute top-3 right-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
              
              <h3 className="text-2xl font-marker font-extrabold text-[#2C2C2C] mb-4">
                <span className="marker-yellow px-2">Tailored Solutions & Direct Coding</span>
              </h3>
              
              <p className="text-sm font-sans font-semibold text-[#5A5A5A] leading-relaxed max-w-xl mx-auto mb-8">
                Every final year academic submission is unique. Instead of static, cookie-cutter packages, we custom-build each codebase to align precisely with your college syllabus, technical guidelines, and timeline requirements.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mb-8">
                <div className="p-4 bg-[#FAF6EE]/50 border-2 border-dashed border-[#2C2C2C]/20 rounded-xl">
                  <span className="text-[#2C2C2C] font-extrabold text-base block mb-1">✓ Complete Files</span>
                  <span className="text-xs text-[#6A6A6A] leading-relaxed block font-sans">Full source code, PPT presentation slides, and thesis reports.</span>
                </div>
                <div className="p-4 bg-[#FAF6EE]/50 border-2 border-dashed border-[#2C2C2C]/20 rounded-xl">
                  <span className="text-[#2C2C2C] font-extrabold text-base block mb-1">✓ Viva Support</span>
                  <span className="text-xs text-[#6A6A6A] leading-relaxed block font-sans">Line-by-line preparatory explanations and walkthrough guides.</span>
                </div>
                <div className="p-4 bg-[#FAF6EE]/50 border-2 border-dashed border-[#2C2C2C]/20 rounded-xl">
                  <span className="text-[#2C2C2C] font-extrabold text-base block mb-1">✓ Remote Setup</span>
                  <span className="text-xs text-[#6A6A6A] leading-relaxed block font-sans">Free remotely guided compiler & database setup on Zoom.</span>
                </div>
              </div>
              
              <Link
                href="/order"
                className="btn-sketch py-4 px-8 text-base inline-flex items-center justify-center cursor-pointer"
              >
                Request a Custom Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          {/* SPECIAL STUDENT DISCOUNT BANNER */}
          <div className="max-w-3xl mx-auto mt-20 text-center relative">
            <div className="sketch-border bg-[#FFCDD2] p-8 shadow-[6px_8px_0px_#2C2C2C] flex flex-col sm:flex-row items-center justify-around gap-6 rotate-[0.5deg]">
              
              {/* Ribbon Sticker */}
              <div className="w-18 h-18 rounded-full bg-[#CE93D8] border-3 border-[#2C2C2C] flex items-center justify-center text-4xl shadow-[3px_4px_0_#2C2C2C] rotate-[-10deg] shrink-0 animate-sketch-float">
                {activeOffer.emoji || "🎁"}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <span className="marker-red text-xs font-marker font-extrabold text-[#B71C1C] border border-[#B71C1C] px-2 py-0.5 rounded uppercase tracking-wider">
                  {activeOffer.ribbon || "Special Offer!"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-hand font-extrabold text-[#2C2C2C] mt-2">
                  {activeOffer.title}
                </h3>
                <p className="text-xs font-marker text-[#6A6A6A] mt-1">{activeOffer.subtext}</p>
              </div>

              <a
                href={waOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sketch py-3.5 px-6 text-sm shrink-0"
              >
                Claim Offer
              </a>

            </div>
          </div>

        </div>
      </section>

      {/* 5. BLUEPRINTS SHOWCASE */}
      <section id="portfolio" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-hand font-extrabold text-[#2C2C2C]">
            Academic System Blueprints
          </h2>
          <p className="mt-3 text-base font-marker text-[#6A6A6A]">
            Explore pre-configured logic outlines. We establish secure databases and layouts perfectly tailored to your project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPortfolio.map((proj, i) => (
            <div
              key={proj.title || i}
              className="sketch-card bg-white overflow-hidden flex flex-col group"
            >
              {/* Sketch Header box with paper coloring */}
              <div className="p-6 border-b-3 border-[#2C2C2C] bg-[#FAF6EE] flex flex-col items-center text-center justify-center relative overflow-hidden h-40">
                <div className="absolute top-1.5 right-1.5 p-1 text-[10px] font-marker text-[#6A6A6A] rotate-[6deg] border border-[#6A6A6A] rounded">blueprint</div>
                <BookOpen className="w-16 h-16 opacity-10 absolute -bottom-2 -right-2 transform group-hover:scale-110 transition-transform duration-200 text-[#2C2C2C]" />
                
                <span className={`marker-${(proj.markerColor || "marker-green").split('-')[1] || "green"} font-marker font-bold text-base border-2 border-[#2C2C2C] shadow-[2px_2px_0_#2C2C2C] px-3.5 py-1`}>
                  {proj.title}
                </span>
                
                <p className="text-xs font-marker text-[#6A6A6A] mt-3">
                  {proj.tech ? proj.tech.split(",")[0] : ""}
                </p>
              </div>

              {/* Text info copy */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-marker font-bold text-[#6A6A6A] block mb-1">
                    Tech Stack specifications:
                  </span>
                  <p className="text-xs font-marker font-extrabold text-[#2C2C2C] mb-3 leading-tight">
                    {proj.tech}
                  </p>
                  <p className="text-sm font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                    {proj.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2C2C2C]/10">
                  {proj.title === "Advanced AI Customer Care Chatbot" || proj.title === "Face Recognition Attendance system" || proj.title === "Hospital Management Core Desk" || proj.title === "Expense Tracker with AI Insights" || proj.title === "Smart Notes Summarizer" ? (
                    <button
                      onClick={() => handleRequestDemo(proj.title)}
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 border-2 border-[#2C2C2C] text-sm font-marker font-bold text-[#2C2C2C] hover:bg-[#FAF6EE] rounded-xl transition-all shadow-[2.5px_3px_0_#2C2C2C] hover:translate-y-0.5 cursor-pointer text-left"
                    >
                      Request Demo Output
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </button>
                  ) : (
                    <a
                      href={`https://wa.me/${contactData.phone.replace(/[^0-9]/g, "")}?text=Hello%2C%20I%20want%20to%20see%20a%20demo%20for%20${encodeURIComponent(proj.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 border-2 border-[#2C2C2C] text-sm font-marker font-bold text-[#2C2C2C] hover:bg-[#FAF6EE] rounded-xl transition-all shadow-[2.5px_3px_0_#2C2C2C] hover:translate-y-0.5 cursor-pointer"
                    >
                      Request Demo Output
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. POLAROID TESTIMONIALS SHEET */}
      <section className="relative z-10 py-20 paper-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-hand font-extrabold text-[#2C2C2C]">
              Reviewed by 1000+ Students
            </h2>
            <p className="mt-3 text-base font-marker text-[#6A6A6A]">
              Read verified feedback sheets from seniors who submitted our structured solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTestimonials.map((test, i) => (
              <div
                key={test.name || i}
                className="polaroid-card bg-white flex flex-col justify-between relative"
                style={{ transform: `rotate(${i % 2 === 0 ? '-2deg' : '2deg'})` }}
              >
                {/* Simulated Washi Tape banner */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-[#FFF59D]/70 px-6 py-1 border border-dashed border-[#2C2C2C] text-[10px] font-marker uppercase rotate-[1deg] text-[#2C2C2C] shadow-[1px_2px_0_#2C2C2C]">
                  verified student
                </div>

                <div className="pt-4">
                  <div className="flex items-center space-x-1 text-amber-500 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#FFCA28] stroke-[#2C2C2C] shrink-0" />
                    ))}
                  </div>
                  <p className="text-sm font-sans font-semibold italic text-[#5A5A5A] leading-relaxed mb-6">
                    &quot;{test.review}&quot;
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-[#2C2C2C]/10">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-[#2C2C2C] shadow-[1px_1.5px_0_#2C2C2C]">
                    <img 
                      src={test.avatar} 
                      alt={test.name} 
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-marker font-extrabold text-[#2C2C2C]">
                      {test.name}
                    </h4>
                    <p className="text-xs font-marker text-[#6A6A6A]">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQs */}
      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-hand font-extrabold text-[#2C2C2C]">
            Common Doubts (FAQs)
          </h2>
          <p className="mt-3 text-base font-marker text-[#6A6A6A]">
            Get clear, quick explanations regarding codes, setup support, and viva exams.
          </p>
        </div>

        <div className="space-y-5">
          {currentFaqs.map((faq, i) => (
            <div
              key={faq.q || i}
              className="sketch-card bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between text-[#2C2C2C] focus:outline-none"
              >
                <span className="text-lg font-marker font-extrabold flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-[#6A6A6A] shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 text-[#2C2C2C] shrink-0 transform transition-transform duration-200 ${
                  openFaq === i ? "rotate-180" : ""
                }`} />
              </button>
              
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#2C2C2C]/10 bg-[#FAF6EE]/45"
                  >
                    <div className="px-6 py-4 text-sm font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CHALKBOARD CONTACT DESK */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sketch-border bg-white p-8 md:p-12 shadow-[6px_8px_0px_#2C2C2C] relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            {/* Context details */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="marker-yellow text-sm font-marker font-extrabold text-[#2C2C2C] border border-[#2C2C2C] px-2 py-0.5 rounded uppercase tracking-wider">
                  Ready to Start?
                </span>
                <h2 className="text-3xl font-hand font-extrabold text-[#2C2C2C] mt-4 mb-4 leading-tight">
                  Discuss Your Custom Scope with Our Desk
                </h2>
                <p className="text-sm font-sans font-semibold text-[#5A5A5A] leading-relaxed mb-8">
                  Fill out our inquiry sheet with your basic ideas and branch guidelines, and our coordinator desk will coordinate a direct code consultation review.
                </p>
              </div>

              <div className="space-y-4 font-marker text-lg text-[#2C2C2C] border-t-2 border-dashed border-[#2C2C2C]/20 pt-6">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#2C2C2C] fill-[#A5D6A7]" />
                  <span className="font-extrabold">{contactData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#2C2C2C] fill-[#BBDEFB]" />
                  <span className="font-extrabold">{contactData.email}</span>
                </div>
              </div>
            </div>

            {/* Ruled ledger paper form */}
            <div className="lg:col-span-7">
              <div className="sketch-border bg-[#FFFDF9] p-6 md:p-8 shadow-[4px_5px_0_#2C2C2C]">
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1.5 tracking-wider">Your Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/30 transition-all text-[#2C2C2C] font-marker"
                        placeholder="e.g. John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1.5 tracking-wider">Mobile Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/30 transition-all text-[#2C2C2C] font-marker"
                        placeholder="e.g. 9876543210"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1.5 tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/30 transition-all text-[#2C2C2C] font-marker"
                      placeholder="e.g. john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1.5 tracking-wider">Project Concept / Branch Guidelines</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/30 transition-all text-[#2C2C2C] font-marker"
                      placeholder="Outline any custom tools, specific language requirements, or deadlines..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-sketch w-full py-4.5 text-base flex items-center justify-center cursor-pointer"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2.5 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        File My Inquiry Sheet
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
