import HospitalDeskWorkspace from "@/app/hospital-desk/page";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Hospital Management Core Desk | Healthcare SaaS | ShubDeep Labs Product",
  description: "Enterprise clinic desk and hospital management software product engineered by ShubDeep Labs. Features doctor queue management, patient admission logs, and automated billing.",
  keywords: [
    "Hospital Desk Product",
    "Healthcare SaaS",
    "Clinic Management System",
    "Patient Admission Software"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/products/hospital-desk",
  },
  openGraph: {
    title: "Hospital Management Core Desk | ShubDeep Labs Software Product",
    description: "Enterprise hospital management and clinic queue scheduling software product.",
    url: "https://shubh-deep-labs.vercel.app/products/hospital-desk",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "Hospital Management Core Desk Product" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hospital Desk Management Product | ShubDeep Labs",
    description: "Enterprise hospital desk management and healthcare SaaS solution.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ProductsHospitalDeskPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products Ecosystem", href: "/products" },
    { label: "Hospital Core Desk", href: "/products/hospital-desk" }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-24 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto mb-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="sand-dune-card p-6 sm:p-8 rounded-3xl border-2 border-[#2E3B2B] mb-8 bg-[#CFE3D2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#2E3B2B] text-white mb-3">
              <Heart className="w-3.5 h-3.5 mr-1.5" />
              HEALTHCARE SAAS PRODUCT
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#3B2818]">Hospital Management Core Desk</h1>
            <p className="text-sm sm:text-base text-[#4A3525] font-medium mt-1">Doctor queue scheduling, patient admission logs, and automated billing modules.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link href="/contact" className="btn-sage-green py-3 px-6 text-sm font-extrabold inline-flex items-center justify-center">
              Request Custom Deployment <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <HospitalDeskWorkspace />
    </div>
  );
}
