import ChatbotWorkspace from "@/app/chatbot/page";
import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "AI Support Chatbot Engine | Customer Service AI | ShubDeep Labs Product",
  description: "Intelligent conversational support chatbot engine software product engineered by ShubDeep Labs. Handles customer service inquiries, custom RAG search, and automated lead capture.",
  keywords: [
    "AI Support Chatbot Product",
    "Customer Service AI Engine",
    "Lead Capture Chatbot",
    "Enterprise AI Assistant"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/products/chatbot",
  },
  openGraph: {
    title: "AI Support Chatbot Engine | ShubDeep Labs Software Product",
    description: "Enterprise conversational AI chatbot engine trained on custom business knowledge bases.",
    url: "https://shubh-deep-labs.vercel.app/products/chatbot",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "AI Support Chatbot Engine Product" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Support Chatbot Engine Product | ShubDeep Labs",
    description: "Conversational AI chatbot software product for business customer service.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ProductsChatbotPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products Ecosystem", href: "/products" },
    { label: "AI Support Chatbot", href: "/products/chatbot" }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-24 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto mb-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="sand-dune-card p-6 sm:p-8 rounded-3xl border-2 border-[#2E3B2B] mb-8 bg-[#CFE3D2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#2E3B2B] text-white mb-3">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              CUSTOMER SERVICE AI ENGINE
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#3B2818]">AI Support Chatbot Engine</h1>
            <p className="text-sm sm:text-base text-[#4A3525] font-medium mt-1">Context-aware conversational chatbot engine trained on custom knowledge bases for 24/7 support.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link href="/contact" className="btn-sage-green py-3 px-6 text-sm font-extrabold inline-flex items-center justify-center">
              Request Custom Deployment <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <ChatbotWorkspace />
    </div>
  );
}
