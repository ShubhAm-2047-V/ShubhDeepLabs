import Link from "next/link";
import { DollarSign, ArrowRight, CheckSquare, ShieldCheck, Zap, Rocket } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";
import DynamicCommercialCustomizer from "@/components/DynamicCommercialCustomizer";

export const metadata = {
  title: "Commercial Pricing Matrix & Scope Estimator | ShubDeep Labs",
  description: "Transparent commercial pricing for custom software development, web applications, AI solutions, mobile apps, and enterprise SaaS platforms by ShubDeep Labs.",
  keywords: [
    "Software Pricing Matrix",
    "Custom Web Development Cost",
    "AI Development Pricing",
    "Mobile App Development Cost",
    "Enterprise Software Scope Builder"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/pricing",
  },
  openGraph: {
    title: "Commercial Pricing Matrix & Scope Estimator | ShubDeep Labs",
    description: "Transparent pricing and interactive scope builder for software engineering solutions.",
    url: "https://shubh-deep-labs.vercel.app/pricing",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Commercial Pricing" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commercial Pricing Matrix | ShubDeep Labs",
    description: "Interactive scope estimator and transparent software development pricing.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function PricingPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Pricing & Scope", href: "/pricing" }
  ];

  const pricingTiers = [
    {
      name: "Starter Business Web",
      price: "₹3,999",
      usd: "$50 USD",
      desc: "Perfect for small businesses, cafes, personal brands, and high-converting landing pages.",
      features: [
        "Responsive Next.js 16 architecture",
        "Fast sub-second loading (LCP < 0.9s)",
        "SEO metadata & canonical tags",
        "Contact form & WhatsApp integration",
        "Full unencumbered source code"
      ],
      cta: "Configure Scope",
      highlight: false
    },
    {
      name: "Full-Stack Web App / E-commerce",
      price: "₹9,999",
      usd: "$120 USD",
      desc: "Comprehensive web applications, client portals, e-commerce storefronts, and admin panels.",
      features: [
        "Everything in Starter Web",
        "PostgreSQL / Supabase database",
        "Stripe / PayPal payment gateway",
        "Administrative management desk",
        "OAuth2 / JWT secure user auth",
        "2-week delivery SLA"
      ],
      cta: "Get Full-Stack Quote",
      highlight: true
    },
    {
      name: "Enterprise Custom Software & AI",
      price: "₹14,999+",
      usd: "$180+ USD",
      desc: "Bespoke SaaS platforms, private AI agents (RAG), mobile apps (iOS/Android), and cloud infrastructure.",
      features: [
        "Everything in Full-Stack App",
        "Private AI document search (RAG)",
        "Flutter / React Native mobile app",
        "AWS auto-scaling & Docker",
        "24/7 dedicated engineer support",
        "Custom SLA maintenance contract"
      ],
      cta: "Schedule Discovery Call",
      highlight: false
    }
  ];

  const faqs = [
    { q: "Are there any hidden recurring fees?", a: "No. You own 100% of your source code and infrastructure credentials. There are no mandatory ongoing vendor lock-in fees." },
    { q: "Can I customize an existing package?", a: "Yes. You can use our interactive Scope Builder below to pick individual tech stacks, modules, and add-ons." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <DollarSign className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            TRANSPARENT COMMERCIAL PRICING & ESTIMATION
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Commercial Software Pricing <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Zero Hidden Costs</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Clear, transparent pricing structures for startups, businesses, healthcare providers, and enterprise applications.
          </p>
        </header>

        {/* PRICING CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`sand-dune-card p-8 rounded-3xl flex flex-col justify-between border ${
                tier.highlight ? "border-2 border-[#2E3B2B] bg-[#CFE3D2]/30 shadow-lg" : "border-[#D5C4A6]"
              }`}
            >
              <div>
                {tier.highlight && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-[#2E3B2B] text-white mb-4">
                    MOST POPULAR
                  </span>
                )}
                <h2 className="text-2xl font-extrabold text-[#3B2818] mb-2">{tier.name}</h2>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-[#3B2818]">{tier.price}</span>
                  <span className="text-sm font-bold text-[#4A3525]">({tier.usd})</span>
                </div>
                <p className="text-sm text-[#4A3525] font-medium leading-relaxed mb-6">{tier.desc}</p>

                <div className="space-y-3 mb-8">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-[#3B2818]">
                      <CheckSquare className="w-4 h-4 text-[#2E3B2B] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#customizer"
                className={`w-full py-4 text-center text-sm font-extrabold rounded-2xl block ${
                  tier.highlight ? "btn-sage-green" : "btn-warm-beige"
                }`}
              >
                {tier.cta} →
              </a>
            </div>
          ))}
        </section>

        {/* INTERACTIVE CUSTOMIZER */}
        <section id="customizer" className="mb-20">
          <div className="sand-dune-card p-6 sm:p-10 border-2 border-[#CFE3D2]">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="sage-badge px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Interactive Scope Estimator
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B2818] mt-3">
                Configure Custom Solution Scope
              </h2>
            </div>

            <DynamicCommercialCustomizer />
          </div>
        </section>

        <ServiceFAQ faqs={faqs} title="Pricing & Scope FAQs" />
      </div>
    </div>
  );
}
