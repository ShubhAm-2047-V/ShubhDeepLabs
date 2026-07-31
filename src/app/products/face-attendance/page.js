import FaceAttendanceWorkspace from "@/app/face-attendance/page";

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
  return <FaceAttendanceWorkspace />;
}
