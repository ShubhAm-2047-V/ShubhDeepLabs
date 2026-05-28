"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Database, ArrowRight, MessageSquare, Zap,
  FileText, ShieldCheck, BookOpen, Sparkles, Code
} from "lucide-react";

const BCA_MCA_PROJECTS = [
  {
    title: "Student Database Portal",
    tech: "HTML + CSS + PHP + MySQL",
    desc: "A neat administration console handling student details, course registration, automated roll calls, grade entry, and transcript reports generation.",
    price: "₹3999",
    accent: "#66BB6A",
    tags: ["CRUD", "PHP", "MySQL"],
  },
  {
    title: "Employee Payroll Desk",
    tech: "Java + Swing + MySQL",
    desc: "Desktop ERP system designed to calculate salary slips, record employee attendance logs, process leave applications, and print PDF salary sheets.",
    price: "₹3999",
    accent: "#42A5F5",
    tags: ["Desktop App", "Java", "PDF Slip"],
  },
  {
    title: "Online Book Store Desk",
    tech: "React + Node.js + Express + MongoDB",
    desc: "Interactive catalog page allowing search and cart operations, safe mock credit card checkouts, and an admin page to add or remove books.",
    price: "₹5499",
    accent: "#FFA726",
    tags: ["MERN Stack", "Cart System", "Database"],
  },
  {
    title: "Movie Ticket Reservation System",
    tech: "PHP + Bootstrap + MySQL",
    desc: "Visual seat picker desk. Logged-in members can pick available seats, check showtimes, make mock bookings, and download PDF tickets with QR codes.",
    price: "₹5499",
    accent: "#26A69A",
    tags: ["Seat Picker", "Bootstrap", "MySQL"],
  },
  {
    title: "Gym Membership Console",
    tech: "Python + Flask + SQLite",
    desc: "Gym desk system managing customer plans, active trainer schedules, automated payment alerts, and dynamic attendance sheet logs.",
    price: "₹3999",
    accent: "#AB47BC",
    tags: ["Flask", "SQLite", "Alerts"],
  },
  {
    title: "E-Commerce portal with Admin Panel",
    tech: "React + Firebase + Firestore",
    desc: "Full online store dashboard. Includes product categories, real-time cart counters, secure checkouts, and order-tracking charts.",
    price: "₹6999",
    accent: "#EF5350",
    tags: ["React", "Firebase Store", "Dashboard"],
  },
  {
    title: "College Alumni Directory",
    tech: "Next.js + Node.js + MongoDB",
    desc: "Alumni network search desk. Features secure email invites, interactive user bio profiles, jobs board posts, and batch directories.",
    price: "₹5499",
    accent: "#29B6F6",
    tags: ["Next.js", "Alumni System", "MongoDB"],
  },
  {
    title: "Patient Electronic Health Record",
    tech: "React + Node.js + MongoDB",
    desc: "Medical records platform. Doctors can enter diagnoses, patient members check active prescriptions, and download PDF clinical health cards.",
    price: "₹6999",
    accent: "#EF5350",
    tags: ["MERN Stack", "Healthcare", "Secure Auth"],
  },
];

const OFFERS = [
  {
    emoji: "📚",
    title: "Comprehensive Report Template",
    desc: "All BCA/MCA orders come with a completely formatted project report matching university specifications.",
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
    desc: "We provide expected viva questions and model answers sheet designed for BCA/MCA examiners.",
    badge: "STUDY GUIDE",
    badgeColor: "bg-[#42A5F5]",
  },
];

export default function BcaMcaPage() {
  const waUrl = `https://wa.me/919028833275?text=${encodeURIComponent("Hello! I'm a BCA/MCA student and want to discuss a final year database project with Shubdeep Labs.")}`;

  return (
    <div className="min-h-screen bg-[#FAF6EE] pb-24">

      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#F3E5F5] border-b-4 border-[#2C2C2C] pt-28 pb-16 px-4 sm:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-[#AB47BC] border-2 border-[#2C2C2C]" />
        <div className="absolute bottom-8 right-10 w-4 h-4 rounded-full bg-[#AB47BC] border-2 border-[#2C2C2C]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2C2C2C] shadow-[3px_3px_0_#2C2C2C] px-4 py-1.5 rounded-xl mb-6 rotate-[-1deg]">
            <Database className="w-4 h-4 text-[#2C2C2C]" />
            <span className="text-xs font-marker font-extrabold text-[#2C2C2C] uppercase tracking-wider">BCA / MCA Tiers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-marker font-black text-[#2C2C2C] leading-tight mb-4">
            BCA & MCA Projects<br />
            <span className="underline decoration-[#AB47BC] decoration-4">Starting at ₹3999</span>
          </h1>

          <p className="text-base sm:text-lg font-sans font-semibold text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed mb-8">
            Database-driven management portals, secure login grids, and visual control panel dashboards structured for BCA & MCA submissions.
            Codebase · System Flow charts · Dissertation Report · Setup guidance — all package-included.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2C2C2C] text-[#E1BEE7] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#E1BEE7] hover:shadow-[2px_3px_0_#E1BEE7] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              Order BCA/MCA Project
            </a>
            <Link
              href="/order?category=BCA-MCA"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2C2C2C] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#2C2C2C] hover:bg-[#F3E5F5] hover:shadow-[2px_3px_0_#2C2C2C] hover:translate-y-0.5 transition-all cursor-pointer"
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
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Special benefits designed specifically for BCA/MCA applicants</p>
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
            📚 BCA / MCA Project Catalogue
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Choose a certified database configuration or outline a custom specification</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {BCA_MCA_PROJECTS.map((proj, i) => (
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
                  <span className="font-marker font-extrabold text-[#2C2C2C] text-base">{proj.price}</span>
                  <a
                    href={`https://wa.me/919028833275?text=${encodeURIComponent(`Hello! I'm a BCA/MCA student interested in the "${proj.title}" database project. Please share details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-marker font-bold text-[#2C2C2C] bg-[#F3E5F5] border border-[#2C2C2C] px-2.5 py-1.5 rounded-lg shadow-[1.5px_2px_0_#2C2C2C] hover:bg-[#AB47BC] transition-all cursor-pointer"
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
        <div className="bg-[#2C2C2C] rounded-3xl p-8 sm:p-12 border-2 border-[#2C2C2C] shadow-[6px_8px_0_#AB47BC] text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block text-3xl mb-4">🗄️</span>
            <h2 className="text-2xl sm:text-3xl font-marker font-extrabold text-[#E1BEE7] mb-3">
              Need a Custom Database Project?
            </h2>
            <p className="text-sm font-sans text-[#A0A0A0] leading-relaxed max-w-lg mx-auto mb-8">
              We construct custom system platforms and secure administrative database desks designed precisely around your course parameters.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#AB47BC] text-[#2C2C2C] font-marker font-extrabold text-sm rounded-xl border-2 border-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                Discuss on WhatsApp
              </a>
              <Link
                href="/order?category=BCA-MCA"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-[#E1BEE7] font-marker font-extrabold text-sm rounded-xl border-2 border-[#AB47BC]/40 hover:border-[#AB47BC] hover:bg-white/5 transition-all cursor-pointer"
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
