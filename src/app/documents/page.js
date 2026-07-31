import Link from "next/link";
import { FileText, Download, ShieldCheck, ArrowRight, CheckCircle2, Lock, BookOpen, Layers, Briefcase, Terminal } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";

export default function DocumentsHubPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Business Documents", href: "/documents" }
  ];

  const documentsList = [
    {
      title: "ShubDeep Labs Company Profile",
      category: "Corporate Profile",
      desc: "Comprehensive company background, engineering leadership, service capabilities, SLA standards, and multi-region cloud infrastructure specs.",
      filename: "ShubDeepLabs_Company_Profile_2026.pdf",
      href: "/portfolio-pdf"
    },
    {
      title: "Enterprise Capability Statement",
      category: "Procurement & SLAs",
      desc: "Detailed technical capability statement covering Next.js 16, microservices, RAG AI agents, cloud auto-scaling, and OWASP security compliance.",
      filename: "ShubDeepLabs_Capability_Statement.pdf",
      href: "/portfolio-pdf"
    },
    {
      title: "Software & Services Catalogue",
      category: "Services & Scope",
      desc: "Full catalogue of engineering services (Web Dev, Software Dev, AI Solutions, Mobile Apps, E-commerce, UI/UX Design) with commercial tiers.",
      filename: "ShubDeepLabs_Services_Catalogue.pdf",
      href: "/services"
    },
    {
      title: "Standard Client Proposal Template",
      category: "Legal & Proposals",
      desc: "Formal proposal structure featuring project scope, technical deliverables, milestone timelines, payment terms, and 100% IP code transfer.",
      filename: "ShubDeepLabs_Client_Proposal_Template.pdf",
      href: "/contact"
    },
    {
      title: "Technical Architecture Brochure",
      category: "Architecture & DevOps",
      desc: "Blueprint breakdown of cloud deployment options (AWS ECS, Docker, Vercel Enterprise, Supabase RLS) and 99.9% uptime SLA commitments.",
      filename: "ShubDeepLabs_Technical_Brochure.pdf",
      href: "/portfolio-pdf"
    },
    {
      title: "Client Onboarding & Project Guide",
      category: "Client Experience",
      desc: "Step-by-step onboarding walkthrough explaining communication channels (Slack/WhatsApp), sprint cycles, and GitHub code access.",
      filename: "ShubDeepLabs_Client_Onboarding_Guide.pdf",
      href: "/about"
    },
    {
      title: "4-Step Development Process Guide",
      category: "Engineering Workflow",
      desc: "Detailed breakdown of our agile engineering lifecycle (Discovery & Scope → Architecture Design → Rapid Engineering → Deployment & Support).",
      filename: "ShubDeepLabs_Development_Process.pdf",
      href: "/about"
    },
    {
      title: "SLA Maintenance & Support Overview",
      category: "Support Protocols",
      desc: "24/7 technical monitoring, security patch management, bug resolution response times, and ongoing SLA maintenance packages.",
      filename: "ShubDeepLabs_SLA_Maintenance_Guide.pdf",
      href: "/pricing"
    },
    {
      title: "Security & OWASP Compliance Overview",
      category: "Data Security",
      desc: "Detailed security practices whitepaper detailing AES-256 encryption, OAuth2/JWT authentication, RBAC controls, and NDA protocols.",
      filename: "ShubDeepLabs_Security_Practices_Overview.pdf",
      href: "/about"
    },
    {
      title: "Enterprise FAQ & Procurement Guide",
      category: "Procurement FAQ",
      desc: "Answers to critical enterprise procurement questions regarding NDA execution, multi-currency invoicing, and custom SLA agreements.",
      filename: "ShubDeepLabs_Enterprise_Procurement_FAQ.pdf",
      href: "/contact"
    }
  ];

  const faqs = [
    { q: "How do we request a custom tailored proposal for our business?", a: "You can submit your technical specs via our Contact Desk or book a discovery call. Our senior architects deliver custom proposals within 48 hours." },
    { q: "Can we execute a Non-Disclosure Agreement (NDA) before downloading specs?", a: "Yes. We strictly enforce client confidentiality and execute standard NDAs prior to technical discovery calls." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <FileText className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            ENTERPRISE BUSINESS DOCUMENTS & CAPABILITIES
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Business Documents & Downloads <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Procurement & SLA Transparency</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Access our official business documentation, technical capability statements, service catalogues, security practices, and client onboarding guides.
          </p>
        </header>

        {/* DOCUMENTS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {documentsList.map((doc, idx) => (
            <div key={idx} className="sand-dune-card p-8 flex flex-col justify-between border-2 border-[#D5C4A6]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#EADCC6] text-[#3B2818]">
                    {doc.category}
                  </span>
                  <FileText className="w-5 h-5 text-[#4E7854]" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#3B2818] mb-3">{doc.title}</h2>
                <p className="text-sm font-medium text-[#4A3525] leading-relaxed mb-6">{doc.desc}</p>
              </div>

              <div className="pt-4 border-t border-[#D5C4A6]/50 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#4A3525]">{doc.filename}</span>
                <Link href={doc.href} className="btn-sage-green py-2 px-4 text-xs font-extrabold inline-flex items-center">
                  Request Document <Download className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* SECURITY & SLA SUMMARY */}
        <section className="sand-dune-card p-8 sm:p-12 border-2 border-[#2E3B2B] bg-[#CFE3D2]/30 mb-20 text-center">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">Need Custom Procurement Terms or Security Compliance?</h2>
          <p className="text-sm sm:text-base text-[#4A3525] max-w-2xl mx-auto mb-6 font-medium">Our legal and technical teams work directly with enterprise procurement officers to accommodate custom SLAs, NDAs, and multi-currency invoicing.</p>
          <a href="/contact" className="btn-sage-green py-4 px-8 text-base font-extrabold inline-flex items-center">
            Contact Procurement Desk <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </section>

        <ServiceFAQ faqs={faqs} title="Business Documents FAQs" />
      </div>
    </div>
  );
}
