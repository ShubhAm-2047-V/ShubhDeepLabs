"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe, ArrowRight, MessageSquare, Zap,
  FileText, ShieldCheck, BookOpen, Sparkles, Code
} from "lucide-react";

const WEB_DEV_PROJECTS = [
  {
    title: "Personal Portfolio Website",
    tech: "React + Next.js + CSS",
    desc: "A stunning portfolio page featuring clean dark mode toggle, fully responsive biography timelines, custom contact forms, and animated work showcase grids.",
    price: "₹3999",
    accent: "#66BB6A",
    tags: ["Next.js", "Portfolio", "Tailwind"],
  },
  {
    title: "Task Management Board",
    tech: "React + Tailwind CSS + LocalStorage",
    desc: "Interactive kanban workspace boards with drag-and-drop columns, task classification labels, search filter bars, and custom task due date timers.",
    price: "₹3999",
    accent: "#42A5F5",
    tags: ["React", "Kanban Board", "LocalStorage"],
  },
  {
    title: "Blogging Platform with Markdown",
    tech: "Node.js + Express + EJS + MongoDB",
    desc: "A robust blog dashboard where authors write posts in markdown. Includes automated image resizing, tags categorization, and secure admin control desks.",
    price: "₹5499",
    accent: "#FFA726",
    tags: ["Markdown Editor", "Blog System", "Express"],
  },
  {
    title: "Weather Forecasting Dashboard",
    tech: "JavaScript + HTML + OpenWeather API",
    desc: "Real-time geographical search showing weather metrics, dynamic hourly temperature forecast graphs, humidity gauges, and beautiful sunset alerts.",
    price: "₹5499",
    accent: "#26A69A",
    tags: ["API Integration", "Graphs Chart", "Weather"],
  },
  {
    title: "Recipe Finder Hub",
    tech: "React + Node.js + Express + SQLite",
    desc: "Search thousands of meals, filter by caloric budgets or specific ingredients, save favorite catalogs, and generate dynamic shopping lists.",
    price: "₹3999",
    accent: "#AB47BC",
    tags: ["SQLite", "Recipe API", "React"],
  },
  {
    title: "Full-stack E-Commerce Portal",
    tech: "React + Node.js + Express + MongoDB",
    desc: "Full online marketplace. Features product catalogs, persistent shopping cart counters, secure checkouts, and order tracking administrative charts.",
    price: "₹6999",
    accent: "#EF5350",
    tags: ["MERN Stack", "E-Commerce", "Admin Panel"],
  },
  {
    title: "College Event Management Portal",
    tech: "Next.js + Node.js + MongoDB",
    desc: "Academic reservation desk. Features dynamic registration forms, custom email tickets containing PDF QR codes, and dashboard counters.",
    price: "₹5499",
    accent: "#29B6F6",
    tags: ["Event Reg", "Next.js", "MongoDB"],
  },
  {
    title: "Real-time Collaborative Doc Editor",
    tech: "React + Node.js + Socket.io + Express",
    desc: "Live shared editing console. Multiple members type in document grids concurrently with dynamic active cursor alerts and auto-save databases.",
    price: "₹6999",
    accent: "#EF5350",
    tags: ["Socket.io", "Real-time", "MERN"],
  },
];

const OFFERS = [
  {
    emoji: "📚",
    title: "Comprehensive Report Template",
    desc: "All Web orders come with a completely formatted project report matching university specifications.",
    badge: "FREE",
    badgeColor: "bg-[#66BB6A]",
  },
  {
    emoji: "⚡",
    title: "Priority 3-Day Delivery option",
    desc: "Get your database setup, system flow charts, and clean code ahead of deadline stress.",
    badge: "URGENT",
    badgeColor: "bg-[#FFA726]",
  },
  {
    emoji: "🖥️",
    title: "Zoom Installation Support",
    desc: "We perform full server and database setups on your PC via Zoom or AnyDesk at no extra cost.",
    badge: "FREE SETUP",
    badgeColor: "bg-[#AB47BC]",
  },
  {
    emoji: "🎓",
    title: "Complete Viva prep notes",
    desc: "We provide expected viva questions and model answers sheet designed for web engineering examiners.",
    badge: "STUDY GUIDE",
    badgeColor: "bg-[#42A5F5]",
  },
];

export default function WebDevPage() {
  const waUrl = `https://wa.me/919028833275?text=${encodeURIComponent("Hello! I'm a student interested in a Web Development project with Shubdeep Labs.")}`;

  return (
    <div className="min-h-screen bg-[#FAF6EE] pb-24">

      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#FFF3E0] border-b-4 border-[#2C2C2C] pt-28 pb-16 px-4 sm:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-[#FFA726] border-2 border-[#2C2C2C]" />
        <div className="absolute bottom-8 right-10 w-4 h-4 rounded-full bg-[#FFA726] border-2 border-[#2C2C2C]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2C2C2C] shadow-[3px_3px_0_#2C2C2C] px-4 py-1.5 rounded-xl mb-6 rotate-[-1deg]">
            <Globe className="w-4 h-4 text-[#2C2C2C]" />
            <span className="text-xs font-marker font-extrabold text-[#2C2C2C] uppercase tracking-wider">Web Projects Tiers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-marker font-black text-[#2C2C2C] leading-tight mb-4">
            Web Development Projects<br />
            <span className="underline decoration-[#FFA726] decoration-4">Starting at ₹3999</span>
          </h1>

          <p className="text-base sm:text-lg font-sans font-semibold text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed mb-8">
            Stunning responsive portals, custom dashboards, single page interfaces, and rich administrative panels built with clean, premium codebases.
            Dissertation Report · PPT Presentation · Remote Setup guidance — all package-included.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2C2C2C] text-[#FFE0B2] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#FFE0B2] hover:shadow-[2px_3px_0_#FFE0B2] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              Order Web Project
            </a>
            <Link
              href="/order?category=Web-Dev"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2C2C2C] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#2C2C2C] hover:bg-[#FFF3E0] hover:shadow-[2px_3px_0_#2C2C2C] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              Customise My Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFERS ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-marker font-extrabold text-[#2C2C2C] inline-block">
            🔥 Exclusive Student Offers
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Special benefits designed specifically for Web Development applicants</p>
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
            📚 Web Projects Catalogue
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Choose a certified database configuration or outline a custom specification</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {WEB_DEV_PROJECTS.map((proj, i) => (
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
                  <span className="font-marker font-extrabold text-[#2C2C2C] text-base">Approx. {proj.price}</span>
                  <a
                    href={`https://wa.me/919028833275?text=${encodeURIComponent(`Hello! I'm a student interested in the "${proj.title}" web project. Please share details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-marker font-bold text-[#2C2C2C] bg-[#FFF3E0] border border-[#2C2C2C] px-2.5 py-1.5 rounded-lg shadow-[1.5px_2px_0_#2C2C2C] hover:bg-[#FFA726] transition-all cursor-pointer"
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
        <div className="bg-[#2C2C2C] rounded-3xl p-8 sm:p-12 border-2 border-[#2C2C2C] shadow-[6px_8px_0_#FFA726] text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block text-3xl mb-4">🌐</span>
            <h2 className="text-2xl sm:text-3xl font-marker font-extrabold text-[#FFE0B2] mb-3">
              Need a Custom Web Application?
            </h2>
            <p className="text-sm font-sans text-[#A0A0A0] leading-relaxed max-w-lg mx-auto mb-8">
              We construct custom full-stack solutions and responsive dashboard desks designed precisely around your course parameters.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFA726] text-[#2C2C2C] font-marker font-extrabold text-sm rounded-xl border-2 border-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                Discuss on WhatsApp
              </a>
              <Link
                href="/order?category=Web-Dev"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-[#FFE0B2] font-marker font-extrabold text-sm rounded-xl border-2 border-[#FFA726]/40 hover:border-[#FFA726] hover:bg-white/5 transition-all cursor-pointer"
              >
                Custom Request Form
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
