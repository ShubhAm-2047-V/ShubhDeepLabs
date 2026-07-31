import FaceAttendanceWorkspace from "@/app/face-attendance/page";
import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Face Recognition Attendance System | Computer Vision AI | ShubDeep Labs Product",
  description: "AI-powered facial recognition attendance verification software product engineered by ShubDeep Labs. Real-time webcam biometric scanner and attendance logs export.",
  keywords: [
    "Face Attendance Product",
    "Computer Vision AI Software",
    "Biometric Attendance System",
    "Facial Recognition Logs"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/products/face-attendance",
  },
  openGraph: {
    title: "Face Recognition Attendance System | ShubDeep Labs Software Product",
    description: "Biometric AI facial recognition attendance tracking software product.",
    url: "https://shubh-deep-labs.vercel.app/products/face-attendance",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "Face Recognition Attendance Product" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Face Recognition Attendance Product | ShubDeep Labs",
    description: "AI facial recognition verification and attendance management system.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ProductsFaceAttendancePage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products Ecosystem", href: "/products" },
    { label: "Face Attendance AI", href: "/products/face-attendance" }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-24 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto mb-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="sand-dune-card p-6 sm:p-8 rounded-3xl border-2 border-[#2E3B2B] mb-8 bg-[#CFE3D2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#2E3B2B] text-white mb-3">
              <Brain className="w-3.5 h-3.5 mr-1.5" />
              COMPUTER VISION BIOMETRIC PRODUCT
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#3B2818]">Face Recognition Attendance System</h1>
            <p className="text-sm sm:text-base text-[#4A3525] font-medium mt-1">Biometric webcam scanner, real-time employee attendance verification, and CSV export.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link href="/contact" className="btn-sage-green py-3 px-6 text-sm font-extrabold inline-flex items-center justify-center">
              Request Custom Deployment <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <FaceAttendanceWorkspace />
    </div>
  );
}
