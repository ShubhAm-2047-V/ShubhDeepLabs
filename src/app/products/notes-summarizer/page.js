import NotesSummarizer from "@/app/notes-summarizer/page";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Smart Notes Summarizer | Document NLP AI | ShubDeep Labs Product",
  description: "Automated document indexing and smart text summarizer AI software product engineered by ShubDeep Labs. Generates key concept summaries and study flashcards.",
  keywords: [
    "Notes Summarizer Product",
    "NLP Document AI Software",
    "Text Summarizer AI",
    "Study Flashcard AI Generator"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/products/notes-summarizer",
  },
  openGraph: {
    title: "Smart Notes Summarizer | ShubDeep Labs Software Product",
    description: "Automated document NLP summarizer and study concept flashcard generator.",
    url: "https://shubh-deep-labs.vercel.app/products/notes-summarizer",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "Smart Notes Summarizer Product" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Notes Summarizer Product | ShubDeep Labs",
    description: "AI document indexing and automated study text summarization product.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ProductsNotesSummarizerPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products Ecosystem", href: "/products" },
    { label: "Notes Summarizer AI", href: "/products/notes-summarizer" }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-24 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto mb-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="sand-dune-card p-6 sm:p-8 rounded-3xl border-2 border-[#2E3B2B] mb-8 bg-[#CFE3D2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#2E3B2B] text-white mb-3">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              DOCUMENT NLP AI PRODUCT
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#3B2818]">Smart Notes Summarizer</h1>
            <p className="text-sm sm:text-base text-[#4A3525] font-medium mt-1">Automated text summarization, key concept extraction, and Q&A study flashcard generation.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link href="/contact" className="btn-sage-green py-3 px-6 text-sm font-extrabold inline-flex items-center justify-center">
              Request Custom Deployment <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <NotesSummarizer />
    </div>
  );
}
