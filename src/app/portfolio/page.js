import Link from "next/link";
import { Award, FileText, ArrowRight, ExternalLink, Globe, Server, Smartphone, Brain, Rocket } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "Portfolio & Blueprint Showcase | ShubDeep Labs Architecture Showcase",
  description: "Browse ShubDeep Labs enterprise software portfolio, live application blueprints, SaaS platforms, AI systems, and downloadable technical documentation.",
  keywords: [
    "Software Portfolio",
    "Enterprise Blueprints",
    "SaaS Architecture Showcase",
    "AI Systems Showcase",
    "Next.js Case Portfolio"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/portfolio",
  },
  openGraph: {
    title: "Portfolio & Blueprint Showcase | ShubDeep Labs",
    description: "Explore live enterprise software blueprints and custom applications built by ShubDeep Labs.",
    url: "https://shubh-deep-labs.vercel.app/portfolio",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Portfolio" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio & Blueprint Showcase | ShubDeep Labs",
    description: "Enterprise software architecture showcase and live product demonstrations.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function PortfolioPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Portfolio Showcase", href: "/portfolio" }
  ];

  const showcaseItems = [
    { title: "Hospital Management Core Desk", category: "Healthcare SaaS", href: "/products/hospital-desk", icon: Server, desc: "Multi-tenant clinic desk featuring patient queue scheduling, doctor availability logs, and automated billing." },
    { title: "AI Expense Tracker & Financial Insights", category: "Financial AI", href: "/products/expense-tracker", icon: Brain, desc: "Real-time budget pacing, category analysis, and LLM-generated markdown financial health reports." },
    { title: "Biometric Face Recognition Attendance", category: "Computer Vision", href: "/products/face-attendance", icon: Smartphone, desc: "Webcam facial scanning, real-time employee attendance verification, and automated CSV logs." },
    { title: "Smart Notes Summarizer & Flashcards", category: "NLP Document AI", href: "/products/notes-summarizer", icon: FileText, desc: "Private RAG document search indexing text notes to produce study concepts and Q&A flashcards." },
    { title: "AI Support Chatbot Engine", category: "Customer Support AI", href: "/products/chatbot", icon: Globe, desc: "Context-aware conversational chatbot engine trained on custom business knowledge bases." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Award className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            ENTERPRISE ARCHITECTURE SHOWCASE
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Software Portfolio & Blueprints <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Proven Production Systems</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Discover our portfolio of live enterprise applications, AI systems, SaaS portals, and downloadable technical documentation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/portfolio-pdf" className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto">
              Download Portfolio PDF <FileText className="w-5 h-5 ml-2" />
            </Link>
            <a href="https://shub-deep-dev.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto">
              ShubDeep Dev Hub <ExternalLink className="w-5 h-5 ml-2" />
            </a>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {showcaseItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="sand-dune-card p-8 flex flex-col justify-between border border-[#D5C4A6]">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#CFE3D2] text-[#2E3B2B] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EADCC6] text-[#3B2818]">
                      {item.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#3B2818] mb-3">{item.title}</h2>
                  <p className="text-sm font-medium text-[#4A3525] leading-relaxed mb-6">{item.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#D5C4A6]/50">
                  <Link href={item.href} className="text-sm font-bold text-[#4E7854] hover:underline inline-flex items-center">
                    Launch Interactive Demo <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
