import Link from "next/link";
import { Building, ShieldCheck, Zap, Headphones, Globe, ArrowRight, Code, CheckSquare } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "About ShubDeep Labs | Global Software Engineering & AI Company",
  description: "Learn about ShubDeep Labs, a premier global software development company delivering high-performance custom web applications, SaaS platforms, and AI engineering.",
  keywords: [
    "About ShubDeep Labs",
    "Global Software Engineering Company",
    "Software Development Agency",
    "AI Engineering Team"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/about",
  },
  openGraph: {
    title: "About ShubDeep Labs | Global Software Engineering & AI Company",
    description: "Engineering high-performance software, cloud systems, and custom AI agents for global clients.",
    url: "https://shubh-deep-labs.vercel.app/about",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "About ShubDeep Labs" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About ShubDeep Labs | Software Agency",
    description: "Learn about our engineering principles, SLA commitments, and custom software solutions.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" }
  ];

  const coreValues = [
    { title: "Zero Vendor Lock-In", desc: "You receive unencumbered ownership of all source code, database models, CI/CD scripts, and documentation." },
    { title: "Bank-Grade Security", desc: "Enforcing OWASP Top 10 compliance, AES-256 data encryption, OAuth2/JWT auth, and regular security audits." },
    { title: "Rapid Engineering Sprints", desc: "Production-ready architecture modules delivering custom software solutions 3x faster without compromising quality." },
    { title: "24/7 Dedicated SLAs", desc: "Direct communications with senior software architects, uptime monitoring, and ongoing SLA maintenance." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Building className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            GLOBAL SOFTWARE ENGINEERING & ARCHITECTURE
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Building Intelligent Software Solutions <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">For Global Scale</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            ShubDeep Labs is a Senior Staff Software Engineering and Technical Consultancy firm. We design, architect, and deploy high-performance web applications, enterprise SaaS platforms, AI agents, and mobile software.
          </p>
        </header>

        <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreValues.map((val, idx) => (
            <div key={idx} className="sand-dune-card p-8 rounded-3xl border border-[#D5C4A6]">
              <div className="w-12 h-12 rounded-2xl bg-[#CFE3D2] flex items-center justify-center mb-6 text-[#2E3B2B]">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#3B2818] mb-3">{val.title}</h2>
              <p className="text-[#4A3525] leading-relaxed text-sm font-medium">{val.desc}</p>
            </div>
          ))}
        </section>

        <section className="sand-dune-card p-10 sm:p-14 rounded-3xl text-center border-2 border-[#2E3B2B] bg-[#CFE3D2]/40 my-16">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">Partner With ShubDeep Labs Today</h2>
          <p className="text-lg text-[#4A3525] max-w-2xl mx-auto mb-8 font-medium">Schedule a 30-minute discovery consultation to discuss your product architecture.</p>
          <a href="/#consultation" className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center">
            Book Free Consultation <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </section>
      </div>
    </div>
  );
}
