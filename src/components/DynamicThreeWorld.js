"use client";

import dynamic from "next/dynamic";

const ThreeWorld = dynamic(() => import("@/components/ThreeWorld"), { ssr: false });

export default function DynamicThreeWorld(props) {
  return <ThreeWorld {...props} />;
}
