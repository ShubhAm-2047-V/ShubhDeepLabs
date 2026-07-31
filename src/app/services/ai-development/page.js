import Link from "next/link";
import { Brain, ArrowRight, ShieldCheck, Zap, Layers, Cpu, CheckSquare, Code, Rocket } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "AI Development Services | Enterprise LLM & Machine Learning Agents",
  description: "ShubDeep Labs delivers custom AI development services, OpenAI/Claude integration, document indexing (RAG), autonomous AI agents, and predictive machine learning models.",
  keywords: [
    "AI Development",
    "AI Development Services",
    "Enterprise AI Solutions",
    "Custom LLM Agents",
    "RAG Indexing",
    "Machine Learning Engineering",
    "AI Chatbot Development"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/services/ai-development",
  },
  openGraph: {
    title: "AI Development Services | Enterprise LLM & ML Solutions | ShubDeep Labs",
    description: "Custom AI development services for business automation, RAG knowledge bases, intelligent LLM agents, and machine learning models.",
    url: "https://shubh-deep-labs.vercel.app/services/ai-development",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "AI Development Services" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Development Services | ShubDeep Labs",
    description: "Enterprise artificial intelligence engineering, RAG document search, and LLM automation.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function AiDevelopmentPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://shubh-deep-labs.vercel.app/services/ai-development/#service",
    "name": "AI Development Services",
    "serviceType": "Artificial Intelligence Engineering, LLM Integration & RAG Systems",
    "provider": {
      "@id": "https://shubh-deep-labs.vercel.app/#organization"
    },
    "areaServed": "Worldwide",
    "description": "Custom enterprise AI development services including LLM agents, vector database search (RAG), automated customer support chatbots, and predictive ML models."
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/software-development" },
    { label: "AI Development", href: "/services/ai-development" }
  ];

  const features = [
    { title: "Retrieval-Augmented Generation (RAG)", desc: "Private enterprise knowledge search indexing PDFs, internal documents, and databases with Pinecone, pgvector, and LangChain." },
    { title: "Autonomous AI Agents", desc: "Custom AI agents capable of multi-step task execution, lead qualification, report generation, and workflow automation." },
    { title: "Customer Support AI Chatbots", desc: "Intelligent conversational chatbots trained on your business data to handle 80%+ of customer inquiries 24/7." },
    { title: "Fine-Tuned Machine Learning Models", desc: "Custom fine-tuned open-source models (Llama 3, Mistral) deployed on private cloud infrastructure for maximum data security." }
  ];

  const faqs = [
    { q: "Is our business data secure when building custom AI solutions?", a: "100% secure. We utilize enterprise API privacy standards, self-hosted vector databases, and private model instances that explicitly prohibit third-party data training." },
    { q: "How fast can an enterprise AI agent or chatbot be integrated?", a: "Production-ready AI document search (RAG) and support chatbots can be deployed within 1-2 weeks." },
    { q: "What LLMs and AI frameworks do you work with?", a: "We work with OpenAI GPT-4o, Anthropic Claude, Llama 3, LangChain, LlamaIndex, Pinecone, Qdrant, PyTorch, and TensorFlow." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <StructuredData data={serviceSchema} />

      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Brain className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            ENTERPRISE ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            AI Development Services <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Empowering Enterprise Automation</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Harness the power of generative AI and machine learning. ShubDeep Labs builds intelligent LLM agents, private document search (RAG), automated customer support bots, and custom predictive models.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Book AI Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <a
              href="/#customizer"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Build AI Scope
              <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>
        </header>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B2818] tracking-tight mb-4">
              Enterprise AI & ML Capabilities
            </h2>
            <p className="text-[#4A3525] max-w-2xl mx-auto font-medium">
              Transform raw business data into autonomous AI actions and intelligent insights.
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

        <ServiceFAQ faqs={faqs} title="AI Development FAQs" />

        <section className="sand-dune-card p-10 sm:p-14 rounded-3xl text-center border-2 border-[#2E3B2B] bg-[#CFE3D2]/40 my-16">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">
            Supercharge Your Enterprise With Artificial Intelligence
          </h2>
          <p className="text-lg text-[#4A3525] max-w-2xl mx-auto mb-8 font-medium">
            Schedule a technical strategy session to explore how AI agents can automate your core business workflows.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              Schedule Discovery Call
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <Link
              href="/services/software-development"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              View Software Development
            </Link>
          </div>

          <div className="pt-6 border-t border-[#2E3B2B]/20 flex flex-wrap justify-center gap-4 text-xs font-bold text-[#2E3B2B]">
            <span>Related Services:</span>
            <Link href="/services/website-development" className="hover:underline">Web Development</Link> •
            <Link href="/services/custom-software-development" className="hover:underline">Custom Software</Link> •
            <Link href="/services/mobile-app-development" className="hover:underline">Mobile Apps</Link> •
            <Link href="/services/ecommerce-development" className="hover:underline">Ecommerce</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
