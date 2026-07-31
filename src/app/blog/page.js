import Link from "next/link";
import { FileText, ArrowRight, Code, Server, Brain, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Tech Insights & Software Engineering Blog | ShubDeep Labs",
  description: "Read technical articles and insights on Next.js 16 architecture, custom AI agent engineering (RAG), SaaS multi-tenancy, and technical SEO by ShubDeep Labs.",
  keywords: [
    "Software Engineering Blog",
    "Next.js 16 Architecture Articles",
    "AI Agent RAG Insights",
    "SaaS Multi-Tenancy Design",
    "Technical SEO Engineering"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/blog",
  },
  openGraph: {
    title: "Tech Insights & Software Engineering Blog | ShubDeep Labs",
    description: "In-depth engineering articles on full-stack web applications, AI LLM agents, and cloud scalability.",
    url: "https://shubh-deep-labs.vercel.app/blog",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Blog" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Insights Blog | ShubDeep Labs",
    description: "Software engineering insights, Next.js architecture, and AI development articles.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function BlogPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Engineering Blog", href: "/blog" }
  ];

  const articles = [
    {
      title: "Mastering Next.js 16 Server Components & Metadata Optimization",
      date: "July 2026",
      category: "Web Engineering",
      desc: "Learn how Next.js 16 App Router Server Components drastically reduce browser JavaScript bundle size while improving Core Web Vitals (LCP/CLS) and Google SEO indexability."
    },
    {
      title: "Architecting Enterprise AI Agents with Pinecone & RAG Document Search",
      date: "July 2026",
      category: "AI & Machine Learning",
      desc: "A comprehensive deep dive into vector database embeddings, Retrieval-Augmented Generation (RAG), and self-hosted private LLM instances for enterprise data privacy."
    },
    {
      title: "Designing Multi-Tenant SaaS Databases with Row-Level Isolation",
      date: "June 2026",
      category: "Cloud Architecture",
      desc: "Explore database multi-tenancy design patterns in PostgreSQL and Supabase, comparing tenant schema isolation vs row-level security (RLS) policy enforcement."
    }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <FileText className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            SHUBDEEP LABS TECHNICAL ENGINEERING BLOG
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Tech Insights & Architectural Guides <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Written by Engineers</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Deep-dive technical articles covering Next.js 16, enterprise AI systems, cloud microservices, and modern web engineering.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {articles.map((art, idx) => (
            <article key={idx} className="sand-dune-card p-8 flex flex-col justify-between border border-[#D5C4A6]">
              <div>
                <div className="flex items-center justify-between mb-4 text-xs font-bold">
                  <span className="px-3 py-1 rounded-full bg-[#EADCC6] text-[#3B2818]">
                    {art.category}
                  </span>
                  <span className="text-[#6A6A6A]">{art.date}</span>
                </div>
                <h2 className="text-xl font-extrabold text-[#3B2818] mb-3 leading-snug">{art.title}</h2>
                <p className="text-sm font-medium text-[#4A3525] leading-relaxed mb-6">{art.desc}</p>
              </div>
              <div className="pt-4 border-t border-[#D5C4A6]/50">
                <a href="#read" className="text-sm font-bold text-[#4E7854] hover:underline inline-flex items-center">
                  Read Article <ArrowRight className="w-4 h-4 ml-1.5" />
                </a>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
