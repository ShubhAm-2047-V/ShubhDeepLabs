import ChatbotWorkspace from "@/app/chatbot/page";

export const metadata = {
  title: "AI Support Chatbot Engine | Customer Service AI | ShubDeep Labs Product",
  description: "Intelligent conversational support chatbot engine software product engineered by ShubDeep Labs. Handles customer service inquiries, custom RAG search, and automated lead capture.",
  keywords: [
    "AI Support Chatbot Product",
    "Customer Service AI Engine",
    "Lead Capture Chatbot",
    "Enterprise AI Assistant"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/products/chatbot",
  },
  openGraph: {
    title: "AI Support Chatbot Engine | ShubDeep Labs Software Product",
    description: "Enterprise conversational AI chatbot engine trained on custom business knowledge bases.",
    url: "https://shubh-deep-labs.vercel.app/products/chatbot",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "AI Support Chatbot Engine Product" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Support Chatbot Engine Product | ShubDeep Labs",
    description: "Conversational AI chatbot software product for business customer service.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ProductsChatbotPage() {
  return <ChatbotWorkspace />;
}
