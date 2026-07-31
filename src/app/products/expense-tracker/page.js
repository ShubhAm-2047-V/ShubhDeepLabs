import ExpenseTracker from "@/app/expense-tracker/page";

export const metadata = {
  title: "AI Expense Tracker | Financial Insights | ShubDeep Labs Product",
  description: "AI-driven financial management and expense tracking software product engineered by ShubDeep Labs. Features real-time budget pacing and AI financial health reports.",
  keywords: [
    "AI Expense Tracker Product",
    "Financial AI Software",
    "Budget Pacing App",
    "Expense Insights AI"
  ],
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app/products/expense-tracker",
  },
  openGraph: {
    title: "AI Expense Tracker | ShubDeep Labs Software Product",
    description: "Real-time AI financial tracking, budget pacing analysis, and category spending reports.",
    url: "https://shubh-deep-labs.vercel.app/products/expense-tracker",
    siteName: "ShubDeep Labs",
    images: [{ url: "https://shubh-deep-labs.vercel.app/logo.jpg", width: 800, height: 800, alt: "AI Expense Tracker Product" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Expense Tracker | ShubDeep Labs Product",
    description: "Financial analytics and AI-powered expense tracking software.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

export default function ProductsExpenseTrackerPage() {
  return <ExpenseTracker />;
}
