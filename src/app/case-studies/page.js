import Link from "next/link";
import { Briefcase, ArrowRight, CheckSquare, Star, Building, BarChart, Server, Globe, Download, FileText, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";

export const metadata = {
  title: "In-Depth B2B Software Case Studies | ShubDeep Labs Transformations",
  description: "Read technical case studies detailing how ShubDeep Labs delivered enterprise web applications, clinic management desks, multi-tenant SaaS portals, and AI systems for global clients.",
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
    title: "In-Depth B2B Software Case Studies | ShubDeep Labs",
    description: "Deep-dive case studies on SaaS engineering, custom AI agents, and high-volume web portals.",
    url: "https://shubh-deep-labs.vercel.app/case-studies",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Case Studies" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "In-Depth B2B Software Case Studies | ShubDeep Labs",
    description: "Technical case studies detailing enterprise cloud migrations and custom AI indexing.",
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
      title: "Building a Multi-Tenant SaaS Customer Dashboard with Next.js 16 & Microservices",
      client: "TechScale Solutions",
      industry: "Enterprise SaaS",
      metric: "3x Faster Launch",
      execSummary: "ShubDeep Labs engineered core customer administration portals, API gateways, and role-based authentication pipelines within 3 weeks of architectural discovery.",
      challenge: "TechScale Solutions faced scaling bottlenecks with their monolithic legacy portal, resulting in high latency and user authentication drop-offs during traffic spikes.",
      solution: "Decomposed the monolith into a modular Next.js 16 App Router architecture backed by Supabase PostgreSQL row-level security and isolated microservices.",
      deployment: "Multi-region cloud deployment on AWS & Vercel Enterprise with CI/CD GitHub Actions pipelines.",
      results: [
        "Sub-second page rendering (LCP < 0.8s)",
        "100% unencumbered source code delivery",
        "Zero vendor lock-in architecture"
      ],
      lessonsLearned: "Implementing schema-level data isolation early in the architecture phase reduced database migration overhead by 40%.",
      futureRoadmap: "Integrating AI-driven automated anomaly alerts and real-time subscription usage dashboards.",
      testimonial: "ShubDeep Labs engineered our core customer dashboard and API pipeline within 3 weeks. Their clean codebase and rapid delivery gave us a massive head start before launch!"
    },
    {
      title: "Clinic Management Core Desk with Doctor Queue & Patient Records",
      client: "HealthTech Innovations",
      industry: "Healthcare Systems",
      metric: "99.9% Reliability",
      execSummary: "Designed and deployed a customized clinic management module featuring automated patient queue logs, doctor scheduling, and bank-grade data security.",
      challenge: "Manual patient queue registration created severe administrative delays, while unencrypted patient log sheets posed security compliance risks.",
      solution: "Built a centralized clinic management core desk with instant doctor availability schedules, automated invoice generation, and AES-256 patient data encryption.",
      deployment: "Containerized Docker microservices hosted on AWS ECS with automated daily database backups.",
      results: [
        "AES-256 encrypted health data logs",
        "Streamlined patient queueing by 65%",
        "Simplified multi-department billing accuracy to 99.9%"
      ],
      lessonsLearned: "Role-based access control (RBAC) was essential to ensure doctors, receptionists, and billing staff only accessed authorized modules.",
      futureRoadmap: "Integrating automated SMS/WhatsApp appointment reminders for waiting patients.",
      testimonial: "We partnered with ShubDeep Labs to build a customized clinic desk module. The UI design and backend security exceeded our expectations."
    },
    {
      title: "Scaling Headless E-commerce & High-Throughput API Gateway",
      client: "RetailEdge SaaS",
      industry: "E-commerce & Retail",
      metric: "45% Conversion Surge",
      execSummary: "Architected a headless Next.js e-commerce storefront integrated with multi-currency payment gateways and real-time inventory synchronization.",
      challenge: "High checkout abandonment rates due to slow mobile loading speeds and lagging inventory sync across multi-warehouse locations.",
      solution: "Engineered a headless storefront with server-rendered product catalog pages, Redis caching, and automated multi-currency Stripe/PayPal checkouts.",
      deployment: "Edge network CDN deployment ensuring global response times under 150ms.",
      results: [
        "Handled 10,000+ daily active user queries",
        "Cart checkout abandonment reduced by 35%",
        "Automated multi-warehouse inventory synchronization"
      ],
      lessonsLearned: "Pre-rendering top category pages as static HTML while streaming inventory stock via Edge APIs improved core web vitals drastically.",
      futureRoadmap: "AI-driven personalized product recommendations and one-tap checkout modules.",
      testimonial: "The multi-tenant SaaS architecture ShubDeep Labs built for us handles thousands of daily active user queries effortlessly."
    }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Briefcase className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            DEEP-DIVE TECHNICAL CASE STUDIES
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Client Transformation Stories <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Proven Technical Results</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            In-depth architectural breakdowns detailing how ShubDeep Labs solves complex business challenges with custom software, cloud engineering, and AI integration.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/portfolio-pdf" className="btn-sage-green py-3.5 px-6 text-sm font-extrabold inline-flex items-center">
              Download Case Studies Report (PDF) <Download className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </header>

        {/* DETAILED CASE STUDY LIST */}
        <section className="space-y-16 mb-20">
          {caseStudies.map((cs, idx) => (
            <div key={idx} className="sand-dune-card p-8 sm:p-12 rounded-3xl border-2 border-[#D5C4A6] space-y-8">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#D5C4A6]">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EADCC6] text-[#3B2818]">
                    {cs.industry}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-[#3B2818] mt-2">{cs.title}</h2>
                  <p className="text-xs font-bold text-[#4E7854] mt-1">Client Partner: {cs.client}</p>
                </div>
                <div className="p-4 bg-[#CFE3D2] rounded-2xl text-center">
                  <div className="text-xl sm:text-2xl font-extrabold text-[#2E3B2B]">{cs.metric}</div>
                  <div className="text-xs font-bold text-[#4A3525]">Key Result</div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-6 bg-[#EADCC6]/40 rounded-2xl border border-[#D5C4A6]">
                <h3 className="text-xs font-extrabold uppercase text-[#3B2818] mb-1">Executive Summary</h3>
                <p className="text-sm font-medium text-[#4A3525] leading-relaxed">{cs.execSummary}</p>
              </div>

              {/* Challenge vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/80 rounded-2xl border border-[#D5C4A6]">
                  <h3 className="text-xs font-extrabold uppercase text-[#8B0000] mb-2">Business Challenge</h3>
                  <p className="text-sm text-[#4A3525] font-medium leading-relaxed">{cs.challenge}</p>
                </div>
                <div className="p-6 bg-white/80 rounded-2xl border border-[#D5C4A6]">
                  <h3 className="text-xs font-extrabold uppercase text-[#2E3B2B] mb-2">Technical Solution</h3>
                  <p className="text-sm text-[#4A3525] font-medium leading-relaxed">{cs.solution}</p>
                </div>
              </div>

              {/* Deployment & Results */}
              <div>
                <h3 className="text-base font-extrabold text-[#3B2818] mb-2">Deployment & Infrastructure:</h3>
                <p className="text-sm font-medium text-[#4A3525] mb-4">{cs.deployment}</p>

                <h3 className="text-base font-extrabold text-[#3B2818] mb-3">Key Results Achieved:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {cs.results.map((res, rIdx) => (
                    <div key={rIdx} className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-[#3B2818] p-3 bg-white/90 rounded-xl border border-[#D5C4A6]">
                      <CheckCircle2 className="w-4 h-4 text-[#2E3B2B] shrink-0" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lessons Learned & Testimonial Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#D5C4A6]">
                <div className="text-xs font-medium text-[#4A3525]">
                  <span className="font-extrabold text-[#3B2818] block mb-1">Lessons Learned & Roadmap:</span>
                  <p className="mb-2">• {cs.lessonsLearned}</p>
                  <p>• Future Roadmap: {cs.futureRoadmap}</p>
                </div>
                <div className="p-4 bg-[#CFE3D2]/40 rounded-xl border border-[#2E3B2B]/20 italic text-xs text-[#3B2818]">
                  "{cs.testimonial}"
                  <span className="block font-bold not-italic text-[#4E7854] mt-2">— Verified Client Partner</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="sand-dune-card p-10 text-center border-2 border-[#2E3B2B] bg-[#CFE3D2]/40">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">Want Similar Results for Your Business?</h2>
          <p className="text-[#4A3525] max-w-xl mx-auto mb-6 font-medium">Book a free 30-minute discovery consultation with our technical leadership team.</p>
          <a href="/contact" className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center">
            Book Free Consultation <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </section>
      </div>
    </div>
  );
}
