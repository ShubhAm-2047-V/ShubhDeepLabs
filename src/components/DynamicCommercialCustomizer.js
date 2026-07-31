"use client";

import dynamic from "next/dynamic";

const CommercialCustomizer = dynamic(() => import("@/components/CommercialCustomizer"), { ssr: false });

export default function DynamicCommercialCustomizer(props) {
  return <CommercialCustomizer {...props} />;
}
