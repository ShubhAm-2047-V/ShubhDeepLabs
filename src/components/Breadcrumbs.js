import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import StructuredData from "@/components/StructuredData";

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href.startsWith("http") ? item.href : `https://shubh-deep-labs.vercel.app${item.href}`
    }))
  };

  return (
    <>
      <StructuredData data={breadcrumbListSchema} />
      <nav aria-label="Breadcrumb" className="mb-6 inline-block">
        <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-hand font-bold bg-[#FAF6EE] px-3.5 py-1.5 rounded-full border-1.5 border-[#2C2C2C] shadow-[2px_2px_0_#2C2C2C]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center space-x-1.5">
                {index === 0 ? (
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-[#3B2818] hover:text-[#2E3B2B] hover:underline"
                  >
                    <Home className="w-3.5 h-3.5 mr-1 text-[#2E3B2B]" />
                    <span>{item.label}</span>
                  </Link>
                ) : isLast ? (
                  <span className="text-[#6A6A6A] font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-[#3B2818] hover:text-[#2E3B2B] hover:underline"
                  >
                    {item.label}
                  </Link>
                )}
                {!isLast && <ChevronRight className="w-3.5 h-3.5 text-[#2C2C2C]" />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
