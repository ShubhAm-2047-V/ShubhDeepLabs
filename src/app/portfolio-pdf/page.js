"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Laptop, Code, Cpu, Database, Brain, Sparkles, CheckSquare, 
  Smartphone, Network, Clock, FileText, Phone, Mail, MapPin, 
  BookOpen, Star, HelpCircle, ArrowLeft, Printer, Info
} from "lucide-react";
import { dbService } from "@/lib/supabase";

export default function PortfolioPDFPage() {
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

  const defaultFeatures = [
    { title: "100% Original Work", desc: "No copy-pasted templates. Every codebase is structured freshly according to your specific college needs.", icon: CheckSquare },
    { title: "On-Time Delivery", desc: "We are extremely strict with dates. Get your complete setup, reports, and slides well before your final submit day.", icon: Clock },
    { title: "PPT & Reports Ready", desc: "Syllabus-compliant, fully formatted presentation drafts and comprehensive project reports included.", icon: FileText },
    { title: "Clean Documented Code", desc: "Neat model structures, clean controllers, and comprehensive code comments that make logic review easy.", icon: Code }
  ];

  const defaultCategories = [
    { title: "Diploma Projects", icon: Laptop, desc: "Syllabus-compliant, core-logic driven applications scaled perfectly for diploma review parameters.", bg: "bg-[#FFF9C4]" },
    { title: "Engineering Projects", icon: Code, desc: "Full-stack architectures, neat database structures, and comprehensive data flows built for B.E. / B.Tech.", bg: "bg-[#E8F5E9]" },
    { title: "M.Tech Projects", icon: Cpu, desc: "High-grade algorithm modeling, data analysis, and advanced codebase executions for research thesis.", bg: "bg-[#E1F5FE]" },
    { title: "BCA / MCA Projects", icon: Database, desc: "Interactive management portals, dashboard consoles, cloud databases, and clean system layouts.", bg: "bg-[#F3E5F5]" },
    { title: "AI / ML Projects", icon: Brain, desc: "TensorFlow / PyTorch models, visual scans, NLP conversational bots, and predictive analytics pipelines.", bg: "bg-[#FFEBEE]" },
    { title: "Web Projects", icon: Sparkles, desc: "Stunning responsive portals, custom dashboards, single page interfaces, and rich administrative panels.", bg: "bg-[#FFF3E0]" },
    { title: "Android Projects", icon: Smartphone, desc: "Mobile applications, local SQLite databases, customizable API links, and fully functional Android packages.", bg: "bg-[#E8F5E9]" },
    { title: "IoT Projects", icon: Network, desc: "Smart automation designs, hardware controller mapping (Arduino/ESP32), and interactive dashboards.", bg: "bg-[#E1F5FE]" }
  ];

  const defaultPortfolio = [
    { title: "AI Plant Disease Detector", tech: "Python, Next.js, TensorFlow, FastAPI", desc: "A neural-network visual scanning web application detecting agricultural leaf diseases with detailed metric analytics.", markerColor: "marker-green" },
    { title: "Advanced AI Customer Care Chatbot", tech: "React, Node.js, Express, OpenAI API", desc: "Intelligent messaging center with customizable document indexing (RAG) and interactive dashboard console log views.", markerColor: "marker-purple" },
    { title: "Face Recognition Attendance system", tech: "Python, OpenCV, Tkinter, SQLite", desc: "Real-time face detection tracker featuring automated CSV sheets generation and attendance log exports.", markerColor: "marker-blue" },
    { title: "Hospital Management Core Desk", tech: "Next.js, MongoDB, Tailwind, Node.js", desc: "Full clinic portal with scheduling grids, active invoice trackers, and secure digital prescription vaults.", markerColor: "marker-orange" },
    { title: "Expense Tracker with AI Insights", tech: "React, Node.js, MongoDB, Gemini API", desc: "Personal finance portal offering automated category tagging, monthly budget forecasting, and AI-driven spending recommendations.", markerColor: "marker-yellow" },
    { title: "Smart Notes Summarizer", tech: "React, FastAPI, Python, Hugging Face", desc: "Collaborative document pad that auto-generates structured summaries, highlights action items, and generates flashcards using NLP.", markerColor: "marker-red" }
  ];

  const defaultTestimonials = [
    { name: "Miss Yelgonde", role: "M.Tech Student", review: "Excellent research algorithm modeling! The Shubdeep Labs team helped me build the GreenMind AI plant disease detector app for my M.Tech thesis. The codebase was clean and well-documented. Got full support during reviews." },
    { name: "Miss Pogul", role: "M.Tech Student", review: "Highly professional service. They custom-tailored the Agrovision machine learning model and backend integration for my project. The detailed thesis report and presentation slides saved me months of revision." },
    { name: "Miss Saina", role: "Client", review: "Amazing explanation and Zoom support! They built a beautiful e-commerce website for my business, helped configure the database, and explained the administration panels perfectly. Strongly recommended!" }
  ];

  const features = (siteSettings?.features && siteSettings.features.length > 0 && siteSettings.features[0]?.title) ? siteSettings.features : defaultFeatures;
  const categories = (siteSettings?.categories && siteSettings.categories.length > 0 && siteSettings.categories[0]?.title) ? siteSettings.categories : defaultCategories;
  const portfolio = (siteSettings?.portfolio && siteSettings.portfolio.length > 0 && siteSettings.portfolio[0]?.title) ? siteSettings.portfolio : defaultPortfolio;
  const testimonials = (siteSettings?.testimonials && siteSettings.testimonials.length > 0 && siteSettings.testimonials[0]?.name) ? siteSettings.testimonials : defaultTestimonials;
  const contact = siteSettings?.contact || {
    phone: "+91 90288 33275",
    email: "shubdeeplabs@gmail.com",
    address: "Solapur, Maharashtra"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] pb-10">
      {/* Styles Injection for Page layout */}
      <style jsx global>{`
        @media screen {
          .a4-page {
            width: 210mm;
            height: 297mm;
            box-shadow: 0 10px 25px rgba(44, 44, 44, 0.15);
            margin: 28px auto;
            border: 3.5px solid #2C2C2C;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
            background-color: #FCF9F2;
          }
          .binder-rings {
            position: absolute;
            top: 0;
            left: 14px;
            bottom: 0;
            width: 18px;
            background-image: 
              radial-gradient(circle, #FAF6EE 5px, transparent 6px),
              linear-gradient(to right, #2C2C2C, #2C2C2C);
            background-size: 18px 32px, 2px 100%;
            background-repeat: repeat-y, no-repeat;
            background-position: center top, center top;
            opacity: 0.25;
            z-index: 10;
          }
          .binder-loops {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 28px;
            z-index: 15;
            pointer-events: none;
          }
          .binder-loop-ring {
            position: absolute;
            left: 4px;
            width: 24px;
            height: 10px;
            border: 2px solid #2C2C2C;
            background: linear-gradient(to bottom, #EBE5D9, #FAF6EE);
            border-radius: 8px;
            box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.15);
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            background-color: #FAF6EE !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .a4-page {
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            page-break-after: always;
            page-break-inside: avoid;
            break-after: page;
            position: relative;
            overflow: hidden;
            background-color: #FCF9F2 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .binder-rings {
            position: absolute;
            top: 0;
            left: 14px;
            bottom: 0;
            width: 18px;
            background-image: 
              radial-gradient(circle, #FAF6EE 5px, transparent 6px),
              linear-gradient(to right, #2C2C2C, #2C2C2C);
            background-size: 18px 32px, 2px 100%;
            background-repeat: repeat-y, no-repeat;
            background-position: center top, center top;
            opacity: 0.25;
            z-index: 10;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Action Bar (Screen Only) */}
      <div className="no-print bg-[#FAF6EE] border-b-3 border-[#2C2C2C] sticky top-0 z-[100] py-4 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link 
              href="/"
              className="p-2 rounded-xl border-2 border-[#2C2C2C] bg-white hover:bg-[#EBE5D9] transition-all shadow-[2px_2px_0_#2C2C2C] text-[#2C2C2C]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-marker font-extrabold tracking-wide text-[#2C2C2C]">Shubdeep Labs Portfolio PDF</h1>
              <p className="text-xs text-[#6A6A6A] font-sans font-semibold">Print this page to save it as a high-quality PDF brochure.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-[#FFF59D] border-2 border-[#2C2C2C] px-3.5 py-1.5 rounded-xl text-xs font-marker font-bold shadow-[2px_2px_0_#2C2C2C]">
              <Info className="w-4 h-4 text-[#2C2C2C]" />
              <span>Tip: Enable &quot;Background graphics&quot; & set margins to &quot;None&quot; in Print settings!</span>
            </div>
            
            <button
              onClick={handlePrint}
              className="btn-sketch inline-flex items-center justify-center px-6 py-2.5 text-base cursor-pointer"
            >
              <Printer className="w-5 h-5 mr-2" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pages Container */}
      <div className="flex flex-col items-center select-none pt-4">
        
        {/* PAGE 1: COVER PAGE */}
        <div className="a4-page relative p-12 pr-12 pl-20 flex flex-col justify-between ruled-paper">
          {/* Binder spirals effect */}
          <div className="binder-rings" />
          <div className="binder-loops hidden md:block">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="binder-loop-ring" style={{ top: `${16 + i * 96}px` }} />
            ))}
          </div>

          {/* Top Banner */}
          <div className="flex justify-between items-start pt-4 border-b-2 border-dashed border-[#2C2C2C]/20 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white border-2.5 border-[#2C2C2C] overflow-hidden shadow-[2px_3px_0_#2C2C2C]">
                <img src="/logo.jpg" alt="Shubdeep Labs Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-hand font-black text-3xl leading-none">Shubdeep Labs</h2>
                <p className="text-[10px] font-marker text-[#6A6A6A] tracking-wider leading-none mt-1">Building Intelligent Solutions</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-[#FFF59D] border-2 border-[#2C2C2C] rounded-lg text-xs font-marker shadow-[2px_2px_0_#2C2C2C] rotate-[2deg]">
              Academic Portfolio
            </div>
          </div>

          {/* Center Title Content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center my-10 relative">
            
            {/* Whimsical sticky note */}
            <div className="absolute top-[-30px] right-4 bg-[#CE93D8] border-2.5 border-[#2C2C2C] px-5 py-2.5 rounded shadow-[3px_4px_0_#2C2C2C] rotate-[-4deg] font-marker font-extrabold text-sm z-20">
              ⚡ 100% Original Code
            </div>

            <div className="inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-marker bg-[#FFF59D] border-2.5 border-[#2C2C2C] shadow-[2.5px_3px_0px_#2C2C2C] rotate-[-1.5deg] mb-6">
              <Star className="w-4.5 h-4.5 mr-1.5 fill-[#FFCA28] stroke-[#2C2C2C] shrink-0" />
              SIMPLE PROJECTS. SMART SOLUTIONS.
            </div>

            <h1 className="text-5xl font-marker font-black text-[#2C2C2C] tracking-wide leading-tight mb-6 select-none max-w-lg">
              Academic Project Portfolio & Blueprints
            </h1>

            <p className="text-lg text-[#5A5A5A] max-w-md font-sans font-semibold leading-relaxed mb-8">
              From Idea to Implementation, We Build Intelligent Academic Solutions. Next-generation web portals, machine learning algorithms, and IoT prototypes built with clean, premium codebases.
            </p>

            <div className="w-full max-w-sm p-5 border-3 border-[#2C2C2C] bg-white rounded-xl shadow-[4px_5px_0_#2C2C2C] text-left">
              <span className="marker-yellow text-xs font-marker font-bold border border-[#2C2C2C] px-2 py-0.5 rounded">WHAT WE DO</span>
              <ul className="mt-3 space-y-2 text-sm font-marker text-[#2C2C2C]">
                <li>✓ Full Syllabus-Compliant Codebase Designs</li>
                <li>✓ Complete Project Thesis Reports (Syllabus-aligned)</li>
                <li>✓ Full PowerPoint (PPT) Presentation Slides</li>
                <li>✓ 1-on-1 Zoom Code Setup & Viva Guidance</li>
              </ul>
            </div>
          </div>

          {/* Footer Contact Info */}
          <div className="border-t-3 border-[#2C2C2C] pt-6 flex justify-between items-center text-xs font-marker text-[#6A6A6A]">
            <div className="flex items-center space-x-1.5">
              <Phone className="w-4 h-4 text-[#2C2C2C]" />
              <span>{contact.phone}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Mail className="w-4 h-4 text-[#2C2C2C]" />
              <span>{contact.email}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#2C2C2C]" />
              <span>{contact.address}</span>
            </div>
          </div>
        </div>


        {/* PAGE 2: WHY TRUST US & ACADEMIC STUDY AREAS */}
        <div className="a4-page relative p-12 pr-12 pl-20 flex flex-col justify-between ruled-paper">
          <div className="binder-rings" />
          <div className="binder-loops hidden md:block">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="binder-loop-ring" style={{ top: `${16 + i * 96}px` }} />
            ))}
          </div>

          {/* Header */}
          <div className="border-b-2 border-dashed border-[#2C2C2C]/20 pb-4">
            <h2 className="text-3xl font-hand font-extrabold text-[#2C2C2C]">
              Why Students Trust Shubdeep Labs
            </h2>
            <p className="text-xs font-marker text-[#6A6A6A]">
              We supply top-grade code resources alongside explanation tools to help you verify logic.
            </p>
          </div>

          {/* Guarantees Checklist Grid */}
          <div className="grid grid-cols-2 gap-4 my-6">
            {features.slice(0, 4).map((f, i) => {
              const colors = ["border-t-[#66BB6A]", "border-t-[#42A5F5]", "border-t-[#FFCA28]", "border-t-[#EF5350]"];
              const markers = ["marker-green", "marker-blue", "marker-yellow", "marker-red"];
              return (
                <div key={i} className={`sketch-card p-4 bg-white border-t-[5px] ${colors[i]} h-[125px] overflow-hidden`}>
                  <h3 className="text-sm font-marker font-extrabold text-[#2C2C2C] mb-1">
                    <span className={`${markers[i]} px-1`}>{f.title}</span>
                  </h3>
                  <p className="text-[11px] font-sans font-semibold text-[#5A5A5A] leading-tight">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Section: Academic Study Areas */}
          <div className="border-b-2 border-dashed border-[#2C2C2C]/20 pb-2 pt-2">
            <h2 className="text-2xl font-hand font-extrabold text-[#2C2C2C]">
              Academic Study Areas & Syllabus Levels
            </h2>
            <p className="text-xs font-marker text-[#6A6A6A]">
              We customize project directories to comply exactly with your review parameters.
            </p>
          </div>

          {/* Categories Grid (Optimized for A4 Page) */}
          <div className="grid grid-cols-2 gap-3 my-4">
            {categories.slice(0, 8).map((cat, i) => {
              const borderColors = ["border-[#FFCA28]", "border-[#66BB6A]", "border-[#42A5F5]", "border-[#AB47BC]", "border-[#EF5350]", "border-[#FFA726]", "border-[#66BB6A]", "border-[#42A5F5]"];
              return (
                <div 
                  key={i}
                  className={`border-2 ${borderColors[i]} bg-white p-3.5 rounded-xl flex items-start space-x-2.5 h-[80px] shadow-[2px_2px_0_#2C2C2C] overflow-hidden`}
                >
                  <div className={`w-8 h-8 rounded-lg ${cat.bg || 'bg-[#FAF6EE]'} border border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center shrink-0`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-marker font-extrabold text-[#2C2C2C] leading-none mb-1">{cat.title}</h4>
                    <p className="text-[10px] font-sans font-semibold text-[#5A5A5A] leading-tight line-clamp-2">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Page Number */}
          <div className="border-t border-[#2C2C2C]/10 pt-2 text-right text-xs font-marker text-[#6A6A6A]">
            Page 2 of 5
          </div>
        </div>


        {/* PAGE 3: PORTFOLIO BLUEPRINTS CATALOG - PART 1 */}
        <div className="a4-page relative p-12 pr-12 pl-20 flex flex-col justify-between ruled-paper">
          <div className="binder-rings" />
          <div className="binder-loops hidden md:block">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="binder-loop-ring" style={{ top: `${16 + i * 96}px` }} />
            ))}
          </div>

          {/* Header */}
          <div className="border-b-2 border-dashed border-[#2C2C2C]/20 pb-4">
            <h2 className="text-3xl font-hand font-extrabold text-[#2C2C2C]">
              Academic System Blueprints
            </h2>
            <p className="text-xs font-marker text-[#6A6A6A]">
              Explore details of our core pre-configured system modules. We deliver verified models and structured folders.
            </p>
          </div>

          {/* Projects List 1 to 3 */}
          <div className="flex-1 flex flex-col justify-around my-4 space-y-4">
            {portfolio.slice(0, 3).map((proj, i) => {
              const borderColors = ["border-t-[#66BB6A]", "border-t-[#AB47BC]", "border-t-[#42A5F5]"];
              const markers = ["marker-green", "marker-purple", "marker-blue"];
              return (
                <div key={i} className={`sketch-card bg-white p-5 border-t-[5px] ${borderColors[i]} flex flex-col justify-between`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`${markers[i]} font-marker font-extrabold text-sm border border-[#2C2C2C] px-2.5 py-0.5 rounded shadow-[1.5px_1.5px_0_#2C2C2C]`}>
                      {proj.title}
                    </span>
                    <span className="text-[10px] font-hand font-bold text-[#6A6A6A] border border-[#6A6A6A] px-1.5 rounded rotate-[-2deg]">Verify Stack</span>
                  </div>
                  
                  <div className="my-1.5">
                    <span className="text-[10px] font-marker text-[#6A6A6A] block">TECH SPECIFICATION:</span>
                    <p className="text-xs font-marker font-extrabold text-[#2C2C2C] leading-none mb-2">{proj.tech}</p>
                  </div>

                  <p className="text-xs font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                    {proj.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Page Number */}
          <div className="border-t border-[#2C2C2C]/10 pt-2 text-right text-xs font-marker text-[#6A6A6A]">
            Page 3 of 5
          </div>
        </div>


        {/* PAGE 4: PORTFOLIO BLUEPRINTS CATALOG - PART 2 */}
        <div className="a4-page relative p-12 pr-12 pl-20 flex flex-col justify-between ruled-paper">
          <div className="binder-rings" />
          <div className="binder-loops hidden md:block">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="binder-loop-ring" style={{ top: `${16 + i * 96}px` }} />
            ))}
          </div>

          {/* Header */}
          <div className="border-b-2 border-dashed border-[#2C2C2C]/20 pb-4">
            <h2 className="text-3xl font-hand font-extrabold text-[#2C2C2C]">
              Academic System Blueprints (Continued)
            </h2>
            <p className="text-xs font-marker text-[#6A6A6A]">
              Explore details of our core pre-configured system modules. We deliver verified models and structured folders.
            </p>
          </div>

          {/* Projects List 4 to 6 */}
          <div className="flex-1 flex flex-col justify-around my-4 space-y-4">
            {portfolio.slice(3, 6).map((proj, i) => {
              const borderColors = ["border-t-[#FFA726]", "border-t-[#FFCA28]", "border-t-[#EF5350]"];
              const markers = ["marker-orange", "marker-yellow", "marker-red"];
              return (
                <div key={i} className={`sketch-card bg-white p-5 border-t-[5px] ${borderColors[i]} flex flex-col justify-between`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`${markers[i]} font-marker font-extrabold text-sm border border-[#2C2C2C] px-2.5 py-0.5 rounded shadow-[1.5px_1.5px_0_#2C2C2C]`}>
                      {proj.title}
                    </span>
                    <span className="text-[10px] font-hand font-bold text-[#6A6A6A] border border-[#6A6A6A] px-1.5 rounded rotate-[2deg]">Verify Stack</span>
                  </div>
                  
                  <div className="my-1.5">
                    <span className="text-[10px] font-marker text-[#6A6A6A] block">TECH SPECIFICATION:</span>
                    <p className="text-xs font-marker font-extrabold text-[#2C2C2C] leading-none mb-2">{proj.tech}</p>
                  </div>

                  <p className="text-xs font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                    {proj.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Page Number */}
          <div className="border-t border-[#2C2C2C]/10 pt-2 text-right text-xs font-marker text-[#6A6A6A]">
            Page 4 of 5
          </div>
        </div>


        {/* PAGE 5: PRICING, TESTIMONIALS & CONTACT */}
        <div className="a4-page relative p-12 pr-12 pl-20 flex flex-col justify-between ruled-paper">
          <div className="binder-rings" />
          <div className="binder-loops hidden md:block">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="binder-loop-ring" style={{ top: `${16 + i * 96}px` }} />
            ))}
          </div>

          {/* Header */}
          <div className="border-b-2 border-dashed border-[#2C2C2C]/20 pb-4">
            <h2 className="text-3xl font-hand font-extrabold text-[#2C2C2C]">
              Costing & Student Stories
            </h2>
            <p className="text-xs font-marker text-[#6A6A6A]">
              Transparent consultation starting values and verified feedback from diploma & degree final years.
            </p>
          </div>

          {/* Pricing Ledger Card */}
          <div className="border-3 border-[#2C2C2C] bg-white p-4 rounded-xl shadow-[3px_3px_0_#2C2C2C] text-left my-2">
            <h3 className="text-sm font-marker font-extrabold text-[#2C2C2C] mb-2 underline decoration-2 decoration-[#FFCA28]">
              Academic Project Pricing
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-marker text-[#2C2C2C]">
              <div className="flex justify-between border-b border-[#2C2C2C]/10 pb-0.5">
                <span>🎓 Diploma Projects</span>
                <span className="font-bold">Free 🌿</span>
              </div>
              <div className="flex justify-between border-b border-[#2C2C2C]/10 pb-0.5">
                <span>⚙️ Engineering Projects</span>
                <span className="font-bold">₹3,999+</span>
              </div>
              <div className="flex justify-between border-b border-[#2C2C2C]/10 pb-0.5">
                <span>📊 BCA / MCA Projects</span>
                <span className="font-bold">₹2,999+</span>
              </div>
              <div className="flex justify-between border-b border-[#2C2C2C]/10 pb-0.5">
                <span>🌐 Web Development</span>
                <span className="font-bold">₹3,999+</span>
              </div>
              <div className="flex justify-between border-b border-[#2C2C2C]/10 pb-0.5">
                <span>📱 Android Projects</span>
                <span className="font-bold">₹4,999+</span>
              </div>
              <div className="flex justify-between border-b border-[#2C2C2C]/10 pb-0.5">
                <span>🔌 IoT Projects</span>
                <span className="font-bold">₹4,999+</span>
              </div>
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="my-2 flex flex-col space-y-3.5">
            <h3 className="text-sm font-marker font-extrabold text-[#2C2C2C] px-1">
              <span className="marker-yellow">Verified Student Testimonials</span>
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {testimonials.slice(0, 3).map((test, i) => (
                <div 
                  key={i} 
                  className="bg-white border-2 border-[#2C2C2C] rounded-lg p-2.5 shadow-[2px_2px_0_rgba(44,44,44,0.1)] flex flex-col justify-between h-[155px]"
                  style={{ transform: `rotate(${i % 2 === 0 ? '-1.5deg' : '1.5deg'})` }}
                >
                  <p className="text-[10px] font-sans font-semibold italic text-[#5A5A5A] leading-tight mb-2 line-clamp-6">
                    &quot;{test.review}&quot;
                  </p>
                  <div className="border-t border-[#2C2C2C]/10 pt-1.5 flex flex-col justify-end">
                    <h4 className="text-[10px] font-marker font-extrabold text-[#2C2C2C] leading-none mb-0.5 truncate">{test.name}</h4>
                    <p className="text-[8px] font-marker text-[#6A6A6A] leading-none truncate">{test.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classroom Chalkboard Contact Desk */}
          <div className="border-3 border-[#2C2C2C] bg-[#1E2E2A] p-5 rounded-xl text-[#EBE5D9] text-center shadow-[4px_4px_0px_#2C2C2C] relative overflow-hidden my-3">
            <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-white/20 rounded-full" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-white/20 rounded-full" />
            
            <h3 className="text-xl font-hand font-extrabold text-white mb-2 leading-none">
              Discuss Your Scope with Our Desk
            </h3>
            <p className="text-[10px] font-sans text-white/70 max-w-sm mx-auto mb-3">
              Connect directly to clarify details, branch requirements, deadlines, or to custom design modules for your college viva reviewers.
            </p>

            <div className="flex flex-row justify-around items-center pt-2.5 border-t border-white/20 font-marker text-xs">
              <div className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 fill-[#A5D6A7] text-[#A5D6A7]" />
                <span className="font-extrabold text-white">{contact.phone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 fill-[#BBDEFB] text-[#BBDEFB]" />
                <span className="font-extrabold text-white">{contact.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white">🌐</span>
                <a href="https://shubh-deep-labs.vercel.app" target="_blank" rel="noopener noreferrer" className="font-extrabold text-white underline hover:text-[#FFF59D] transition-colors">
                  shubh-deep-labs.vercel.app
                </a>
              </div>
            </div>
          </div>

          {/* Page Number */}
          <div className="border-t border-[#2C2C2C]/10 pt-2 text-right text-xs font-marker text-[#6A6A6A]">
            Page 5 of 5
          </div>
        </div>

      </div>
    </div>
  );
}
