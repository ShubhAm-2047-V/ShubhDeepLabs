export const metadata = {
  title: "Full-Page AI Business Consultant | ShubDeep Labs AI Assistant",
  description: "Interactive AI Business Consultant for ShubDeep Labs. Get instant pricing estimates for custom website development, software engineering, mobile apps, and AI solutions.",
  keywords: [
    "AI Business Consultant",
    "Website Cost AI Assistant",
    "Software Development Quote AI",
    "ShubDeep Labs AI Chat"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/chat",
  },
  openGraph: {
    title: "Full-Page AI Business Consultant | ShubDeep Labs",
    description: "Instant AI business consultation for website, software, and AI engineering.",
    url: "https://shubh-deep-labs.vercel.app/chat",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "ShubDeep Labs AI Consultant" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Business Consultant | ShubDeep Labs",
    description: "Interactive AI project estimation and business consultation.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ChatLayout({ children }) {
  return children;
}
