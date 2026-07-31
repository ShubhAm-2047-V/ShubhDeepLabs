import Link from "next/link";
import { 
  Briefcase, ArrowRight, ShieldCheck, Zap, Globe, Server, 
  Cpu, Brain, Smartphone, Layers, Lock, Headphones, Rocket, Star
} from "lucide-react";
import DynamicThreeWorld from "@/components/DynamicThreeWorld";
import DynamicCommercialCustomizer from "@/components/DynamicCommercialCustomizer";
import ServiceFAQ from "@/components/ServiceFAQ";
import ConsultationForm from "@/components/ConsultationForm";

export const metadata = {
  title: "ShubDeep Labs | Global Software Development & Custom AI Solutions",
  description: "ShubDeep Labs is a premier global software development company delivering custom web applications, enterprise SaaS platforms, AI solutions, mobile apps, and cloud engineering.",
  keywords: [
    "Software Development Company",
    "Global Software Agency",
    "Custom Software Development",
    "AI Development Company",
    "Website Development",
    "Mobile App Development",
    "Ecommerce Development",
    "UI UX Design",
    "Enterprise Software Solutions"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app",
  },
  openGraph: {
    title: "ShubDeep Labs | Global Software Development & Custom AI Solutions",
    description: "Empowering startups, enterprises, and international clients with custom web applications, AI engineering, and scalable software systems.",
    url: "https://shubh-deep-labs.vercel.app",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Global Software Agency" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShubDeep Labs | Global Software Development & Custom AI Solutions",
    description: "Enterprise custom software development, cloud systems, and AI engineering.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function Home() {
  const commercialServices = [
    { title: "Website Development", href: "/services/website-development", icon: Globe, desc: "High-performance web applications, client portals, and administrative dashboards engineered with Next.js, React, and microservices." },
    { title: "Enterprise Software Engineering", href: "/services/software-development", icon: Server, desc: "Scalable enterprise software architectures featuring automated subscription billing, role-based access, and isolated databases." },
    { title: "Custom Software Solutions", href: "/services/custom-software-development", icon: Cpu, desc: "Bespoke business platforms, proprietary management desks, and workflow automation tailored 100% to your operational goals." },
    { title: "Custom AI & LLM Solutions", href: "/services/ai-development", icon: Brain, desc: "Enterprise AI agents, document indexing (RAG), automated customer support chatbots, and predictive ML models." },
    { title: "Mobile App Development", href: "/services/mobile-app-development", icon: Smartphone, desc: "Production-ready mobile applications for iOS & Android built with Flutter/React Native, offline sync, and push alerts." },
    { title: "Ecommerce & Shopping Portals", href: "/services/ecommerce-development", icon: Layers, desc: "High-converting headless storefronts, multi-currency payment gateway integrations, and automated inventory sync." }
  ];

  const valueProps = [
    { title: "99.9% Uptime SLA", desc: "Built on resilient cloud infrastructure with multi-region redundancy and auto-scaling.", icon: ShieldCheck },
    { title: "Bank-Grade Security", desc: "End-to-end data encryption, strict RBAC controls, OAuth2/JWT, and regular vulnerability audits.", icon: Lock },
    { title: "Rapid Engineering", desc: "Production-ready boilerplate architectures to launch your enterprise software 3x faster.", icon: Zap },
    { title: "Dedicated 24/7 Support", desc: "Round-the-clock technical monitoring, SLA maintenance, and direct engineer-level support.", icon: Headphones }
  ];

  const testimonials = [
    { name: "Vikram Mehta", role: "Founder & CEO, TechScale Solutions", review: "ShubDeep Labs engineered our core customer dashboard and API pipeline within 3 weeks. Their clean codebase and rapid delivery gave us a massive head start before launch!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
    { name: "Anand Kulkarni", role: "CTO, HealthTech Innovations", review: "We partnered with ShubDeep Labs to build a customized clinic desk module. The UI design and backend security exceeded our expectations. Highly recommended for commercial projects!", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
    { name: "Meera Singhania", role: "Head of Product, RetailEdge SaaS", review: "The multi-tenant SaaS architecture ShubDeep Labs built for us handles thousands of daily active user queries effortlessly. Extraordinary engineering quality!", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" }
  ];

  const faqs = [
    { q: "What types of business applications do you build?", a: "We build custom web applications, enterprise software, SaaS platforms, AI integrations, mobile applications, e-commerce storefronts, and high-scale API microservices." },
    { q: "Do we get 100% full source code ownership?", a: "Yes, absolutely! You receive complete, unencumbered ownership of all source code, database schemas, CI/CD scripts, and technical documentation." },
    { q: "What is your typical project delivery timeline?", a: "MVP releases and core business applications are typically delivered within 2-4 weeks, depending on system complexity." },
    { q: "How do you handle security and compliance?", a: "We implement OAuth2/JWT authentication, AES-256 data encryption at rest and in transit, strict RBAC permissions, and OWASP security standards." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen space-y-24 pb-20 relative overflow-hidden text-[#3B2818]">
      <DynamicThreeWorld hideBooks={true} theme="sand" />
      
      {/* 1. HERO SECTION */}
      <section className="relative z-10 min-h-[88vh] flex items-center justify-center pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full text-center max-w-4xl mx-auto">
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold sage-badge shadow-sm">
              <Briefcase className="w-4 h-4 mr-2 text-[#2E3B2B]" />
              GLOBAL SOFTWARE DEVELOPMENT COMPANY
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Global Software Engineering <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Built for Scale & Speed</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Empowering Startups, Enterprises, Hospitals, and International Clients with Custom Software Development, High-Performance Web Applications, AI Solutions, and Mobile Engineering.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto cursor-pointer"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <a
              href="#customizer"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto cursor-pointer"
            >
              Configure Scope
              <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>

          {/* SLA Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-[#D5C4A6]/50 text-left">
            <div className="p-4 sand-dune-card text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#3B2818]">99.9%</div>
              <div className="text-xs sm:text-sm font-semibold text-[#4A3525]">Uptime SLA</div>
            </div>
            <div className="p-4 sand-dune-card text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#3B2818]">100+</div>
              <div className="text-xs sm:text-sm font-semibold text-[#4A3525]">Global Deployments</div>
            </div>
            <div className="p-4 sand-dune-card text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#3B2818]">256-bit</div>
              <div className="text-xs sm:text-sm font-semibold text-[#4A3525]">Bank Security</div>
            </div>
            <div className="p-4 sand-dune-card text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#3B2818]">24/7</div>
              <div className="text-xs sm:text-sm font-semibold text-[#4A3525]">Dedicated Support</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. VALUE PROPOSITION MATRIX */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, i) => {
            const Icon = prop.icon;
            return (
              <div key={i} className="sand-dune-card p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#CFE3D2] text-[#2E3B2B] flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#3B2818] mb-2">{prop.title}</h3>
                  <p className="text-sm font-medium text-[#4A3525] leading-relaxed">{prop.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. COMMERCIAL SERVICES CATALOG */}
      <section id="services" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold sage-badge mb-3 uppercase tracking-wider">
            Target Services & Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#3B2818]">
            Core Enterprise Solutions
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#4A3525] font-medium">
            From web engineering to custom AI agents and enterprise software platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {commercialServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={i} className="sand-dune-card p-8 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#CFE3D2] text-[#2E3B2B] flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-7 h-7 text-[#2E3B2B]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#3B2818] mb-3">{service.title}</h3>
                  <p className="text-sm text-[#4A3525] font-medium leading-relaxed mb-6">{service.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#D5C4A6]/50 flex items-center justify-between">
                  <Link href={service.href} className="text-sm font-bold text-[#4E7854] hover:underline flex items-center">
                    Learn More <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. INTERACTIVE COMMERCIAL CUSTOMIZER */}
      <section id="customizer" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sand-dune-card p-6 sm:p-10 border-2 border-[#CFE3D2]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="sage-badge px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Interactive Scope Builder
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B2818] mt-3">
              Configure Your Enterprise Software Scope
            </h2>
            <p className="text-sm sm:text-base text-[#4A3525] mt-2">
              Select required modules, integrations, and deployment scale to estimate your business solution.
            </p>
          </div>

          <DynamicCommercialCustomizer />
        </div>
      </section>

      {/* 5. CLIENT TESTIMONIALS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B2818]">
            Trusted by Businesses & Startups Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <div key={i} className="sand-dune-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1 text-[#4E7854] mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-[#4E7854] text-[#4E7854]" />
                  ))}
                </div>
                <p className="text-sm font-medium italic text-[#4A3525] leading-relaxed mb-6">
                  &quot;{test.review}&quot;
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-[#D5C4A6]/50">
                <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#CFE3D2]" />
                <div>
                  <h4 className="text-sm font-bold text-[#3B2818]">{test.name}</h4>
                  <p className="text-xs font-medium text-[#4A3525]">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQS */}
      <ServiceFAQ faqs={faqs} title="Enterprise Software FAQs" />

      {/* 7. CONSULTATION CONTACT FORM */}
      <section id="consultation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConsultationForm />
      </section>

    </div>
  );
}
