import Link from "next/link";
import { Award, FileText, ArrowRight, ExternalLink, Globe, Server, Smartphone, Brain, Rocket, CheckSquare, ShieldCheck, Zap, Layers, Clock, BarChart } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";

export const metadata = {
  title: "Software Architecture & Case-Study Portfolio | ShubDeep Labs Showcase",
  description: "Explore ShubDeep Labs enterprise software portfolio, live application blueprints, SaaS platforms, AI systems, and technical case-study breakdowns.",
  keywords: [
    "Software Portfolio",
    "Enterprise Case Studies",
    "SaaS Architecture Showcase",
    "AI Systems Showcase",
    "Next.js Case Portfolio"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/portfolio",
  },
  openGraph: {
    title: "Software Architecture Portfolio | ShubDeep Labs Showcase",
    description: "Explore live enterprise software blueprints, SaaS case studies, and custom applications built by ShubDeep Labs.",
    url: "https://shubh-deep-labs.vercel.app/portfolio",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Portfolio Showcase" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Architecture Portfolio | ShubDeep Labs",
    description: "Enterprise software architecture showcase and live case-study demonstrations.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function PortfolioPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Portfolio Showcase", href: "/portfolio" }
  ];

  const showcaseProjects = [
    {
      title: "Hospital Management Core Desk",
      category: "Healthcare SaaS",
      client: "HealthTech Innovations",
      href: "/products/hospital-desk",
      icon: Server,
      timeline: "3 Weeks Sprints",
      problem: "Legacy paper-based patient queueing and manual doctor scheduling caused long clinic wait times and billing discrepancies.",
      solution: "Engineered a multi-tenant clinic management core desk featuring real-time doctor queue scheduling, AES-256 patient admission logs, and automated billing modules.",
      techStack: ["Next.js 16", "React 19", "PostgreSQL", "Supabase RLS", "Tailwind CSS"],
      architecture: "Isolated tenant database schemas with strict row-level security (RLS) and real-time WebSocket queue updates.",
      features: [
        "Patient Admission & Discharge Ledgers",
        "Doctor Live Availability & OPD Scheduling",
        "Automated Multi-Department Invoice Generator",
        "Role-Based Access Control (RBAC) for Staff"
      ],
      results: "Reduced patient check-in wait times by 65% and streamlined clinic billing accuracy to 99.9%.",
      impactStat: "65% Faster Check-Ins"
    },
    {
      title: "AI Expense Tracker & Financial Analytics",
      category: "Financial AI Platform",
      client: "FinPulse Analytics",
      href: "/products/expense-tracker",
      icon: Brain,
      timeline: "2 Weeks Sprints",
      problem: "Users struggled to track monthly budget pacing and lacked actionable financial insights from raw spending receipts.",
      solution: "Built a financial AI platform combining real-time budget pacing analytics with LLM-generated markdown financial health recommendations.",
      techStack: ["Next.js 16", "Gemini 2.0 AI", "Python Flask", "Chart.js", "Tailwind CSS"],
      architecture: "Asynchronous LLM pipeline calculating monthly budget burn rates and generating formatted markdown advisory reports.",
      features: [
        "Real-Time Category Spending Breakdown",
        "Monthly Budget Pacing Progress Tracker",
        "LLM Financial Health Advisory Reports",
        "CSV Transaction Ledger Export"
      ],
      results: "Helped over 1,200 active users maintain budget pacing within 95% of target monthly limits.",
      impactStat: "95% Budget Adherence"
    },
    {
      title: "Biometric Face Recognition Attendance",
      category: "Computer Vision AI",
      client: "Civic Workforce Solutions",
      href: "/products/face-attendance",
      icon: Smartphone,
      timeline: "3 Weeks Sprints",
      problem: "Traditional ID card scanning allowed proxy attendance and required manual attendance register reconciliation.",
      solution: "Architected a biometric facial recognition attendance system featuring real-time webcam video stream scanning and instant log generation.",
      techStack: ["Python OpenCV", "TensorFlow", "React 19", "Node.js", "Supabase"],
      architecture: "Client-side OpenCV canvas frame processing coupled with server-side facial vector embedding matching.",
      features: [
        "Sub-Second Live Facial Vector Verification",
        "Automated Attendance Log Generation",
        "Proxy Detection & Anti-Spoofing Alerts",
        "Manager Dashboard & CSV Export"
      ],
      results: "Eliminated proxy attendance 100% and reduced monthly HR payroll reconciliation time by 15 hours.",
      impactStat: "100% Proxy Elimination"
    },
    {
      title: "Smart AI Notes Summarizer & Flashcards",
      category: "NLP Document AI",
      client: "EduTech Global Labs",
      href: "/products/notes-summarizer",
      icon: FileText,
      timeline: "2 Weeks Sprints",
      problem: "Students and researchers spent hours manually summarizing lengthy lecture notes and generating revision study guides.",
      solution: "Engineered a private NLP document indexing application utilizing RAG vector search to output concept summaries and Q&A flashcards.",
      techStack: ["Next.js 16", "Gemini 2.0 Flash", "Pinecone Vectors", "React 19"],
      architecture: "Chunked text document vector embedding pipeline executing semantic RAG lookup to return formatted study materials.",
      features: [
        "Automated Markdown Document Summary",
        "Bulleted Core Concept Extraction",
        "Interactive Q&A Study Flashcards",
        "One-Click Copy & Export to Markdown"
      ],
      results: "Reduced study material preparation time by 75% for over 5,000 active academic users.",
      impactStat: "75% Faster Revision"
    }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Award className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            ENTERPRISE CASE-STUDY PORTFOLIO
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Software Engineering Portfolio <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Architectural Case Studies</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Discover how ShubDeep Labs designs, architects, and deploys production-ready software applications, AI integrations, and SaaS platforms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/portfolio-pdf" className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto">
              Download Portfolio PDF <FileText className="w-5 h-5 ml-2" />
            </Link>
            <a href="/contact" className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto">
              Request Technical Blueprint <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>
        </header>

        {/* DETAILED CASE-STUDY PORTFOLIO ITEMS */}
        <section className="space-y-16 mb-20">
          {showcaseProjects.map((proj, idx) => {
            const Icon = proj.icon;
            return (
              <div key={idx} className="sand-dune-card p-8 sm:p-12 rounded-3xl border-2 border-[#D5C4A6] space-y-8">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#D5C4A6]">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#CFE3D2] text-[#2E3B2B] flex items-center justify-center shadow-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EADCC6] text-[#3B2818]">
                        {proj.category}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B2818] mt-1">{proj.title}</h2>
                      <p className="text-xs font-bold text-[#4E7854]">Client: {proj.client} • Timeline: {proj.timeline}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#CFE3D2] rounded-2xl text-center">
                    <div className="text-xl sm:text-2xl font-extrabold text-[#2E3B2B]">{proj.impactStat}</div>
                    <div className="text-xs font-bold text-[#4A3525]">Measurable Impact</div>
                  </div>
                </div>

                {/* Problem vs Solution Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-white/70 rounded-2xl border border-[#D5C4A6]">
                    <h3 className="text-sm font-extrabold uppercase text-[#8B0000] mb-2">The Business Challenge</h3>
                    <p className="text-sm text-[#4A3525] font-medium leading-relaxed">{proj.problem}</p>
                  </div>
                  <div className="p-6 bg-white/70 rounded-2xl border border-[#D5C4A6]">
                    <h3 className="text-sm font-extrabold uppercase text-[#2E3B2B] mb-2">The Engineering Solution</h3>
                    <p className="text-sm text-[#4A3525] font-medium leading-relaxed">{proj.solution}</p>
                  </div>
                </div>

                {/* Architecture & Key Features */}
                <div>
                  <h3 className="text-base font-extrabold text-[#3B2818] mb-3">Architecture & System Design:</h3>
                  <p className="text-sm font-medium text-[#4A3525] bg-[#EADCC6]/40 p-4 rounded-xl mb-6 border border-[#D5C4A6]">
                    {proj.architecture}
                  </p>

                  <h3 className="text-base font-extrabold text-[#3B2818] mb-3">Core Deliverables & Features:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {proj.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-[#3B2818]">
                        <CheckSquare className="w-4 h-4 text-[#2E3B2B] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Badges & CTA */}
                <div className="pt-6 border-t border-[#D5C4A6] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold uppercase text-[#4A3525] mr-2">Tech Stack:</span>
                    {proj.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="px-3 py-1 rounded-lg text-xs font-bold bg-[#3B2818] text-[#FAF6EE]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link href={proj.href} className="btn-sage-green py-2.5 px-6 text-sm font-extrabold inline-flex items-center">
                    Launch Interactive Demo <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {/* CTA BANNER */}
        <section className="sand-dune-card p-10 text-center border-2 border-[#2E3B2B] bg-[#CFE3D2]/40">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">Have a Similar System Requirement?</h2>
          <p className="text-[#4A3525] max-w-xl mx-auto mb-6 font-medium">Schedule a 30-minute discovery call with our technical architects to engineer your blueprint.</p>
          <a href="/contact" className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center">
            Book Discovery Call <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </section>
      </div>
    </div>
  );
}
