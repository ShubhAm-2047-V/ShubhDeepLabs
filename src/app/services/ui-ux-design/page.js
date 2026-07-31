import Link from "next/link";
import { Code, ArrowRight, ShieldCheck, Zap, Layers, Cpu, CheckSquare, Rocket } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "UI/UX Design Services | Custom Web & Product Interface Design",
  description: "ShubDeep Labs delivers enterprise UI/UX design, interactive wireframing, component design systems, and conversion-rate optimized product interfaces for SaaS and mobile applications.",
  keywords: [
    "UI/UX Design",
    "UI/UX Design Services",
    "Web Design Agency",
    "Product Interface Design",
    "Figma Design Systems",
    "SaaS UI UX Design",
    "Mobile App UI UX"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/services/ui-ux-design",
  },
  openGraph: {
    title: "UI/UX Design Services | Custom Product Interface Design | ShubDeep Labs",
    description: "Enterprise UI/UX design and web design services. Figma prototypes, design systems, micro-animations, and conversion rate optimization.",
    url: "https://shubh-deep-labs.vercel.app/services/ui-ux-design",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "UI/UX Design Services" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Design Services | ShubDeep Labs",
    description: "Custom user interface and user experience design for enterprise web apps, SaaS, and mobile platforms.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function UiUxDesignPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://shubh-deep-labs.vercel.app/services/ui-ux-design/#service",
    "name": "UI/UX Design Services",
    "serviceType": "User Interface Engineering, User Experience Research & Design Systems",
    "provider": {
      "@id": "https://shubh-deep-labs.vercel.app/#organization"
    },
    "areaServed": "Worldwide",
    "description": "Professional UI/UX and web design services including Figma component design systems, wireframing, interactive prototyping, and conversion optimization."
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/software-development" },
    { label: "UI/UX Design", href: "/services/ui-ux-design" }
  ];

  const features = [
    { title: "User-Centered Wireframing & Research", desc: "In-depth user journey mapping, information architecture layout, and low-fidelity to high-fidelity wireframes." },
    { title: "Scalable Figma Design Systems", desc: "Comprehensive component libraries, typography scales, cohesive color tokens, and dark/light theme definitions." },
    { title: "Interactive Prototyping & Motion", desc: "Clickable Figma prototypes, Framer Motion micro-animations, and interactive component state specifications." },
    { title: "Conversion Rate Optimization (CRO)", desc: "A/B testing wireframes, heat-map user analysis, and clear visual hierarchy designed to maximize user sign-ups and sales." }
  ];

  const faqs = [
    { q: "What design tools do you use for UI/UX projects?", a: "We primarily utilize Figma for all design systems, component libraries, and interactive prototyping, along with Adobe Creative Suite and Framer." },
    { q: "Do you hand over ready-to-code design specs to frontend developers?", a: "Yes. All Figma designs include complete developer handoff specs with exact CSS properties, spacing guidelines, exportable SVG assets, and motion timing curves." },
    { q: "Can you redesign our existing web application or SaaS platform?", a: "Absolutely. We perform full UI/UX audits, streamline user navigation, and modernize legacy interfaces while keeping core backend functionality intact." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <StructuredData data={serviceSchema} />

      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Code className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            ENTERPRISE UI/UX DESIGN & PRODUCT INTERFACES
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            UI/UX Design Services <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Crafted for Exceptional Engagement</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Captivate users with world-class product interfaces. We craft intuitive user journeys, interactive Figma prototypes, design systems, and conversion-optimized web designs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Book Design Audit
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <a
              href="/#customizer"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Request Design Scope
              <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>
        </header>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B2818] tracking-tight mb-4">
              UI/UX Design Capabilities
            </h2>
            <p className="text-[#4A3525] max-w-2xl mx-auto font-medium">
              Transforming complex software systems into simple, beautiful, and intuitive interfaces.
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

        <ServiceFAQ faqs={faqs} title="UI/UX Design FAQs" />

        <section className="sand-dune-card p-10 sm:p-14 rounded-3xl text-center border-2 border-[#2E3B2B] bg-[#CFE3D2]/40 my-16">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">
            Elevate Your Product User Experience
          </h2>
          <p className="text-lg text-[#4A3525] max-w-2xl mx-auto mb-8 font-medium">
            Partner with senior product designers to build a design system your users will love.
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
              href="/services/website-development"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              View Web Development
            </Link>
          </div>

          <div className="pt-6 border-t border-[#2E3B2B]/20 flex flex-wrap justify-center gap-4 text-xs font-bold text-[#2E3B2B]">
            <span>Related Services:</span>
            <Link href="/services/software-development" className="hover:underline">Software Development</Link> •
            <Link href="/services/mobile-app-development" className="hover:underline">Mobile Apps</Link> •
            <Link href="/services/ai-development" className="hover:underline">AI Development</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
