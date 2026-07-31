import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight, Send } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ConsultationForm from "@/components/ConsultationForm";
import ServiceFAQ from "@/components/ServiceFAQ";

export const metadata = {
  title: "Contact Desk & Technical Consultation | ShubDeep Labs",
  description: "Get in touch with ShubDeep Labs senior software engineering desk. Book a free 30-minute discovery consultation, request a project quote, or inquire about technical services.",
  keywords: [
    "Contact ShubDeep Labs",
    "Software Consultation Desk",
    "Request Software Quote",
    "Book Engineering Call"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/contact",
  },
  openGraph: {
    title: "Contact Desk & Technical Consultation | ShubDeep Labs",
    description: "Connect directly with our software engineering team to discuss your web application, SaaS, or AI project.",
    url: "https://shubh-deep-labs.vercel.app/contact",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "Contact ShubDeep Labs" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Desk | ShubDeep Labs",
    description: "Schedule a discovery call or request a custom software development estimate.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ContactPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact Desk", href: "/contact" }
  ];

  const faqs = [
    { q: "How quickly do you respond to consultation requests?", a: "Our engineering desk responds to all inquiries within 2-4 business hours." },
    { q: "Can we sign a Non-Disclosure Agreement (NDA) before sharing specs?", a: "Yes. We strictly respect client confidentiality and are happy to execute standard NDAs prior to technical discovery." }
  ];

  return (
    <div className="sand-dune-theme sand-dune-gradient-bg min-h-screen py-28 px-4 sm:px-6 lg:px-8 text-[#3B2818]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold sage-badge mb-6">
            <Mail className="w-4 h-4 mr-2 text-[#2E3B2B]" />
            DIRECT ENGINEERING CONSULTATION DESK
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3B2818] tracking-tight leading-tight mb-6">
            Let’s Build Your Software <br className="hidden sm:inline" />
            <span className="text-[#2E3B2B] underline decoration-[#CFE3D2] decoration-4">Get In Touch Today</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A3525] font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Have a project scope, MVP blueprint, or software architecture question? Submit your details below to schedule a discovery call.
          </p>
        </header>

        <section className="mb-20">
          <ConsultationForm />
        </section>

        <ServiceFAQ faqs={faqs} title="Contact FAQs" />
      </div>
    </div>
  );
}
