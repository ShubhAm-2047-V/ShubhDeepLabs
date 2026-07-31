import Link from "next/link";
import { Briefcase, ArrowRight, CheckSquare, Star, Building, BarChart, Server, Globe } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "B2B Software Engineering Case Studies | ShubDeep Labs Transformations",
  description: "Read real-world enterprise case studies showcasing how ShubDeep Labs delivered high-performance web applications, custom SaaS platforms, and AI integrations for global clients.",
  keywords: [
    "Software Case Studies",
    "Enterprise Transformation Case Studies",
    "SaaS Scaling Case Study",
    "AI Integration Case Study",
    "Next.js Architecture Results"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/case-studies",
  },
  openGraph: {
    title: "B2B Software Engineering Case Studies | ShubDeep Labs",
    description: "In-depth technical case studies on SaaS engineering, custom AI agents, and high-volume web portals.",
    url: "https://shubh-deep-labs.vercel.app/case-studies",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Case Studies" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B Software Case Studies | ShubDeep Labs",
    description: "Technical case studies detailing enterprise cloud migrations, custom AI indexing, and SaaS scalability.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function CaseStudiesPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Case Studies", href: "/case-studies" }
  ];

  const caseStudies = [
    {
      client: "TechScale Solutions",
      industry: "Enterprise SaaS",
      title: "Building a Multi-Tenant SaaS Customer Dashboard with Next.js & Microservices",
      metric: "3x Faster Launch",
      desc: "ShubDeep Labs engineered core customer administration portals, API gateways, and role-based authentication pipelines within 3 weeks of architectural discovery.",
      results: ["Sub-second page rendering (LCP < 0.8s)", "100% full source code delivery", "Zero vendor lock-in architecture"]
    },
    {
      client: "HealthTech Innovations",
      industry: "Healthcare Systems",
      title: "Clinic Management Core Desk with Doctor Queue & Patient Records",
      metric: "99.9% Operational Reliability",
      desc: "Designed and deployed a customized clinic management module featuring automated patient queue logs, doctor scheduling, and bank-grade data security.",
      results: ["AES-256 encrypted health data", "Streamlined patient queueing by 65%", "Simplified multi-department billing"]
    },
    {
      client: "RetailEdge SaaS",
      industry: "E-commerce & Retail",
      title: "Scaling Headless E-commerce & High-Throughput API Gateway",
      metric: "45% Conversion Increase",
      desc: "Architected a headless Next.js e-commerce storefront integrated with multi-currency payment gateways and real-time inventory synchronization.",
      results: ["Handled 10,000+ daily active queries", "Cart checkout abandonment reduced by 35%", "Automated multi-warehouse stock sync"]
    }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Briefcase className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            REAL-WORLD ENTERPRISE CASE STUDIES
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Client Success & Transformation Stories <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Proven Technical Results</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Read how ShubDeep Labs partners with founders, CTOs, and product leaders to engineer production-ready web applications, AI platforms, and cloud solutions.
          </p>
        </header>

        <section className="space-y-12 mb-20">
          {caseStudies.map((cs, idx) => (
            <div key={idx} className="sand-dune-card p-8 sm:p-12 rounded-3xl border border-[#D5C4A6]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#EADCC6] text-[#3B2818]">
                    {cs.industry}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B2818] mt-2">{cs.title}</h2>
                  <p className="text-sm font-bold text-[#4E7854] mt-1">Client: {cs.client}</p>
                </div>
                <div className="p-4 bg-[#CFE3D2] rounded-2xl text-center">
                  <div className="text-xl sm:text-2xl font-extrabold text-[#2E3B2B]">{cs.metric}</div>
                  <div className="text-xs font-bold text-[#4A3525]">Key Result</div>
                </div>
              </div>

              <p className="text-[#4A3525] leading-relaxed text-base font-medium mb-6">{cs.desc}</p>

              <div className="pt-6 border-t border-[#D5C4A6]/50 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {cs.results.map((res, rIdx) => (
                  <div key={rIdx} className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-[#3B2818]">
                    <CheckSquare className="w-4 h-4 text-[#2E3B2B] shrink-0" />
                    <span>{res}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="sand-dune-card p-10 text-center border-2 border-[#2E3B2B] bg-[#CFE3D2]/40">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">Want Similar Results for Your Product?</h2>
          <p className="text-[#4A3525] max-w-xl mx-auto mb-6 font-medium">Book a free 30-minute discovery consultation with our senior engineering team.</p>
          <a href="/#consultation" className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center">
            Book Free Consultation <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </section>
      </div>
    </div>
  );
}
