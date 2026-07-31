import ExpenseTracker from "@/app/expense-tracker/page";
import Link from "next/link";
import { DollarSign, ArrowRight, ShieldCheck, Rocket } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "AI Expense Tracker | Financial Insights | ShubDeep Labs Product",
  description: "AI-driven financial management and expense tracking software product engineered by ShubDeep Labs. Features real-time budget pacing and AI financial health reports.",
  keywords: [
    "AI Expense Tracker Product",
    "Financial AI Software",
    "Budget Pacing App",
    "Expense Insights AI"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/products/expense-tracker",
  },
  openGraph: {
    title: "AI Expense Tracker | ShubDeep Labs Software Product",
    description: "Real-time AI financial tracking, budget pacing analysis, and category spending reports.",
    url: "https://shubh-deep-labs.vercel.app/products/expense-tracker",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "AI Expense Tracker Product" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Expense Tracker | ShubDeep Labs Product",
    description: "Financial analytics and AI-powered expense tracking software.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ProductsExpenseTrackerPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products Ecosystem", href: "/products" },
    { label: "AI Expense Tracker", href: "/products/expense-tracker" }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-24 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto mb-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="sand-dune-card p-6 sm:p-8 rounded-3xl border-2 border-[#2E3B2B] mb-8 bg-[#CFE3D2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#2E3B2B] text-white mb-3">
              <DollarSign className="w-3.5 h-3.5 mr-1.5" />
              ENTERPRISE FINANCIAL AI PRODUCT
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#3B2818]">AI Expense Tracker & Financial Insights</h1>
            <p className="text-sm sm:text-base text-[#4A3525] font-medium mt-1">Real-time budget pacing, category analysis, and automated markdown financial health reports.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link href="/contact" className="btn-sage-green py-3 px-6 text-sm font-extrabold inline-flex items-center justify-center">
              Request Custom Deployment <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <ExpenseTracker />
    </div>
  );
}
