import HospitalDeskWorkspace from "@/app/hospital-desk/page";

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
  return <HospitalDeskWorkspace />;
}
