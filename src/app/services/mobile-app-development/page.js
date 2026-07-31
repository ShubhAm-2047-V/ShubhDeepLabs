import Link from "next/link";
import { Smartphone, ArrowRight, ShieldCheck, Zap, Layers, CheckSquare, Code, Rocket } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "Mobile App Development Services | iOS & Android Engineering",
  description: "ShubDeep Labs builds high-performance mobile apps for iOS and Android using Flutter, React Native, and native architectures. Offline sync, real-time push, and app store deployment included.",
  keywords: [
    "Mobile App Development",
    "iOS App Development",
    "Android App Development",
    "Cross-Platform Mobile Apps",
    "Flutter App Agency",
    "React Native Development",
    "Custom Mobile Engineering"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/services/mobile-app-development",
  },
  openGraph: {
    title: "Mobile App Development Services | iOS & Android Engineering | ShubDeep Labs",
    description: "Production-grade mobile applications built for iOS and Android. High performance, offline synchronization, and seamless app store releases.",
    url: "https://shubh-deep-labs.vercel.app/services/mobile-app-development",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "Mobile App Development Services" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile App Development Services | ShubDeep Labs",
    description: "Custom mobile app development for startups and enterprise clients across iOS and Android.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function MobileAppDevelopmentPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://shubh-deep-labs.vercel.app/services/mobile-app-development/#service",
    "name": "Mobile App Development Services",
    "serviceType": "iOS & Android Cross-Platform Mobile Application Development",
    "provider": {
      "@id": "https://shubh-deep-labs.vercel.app/#organization"
    },
    "areaServed": "Worldwide",
    "description": "Enterprise mobile application development services for iOS and Android using Flutter, React Native, and cloud APIs."
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/software-development" },
    { label: "Mobile App Development", href: "/services/mobile-app-development" }
  ];

  const features = [
    { title: "Cross-Platform Efficiency", desc: "Build once and deploy to both Apple App Store and Google Play Store using Flutter & React Native, saving up to 40% development cost." },
    { title: "Offline Data Synchronization", desc: "Local SQLite/WatermelonDB storage engines allowing full mobile app functionality even during poor connectivity." },
    { title: "Real-Time Push Notifications", desc: "Automated Firebase/OneSignal push alert triggers, background worker tasks, and biometrics authentication (FaceID/Fingerprint)." },
    { title: "App Store Publishing Guarantee", desc: "Complete handling of Apple App Store and Google Play Store approval processes, guidelines compliance, and deployment pipelines." }
  ];

  const faqs = [
    { q: "Should we build a native or cross-platform mobile app?", a: "For 90% of business applications, cross-platform frameworks like Flutter or React Native provide native 60fps performance while reducing time-to-market and maintenance costs by nearly half." },
    { q: "Do you publish the mobile app to Apple App Store and Google Play Store?", a: "Yes. We manage full submission guidelines, privacy documentation, store listing assets, and approval deployment for both stores." },
    { q: "Can the mobile app connect to our web backend database?", a: "Absolutely. We build secure RESTful or GraphQL API gateways ensuring real-time data sync between your web portal and mobile app." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <StructuredData data={serviceSchema} />

      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Smartphone className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            IOS & ANDROID MOBILE APP ENGINEERING
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Mobile App Development <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Engineered for User Retention</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Empower your business with high-performance native and cross-platform mobile applications for iOS and Android. Built with fluid 60fps animations, offline sync, and enterprise security.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Hire Mobile Developers
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <a
              href="/#customizer"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Request App Quote
              <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>
        </header>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B2818] tracking-tight mb-4">
              Mobile Engineering Highlights
            </h2>
            <p className="text-[#4A3525] max-w-2xl mx-auto font-medium">
              Everything required to launch a top-rated mobile app on App Store & Google Play.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat, idx) => (
              <div key={idx} className="sand-dune-card p-8 rounded-3xl border border-[#D5C4A6]">
                <div className="w-12 h-12 rounded-2xl bg-[#CFE3D2] flex items-center justify-center mb-6 text-[#2E3B2B]">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#3B2818] mb-3">{feat.title}</h3>
                <p className="text-[#4A3525] leading-relaxed text-sm font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <ServiceFAQ faqs={faqs} title="Mobile App Development FAQs" />

        <section className="sand-dune-card p-10 sm:p-14 rounded-3xl text-center border-2 border-[#2E3B2B] bg-[#CFE3D2]/40 my-16">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">
            Launch Your Mobile Product Worldwide
          </h2>
          <p className="text-lg text-[#4A3525] max-w-2xl mx-auto mb-8 font-medium">
            Schedule a free technical session to discuss your mobile app concept, wireframes, and release timeline.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <Link
              href="/services/ui-ux-design"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              View Mobile UI/UX Services
            </Link>
          </div>

          <div className="pt-6 border-t border-[#2E3B2B]/20 flex flex-wrap justify-center gap-4 text-xs font-bold text-[#2E3B2B]">
            <span>Related Services:</span>
            <Link href="/services/website-development" className="hover:underline">Web Development</Link> •
            <Link href="/services/software-development" className="hover:underline">Software Development</Link> •
            <Link href="/services/ai-development" className="hover:underline">AI Development</Link> •
            <Link href="/services/ecommerce-development" className="hover:underline">Ecommerce</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
