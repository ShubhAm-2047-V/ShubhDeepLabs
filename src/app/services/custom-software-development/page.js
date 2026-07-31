import Link from "next/link";
import { Cpu, ArrowRight, ShieldCheck, Zap, Layers, CheckSquare, Code, Rocket } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "Custom Software Development Services | Tailored B2B Applications",
  description: "ShubDeep Labs specializes in custom software development tailored to unique business workflows, internal automation tools, CRM systems, and enterprise platforms.",
  keywords: [
    "Custom Software Development",
    "Tailored Software Development",
    "B2B Custom Software",
    "Internal Automation Systems",
    "Custom CRM ERP Development",
    "Custom Business Apps",
    "Enterprise Software Solutions"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/services/custom-software-development",
  },
  openGraph: {
    title: "Custom Software Development Services | ShubDeep Labs",
    description: "Tailored custom software development services for enterprises, hospitals, schools, and growing businesses worldwide.",
    url: "https://shubh-deep-labs.vercel.app/services/custom-software-development",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "Custom Software Development Services" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Software Development | ShubDeep Labs",
    description: "Bespoke software solutions engineered specifically for your business workflow and automation goals.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function CustomSoftwareDevelopmentPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://shubh-deep-labs.vercel.app/services/custom-software-development/#service",
    "name": "Custom Software Development Services",
    "serviceType": "Bespoke Business Software & Workflow Automation Engineering",
    "provider": {
      "@id": "https://shubh-deep-labs.vercel.app/#organization"
    },
    "areaServed": "Worldwide",
    "description": "Tailored custom software development solutions engineered specifically for your proprietary business processes, automated workflows, and internal enterprise management."
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/software-development" },
    { label: "Custom Software Development", href: "/services/custom-software-development" }
  ];

  const features = [
    { title: "Bespoke Workflow Automation", desc: "Custom business software tailored to replace spreadsheets, reduce manual operations, and boost organizational productivity by up to 10x." },
    { title: "Proprietary CRM & ERP Platforms", desc: "Custom client portals, asset management desks, inventory management systems, and automated billing engines." },
    { title: "Seamless Third-Party API Integration", desc: "Custom software connectors for Stripe, PayPal, Salesforce, HubSpot, QuickBooks, and internal enterprise databases." },
    { title: "Zero Technical Debt & Modular Code", desc: "Production-ready, thoroughly documented codebases designed for easy future scaling and internal developer handoffs." }
  ];

  const faqs = [
    { q: "Why choose custom software development over off-the-shelf software?", a: "Custom software is designed 100% around your exact business workflow. It eliminates recurring per-user SaaS license fees, prevents vendor lock-in, and gives you total ownership of your proprietary IP." },
    { q: "What industries do you build custom software for?", a: "We build custom software for startups, healthcare/hospitals, education/schools, retail, logistics, financial services, and B2B enterprises." },
    { q: "How do you handle scope changes during custom software development?", a: "We utilize an agile development workflow with weekly sprint demos. You review live working increments and adjust features dynamically." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <StructuredData data={serviceSchema} />

      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Cpu className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            BESPOKE BUSINESS SOFTWARE & AUTOMATION
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Custom Software Development <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Tailored to Your Workflow</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Eliminate off-the-shelf limitations. We engineer bespoke custom software solutions, management desks, automated workflows, and internal business platforms engineered for your unique operations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Get Free Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <a
              href="/#customizer"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Configure Scope
              <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>
        </header>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B2818] tracking-tight mb-4">
              Custom Software Development Benefits
            </h2>
            <p className="text-[#4A3525] max-w-2xl mx-auto font-medium">
              Software built around your business goals, not forced into rigid third-party frameworks.
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

        <ServiceFAQ faqs={faqs} title="Custom Software Development FAQs" />

        <section className="sand-dune-card p-10 sm:p-14 rounded-3xl text-center border-2 border-[#2E3B2B] bg-[#CFE3D2]/40 my-16">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">
            Ready to Build Your Custom Software Solution?
          </h2>
          <p className="text-lg text-[#4A3525] max-w-2xl mx-auto mb-8 font-medium">
            Contact our senior software architecture team today for a free technical consultation and discovery breakdown.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <Link
              href="/services/ai-development"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              Explore AI & Machine Learning
            </Link>
          </div>

          <div className="pt-6 border-t border-[#2E3B2B]/20 flex flex-wrap justify-center gap-4 text-xs font-bold text-[#2E3B2B]">
            <span>Related Services:</span>
            <Link href="/services/software-development" className="hover:underline">Software Development</Link> •
            <Link href="/services/website-development" className="hover:underline">Website Engineering</Link> •
            <Link href="/services/mobile-app-development" className="hover:underline">Mobile Apps</Link> •
            <Link href="/services/ui-ux-design" className="hover:underline">UI/UX Design</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
