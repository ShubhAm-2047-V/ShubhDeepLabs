"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Briefcase, Code, Rocket, ShieldCheck, Zap, Globe, Server, CheckSquare, Star } from "lucide-react";
import ThreeWorld from "@/components/ThreeWorld";

export default function CommercialPage() {
  const commercialFeatures = [
    { title: "Enterprise Architecture", desc: "Scalable microservices and monolithic architectures built for high availability and performance.", icon: Server, color: "marker-blue", border: "border-t-[#42A5F5]" },
    { title: "Bank-Grade Security", desc: "Implementation of advanced encryption, secure authentication (OAuth/JWT), and strict role-based access.", icon: ShieldCheck, color: "marker-red", border: "border-t-[#EF5350]" },
    { title: "Lightning Fast Performance", desc: "Optimized queries, CDN integrations, and advanced caching layers (Redis/Memcached).", icon: Zap, color: "marker-yellow", border: "border-t-[#FFCA28]" },
    { title: "Global Scale", desc: "Cloud-native deployments on AWS/GCP/Azure with auto-scaling capabilities.", icon: Globe, color: "marker-green", border: "border-t-[#66BB6A]" }
  ];

  return (
    <div className="space-y-24 pb-20 relative overflow-hidden bg-transparent">
      <ThreeWorld />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-[70vh] flex items-center justify-center pt-28 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ruled-paper absolute bottom-0 left-0 right-0 h-[22vh] opacity-40 pointer-events-none" />

        <div className="text-center relative z-10 w-full max-w-4xl mx-auto">
          
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-sm font-marker bg-[#C8E6C9] border-2.5 border-[#2C2C2C] shadow-[2.5px_3.0px_0px_#2C2C2C] rotate-[1.5deg] mb-8">
            <Briefcase className="w-4.5 h-4.5 mr-1.5 text-[#2C2C2C]" />
            SHUBDEEP LABS COMMERCIAL
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-marker font-black text-[#2C2C2C] leading-tight mb-6">
            <span className="underline decoration-[#A5D6A7] decoration-4">Enterprise-Grade</span> Solutions for Real Businesses
          </h1>
          
          <p className="text-lg sm:text-xl text-[#5A5A5A] leading-relaxed font-sans font-semibold mb-10 max-w-2xl mx-auto">
            From MVPs to complex SaaS platforms, we build robust, scalable, and secure applications that drive business growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/order"
              className="btn-sketch text-lg py-4 px-8 inline-flex items-center justify-center w-full sm:w-auto"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 paper-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-hand font-extrabold text-[#2C2C2C] underline decoration-[#90CAF9] decoration-4">
              Why Choose Our Commercial Solutions?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commercialFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className={`sketch-card p-6 bg-white relative overflow-hidden group border-t-[6px] ${feature.border}`}>
                  <div className="absolute top-2.5 left-2.5 w-3 h-3 bg-[#FAF6EE] border border-[#2C2C2C] rounded-full" />
                  <div className="w-12 h-12 rounded-xl bg-[#E3F2FD] border-2.5 border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center mb-5 shadow-[3px_3px_0_#2C2C2C] group-hover:rotate-[6deg] transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] mb-2 tracking-wide">
                    <span className={`${feature.color} px-1.5`}>{feature.title}</span>
                  </h3>
                  <p className="text-sm font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Showcase */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="sketch-border bg-[#FFF9C4] p-8 sm:p-12 shadow-[6px_8px_0px_#2C2C2C] rotate-[-0.5deg]">
          <h2 className="text-3xl font-hand font-extrabold text-[#2C2C2C] mb-6 text-center">
            Ready to scale your business?
          </h2>
          <p className="text-center text-[#5A5A5A] font-sans font-semibold mb-8 max-w-2xl mx-auto">
            We act as your extended tech team. No freelance drama, just clean code, transparent timelines, and measurable results.
          </p>
          <div className="flex justify-center">
            <Link
              href="/order"
              className="btn-sketch py-3 px-8 text-lg inline-flex items-center justify-center"
            >
              Get a Free Consultation
              <Rocket className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
