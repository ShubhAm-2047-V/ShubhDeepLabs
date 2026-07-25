"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Laptop, Code, Cpu, Database, Brain, Sparkles, CheckSquare, 
  Smartphone, Network, ShieldCheck, Clock, Award, FileText, 
  HeartHandshake, ChevronDown, Phone, Mail, Send, ArrowRight, MessageSquare, BookOpen, Star, HelpCircle, Briefcase, GraduationCap
} from "lucide-react";
import toast from "react-hot-toast";
import { dbService } from "@/lib/supabase";
import ThreeWorld from "@/components/ThreeWorld";
import ProductCustomizer, { STEPS, calculateTotal, formatINR } from "@/components/ProductCustomizer";

const ICON_MAP = {
  Laptop, Code, Cpu, Database, Brain, Sparkles, CheckSquare, 
  Smartphone, Network, ShieldCheck, Clock, Award, FileText, 
  HeartHandshake, ChevronDown, Phone, Mail, Send, ArrowRight, MessageSquare, BookOpen, Star, HelpCircle, Briefcase, GraduationCap
};

const getIcon = (iconName) => {
  if (!iconName) return HelpCircle;
  if (typeof iconName !== "string") return iconName;
  return ICON_MAP[iconName] || HelpCircle;
};

export default function StudentDeskPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

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

  const [openFaq, setOpenFaq] = useState(null);

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
        `Hello ShubDeep Labs! 👋\n\nI want to claim the Student Special Deal: "${activeOffer.title}"!`
      )}`;
    }
    
    const cat    = STEPS[0].options.find(o => o.id === selections.category)?.label || "—";
    const techs  = (selections.tech   || []).map(id => STEPS[1].options.find(o => o.id === id)?.label).filter(Boolean).join(", ") || "—";
    const addons = (selections.addons || []).map(id => STEPS[2].options.find(o => o.id === id)?.label).filter(Boolean).join(", ") || "None";
    const time   = STEPS[3].options.find(o => o.id === selections.timeline)?.label || "—";
    const { total } = calculateTotal(selections, customPrices);
    
    return `https://wa.me/${phoneNo}?text=${encodeURIComponent(
      `Hello ShubDeep Labs! 👋\n\nI want to claim the Student Special Deal: "${activeOffer.title}"!\n\nMy Capstone Requirement:\n🎓 Level: ${cat}\n⚙️ Tech Stack: ${techs}\n✨ Add-Ons: ${addons}\n⏱️ Timeline: ${time}\n💰 My Estimate: ${formatINR(total)}\n\nPlease confirm final quote!`
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
        collegeName: "Student Desk Inquiry",
        branch: "Academic Project",
        year: "Final Year",
        projectTitle: "Student Project Inquiry",
        techRequired: "N/A",
        deadline: new Date().toISOString().split('T')[0],
        budget: "0",
        description: formData.message,
        needPPT: true,
        needReport: true,
        needVivaGuidance: true,
        projectStatus: "Pending",
        paymentStatus: "Unpaid"
      });

      localStorage.setItem("shubhdeeplabs_user_email", formData.email);
      localStorage.setItem("shubhdeeplabs_user_name", formData.name);

      toast.success("Student inquiry submitted! We will contact you soon.", {
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

  const studentCategories = [
    { title: "Diploma Final Year", icon: Laptop, desc: "Syllabus-compliant, core-logic driven applications scaled for diploma review parameters.", href: "/diploma", bg: "bg-[#FFF9C4]", border: "border-t-[#FFCA28]" },
    { title: "Engineering B.E / B.Tech", icon: Code, desc: "Full-stack architectures, clean database structures, and comprehensive data flows for B.E. / B.Tech.", href: "/engineering", bg: "bg-[#E8F5E9]", border: "border-t-[#66BB6A]" },
    { title: "M.Tech & Research", icon: Cpu, desc: "High-grade algorithm modeling, data analysis, and thesis research code executions.", href: "/mtech", bg: "bg-[#E1F5FE]", border: "border-t-[#42A5F5]" },
    { title: "BCA / MCA Capstone", icon: Database, desc: "Interactive management portals, dashboard consoles, cloud databases, and clean system layouts.", href: "/bca-mca", bg: "bg-[#F3E5F5]", border: "border-t-[#AB47BC]" }
  ];

  const features = [
    { title: "100% Original Codebase", desc: "No reused or broken code. Built according to your university syllabus and faculty specifications.", icon: CheckSquare, marker: "marker-green", border: "border-t-[#66BB6A]" },
    { title: "On-Time Project Delivery", desc: "We adhere strictly to submission dates. Receive your complete project, slides, and reports on time.", icon: Clock, marker: "marker-blue", border: "border-t-[#42A5F5]" },
    { title: "Complete PPT & Thesis Report", desc: "Includes IEEE format project reports, blackbook documentation, and high-impact PPT presentation slides.", icon: FileText, marker: "marker-yellow", border: "border-t-[#FFCA28]" },
    { title: "Mock Viva Tutoring Support", desc: "Direct guidance on code flow, database schema explanations, and viva examination preparation.", icon: GraduationCap, marker: "marker-red", border: "border-t-[#EF5350]" }
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
    { name: "Priyanka Naik", role: "MCA Final Year Student", review: "I ordered the AI leaf scanner project. The beautiful dashboard layout completely wowed the external examiner! Having the structured report draft included saved me from college revision loops.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
    { name: "Rahul Deshmukh", role: "Diploma CS Graduate", review: "Got my final year Android attendance system delivered with complete PPT and report! The mock viva session helped me answer every question confidently.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
    { name: "Sneha Patil", role: "B.Tech IT Student", review: "ShubDeep Labs made my capstone project super easy. Everything worked right out of the box and the source code comments were super clear.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" }
  ];

  const faqs = [
    { q: "What is included with my student project order?", a: "You get 100% full source code, database files, IEEE format project report/documentation, PPT slides, and AnyDesk setup assistance." },
    { q: "Can I get viva explanation and code walkthrough?", a: "Yes! We provide one-on-one mock viva tutoring and guide you step-by-step through the code structure and logic." },
    { q: "Are project modifications possible if guides request changes?", a: "Yes, we support guide modifications and minor updates to ensure your final submission is approved smoothly." },
    { q: "How fast can an academic project be delivered?", a: "Academic projects are typically delivered within 3-7 days based on urgency and customization level." }
  ];

  return (
    <div className="space-y-24 pb-20 relative overflow-hidden bg-transparent">
      <ThreeWorld />
      
      {/* 1. STUDENT HERO SECTION */}
      <section className="relative z-10 min-h-[85vh] flex items-center justify-center pt-28 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ruled-paper absolute bottom-0 left-0 right-0 h-[22vh] opacity-40 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          <div className="lg:col-span-8 flex flex-col space-y-6 text-center lg:text-left pt-4">
            
            {/* Mode Switch Pill Banner */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
              <div className="inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-marker bg-[#FFF59D] border-2.5 border-[#2C2C2C] shadow-[2.5px_3.0px_0px_#2C2C2C] rotate-[-1.5deg]">
                <GraduationCap className="w-4.5 h-4.5 mr-1.5 text-[#2C2C2C] shrink-0" />
                SHUBDEEP LABS STUDENT & ACADEMIC DESK
              </div>
              <Link href="/" className="text-xs font-marker font-bold bg-[#C8E6C9] border border-[#2C2C2C] px-3 py-1 rounded-lg hover:bg-[#A5D6A7] transition-all flex items-center gap-1 shadow-[1.5px_2px_0_#2C2C2C]">
                <Briefcase className="w-3.5 h-3.5" />
                Switch to Business Mode →
              </Link>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-marker font-black text-[#2C2C2C] leading-tight">
              Get Custom <span className="underline decoration-[#FFF59D] decoration-4">Academic Projects</span>, PPT Slides & Viva Tutoring
            </h1>
            
            <p className="text-base sm:text-lg text-[#5A5A5A] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans font-semibold">
              Specially designed for Diploma, B.Tech, M.Tech, and BCA/MCA final year submissions. 100% original source code, IEEE reports, PPT presentation slides, and step-by-step viva guidance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4">
              <Link
                href="/order"
                className="btn-sketch w-full sm:w-auto text-lg text-center py-4 px-8 inline-flex items-center justify-center"
              >
                Build My Capstone!
                <ArrowRight className="w-5 h-5 ml-2 text-[#2C2C2C]" />
              </Link>              
              
              <a
                href={`https://wa.me/${contactData.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello ShubDeep Labs! I want to inquire about a student project.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-base font-marker bg-white text-[#2C2C2C] border-3 border-[#2C2C2C] rounded-xl px-8 py-4 flex items-center justify-center shadow-[4px_5px_0px_#2C2C2C] hover:bg-[#FAF6EE] transition-all cursor-pointer"
              >
                <GraduationCap className="w-5 h-5 mr-2 text-[#2C2C2C]" />
                WhatsApp Student Desk
              </a>
            </div>

            <div className="pt-6 border-t border-dashed border-[#2C2C2C]/20 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm font-marker text-[#6A6A6A]">
              <span>✓ 100% Working Code</span>
              <span>✓ PPT Presentation Included</span>
              <span>✓ Thesis & Blackbook Report</span>
              <span>✓ Mock Viva & Guide Support</span>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-4 h-[320px] relative pointer-events-none">
            <div className="absolute top-6 right-6 bg-[#FFF9C4] border-2.5 border-[#2C2C2C] p-5 rounded-2xl shadow-[4px_5px_0_#2C2C2C] rotate-[3deg] font-hand font-extrabold text-xl text-[#2C2C2C]">
              🎓 100% Viva Ready Guarantee!
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACADEMIC CATEGORIES */}
      <section id="categories" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-hand font-extrabold text-[#2C2C2C]">
            Academic Project Streams
          </h2>
          <p className="mt-3 text-base font-marker text-[#6A6A6A]">
            Select your academic branch or course level for tailored final year solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentCategories.map((cat, i) => {
            const Icon = getIcon(cat.icon);
            return (
              <div
                key={cat.title || i}
                className={`sketch-card p-6 flex flex-col justify-between h-[255px] bg-white hover:bg-[#FFFDF6] border-t-[6px] ${cat.border}`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${cat.bg} border-2.5 border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center mb-4 shadow-[3px_3px_0_#2C2C2C]`}>
                    <Icon className="w-6 h-6" />
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
                    className="inline-flex items-center text-sm font-marker font-bold text-[#3F51B5] hover:underline"
                  >
                    Explore Projects 
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. STUDENT ASSURANCES */}
      <section className="relative z-10 py-16 paper-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-hand font-extrabold text-[#2C2C2C] underline decoration-[#A5D6A7] decoration-4">
              Everything Needed for 100% Submission Success
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = getIcon(feature.icon);
              return (
                <div key={i} className={`sketch-card p-6 bg-white relative overflow-hidden group border-t-[6px] ${feature.border}`}>
                  <div className="w-12 h-12 rounded-xl bg-[#FFF59D] border-2.5 border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center mb-5 shadow-[3px_3px_0_#2C2C2C]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] mb-2">
                    <span className={`${feature.marker} px-1.5`}>{feature.title}</span>
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

      {/* 4. BLUEPRINTS / PORTFOLIO */}
      <section id="portfolio" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-hand font-extrabold text-[#2C2C2C]">
            Popular Student Blueprints
          </h2>
          <p className="mt-3 text-base font-marker text-[#6A6A6A]">
            Pre-built project blueprints ready for customized delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((proj, i) => (
            <div key={i} className="sketch-card bg-white overflow-hidden flex flex-col group">
              <div className="p-6 border-b-3 border-[#2C2C2C] bg-[#FAF6EE] flex flex-col items-center text-center justify-center relative overflow-hidden h-36">
                <BookOpen className="w-16 h-16 opacity-10 absolute -bottom-2 -right-2 text-[#2C2C2C]" />
                <span className={`marker-${proj.markerColor.split('-')[1]} font-marker font-bold text-base border-2 border-[#2C2C2C] shadow-[2px_2px_0_#2C2C2C] px-3.5 py-1`}>
                  {proj.title}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-marker font-extrabold text-[#2C2C2C] mb-2">
                    Tech Stack: {proj.tech}
                  </p>
                  <p className="text-sm font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                    {proj.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#2C2C2C]/10">
                  <button
                    onClick={() => handleRequestDemo(proj.title)}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 border-2 border-[#2C2C2C] text-sm font-marker font-bold text-[#2C2C2C] hover:bg-[#FAF6EE] rounded-xl transition-all shadow-[2.5px_3px_0_#2C2C2C] cursor-pointer"
                  >
                    Request Demo Output
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS & FAQS */}
      <section className="relative z-10 py-16 paper-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-hand font-extrabold text-[#2C2C2C]">
              What Graduates & Students Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {testimonials.map((test, i) => (
              <div key={i} className="polaroid-card bg-white flex flex-col justify-between p-6">
                <p className="text-sm font-sans font-semibold italic text-[#5A5A5A] leading-relaxed mb-6">
                  &quot;{test.review}&quot;
                </p>
                <div className="flex items-center space-x-3">
                  <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full border-2 border-[#2C2C2C]" />
                  <div>
                    <h4 className="text-sm font-marker font-extrabold text-[#2C2C2C]">{test.name}</h4>
                    <p className="text-xs font-marker text-[#6A6A6A]">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT FORM */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sketch-border bg-white p-8 md:p-12 shadow-[6px_8px_0px_#2C2C2C]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="marker-yellow text-sm font-marker font-extrabold text-[#2C2C2C] border border-[#2C2C2C] px-2 py-0.5 rounded uppercase">
                  Student Assistance Desk
                </span>
                <h2 className="text-3xl font-hand font-extrabold text-[#2C2C2C] mt-4 mb-4">
                  File Your Project Inquiry
                </h2>
                <p className="text-sm font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                  Provide your project title or domain, and our technical coordinators will get back to you with custom options.
                </p>
              </div>

              <div className="space-y-3 font-marker text-lg text-[#2C2C2C] pt-6">
                <div>📞 {contactData.phone}</div>
                <div>✉️ {contactData.email}</div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleFormSubmit} className="space-y-4 bg-[#FFFDF9] p-6 border-2 border-[#2C2C2C] rounded-2xl shadow-[3px_4px_0_#2C2C2C]">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-xl font-marker"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Mobile Number"
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-xl font-marker"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-xl font-marker"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Mention project topic, technology requirements, or deadlines..."
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-xl font-marker"
                  required
                ></textarea>
                <button type="submit" disabled={loading} className="btn-sketch w-full py-4 text-base flex items-center justify-center">
                  {loading ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
