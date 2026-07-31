import Link from "next/link";
import { Layers, ArrowRight, CheckSquare, Rocket, Sparkles, Smartphone, Brain, Heart, FileText, MessageSquare, DollarSign } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "Products Ecosystem Directory | ShubDeep Labs Software Applications",
  description: "Explore ShubDeep Labs software product ecosystem including AI Expense Tracker, Hospital Management Core Desk, Face Recognition Attendance System, Smart Notes Summarizer, and AI Support Chatbot.",
  keywords: [
    "Software Products",
    "Enterprise Software Ecosystem",
    "AI Expense Tracker Product",
    "Hospital Desk Management Product",
    "Face Attendance AI Product",
    "Notes Summarizer AI Product",
    "AI Support Chatbot Engine"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/products",
  },
  openGraph: {
    title: "Products Ecosystem Directory | ShubDeep Labs Software Applications",
    description: "Production-ready software products engineered by ShubDeep Labs.",
    url: "https://shubh-deep-labs.vercel.app/products",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Products Ecosystem" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products Ecosystem Directory | ShubDeep Labs",
    description: "Production-ready AI tools, financial management, healthcare desks, and automation software.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ProductsHubPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://shubh-deep-labs.vercel.app/products/#software",
    "name": "ShubDeep Labs Software Product Ecosystem",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "publisher": {
      "@id": "https://shubh-deep-labs.vercel.app/#organization"
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products Ecosystem", href: "/products" }
  ];

  const productsList = [
    {
      title: "AI Expense Tracker",
      href: "/products/expense-tracker",
      icon: DollarSign,
      badge: "Financial AI",
      desc: "AI-driven financial management software offering real-time budget pacing, category analysis, and automated markdown financial health reports."
    },
    {
      title: "Hospital Management Core Desk",
      href: "/products/hospital-desk",
      icon: Heart,
      badge: "Healthcare SaaS",
      desc: "Enterprise clinic desk and hospital management solution featuring patient admission logs, doctor queue scheduling, and billing modules."
    },
    {
      title: "Face Recognition Attendance System",
      href: "/products/face-attendance",
      icon: Brain,
      badge: "Computer Vision AI",
      desc: "Biometric AI facial recognition attendance verification system with instant camera scan, log tracking, and real-time report exports."
    },
    {
      title: "Smart Notes Summarizer",
      href: "/products/notes-summarizer",
      icon: FileText,
      badge: "NLP Document AI",
      desc: "Automated study notes and document summarizer utilizing RAG indexing to generate key concepts and interactive Q&A study flashcards."
    },
    {
      title: "AI Support Chatbot Engine",
      href: "/products/chatbot",
      icon: MessageSquare,
      badge: "Customer Service AI",
      desc: "Intelligent conversational chatbot engine trained on your custom business context to handle client inquiries, quotes, and lead qualification 24/7."
    }
  ];

  const faqs = [
    { q: "Can these software products be deployed on our own server?", a: "Yes. All products can be deployed directly on your private cloud (AWS, Vercel, GCP, Azure, Docker) or self-hosted infrastructure." },
    { q: "Can we request custom features for a product?", a: "100%. Every product in our ecosystem can be tailored and customized around your organization's exact business requirements." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <StructuredData data={productSchema} />

      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Layers className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            SHUBDEEP LABS PRODUCTS ECOSYSTEM
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Production-Ready Software Applications <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Built for Immediate Deployment</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Explore our suite of intelligent software products spanning financial analytics, healthcare management, computer vision biometric AI, document NLP, and customer support engines.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/#customizer" className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto">
              Custom Product Request <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a href="/pricing" className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto">
              View Licensing & Cost <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>
        </header>

        {/* PRODUCTS GRID */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsList.map((prod, idx) => {
              const Icon = prod.icon;
              return (
                <div key={idx} className="sand-dune-card p-8 flex flex-col justify-between border border-[#D5C4A6]">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#CFE3D2] text-[#2E3B2B] flex items-center justify-center shadow-sm">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EADCC6] text-[#3B2818]">
                        {prod.badge}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#3B2818] mb-3">{prod.title}</h2>
                    <p className="text-sm font-medium text-[#4A3525] leading-relaxed mb-6">{prod.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-[#D5C4A6]/50">
                    <Link href={prod.href} className="text-sm font-bold text-[#4E7854] hover:underline inline-flex items-center">
                      Launch Product Workspace <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <ServiceFAQ faqs={faqs} title="Product Ecosystem FAQs" />
      </div>
    </div>
  );
}
