import NotesSummarizer from "@/app/notes-summarizer/page";

export const metadata = {
  title: "Smart Notes Summarizer | Document NLP AI | ShubDeep Labs Product",
  description: "Automated document indexing and smart text summarizer AI software product engineered by ShubDeep Labs. Generates key concept summaries and study flashcards.",
  keywords: [
    "Notes Summarizer Product",
    "NLP Document AI Software",
    "Text Summarizer AI",
    "Study Flashcard AI Generator"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/products/notes-summarizer",
  },
  openGraph: {
    title: "Smart Notes Summarizer | ShubDeep Labs Software Product",
    description: "Automated document NLP summarizer and study concept flashcard generator.",
    url: "https://shubh-deep-labs.vercel.app/products/notes-summarizer",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "Smart Notes Summarizer Product" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Notes Summarizer Product | ShubDeep Labs",
    description: "AI document indexing and automated study text summarization product.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ProductsNotesSummarizerPage() {
  return <NotesSummarizer />;
}
