export const metadata = {
  title: "Enterprise Business Documents & Capabilities Hub | ShubDeep Labs",
  description: "Access and download ShubDeep Labs enterprise software business documents, capability statements, service catalogues, proposal templates, and security guidelines.",
  keywords: [
    "Company Profile PDF",
    "Software Capability Statement",
    "Service Catalogue PDF",
    "Client Proposal Template",
    "Security & OWASP Overview"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/documents",
  },
  openGraph: {
    title: "Enterprise Business Documents Hub | ShubDeep Labs",
    description: "Official enterprise business documents, SLA guides, capability statements, and technical brochures.",
    url: "https://shubh-deep-labs.vercel.app/documents",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs Documents Hub" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Documents & Capability Statement | ShubDeep Labs",
    description: "Enterprise PDF templates, technical brochures, and SLA guides for procurement.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function DocumentsLayout({ children }) {
  return children;
}
