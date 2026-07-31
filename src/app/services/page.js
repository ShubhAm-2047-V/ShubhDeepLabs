import Link from "next/link";
import { Globe, Server, Cpu, Brain, Smartphone, Layers, Code, ArrowRight, CheckSquare, Rocket, ShieldCheck, Zap, Headphones } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "Enterprise Software & Cloud Services Hub | ShubDeep Labs",
  description: "Explore ShubDeep Labs full suite of enterprise software development services, custom web applications, AI solutions, mobile apps, e-commerce storefronts, and UI/UX design.",
  keywords: [
    "Enterprise Software Services",
    "Website Development Services",
    "Custom Software Engineering",
    "AI Development Services",
    "Mobile App Development",
    "Ecommerce Development",
    "UI UX Design Services"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/services",
  },
  openGraph: {
    title: "Enterprise Software & Cloud Services Hub | ShubDeep Labs",
    description: "Full-suite software development services engineered for startups, enterprises, hospitals, and global clients.",
    url: "https://shubh-deep-labs.vercel.app/services",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Services Hub" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise Software Services Hub | ShubDeep Labs",
    description: "Custom web development, enterprise software, AI solutions, mobile apps, and UI/UX design.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ServicesHubPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://shubh-deep-labs.vercel.app/services/#service",
    "name": "Software Engineering & Technical Services Hub",
    "serviceType": "Custom Software, Web Apps, AI & Mobile Development",
    "provider": {
      "@id": "https://shubh-deep-labs.vercel.app/#organization"
    },
    "areaServed": "Worldwide"
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services Hub", href: "/services" }
  ];

  const servicesList = [
    { title: "Website Development", href: "/services/website-development", icon: Globe, badge: "Next.js 16 & React", desc: "High-performance web applications, client portals, and administrative dashboards engineered for global SEO rankings and speed." },
    { title: "Software Development", href: "/services/software-development", icon: Server, badge: "Cloud & Microservices", desc: "Scalable enterprise software architectures featuring automated subscription billing, role-based access, and isolated tenant databases." },
    { title: "Custom Software Development", href: "/services/custom-software-development", icon: Cpu, badge: "Bespoke Automation", desc: "Tailored business software solutions, proprietary management desks, and internal workflow automation built around your unique operations." },
    { title: "AI Development", href: "/services/ai-development", icon: Brain, badge: "LLM & RAG Systems", desc: "Enterprise AI agents, document indexing (RAG), automated customer support chatbots, and fine-tuned predictive machine learning models." },
    { title: "Mobile App Development", href: "/services/mobile-app-development", icon: Smartphone, badge: "iOS & Android", desc: "Production-ready mobile applications for iOS & Android built with Flutter/React Native, offline sync, biometrics, and push alerts." },
    { title: "Ecommerce Development", href: "/services/ecommerce-development", icon: Layers, badge: "Headless Storefronts", desc: "High-converting headless storefronts, multi-currency payment gateway integrations, automated inventory sync, and PCI compliance." },
    { title: "UI/UX Design", href: "/services/ui-ux-design", icon: Code, badge: "Figma Design Systems", desc: "User-centered wireframing, component design systems, interactive prototypes, micro-animations, and conversion rate optimization." }
  ];

  const faqs = [
    { q: "What types of companies do you build software for?", a: "We build custom software solutions for startups, fast-growing businesses, healthcare providers, educational institutions, and global enterprises." },
    { q: "How do we get started with a custom project?", a: "You can book a free 30-minute discovery call or use our interactive Scope Builder to configure your platform requirements and receive a detailed technical proposal." },
    { q: "Do you provide dedicated ongoing maintenance?", a: "Yes. All enterprise software solutions include 24/7 technical monitoring, security patch updates, auto-scaling maintenance, and dedicated support SLAs." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <StructuredData data={serviceSchema} />

      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Server className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            SHUBDEEP LABS TECHNICAL SERVICES DIRECTORY
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Enterprise Software Services <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Engineered for Global Impact</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            From modern Next.js web applications and multi-tenant SaaS backends to custom AI agents, cross-platform mobile apps, and Figma design systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/#consultation" className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto">
              Book Free Consultation <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a href="/pricing" className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto">
              View Pricing Matrix <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>
        </header>

        {/* SERVICES CATALOG GRID */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="sand-dune-card p-8 flex flex-col justify-between border border-[#D5C4A6]">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#CFE3D2] text-[#2E3B2B] flex items-center justify-center shadow-sm">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EADCC6] text-[#3B2818]">
                        {srv.badge}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#3B2818] mb-3">{srv.title}</h2>
                    <p className="text-sm font-medium text-[#4A3525] leading-relaxed mb-6">{srv.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-[#D5C4A6]/50">
                    <Link href={srv.href} className="text-sm font-bold text-[#4E7854] hover:underline inline-flex items-center">
                      View Service Details <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SLA & PROPOSITION MATRIX */}
        <section className="mb-20 sand-dune-card p-8 sm:p-12 border-2 border-[#CFE3D2]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-[#3B2818] mb-3">Enterprise SLA Commitments</h2>
            <p className="text-[#4A3525] font-medium">Bank-grade security, 99.9% uptime SLA, and production-ready codebases.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white/80 rounded-2xl border border-[#D5C4A6] text-center">
              <ShieldCheck className="w-8 h-8 text-[#2E3B2B] mx-auto mb-3" />
              <h3 className="font-bold text-[#3B2818] text-lg mb-1">99.9% Uptime SLA</h3>
              <p className="text-xs text-[#4A3525]">Multi-region cloud infrastructure on AWS & Vercel Enterprise.</p>
            </div>
            <div className="p-6 bg-white/80 rounded-2xl border border-[#D5C4A6] text-center">
              <Zap className="w-8 h-8 text-[#2E3B2B] mx-auto mb-3" />
              <h3 className="font-bold text-[#3B2818] text-lg mb-1">3x Rapid Engineering</h3>
              <p className="text-xs text-[#4A3525]">Production-ready architecture modules for rapid time-to-market.</p>
            </div>
            <div className="p-6 bg-white/80 rounded-2xl border border-[#D5C4A6] text-center">
              <Headphones className="w-8 h-8 text-[#2E3B2B] mx-auto mb-3" />
              <h3 className="font-bold text-[#3B2818] text-lg mb-1">24/7 Engineer Support</h3>
              <p className="text-xs text-[#4A3525]">Direct communication channels with senior software architects.</p>
            </div>
          </div>
        </section>

        <ServiceFAQ faqs={faqs} title="Services Directory FAQs" />
      </div>
    </div>
  );
}
