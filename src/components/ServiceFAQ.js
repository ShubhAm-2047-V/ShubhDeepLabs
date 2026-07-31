"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StructuredData from "@/components/StructuredData";

export default function ServiceFAQ({ faqs = [], title = "Frequently Asked Questions" }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="my-16 max-w-4xl mx-auto">
      <StructuredData data={faqSchema} />
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#EADCC6] text-[#3B2818] border border-[#D5C4A6] mb-3">
          <HelpCircle className="w-4 h-4 mr-1.5 text-[#2E3B2B]" />
          FAQS & TRANSPARENCY
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B2818] tracking-tight">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="sand-dune-card rounded-2xl overflow-hidden transition-all border border-[#D5C4A6]"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-lg text-[#3B2818] hover:text-[#2E3B2B] transition-colors focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#3B2818] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 pt-1 text-[#4A3525] font-medium leading-relaxed border-t border-[#D5C4A6]/40 text-base">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
