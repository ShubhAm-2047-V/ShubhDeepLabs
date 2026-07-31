import Link from "next/link";
import { Layers, ArrowRight, ShieldCheck, Zap, Cpu, CheckSquare, Code, Rocket } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "Ecommerce Development Services | High-Converting Online Stores",
  description: "ShubDeep Labs builds scalable e-commerce platforms, headless Shopify solutions, custom shopping portals, and payment gateway integrations optimized for global online sales.",
  keywords: [
    "Ecommerce Development",
    "Ecommerce Development Services",
    "Headless Ecommerce",
    "Shopify Custom Development",
    "Next.js Ecommerce",
    "Online Store Engineering",
    "Payment Gateway Integration"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/services/ecommerce-development",
  },
  openGraph: {
    title: "Ecommerce Development Services | High-Converting Online Stores | ShubDeep Labs",
    description: "Enterprise e-commerce development company engineering headless storefronts, custom checkout pipelines, and international multi-currency stores.",
    url: "https://shubh-deep-labs.vercel.app/services/ecommerce-development",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "Ecommerce Development Services" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ecommerce Development Services | ShubDeep Labs",
    description: "Custom e-commerce platforms and high-converting storefronts built for global scale.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function EcommerceDevelopmentPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://shubh-deep-labs.vercel.app/services/ecommerce-development/#service",
    "name": "Ecommerce Development Services",
    "serviceType": "Headless E-commerce Storefronts & Shopping Portal Engineering",
    "provider": {
      "@id": "https://shubh-deep-labs.vercel.app/#organization"
    },
    "areaServed": "Worldwide",
    "description": "Custom e-commerce application development services including Next.js storefronts, payment gateway integrations, multi-currency support, and inventory synchronization."
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services Hub", href: "/services" },
    { label: "Ecommerce Development", href: "/services/ecommerce-development" }
  ];

  const features = [
    { title: "Headless Next.js Storefronts", desc: "Blazing-fast e-commerce user experiences with sub-second page loads, boosting checkout conversion rates by up to 35%." },
    { title: "Multi-Currency & Global Payments", desc: "Seamless integration with Stripe, PayPal, Razorpay, Apple Pay, Google Pay, and localized tax engines." },
    { title: "Automated Inventory & ERP Sync", desc: "Real-time automated inventory updates across warehouse databases, Shopify, WooCommerce, and custom admin dashboards." },
    { title: "High-Volume Checkout Optimization", desc: "Frictionless one-click checkout flows, cart abandon recovery triggers, and PCI-DSS compliant data security." }
  ];

  const faqs = [
    { q: "What e-commerce platforms do you support?", a: "We build custom headless storefronts using Next.js/React, Shopify Plus, WooCommerce, and custom Node.js/PostgreSQL e-commerce engines." },
    { q: "Can you integrate international payment gateways and tax calculators?", a: "Yes. We implement Stripe, PayPal, Razorpay, Avalara, and localized multi-currency conversion APIs." },
    { q: "How do you optimize e-commerce site performance?", a: "We utilize Next.js server components, edge image optimization, Redis cart caching, and dynamic CDN asset delivery." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <StructuredData data={serviceSchema} />

      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Layers className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            GLOBAL E-COMMERCE ENGINEERING & STOREFRONTS
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Ecommerce Development <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Engineered for Global Sales</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Drive higher revenue with custom e-commerce applications, headless storefronts, frictionless checkout flows, and automated inventory sync built for international scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Get Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <a
              href="/#customizer"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Configure Store Scope
              <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>
        </header>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B2818] tracking-tight mb-4">
              Enterprise E-commerce Features
            </h2>
            <p className="text-[#4A3525] max-w-2xl mx-auto font-medium">
              High-converting shopping platforms built for performance, security, and global sales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat, idx) => (
              <div key={idx} className="sand-dune-card p-8 rounded-3xl border border-[#D5C4A6]">
                <div className="w-12 h-12 rounded-2xl bg-[#CFE3D2] flex items-center justify-center mb-6 text-[#2E3B2B]">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#3B2818] mb-3">{feat.title}</h3>
                <p className="text-[#4A3525] leading-relaxed text-sm font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <ServiceFAQ faqs={faqs} title="Ecommerce Development FAQs" />

        <section className="sand-dune-card p-10 sm:p-14 rounded-3xl text-center border-2 border-[#2E3B2B] bg-[#CFE3D2]/40 my-16">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">
            Scale Your E-Commerce Revenue Globally
          </h2>
          <p className="text-lg text-[#4A3525] max-w-2xl mx-auto mb-8 font-medium">
            Contact our e-commerce engineering specialists to plan your custom storefront architecture.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              Request Proposal
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <Link
              href="/services/website-development"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              Explore Web Engineering
            </Link>
          </div>

          <div className="pt-6 border-t border-[#2E3B2B]/20 flex flex-wrap justify-center gap-4 text-xs font-bold text-[#2E3B2B]">
            <span>Related Services:</span>
            <Link href="/services/software-development" className="hover:underline">Software Development</Link> •
            <Link href="/services/mobile-app-development" className="hover:underline">Mobile Apps</Link> •
            <Link href="/services/ui-ux-design" className="hover:underline">UI/UX Design</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
