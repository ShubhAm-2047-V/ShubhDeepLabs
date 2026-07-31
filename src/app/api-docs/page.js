import Link from "next/link";
import { Code, Server, ArrowRight, ShieldCheck, Terminal, Layers } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Developer API Documentation | ShubDeep Labs Public APIs",
  description: "Official developer API documentation for ShubDeep Labs REST API endpoints including AI chat, leads registration, whatsapp triggers, and document summarization.",
  keywords: [
    "Developer API Documentation",
    "ShubDeep Labs REST API",
    "AI Chat API Endpoint",
    "Notes Summarize API",
    "Expense Insights API"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/api-docs",
  },
  openGraph: {
    title: "Developer API Documentation | ShubDeep Labs Public APIs",
    description: "RESTful API documentation and code snippets for integrating ShubDeep Labs AI services.",
    url: "https://shubh-deep-labs.vercel.app/api-docs",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Developer API Docs" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer API Documentation | ShubDeep Labs",
    description: "API specs and code samples for integration with ShubDeep Labs web services.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ApiDocsPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Developer API", href: "/api-docs" }
  ];

  const endpoints = [
    {
      name: "Conversational AI Chat API",
      path: "POST /api/chat",
      desc: "Sends a user query and returns contextual AI assistant response along with inferred customizer selections and qualified lead tags.",
      payload: `{\n  "message": "hello get me approx cost for cafe website",\n  "sessionId": "web-anon-12345"\n}`,
      response: `{\n  "reply": "Thank you for reaching out! Standard business websites start at ₹3,999...",\n  "selections": { "category": "engineering", "tech": ["nextjs"], "timeline": "normal" }\n}`
    },
    {
      name: "AI Study Notes Summarize API",
      path: "POST /api/notes-summarize",
      desc: "Analyzes raw text study notes and generates a structured markdown summary, key concepts, and Q&A flashcards.",
      payload: `{\n  "notesText": "Next.js 16 uses Server Components by default..."\n}`,
      response: `{\n  "summary": "### Summary\\nNext.js 16 provides optimized SSR...",\n  "concepts": ["- Concept 1"],\n  "flashcards": [{ "q": "Question", "a": "Answer" }]\n}`
    },
    {
      name: "AI Expense Analytics API",
      path: "POST /api/expense-insights",
      desc: "Processes monthly financial log arrays and produces AI budget pacing analysis and savings recommendations.",
      payload: `{\n  "expenses": [{ "date": "2026-07-31", "description": "Cloud hosting", "amount": 1200, "category": "Bills", "type": "expense" }],\n  "totalIncome": 50000,\n  "monthlyBudget": 20000\n}`,
      response: `{\n  "report": "### Financial Health Review\\nYou are well within budget..."\n}`
    }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Terminal className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            DEVELOPER REST API SPECIFICATIONS
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Developer API Documentation <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Integrate Services Seamlessly</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Build custom integrations using ShubDeep Labs RESTful API endpoints for AI chat, document indexing, lead capture, and financial analytics.
          </p>
        </header>

        <section className="space-y-12 mb-20">
          {endpoints.map((ep, idx) => (
            <div key={idx} className="sand-dune-card p-8 sm:p-10 rounded-3xl border border-[#D5C4A6]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-[#3B2818]">{ep.name}</h2>
                <span className="px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold bg-[#2E3B2B] text-white">
                  {ep.path}
                </span>
              </div>

              <p className="text-sm font-medium text-[#4A3525] mb-6">{ep.desc}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2818] mb-2">Request Body (JSON)</label>
                  <pre className="p-4 rounded-2xl bg-[#3B2818] text-[#FAF6EE] text-xs font-mono overflow-x-auto">
                    {ep.payload}
                  </pre>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2818] mb-2">Response (JSON)</label>
                  <pre className="p-4 rounded-2xl bg-[#3B2818] text-[#CFE3D2] text-xs font-mono overflow-x-auto">
                    {ep.response}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
