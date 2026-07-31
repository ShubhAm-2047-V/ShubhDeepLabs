import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SupportChatbotWidget from "@/components/SupportChatbotWidget";
import ProductCustomizer from "@/components/ProductCustomizer";
import CursorGlow from "@/components/CursorGlow";
import StructuredData from "@/components/StructuredData";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://shubh-deep-labs.vercel.app"),
  title: {
    default: "ShubDeep Labs | Global Software Development & Custom AI Engineering Company",
    template: "%s | ShubDeep Labs"
  },
  description: "ShubDeep Labs is a premier global software development company delivering custom web applications, enterprise SaaS platforms, AI solutions, mobile apps, and cloud engineering for startups, enterprises, and international clients.",
  keywords: [
    "Software Development Company",
    "Website Development",
    "Custom Software Development",
    "AI Development Company",
    "Mobile App Development",
    "Ecommerce Development",
    "UI/UX Design Services",
    "Web Design Agency",
    "Enterprise Software Engineering",
    "SaaS Platform Development"
  ],
  authors: [{ name: "ShubDeep Labs", url: "https://shubh-deep-labs.vercel.app" }],
  creator: "ShubDeep Labs",
  publisher: "ShubDeep Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "fZFmrDrF1HxRz2XF_EMLx_i1AmUSVbxFYD328XLjhck",
  },
  alternates: {
    canonical: "https://shubh-deep-labs.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "ShubDeep Labs | Global Software Development & Custom AI Engineering Company",
    description: "ShubDeep Labs is a premier global software development company delivering custom web applications, enterprise SaaS platforms, AI solutions, mobile apps, and cloud engineering.",
    url: "https://shubh-deep-labs.vercel.app",
    siteName: "ShubDeep Labs",
    images: [
      {
        url: "https://shubh-deep-labs.vercel.app/logo.jpg",
        width: 800,
        height: 800,
        alt: "ShubDeep Labs - Global Software Development Company Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShubDeep Labs | Global Software Development & Custom AI Engineering Company",
    description: "ShubDeep Labs is a premier global software development company delivering custom web applications, enterprise SaaS platforms, AI solutions, mobile apps, and cloud engineering.",
    images: ["https://shubh-deep-labs.vercel.app/logo.jpg"],
  },
};

const globalSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://shubh-deep-labs.vercel.app/#organization",
    "name": "ShubDeep Labs",
    "url": "https://shubh-deep-labs.vercel.app",
    "logo": "https://shubh-deep-labs.vercel.app/logo.jpg",
    "description": "Global software development company delivering high-performance custom web applications, enterprise SaaS, AI solutions, and mobile app development.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9028833275",
      "contactType": "customer service",
      "email": "shubdeeplabs@gmail.com",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://github.com/ShubhAm-2047-V",
      "https://shub-deep-dev.vercel.app/"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://shubh-deep-labs.vercel.app/#service",
    "name": "ShubDeep Labs Software Engineering & AI Solutions",
    "image": "https://shubh-deep-labs.vercel.app/logo.jpg",
    "url": "https://shubh-deep-labs.vercel.app",
    "telephone": "+91-9028833275",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Solapur",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.6599,
      "longitude": 75.9064
    },
    "areaServed": "Worldwide",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://shubh-deep-labs.vercel.app/#website",
    "url": "https://shubh-deep-labs.vercel.app",
    "name": "ShubDeep Labs",
    "publisher": {
      "@id": "https://shubh-deep-labs.vercel.app/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://shubh-deep-labs.vercel.app/services/software-development?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
];

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] flex flex-col transition-colors duration-200 overflow-x-hidden antialiased">
        <StructuredData data={globalSchemas} />
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
          {/* Order: Customizer (top) → Chatbot (middle) → WhatsApp (bottom) */}
          <div className="fixed bottom-6 right-4 sm:right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none [&>*]:pointer-events-auto no-print">
            {/* Customiser widget */}
            <div className="flex flex-col items-end">
              <ProductCustomizer />
            </div>

            {/* AI support chatbot widget */}
            <div className="flex flex-col items-end">
              <SupportChatbotWidget />
            </div>

            {/* WhatsApp direct contact */}
            <div className="flex flex-col items-end">
              <WhatsAppButton />
            </div>
          </div>
          
          {/* Custom handwritten toaster notification */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: "sketch-card text-[#2C2C2C] border-2 border-[#2C2C2C] bg-[#FAF6EE] rounded-xl font-hand text-sm",
              duration: 4000
            }}
          />
        </ThemeProvider>
        <GoogleAnalytics gaId="G-MK3YY3EFX7" />
      </body>
    </html>
  );
}
