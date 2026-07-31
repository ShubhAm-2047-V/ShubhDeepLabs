import Link from "next/link";
import { 
  Briefcase, ArrowRight, ShieldCheck, Zap, Globe, Server, 
  Cpu, Brain, Smartphone, Layers, Lock, Headphones, Rocket, Star, CheckSquare, Code, Building, Heart, ShoppingBag, GraduationCap, DollarSign, FileText, MessageSquare, ExternalLink
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
    { title: "Website Development", href: "/services/website-development", icon: Globe, desc: "High-performance web applications, client portals, and administrative dashboards engineered with Next.js 16, React, and microservices." },
    { title: "Enterprise Software Engineering", href: "/services/software-development", icon: Server, desc: "Scalable enterprise software architectures featuring automated subscription billing, role-based access, and isolated databases." },
    { title: "Custom Software Solutions", href: "/services/custom-software-development", icon: Cpu, desc: "Bespoke business platforms, proprietary management desks, and workflow automation tailored 100% to your operational goals." },
    { title: "Custom AI & LLM Solutions", href: "/services/ai-development", icon: Brain, desc: "Enterprise AI agents, document indexing (RAG), automated customer support chatbots, and predictive ML models." },
    { title: "Mobile App Development", href: "/services/mobile-app-development", icon: Smartphone, desc: "Production-ready mobile applications for iOS & Android built with Flutter/React Native, offline sync, and push alerts." },
    { title: "Ecommerce & Shopping Portals", href: "/services/ecommerce-development", icon: Layers, desc: "High-converting headless storefronts, multi-currency payment gateway integrations, and automated inventory sync." },
    { title: "UI/UX & Product Design Systems", href: "/services/ui-ux-design", icon: Code, desc: "User-centered wireframing, component design systems, interactive prototypes, micro-animations, and conversion optimization." }
  ];

  const productsList = [
    { title: "AI Expense Tracker", href: "/products/expense-tracker", icon: DollarSign, badge: "Financial AI", desc: "Real-time budget pacing analysis, category spending reports, and LLM financial health insights." },
    { title: "Hospital Management Core Desk", href: "/products/hospital-desk", icon: Heart, badge: "Healthcare SaaS", desc: "Patient queue logs, doctor availability scheduling, and multi-department automated billing." },
    { title: "Face Recognition Attendance", href: "/products/face-attendance", icon: Brain, badge: "Computer Vision", desc: "Webcam biometric scanner, real-time employee attendance verification, and CSV report export." },
    { title: "Smart Notes Summarizer", href: "/products/notes-summarizer", icon: FileText, badge: "NLP Document AI", desc: "Private RAG document search indexing text notes to generate study concepts and Q&A flashcards." },
    { title: "AI Support Chatbot Engine", href: "/products/chatbot", icon: MessageSquare, badge: "Customer Service AI", desc: "Conversational chatbot engine trained on custom business context for 24/7 lead qualification." }
  ];

  const trustPillars = [
    { title: "Zero Vendor Lock-In", desc: "You receive complete unencumbered ownership of all source code, database schemas, CI/CD pipelines, and technical documentation.", icon: ShieldCheck },
    { title: "Modern Technology Stacks", desc: "Architected using Next.js 16, React, Node.js, Python/Flask, Supabase, Docker, and AWS for sub-second speed.", icon: Zap },
    { title: "Secure Development Practices", desc: "OWASP Top 10 security compliance, AES-256 data encryption at rest and in transit, and OAuth2/JWT authentication.", icon: Lock },
    { title: "Scalable Architecture", desc: "Multi-tenant cloud architecture engineered to handle millions of daily API queries with auto-scaling.", icon: Server },
    { title: "Fast Delivery Guarantee", desc: "Production-ready architecture modules allowing fast MVP deployment within 2-4 weeks.", icon: Rocket },
    { title: "24/7 SLA Engineer Support", desc: "Round-the-clock technical monitoring, uptime SLAs, and direct access to senior software architects.", icon: Headphones }
  ];

  const industries = [
    { title: "Healthcare & Clinics", icon: Heart, desc: "Patient management desks, telemedicine portals, and HIPAA-compliant health data pipelines." },
    { title: "FinTech & Banking", icon: DollarSign, desc: "Secure payment gateway integration, transaction ledgers, and automated budget analytics." },
    { title: "E-commerce & Retail", icon: ShoppingBag, desc: "Headless storefronts, inventory synchronization, multi-currency checkouts, and CRM integrations." },
    { title: "Education & Academics", icon: GraduationCap, desc: "Learning management systems, student portals, study tools, and academic research desks." },
    { title: "Enterprise SaaS", icon: Building, desc: "Multi-tenant B2B portals, subscription billing, role-based permissions, and custom analytics." }
  ];

  const devProcess = [
    { step: "01", title: "Discovery & Scope", desc: "We review your product vision, system requirements, and user flows to engineer a detailed scope blueprint." },
    { step: "02", title: "Architecture & Design", desc: "We create Figma design prototypes, database models, and secure microservices system architecture." },
    { step: "03", title: "Rapid Engineering", desc: "Our senior software team builds your platform using Next.js, Node/Python, and automated testing suites." },
    { step: "04", title: "Deployment & Support", desc: "We launch your software to AWS/Vercel with CI/CD deployment, 99.9% uptime monitoring, and ongoing SLAs." }
  ];

  const testimonials = [
    { 
      name: "Miss Sania", 
      role: "Founder & Owner, Saira Elegance", 
      review: "ShubDeep Labs engineered our fashion e-commerce storefront with incredible speed and design elegance. The mobile shopping experience and seamless checkout increased our online sales from day one!", 
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      websiteLink: "https://saira-elegance.vercel.app/"
    },
    { 
      name: "Mr. Dinesh", 
      role: "Owner, Dinesh Gold & Jewellery", 
      review: "We partnered with ShubDeep Labs to build a custom mobile application for our gold shop. The real-time daily gold rate tracking, digital billing, and customer catalog management run flawlessly!", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      websiteLink: null
    }
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
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge shadow-sm">
              <Briefcase className="w-4 h-4 mr-2 text-[#2E3B2B]" />
              GLOBAL SOFTWARE DEVELOPMENT COMPANY
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Global Software Engineering <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Built for Scale & Speed</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Empowering Startups, Businesses, Hospitals, Enterprises, and International Clients with Custom Software Development, High-Performance Web Applications, AI Solutions, and Mobile Engineering.
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

      {/* 2. TRUST GRID: WHY BUSINESSES CHOOSE SHUBDEEP LABS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="sage-badge px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Trust & Architecture Standards
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#3B2818] mt-3">
            Why Businesses Choose ShubDeep Labs
          </h2>
          <p className="text-base sm:text-lg text-[#4A3525] font-medium mt-3">
            Enterprise software principles designed for long-term scalability, data isolation, and total code ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustPillars.map((pil, i) => {
            const Icon = pil.icon;
            return (
              <div key={i} className="sand-dune-card p-8 flex flex-col justify-between border border-[#D5C4A6]">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#CFE3D2] text-[#2E3B2B] flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#3B2818] mb-3">{pil.title}</h3>
                  <p className="text-sm text-[#4A3525] font-medium leading-relaxed">{pil.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CORE SERVICES DIRECTORY */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="sage-badge px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Technical Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#3B2818] mt-3">
            Enterprise Technical Services
          </h2>
          <p className="text-base sm:text-lg text-[#4A3525] font-medium mt-3">
            Full-suite software development services engineered for performance, security, and global search engine visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {commercialServices.map((srv, i) => {
            const Icon = srv.icon;
            return (
              <div key={i} className="sand-dune-card p-8 flex flex-col justify-between border border-[#D5C4A6]">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#CFE3D2] text-[#2E3B2B] flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#3B2818] mb-3">{srv.title}</h3>
                  <p className="text-sm font-medium text-[#4A3525] leading-relaxed mb-6">{srv.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#D5C4A6]/50">
                  <Link href={srv.href} className="text-sm font-bold text-[#4E7854] hover:underline inline-flex items-center">
                    Explore Service Scope <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PRODUCTS ECOSYSTEM SHOWCASE */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="sage-badge px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Ready Software Applications
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#3B2818] mt-3">
            Our Software Product Ecosystem
          </h2>
          <p className="text-base sm:text-lg text-[#4A3525] font-medium mt-3">
            Deployable software platforms engineered for instant cloud implementation and custom tailoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsList.map((prod, i) => {
            const Icon = prod.icon;
            return (
              <div key={i} className="sand-dune-card p-8 flex flex-col justify-between border border-[#D5C4A6]">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#CFE3D2] text-[#2E3B2B] flex items-center justify-center shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EADCC6] text-[#3B2818]">
                      {prod.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#3B2818] mb-3">{prod.title}</h3>
                  <p className="text-sm font-medium text-[#4A3525] leading-relaxed mb-6">{prod.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#D5C4A6]/50">
                  <Link href={prod.href} className="text-sm font-bold text-[#4E7854] hover:underline inline-flex items-center">
                    Launch Interactive Demo <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. INDUSTRIES WE SERVE */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="sage-badge px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Domain Expertise
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#3B2818] mt-3">
            Industries We Serve
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <div key={i} className="sand-dune-card p-6 text-center border border-[#D5C4A6]">
                <div className="w-12 h-12 rounded-2xl bg-[#CFE3D2] text-[#2E3B2B] flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#3B2818] text-base mb-2">{ind.title}</h3>
                <p className="text-xs text-[#4A3525] font-medium">{ind.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. DEVELOPMENT PROCESS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="sage-badge px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Engineering Lifecycle
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#3B2818] mt-3">
            Our 4-Step Development Process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {devProcess.map((proc, i) => (
            <div key={i} className="sand-dune-card p-8 rounded-3xl border border-[#D5C4A6] relative">
              <span className="text-4xl font-extrabold text-[#2E3B2B]/20 absolute top-4 right-6">{proc.step}</span>
              <h3 className="text-xl font-extrabold text-[#3B2818] mb-3">{proc.title}</h3>
              <p className="text-sm font-medium text-[#4A3525] leading-relaxed">{proc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. INTERACTIVE SCOPE ESTIMATOR */}
      <section id="customizer" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sand-dune-card p-6 sm:p-12 border-2 border-[#CFE3D2]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="sage-badge px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Interactive Scope Estimator
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#3B2818] mt-3">
              Estimate Project Scope & Cost
            </h2>
            <p className="text-base sm:text-lg text-[#4A3525] font-medium mt-3">
              Configure your tech stack, add-ons, and delivery timeline to receive an instant commercial estimate.
            </p>
          </div>

          <DynamicCommercialCustomizer />
        </div>
      </section>

      {/* 8. CLIENT SUCCESS TESTIMONIALS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="sage-badge px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Client Success
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#3B2818] mt-3">
            What Technical Leaders Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="sand-dune-card p-8 flex flex-col justify-between border-2 border-[#D5C4A6] rounded-3xl space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-[#2E3B2B]">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#CFE3D2] text-[#2E3B2B]">
                    Verified Client Partner
                  </span>
                </div>
                <p className="text-sm text-[#4A3525] font-medium leading-relaxed mb-4 italic">"{t.review}"</p>
              </div>

              <div className="pt-4 border-t border-[#D5C4A6]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-[#2E3B2B]" />
                  <div>
                    <h4 className="text-base font-extrabold text-[#3B2818]">{t.name}</h4>
                    <p className="text-xs text-[#4A3525] font-bold">{t.role}</p>
                  </div>
                </div>

                {t.websiteLink && (
                  <a
                    href={t.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sage-green py-2 px-4 text-xs font-extrabold inline-flex items-center justify-center shrink-0"
                    title="Visit Live Store"
                  >
                    <span>Visit Live Store</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQs */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServiceFAQ faqs={faqs} title="Frequently Asked Questions" />
      </section>

      {/* 10. DIRECT CONSULTATION DESK */}
      <section id="consultation" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConsultationForm />
      </section>
    </div>
  );
}
