import Link from "next/link";
import { Server, ArrowRight, ShieldCheck, Zap, Layers, CheckSquare, Clock, FileText, Lock } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Client Project Dashboard | ShubDeep Labs Workspace",
  description: "Access your ShubDeep Labs client dashboard to track active software development milestones, review project blueprints, and manage technical consultations.",
  keywords: [
    "Client Dashboard",
    "Project Milestone Tracking",
    "ShubDeep Labs Client Workspace"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/dashboard",
  },
  openGraph: {
    title: "Client Project Dashboard | ShubDeep Labs Workspace",
    description: "Track project milestones, access source code repositories, and view SLA status.",
    url: "https://shubh-deep-labs.vercel.app/dashboard",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Client Dashboard" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Dashboard | ShubDeep Labs",
    description: "Client workspace for tracking custom software development projects.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function DashboardPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Client Dashboard", href: "/dashboard" }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Server className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            CLIENT PROJECT WORKSPACE & TRACKING
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Client Project Dashboard <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Real-Time Milestone Visibility</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Track active engineering sprints, review architectural blueprints, access GitHub repository links, and communicate directly with your lead software architect.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="sand-dune-card p-6 border border-[#D5C4A6]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A3525]">Active Sprints</span>
              <Clock className="w-5 h-5 text-[#2E3B2B]" />
            </div>
            <div className="text-3xl font-extrabold text-[#3B2818]">2 Projects</div>
            <p className="text-xs font-medium text-[#4A3525] mt-1">Next.js Web App & AI Agent</p>
          </div>

          <div className="sand-dune-card p-6 border border-[#D5C4A6]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A3525]">Uptime Status</span>
              <ShieldCheck className="w-5 h-5 text-[#2E3B2B]" />
            </div>
            <div className="text-3xl font-extrabold text-[#3B2818]">99.99%</div>
            <p className="text-xs font-medium text-[#4A3525] mt-1">All Systems Operational</p>
          </div>

          <div className="sand-dune-card p-6 border border-[#D5C4A6]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A3525]">Source Repositories</span>
              <FileText className="w-5 h-5 text-[#2E3B2B]" />
            </div>
            <div className="text-3xl font-extrabold text-[#3B2818]">Full Access</div>
            <p className="text-xs font-medium text-[#4A3525] mt-1">GitHub & CI/CD Pipelines</p>
          </div>
        </section>

        <section className="sand-dune-card p-8 rounded-3xl border border-[#D5C4A6] mb-16">
          <h2 className="text-2xl font-extrabold text-[#3B2818] mb-6">Need a New Feature or Scope Adjustment?</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/pricing" className="btn-sage-green py-3 px-6 text-sm inline-flex items-center justify-center">
              Configure New Scope <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link href="/chat" className="btn-warm-beige py-3 px-6 text-sm inline-flex items-center justify-center">
              Ask AI Consultant <Zap className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
