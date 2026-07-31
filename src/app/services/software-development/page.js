import Link from "next/link";
import { Server, ArrowRight, ShieldCheck, Zap, Layers, Cpu, CheckSquare, Code, Rocket } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "Software Development Services | Enterprise Software Agency",
  description: "ShubDeep Labs delivers custom enterprise software development services, cloud architectures, microservices, and SaaS platforms for startups and global corporations.",
  keywords: [
    "Software Development",
    "Software Development Services",
    "Enterprise Software Engineering",
    "Custom Software Company",
    "Cloud Architecture",
    "Microservices Development",
    "B2B Software Agency"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/services/software-development",
  },
  openGraph: {
    title: "Software Development Services | Enterprise Software Engineering | ShubDeep Labs",
    description: "Enterprise software development company building scalable SaaS platforms, microservices, and custom cloud applications.",
    url: "https://shubh-deep-labs.vercel.app/services/software-development",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "Software Development Services" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development Services | ShubDeep Labs",
    description: "Custom enterprise software development, cloud systems, and SaaS platform engineering.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function SoftwareDevelopmentPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://shubh-deep-labs.vercel.app/services/software-development/#service",
    "name": "Software Development Services",
    "serviceType": "Enterprise Software Engineering & Cloud Solutions",
    "provider": {
      "@id": "https://shubh-deep-labs.vercel.app/#organization"
    },
    "areaServed": "Worldwide",
    "description": "Custom enterprise software development services including backend APIs, SaaS architectures, microservices, cloud deployments, and system automation."
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/software-development" },
    { label: "Software Development", href: "/services/software-development" }
  ];

  const features = [
    { title: "Scalable Cloud Architecture", desc: "AWS and GCP cloud infrastructure built with microservices, Docker containers, and Kubernetes auto-scaling." },
    { title: "High-Throughput Backend APIs", desc: "RESTful & GraphQL API gateways engineered with Node.js, Go, Python, and PostgreSQL for maximum throughput." },
    { title: "SaaS Multi-Tenancy Architecture", desc: "Multi-tenant database isolates, automated billing subscriptions, and strict role-based access control (RBAC)." },
    { title: "Legacy System Modernization", desc: "Refactoring legacy monoliths into cloud-native microservices with zero operational downtime." }
  ];

  const faqs = [
    { q: "What types of software solutions do you engineer?", a: "We engineer enterprise SaaS platforms, client administration portals, cloud microservices, workflow automation systems, and custom database management tools." },
    { q: "How do you guarantee code security and compliance?", a: "We enforce OWASP Top 10 compliance, AES-256 encryption at rest and in transit, OAuth2/JWT authentication, and regular automated vulnerability scanning." },
    { q: "Can your engineering team integrate with our existing team?", a: "Yes. We work both as an end-to-end software development partner and as an augmented engineering team alongside your internal developers." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <StructuredData data={serviceSchema} />

      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Server className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            ENTERPRISE SOFTWARE DEVELOPMENT & CLOUD ENGINEERING
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Software Development Services <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Built for Enterprise Scale</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            ShubDeep Labs engineers custom enterprise software, multi-tenant SaaS products, cloud microservices, and backend API infrastructure designed for 99.9% uptime and bulletproof reliability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <a
              href="/#customizer"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Request Software Scope
              <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>
        </header>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B2818] tracking-tight mb-4">
              Enterprise Software Engineering Capabilities
            </h2>
            <p className="text-[#4A3525] max-w-2xl mx-auto font-medium">
              Robust, maintainable, and cloud-native software platforms tailored for growth.
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

        <ServiceFAQ faqs={faqs} title="Software Development FAQs" />

        <section className="sand-dune-card p-10 sm:p-14 rounded-3xl text-center border-2 border-[#2E3B2B] bg-[#CFE3D2]/40 my-16">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">
            Transform Your Enterprise Infrastructure
          </h2>
          <p className="text-lg text-[#4A3525] max-w-2xl mx-auto mb-8 font-medium">
            Get a tailored technical architectural roadmap and transparent cost estimate for your custom software project.
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
              href="/services/custom-software-development"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              View Custom Software Solutions
            </Link>
          </div>

          <div className="pt-6 border-t border-[#2E3B2B]/20 flex flex-wrap justify-center gap-4 text-xs font-bold text-[#2E3B2B]">
            <span>Related Services:</span>
            <Link href="/services/website-development" className="hover:underline">Web Development</Link> •
            <Link href="/services/ai-development" className="hover:underline">AI Development</Link> •
            <Link href="/services/mobile-app-development" className="hover:underline">Mobile Apps</Link> •
            <Link href="/services/ecommerce-development" className="hover:underline">Ecommerce</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
