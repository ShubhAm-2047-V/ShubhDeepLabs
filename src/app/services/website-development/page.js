import Link from "next/link";
import { Globe, ArrowRight, ShieldCheck, Zap, Layers, Cpu, CheckSquare, Code, Rocket, Star } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  title: "Website Development Services | Custom Next.js Web Engineering",
  description: "ShubDeep Labs builds high-performance, enterprise-grade websites, web portals, and custom web applications for startups and global enterprises. Fast load speeds, SEO optimized, and bank-grade security.",
  keywords: [
    "Website Development",
    "Web Engineering",
    "Custom Web Applications",
    "Next.js Development Agency",
    "Enterprise Web Design",
    "React Web Apps",
    "SEO Optimized Websites"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/services/website-development",
  },
  openGraph: {
    title: "Website Development Services | Custom Next.js Web Engineering | ShubDeep Labs",
    description: "Enterprise-grade website development services for global businesses. High performance, Next.js architecture, custom UI/UX, and SEO built-in.",
    url: "https://shubh-deep-labs.vercel.app/services/website-development",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "Website Development Services" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Development Services | ShubDeep Labs",
    description: "Custom Next.js website engineering and web app development for startups and global enterprises.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function WebsiteDevelopmentPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://shubh-deep-labs.vercel.app/services/website-development/#service",
    "name": "Website Development Services",
    "serviceType": "Web Application Engineering & Custom Web Design",
    "provider": {
      "@id": "https://shubh-deep-labs.vercel.app/#organization"
    },
    "areaServed": "Worldwide",
    "description": "Professional custom website development services using Next.js, React, Node.js, and cloud infrastructure. Engineered for speed, conversion, and global SEO rankings.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/software-development" },
    { label: "Website Development", href: "/services/website-development" }
  ];

  const features = [
    { title: "Next.js 16 & Server Components", desc: "Ultra-fast server-rendered web applications delivering superior initial page load speeds (LCP) and zero layout shift." },
    { title: "Enterprise Technical SEO", desc: "Built-in dynamic metadata, automated sitemaps, self-referencing canonical tags, structured data, and lighthouse 95+ performance." },
    { title: "Responsive & Handcrafted UI", desc: "Flawlessly tailored user experiences across desktop, tablet, and mobile with custom micro-animations and zero bloat." },
    { title: "Bank-Grade Security & Scalability", desc: "AES-256 encryption, OAuth2/JWT auth, DDoS protection, and auto-scaling cloud deployments." }
  ];

  const techStack = ["Next.js 16", "React 19", "Tailwind CSS", "Node.js", "TypeScript", "PostgreSQL", "Supabase", "AWS / Vercel"];

  const faqs = [
    { q: "What website development technologies do you use?", a: "We specialize in modern JavaScript/TypeScript stacks including Next.js 16, React 19, Node.js, Express, Tailwind CSS, PostgreSQL, Supabase, and AWS/Vercel cloud infrastructure." },
    { q: "How long does a custom website development project take?", a: "Standard corporate websites and web apps take 2-4 weeks from initial architecture discovery to full production deployment." },
    { q: "Do you build SEO-optimized websites?", a: "Yes. Every website we build includes schema markup, dynamic metadata, canonical tags, automated sitemaps, openGraph images, and core web vitals optimization." },
    { q: "Will I own the complete website source code?", a: "100%. Upon delivery, you receive full unencumbered source code ownership, repository access, and deployment credentials." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <StructuredData data={serviceSchema} />

      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        {/* HERO SECTION */}
        <header className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Globe className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            ENTERPRISE WEB ENGINEERING & DEVELOPMENT
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Website Development Services <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Engineered for Global Scale</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            We build high-converting, lightning-fast custom websites and web applications tailored for startups, enterprises, and international clients using Next.js 16 and modern cloud architectures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <a
              href="/#customizer"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center w-full sm:w-auto"
            >
              Request Custom Proposal
              <Rocket className="w-5 h-5 ml-2" />
            </a>
          </div>
        </header>

        {/* KEY CAPABILITIES (H2) */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B2818] tracking-tight mb-4">
              Why Companies Choose Our Web Development Team
            </h2>
            <p className="text-[#4A3525] max-w-2xl mx-auto font-medium">
              Production-ready web solutions crafted to convert visitors into enterprise clients.
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

        {/* TECH STACK SECTION (H2) */}
        <section className="mb-20 text-center">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-8">
            Next-Gen Tech Stack We Utilize
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-[#EADCC6] text-[#3B2818] border border-[#D5C4A6]"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <ServiceFAQ faqs={faqs} title="Website Development FAQs" />

        {/* INTERNAL CROSS LINKS & CTA */}
        <section className="sand-dune-card p-10 sm:p-14 rounded-3xl text-center border-2 border-[#2E3B2B] bg-[#CFE3D2]/40 my-16">
          <h2 className="text-3xl font-extrabold text-[#3B2818] mb-4">
            Ready to Build Your Global Web Application?
          </h2>
          <p className="text-lg text-[#4A3525] max-w-2xl mx-auto mb-8 font-medium">
            Schedule a 30-minute discovery call with our senior staff software engineers to architect your web solution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="/#consultation"
              className="btn-sage-green py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              Schedule Discovery Call
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <Link
              href="/services/software-development"
              className="btn-warm-beige py-4 px-8 text-lg inline-flex items-center justify-center"
            >
              Explore Software Development
            </Link>
          </div>

          <div className="pt-6 border-t border-[#2E3B2B]/20 flex flex-wrap justify-center gap-4 text-xs font-bold text-[#2E3B2B]">
            <span>Related Services:</span>
            <Link href="/services/custom-software-development" className="hover:underline">Custom Software</Link> •
            <Link href="/services/ai-development" className="hover:underline">AI Development</Link> •
            <Link href="/services/mobile-app-development" className="hover:underline">Mobile Apps</Link> •
            <Link href="/services/ecommerce-development" className="hover:underline">Ecommerce</Link> •
            <Link href="/services/ui-ux-design" className="hover:underline">UI/UX Design</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
