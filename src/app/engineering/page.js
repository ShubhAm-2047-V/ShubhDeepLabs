"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code, ArrowRight, MessageSquare, Zap,
  FileText, ShieldCheck, BookOpen, Sparkles, Laptop
} from "lucide-react";

const ENGINEERING_PROJECTS = [
  {
    title: "Hospital Management Core Desk",
    tech: "React + Node.js + Express + MongoDB",
    desc: "A complete multi-role clinic desk. Patient appointment scheduler, doctor consultation records, medical history, dynamic billing module, and custom report export.",
    accent: "#66BB6A",
    tags: ["MERN Stack", "Role Auth", "Database Design"],
  },
  {
    title: "College ERP Portal",
    tech: "Next.js + Node.js + PostgreSQL",
    desc: "Comprehensive academic platform. Separate dashboards for Student, Faculty, and Admin. Handles attendance grids, fee tracking, assignment submission, and result generation.",
    accent: "#EF5350",
    tags: ["Next.js", "PostgreSQL", "Full Dashboard"],
  },
  {
    title: "Real-time Chat Portal",
    tech: "React + Firebase Auth + Firestore",
    desc: "Live messaging application with custom chatrooms, active status trackers, picture attachments, and secure Google/Email authentication.",
    accent: "#42A5F5",
    tags: ["Real-time", "Firebase", "Auth"],
  },
  {
    title: "E-Library Hub with Reader",
    tech: "Python + Django + SQLite",
    desc: "A robust digital library featuring book searches, automated return tracking, reservation notifications, and an integrated PDF reader module.",
    accent: "#AB47BC",
    tags: ["Django", "CRUD", "SQLite"],
  },
  {
    title: "Smart Parking Reservation System",
    tech: "HTML + CSS + PHP + MySQL",
    desc: "Web portal allowing users to view real-time parking slot availability, reserve a slot via automated token codes, and calculate billing based on usage hours.",
    accent: "#FFA726",
    tags: ["PHP", "Booking Logic", "MySQL"],
  },
  {
    title: "Automated Billing & Inventory Desk",
    tech: "Java + Swing + MySQL",
    desc: "Desktop ERP built for small-medium businesses. Includes low-stock alerts, supplier tracking, cash/card payment logs, and dynamic PDF receipt printing.",
    accent: "#26A69A",
    tags: ["Java Swing", "MySQL", "PDF Export"],
  },
  {
    title: "Secure Cloud File Vault",
    tech: "Python + Flask + Cryptography + MySQL",
    desc: "File storage system featuring secure user sign-ups, dual AES-256 encryption keys, automatic file-splitting, and safe share-link generations.",
    accent: "#EF5350",
    tags: ["Security", "Encryption", "Flask"],
  },
  {
    title: "Smart Travel Planner with Routes",
    tech: "React + Node.js + Mapbox API",
    desc: "Travel planner that dynamically maps multi-stop routes, calculates distance matrices, lets users plan itinerary lists, and estimates cost budgets.",
    accent: "#29B6F6",
    tags: ["Maps API", "React", "Node.js"],
  },
];

const OFFERS = [
  {
    emoji: "🎉",
    title: "First 10 Engineering Bookings — 20% OFF",
    desc: "Lock in your final-year project early and receive an exclusive price drop + deep-dive code explanation document.",
    badge: "LIMITED",
    badgeColor: "bg-[#EF5350]",
  },
  {
    emoji: "📄",
    title: "Complete Format Report & Synopsis",
    desc: "Syllabus-compliant, fully drafted project thesis and synopsis included. Ready to submit to your coordinator.",
    badge: "INCLUDED",
    badgeColor: "bg-[#66BB6A]",
  },
  {
    emoji: "⚡",
    title: "Standard 4–7 Day Delivery",
    desc: "We ensure all engineering logic is fully implemented, verified, and delivered on-time without delays.",
    badge: "TIMELY",
    badgeColor: "bg-[#42A5F5]",
  },
  {
    emoji: "🖥️",
    title: "Comprehensive Zoom Setup",
    desc: "We configure the backend server, install databases, and run the frontend interface live on your laptop.",
    badge: "COMPLIMENTARY",
    badgeColor: "bg-[#AB47BC]",
  },
];

export default function EngineeringPage() {
  const waUrl = `https://wa.me/919028833275?text=${encodeURIComponent("Hello! I'm an Engineering student and want to discuss a custom project with Shubdeep Labs.")}`;

  return (
    <div className="min-h-screen bg-[#FAF6EE] pb-24">

      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#E8F5E9] border-b-4 border-[#2C2C2C] pt-28 pb-16 px-4 sm:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-[#66BB6A] border-2 border-[#2C2C2C]" />
        <div className="absolute bottom-8 right-10 w-4 h-4 rounded-full bg-[#66BB6A] border-2 border-[#2C2C2C]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2C2C2C] shadow-[3px_3px_0_#2C2C2C] px-4 py-1.5 rounded-xl mb-6 rotate-[-1deg]">
            <Code className="w-4 h-4 text-[#2C2C2C]" />
            <span className="text-xs font-marker font-extrabold text-[#2C2C2C] uppercase tracking-wider">Engineering Level Projects</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-marker font-black text-[#2C2C2C] leading-tight mb-4">
            B.E. / B.Tech Projects<br />
            <span className="underline decoration-[#66BB6A] decoration-4">Starting at ₹4999</span>
          </h1>

          <p className="text-base sm:text-lg font-sans font-semibold text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed mb-8">
            High-fidelity codebases, normalized databases, and robust full-stack architectures built for engineering submissions.
            Source code · SRS documentation · PPT slides · Dynamic installations — all included.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2C2C2C] text-[#C8E6C9] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#C8E6C9] hover:shadow-[2px_3px_0_#C8E6C9] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              Order B.Tech Project
            </a>
            <Link
              href="/order?category=Engineering"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2C2C2C] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#2C2C2C] hover:bg-[#E8F5E9] hover:shadow-[2px_3px_0_#2C2C2C] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              Customise My Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {["✓ Enterprise Stack", "✓ Complete Report & PPT", "✓ Deep Code Walkthrough", "✓ Remote Setup Support", "✓ Plagiarism-free"].map(a => (
              <span key={a} className="text-xs font-marker font-bold text-[#2C2C2C] bg-white border border-[#2C2C2C]/30 px-3 py-1 rounded-full">
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFERS ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-marker font-extrabold text-[#2C2C2C] inline-block">
            🔥 Exclusive Engineering Offers
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Premium perks engineered for B.E. / B.Tech students</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {OFFERS.map((offer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 bg-white border-2 border-[#2C2C2C] rounded-2xl p-5 shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all"
            >
              <span className="text-3xl shrink-0">{offer.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[9px] font-black text-white px-2 py-0.5 rounded uppercase tracking-wider ${offer.badgeColor}`}>
                    {offer.badge}
                  </span>
                  <h3 className="font-marker font-extrabold text-[#2C2C2C] text-sm">{offer.title}</h3>
                </div>
                <p className="text-xs font-sans text-[#6A6A6A] leading-relaxed">{offer.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROJECT CATALOGUE ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-marker font-extrabold text-[#2C2C2C]">
            📚 B.E. / B.Tech Projects Catalogue
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Select a verified project configuration or describe your own unique setup</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ENGINEERING_PROJECTS.map((proj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border-2 border-[#2C2C2C] rounded-2xl overflow-hidden shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="h-2 w-full" style={{ backgroundColor: proj.accent }} />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1 mb-3">
                  {proj.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-marker font-bold bg-[#FAF6EE] border border-[#2C2C2C]/20 text-[#6A6A6A] px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-marker font-extrabold text-[#2C2C2C] text-sm leading-tight mb-2">
                  {proj.title}
                </h3>

                <p className="text-[11px] font-marker font-bold text-[#6A6A6A] mb-2">{proj.tech}</p>

                <p className="text-xs font-sans text-[#5A5A5A] leading-relaxed flex-1 mb-4">
                  {proj.desc}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#2C2C2C]/10">
                  <span className="font-marker font-extrabold text-[#2C2C2C] text-base">₹4999</span>
                  <a
                    href={`https://wa.me/919028833275?text=${encodeURIComponent(`Hello! I'm a B.Tech student interested in the "${proj.title}" project. Please share details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-marker font-bold text-[#2C2C2C] bg-[#E8F5E9] border border-[#2C2C2C] px-2.5 py-1.5 rounded-lg shadow-[1.5px_2px_0_#2C2C2C] hover:bg-[#66BB6A] transition-all cursor-pointer"
                  >
                    Get This <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ── CUSTOM ORDER SECTION ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
        <div className="bg-[#2C2C2C] rounded-3xl p-8 sm:p-12 border-2 border-[#2C2C2C] shadow-[6px_8px_0_#66BB6A] text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block text-3xl mb-4">🛠️</span>
            <h2 className="text-2xl sm:text-3xl font-marker font-extrabold text-[#C8E6C9] mb-3">
              Need a Custom B.Tech Project?
            </h2>
            <p className="text-sm font-sans text-[#A0A0A0] leading-relaxed max-w-lg mx-auto mb-8">
              We design and construct <strong className="text-white">original full-stack applications</strong> based entirely on your college requirements, specific API integrations, database models, and deadlines.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#66BB6A] text-[#2C2C2C] font-marker font-extrabold text-sm rounded-xl border-2 border-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                Discuss on WhatsApp
              </a>
              <Link
                href="/order?category=Engineering"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-[#C8E6C9] font-marker font-extrabold text-sm rounded-xl border-2 border-[#66BB6A]/40 hover:border-[#66BB6A] hover:bg-white/5 transition-all cursor-pointer"
              >
                Fill Custom Request
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 pb-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-marker font-extrabold text-[#2C2C2C]">Included in Every Engineering Project</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: Code, label: "Full Codebase" },
            { icon: FileText, label: "Detailed Report" },
            { icon: BookOpen, label: "PPT Presentation" },
            { icon: ShieldCheck, label: "Viva Guidance" },
            { icon: Zap, label: "Remote Installation" },
            { icon: Sparkles, label: "1-on-1 Walkthrough" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 bg-white border-2 border-[#2C2C2C] rounded-xl p-4 shadow-[2px_3px_0_#2C2C2C] text-center">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border-2 border-[#2C2C2C] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#2C2C2C]" />
              </div>
              <span className="text-[10px] font-marker font-extrabold text-[#2C2C2C] leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
