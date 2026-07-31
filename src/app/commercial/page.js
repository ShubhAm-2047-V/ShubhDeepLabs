import Link from "next/link";
import { 
  Briefcase, ArrowRight, ShieldCheck, Zap, Globe, Server, 
  Cpu, Brain, Smartphone, Layers, Lock, Headphones, Rocket, Star
} from "lucide-react";
import ServiceFAQ from "@/components/ServiceFAQ";
import ConsultationForm from "@/components/ConsultationForm";
import DynamicThreeWorld from "@/components/DynamicThreeWorld";
import DynamicCommercialCustomizer from "@/components/DynamicCommercialCustomizer";

export const metadata = {
  title: "Commercial Software Development | ShubDeep Labs",
  description: "Enterprise commercial software development services, cloud solutions, and custom AI applications by ShubDeep Labs.",
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/commercial",
  },
};

export default function CommercialPage() {
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

  const faqs = [
    { q: "What types of business applications do you build?", a: "We build custom web applications, enterprise software, SaaS platforms, AI integrations, mobile applications, e-commerce storefronts, and high-scale API microservices." },
    { q: "Do we get 100% full source code ownership?", a: "Yes, absolutely! You receive complete, unencumbered ownership of all source code, database schemas, CI/CD scripts, and technical documentation." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen space-y-24 pb-20 relative overflow-hidden text-[#3B2818]">
      <DynamicThreeWorld hideBooks={true} theme="sand" />
      
      <section className="relative z-10 min-h-[88vh] flex items-center justify-center pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold sage-badge shadow-sm mb-6">
            <Briefcase className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            COMMERCIAL SOFTWARE SOLUTIONS
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Enterprise Digital Solutions <br className="hidden sm:inline" />
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
        </div>
      </section>

      <section id="customizer" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sand-dune-card p-6 sm:p-10 border-2 border-[#CFE3D2]">
          <DynamicCommercialCustomizer />
        </div>
      </section>

      <ServiceFAQ faqs={faqs} title="Commercial Software FAQs" />

      <section id="consultation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConsultationForm />
      </section>
    </div>
  );
}
