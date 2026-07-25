"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, GraduationCap, ArrowRight, ShieldCheck, Zap, Globe, Server, 
  Cpu, Brain, Smartphone, Code, CheckSquare, Layers, Lock, Building, 
  BarChart, Users, Headphones, Phone, Mail, Send, Star, HelpCircle, ChevronDown, Rocket, Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import { dbService } from "@/lib/supabase";
import ThreeWorld from "@/components/ThreeWorld";
import CommercialCustomizer from "@/components/CommercialCustomizer";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const settings = await dbService.getSiteSettings();
        if (settings) setSiteSettings(settings);
      } catch (e) {
        console.error("Failed to load site settings:", e);
      }
    };
    loadSiteSettings();
  }, []);

  const contactData = siteSettings?.contact || {
    phone: "+91 90288 33275",
    email: "shubdeeplabs@gmail.com",
    address: "Solapur, Maharashtra"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill in all required contact details.");
      return;
    }

    setLoading(true);
    try {
      await dbService.addOrder({
        fullName: formData.name,
        collegeName: formData.company || "Commercial Client",
        branch: "Enterprise Business Solution",
        year: "Business",
        projectTitle: "Commercial Business Consultation",
        techRequired: "Enterprise Tech Stack",
        deadline: new Date().toISOString().split('T')[0],
        budget: "Custom Quote",
        description: `Company: ${formData.company || 'N/A'}\nMessage: ${formData.message}`,
        needPPT: false,
        needReport: false,
        needVivaGuidance: false,
        projectStatus: "Pending",
        paymentStatus: "Unpaid"
      });

      toast.success("Consultation request received! Our engineering team will contact you shortly.", {
        style: {
          background: '#0D3B47',
          color: '#F0FBFF',
          border: '1px solid #66C2D1',
          borderRadius: '12px'
        }
      });
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit consultation request.");
    } finally {
      setLoading(false);
    }
  };

  const commercialServices = [
    { title: "Enterprise Web Applications", icon: Globe, desc: "High-performance web apps, client portals, and administrative dashboards engineered with Next.js, React, and microservices.", bg: "bg-[#BFE8F7]/40" },
    { title: "Multi-Tenant SaaS Platforms", icon: Server, desc: "Scalable SaaS architectures featuring automated subscription billing, role-based access, and isolated tenant databases.", bg: "bg-[#66C2D1]/20" },
    { title: "Custom AI & LLM Solutions", icon: Brain, desc: "Enterprise AI agents, document indexing (RAG), automated customer support chatbots, and predictive ML models.", bg: "bg-[#BFE8F7]/50" },
    { title: "Native & Cross-Platform Apps", icon: Smartphone, desc: "Production-ready mobile applications for iOS & Android built with Flutter/React Native, offline sync, and push alerts.", bg: "bg-[#66C2D1]/20" },
    { title: "Cloud Infrastructure & DevOps", icon: Cpu, desc: "AWS/GCP cloud deployments, Kubernetes auto-scaling, CI/CD automated pipelines, and Redis high-speed caching.", bg: "bg-[#BFE8F7]/40" },
    { title: "API Gateway & Integrations", icon: Layers, desc: "Bank-grade RESTful & GraphQL APIs, OAuth2/JWT secure authentication, Webhooks, and Zapier/CRM integrations.", bg: "bg-[#66C2D1]/20" }
  ];

  const valueProps = [
    { title: "99.9% Uptime SLA", desc: "Built on resilient cloud infrastructure with multi-region redundancy and auto-scaling.", icon: ShieldCheck },
    { title: "Bank-Grade Security", desc: "End-to-end data encryption, strict RBAC controls, OAuth2/JWT, and regular vulnerability audits.", icon: Lock },
    { title: "Rapid Engineering", desc: "Production-ready boilerplate architectures to launch your business software 3x faster.", icon: Zap },
    { title: "Dedicated Support", desc: "24/7 technical monitoring, SLA maintenance, and direct engineer-level support.", icon: Headphones }
  ];

  const testimonials = [
    { name: "Vikram Mehta", role: "Founder & CEO, TechScale Solutions", review: "ShubDeep Labs engineered our core customer dashboard and API pipeline within 3 weeks. Their clean codebase and rapid delivery gave us a massive head start before launch!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
    { name: "Anand Kulkarni", role: "CTO, HealthTech Innovations", review: "We partnered with ShubDeep Labs to build a customized clinic desk module. The UI design and backend security exceeded our expectations. Highly recommended for commercial projects!", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
    { name: "Meera Singhania", role: "Head of Product, RetailEdge SaaS", review: "The multi-tenant SaaS architecture ShubDeep Labs built for us handles thousands of daily active user queries effortlessly. Extraordinary engineering quality!", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" }
  ];

  const faqs = [
    { q: "What types of business applications do you build?", a: "We build custom web applications, SaaS platforms, enterprise admin dashboards, AI integrations, mobile applications, and high-scale API microservices." },
    { q: "Do we get 100% full source code ownership?", a: "Yes, absolutely! You receive complete, unencumbered ownership of all source code, database schemas, CI/CD scripts, and documentation with no recurring vendor lock-in." },
    { q: "What is your typical project delivery timeline?", a: "MVP releases and core business applications are typically delivered within 2-4 weeks, depending on system complexity." },
    { q: "How do you handle security and compliance?", a: "We implement OAuth2/JWT authentication, AES-256 data encryption at rest and in transit, strict RBAC permissions, and OWASP security standards." }
  ];

  return (
    <div className="ocean-theme ocean-gradient-bg min-h-screen space-y-24 pb-20 relative overflow-hidden text-[#0D3B47]">
      <ThreeWorld hideBooks={true} />
      
      {/* 1. HERO SECTION (OCEAN BREEZE THEME) */}
      <section className="relative z-10 min-h-[88vh] flex items-center justify-center pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full text-center max-w-4xl mx-auto">
          
          {/* Mode Switch Pill & Tag */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold ocean-badge shadow-sm">
              <Briefcase className="w-4 h-4 mr-2 text-[#0D3B47]" />
              SHUBDEEP LABS FOR BUSINESS & ENTERPRISE
            </div>

            {/* Prominent Mode Switch Button */}
            <Link 
              href="/student"
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#FAF6EE] text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#FFF59D] transition-all shadow-sm"
              title="Switch to Student Desk Mode"
            >
              <GraduationCap className="w-4 h-4 mr-1.5 text-[#3F51B5]" />
              Switch to Student Desk →
            </Link>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0D3B47] tracking-tight leading-tight mb-6">
            Enterprise Digital Solutions <br className="hidden sm:inline" />
            <span className="ocean-text-accent underline decoration-[#BFE8F7] decoration-4">Built for Scale & Speed</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#164E63] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Empowering Startups and Enterprises with High-Performance Software, Scalable SaaS Platforms, Custom AI Agents, and Bank-Grade Web Applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#customizer"
              className="ocean-btn-primary py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto cursor-pointer"
            >
              Configure Enterprise Scope
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <a
              href="#consultation"
              className="ocean-btn-secondary py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto cursor-pointer"
            >
              Request Free Consultation
              <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>

          {/* SLA Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-[#66C2D1]/30 text-left">
            <div className="p-4 ocean-card text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0D3B47]">99.9%</div>
              <div className="text-xs sm:text-sm font-semibold text-[#164E63]">Uptime SLA</div>
            </div>
            <div className="p-4 ocean-card text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0D3B47]">100+</div>
              <div className="text-xs sm:text-sm font-semibold text-[#164E63]">Products Deployed</div>
            </div>
            <div className="p-4 ocean-card text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0D3B47]">256-bit</div>
              <div className="text-xs sm:text-sm font-semibold text-[#164E63]">Bank Security</div>
            </div>
            <div className="p-4 ocean-card text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0D3B47]">24/7</div>
              <div className="text-xs sm:text-sm font-semibold text-[#164E63]">Dedicated Support</div>
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
              <div key={i} className="ocean-card p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#BFE8F7] text-[#0D3B47] flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0D3B47] mb-2">{prop.title}</h3>
                  <p className="text-sm font-medium text-[#164E63] leading-relaxed">{prop.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. COMMERCIAL SERVICES CATALOG */}
      <section id="services" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold ocean-badge mb-3">
            BUSINESS CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0D3B47]">
            Core Enterprise Solutions
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#164E63] font-medium">
            From initial MVP architecture to complex SaaS backends and custom AI integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {commercialServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={i} className="ocean-card p-8 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#BFE8F7] text-[#0D3B47] flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-7 h-7 text-[#0D3B47]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0D3B47] mb-3">{service.title}</h3>
                  <p className="text-sm text-[#164E63] font-medium leading-relaxed mb-6">{service.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#66C2D1]/30 flex items-center justify-between">
                  <a href="#consultation" className="text-sm font-bold ocean-text-accent hover:underline flex items-center">
                    Inquire Service <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. INTERACTIVE COMMERCIAL CUSTOMIZER */}
      <section id="customizer" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ocean-card p-6 sm:p-10 border-2 border-[#66C2D1]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="ocean-badge px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Interactive Estimator
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D3B47] mt-3">
              Configure Your Business Solution Scope
            </h2>
            <p className="text-sm sm:text-base text-[#164E63] mt-2">
              Select your required platform, features, and timeline to build an instant commercial estimate.
            </p>
          </div>

          <CommercialCustomizer />
        </div>
      </section>

      {/* 5. CLIENT TESTIMONIALS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D3B47]">
            Trusted by Business Leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <div key={i} className="ocean-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1 text-[#66C2D1] mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-[#66C2D1] text-[#66C2D1]" />
                  ))}
                </div>
                <p className="text-sm font-medium italic text-[#164E63] leading-relaxed mb-6">
                  &quot;{test.review}&quot;
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-[#66C2D1]/30">
                <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#66C2D1]" />
                <div>
                  <h4 className="text-sm font-bold text-[#0D3B47]">{test.name}</h4>
                  <p className="text-xs font-medium text-[#164E63]">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQS */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D3B47]">
            Commercial FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="ocean-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between text-[#0D3B47] font-bold"
              >
                <span className="text-base sm:text-lg flex items-center">
                  <HelpCircle className="w-5 h-5 mr-3 text-[#66C2D1] shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 text-[#0D3B47] transform transition-transform duration-200 ${
                  openFaq === i ? "rotate-180" : ""
                }`} />
              </button>
              
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#66C2D1]/20 bg-[#BFE8F7]/20"
                  >
                    <div className="px-6 py-4 text-sm font-medium text-[#164E63] leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONSULTATION CONTACT FORM */}
      <section id="consultation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ocean-card p-8 sm:p-12 border-2 border-[#66C2D1]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="ocean-badge px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Direct Engineering Desk
                </span>
                <h2 className="text-3xl font-extrabold text-[#0D3B47] mt-4 mb-4">
                  Schedule a Solution Consultation
                </h2>
                <p className="text-sm font-medium text-[#164E63] leading-relaxed mb-8">
                  Let us review your software architecture or product requirements. Our team will prepare a technical blueprint and custom quote.
                </p>
              </div>

              <div className="space-y-4 font-bold text-[#0D3B47] pt-6 border-t border-[#66C2D1]/30">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#66C2D1]" />
                  <span>{contactData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#66C2D1]" />
                  <span>{contactData.email}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleFormSubmit} className="space-y-4 ocean-card-soft p-6 border border-[#66C2D1]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0D3B47] uppercase mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full text-sm px-4 py-3 bg-white/90 border border-[#66C2D1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#66C2D1] text-[#0D3B47] font-medium"
                      placeholder="e.g. Sarah Jenkins"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0D3B47] uppercase mb-1">Company / Organization</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full text-sm px-4 py-3 bg-white/90 border border-[#66C2D1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#66C2D1] text-[#0D3B47] font-medium"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0D3B47] uppercase mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full text-sm px-4 py-3 bg-white/90 border border-[#66C2D1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#66C2D1] text-[#0D3B47] font-medium"
                      placeholder="e.g. +91 9876543210"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0D3B47] uppercase mb-1">Work Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full text-sm px-4 py-3 bg-white/90 border border-[#66C2D1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#66C2D1] text-[#0D3B47] font-medium"
                      placeholder="e.g. sarah@acme.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D3B47] uppercase mb-1">Project Scope & Requirements *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full text-sm px-4 py-3 bg-white/90 border border-[#66C2D1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#66C2D1] text-[#0D3B47] font-medium"
                    placeholder="Describe your required application, timeline, target features..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="ocean-btn-primary w-full py-4 text-base flex items-center justify-center cursor-pointer"
                >
                  {loading ? "Sending..." : "Submit Business Consultation Request"}
                  <Send className="w-4 h-4 ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
