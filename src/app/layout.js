import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import VisitorPromoWidget from "@/components/VisitorPromoWidget";
import ProductCustomizer from "@/components/ProductCustomizer";
import CursorGlow from "@/components/CursorGlow";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shubdeep Labs | Building Intelligent Solutions",
  description: "Get high-quality hand-drawn custom academic projects with 100% original code, PPT presentation slides, comprehensive thesis reports, and mock viva tutoring. Specially made for Diploma and Engineering final year submissions.",
  keywords: ["academic projects", "diploma final year projects", "engineering projects", "final year projects", "MCA projects", "AI projects", "web development projects", "coding guidance"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] flex flex-col transition-colors duration-200 overflow-x-hidden antialiased">
        <ThemeProvider>
          {/* Pencil dynamic highlight tracking */}
          <CursorGlow />
          
          {/* Sketchy navigation */}
          <Navbar />
          
          {/* Main viewport */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Sketchy cardboard footer */}
          <Footer />
          
          {/* ── Unified FAB column (bottom-right) ── */}
          {/* Order: Customizer (top) → WhatsApp (bottom) */}
          <div className="fixed bottom-6 right-4 sm:right-6 z-[100] flex flex-col items-end gap-3">
            {/* Customiser widget */}
            <ProductCustomizer />

            {/* WhatsApp direct contact */}
            <WhatsAppButton />
          </div>

          {/* Welcome Offer Promo Modal Pop-up */}
          <VisitorPromoWidget />
          
          {/* Custom handwritten toaster notification */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: "sketch-card text-[#2C2C2C] border-2 border-[#2C2C2C] bg-[#FAF6EE] rounded-xl font-hand text-sm",
              duration: 4000
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
