"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop, ArrowRight, MessageSquare, Zap,
  FileText, ShieldCheck, BookOpen, Sparkles, Code
} from "lucide-react";

const DIPLOMA_PROJECTS = [
  {
    title: "Student Result Management System",
    tech: "Python + Flask + MySQL",
    desc: "A complete grade management portal where teachers can enter marks, generate result sheets, and students can view results with a login dashboard.",
    difficulty: "Easy",
    price: "₹1999",
    color: "bg-[#E8F5E9]",
    accent: "#66BB6A",
    tags: ["Database", "Login System", "Reports"],
  },
  {
    title: "Library Management System",
    tech: "HTML + CSS + JavaScript + PHP",
    desc: "Issue/return book management, member registration, overdue fine calculation, and admin dashboard. Perfect for CS diploma final year.",
    difficulty: "Easy",
    price: "₹1999",
    color: "bg-[#FFF9C4]",
    accent: "#FFCA28",
    tags: ["Admin Panel", "CRUD", "PHP"],
  },
  {
    title: "Online Voting System",
    tech: "React + Node.js + MongoDB",
    desc: "Secure college election portal with voter login, real-time vote counting, result announcement, and admin management console.",
    difficulty: "Medium",
    price: "₹3499",
    color: "bg-[#E3F2FD]",
    accent: "#42A5F5",
    tags: ["Auth", "Real-time", "MongoDB"],
  },
  {
    title: "AI Image Classifier Website",
    tech: "Python + TensorFlow + Flask",
    desc: "Upload an image and the AI classifies it using a trained ML model. Includes model accuracy metrics, history log, and a clean UI.",
    difficulty: "Medium",
    price: "₹3499",
    color: "bg-[#FCE4EC]",
    accent: "#EF5350",
    tags: ["AI/ML", "TensorFlow", "Flask"],
  },
  {
    title: "Inventory Management System",
    tech: "Java + MySQL + Swing",
    desc: "Desktop application for stock tracking, supplier management, low-stock alerts, and PDF invoice generation. Ideal for commerce diploma.",
    difficulty: "Easy",
    price: "₹1999",
    color: "bg-[#F3E5F5]",
    accent: "#AB47BC",
    tags: ["Desktop App", "Java", "PDF"],
  },
  {
    title: "Face Recognition Attendance",
    tech: "Python + OpenCV + SQLite",
    desc: "Real-time webcam face detection marks attendance automatically, exports CSV reports, and shows a daily summary on the dashboard.",
    difficulty: "Hard",
    price: "₹4599",
    color: "bg-[#FFF3E0]",
    accent: "#FFA726",
    tags: ["OpenCV", "AI", "CSV Export"],
  },
  {
    title: "Hospital Appointment System",
    tech: "PHP + MySQL + Bootstrap",
    desc: "Patient registration, doctor appointment booking, prescription records, and billing module. Clean responsive UI for diploma CS/IT.",
    difficulty: "Medium",
    price: "₹3499",
    color: "bg-[#E8F5E9]",
    accent: "#66BB6A",
    tags: ["Healthcare", "Bootstrap", "PHP"],
  },
  {
    title: "E-Commerce Mini Store",
    tech: "React + Firebase + Stripe",
    desc: "Product listing, cart, user authentication, and order tracking. Includes admin panel for product management and order status updates.",
    difficulty: "Hard",
    price: "₹4599",
    color: "bg-[#E1F5FE]",
    accent: "#29B6F6",
    tags: ["Firebase", "Auth", "Payments"],
  },
];

const OFFERS = [
  {
    emoji: "🎁",
    title: "First 8 Diploma Students — 30% OFF!",
    desc: "Reserve your spot early and get a massive discount + a free PPT template worth ₹499.",
    badge: "LIMITED",
    badgeColor: "bg-[#EF5350]",
  },
  {
    emoji: "📄",
    title: "Free Thesis Report with Any Order",
    desc: "All diploma projects come with a fully formatted thesis report at no extra cost.",
    badge: "FREE",
    badgeColor: "bg-[#66BB6A]",
  },
  {
    emoji: "⚡",
    title: "Urgent 1–3 Day Delivery Available",
    desc: "Exam tomorrow? We've got you covered with priority delivery for diploma-level projects.",
    badge: "URGENT",
    badgeColor: "bg-[#FFA726]",
  },
  {
    emoji: "🖥️",
    title: "Free Remote Setup on Zoom",
    desc: "We'll set up the full project on your laptop via Zoom — no extra charge for diploma students.",
    badge: "BONUS",
    badgeColor: "bg-[#AB47BC]",
  },
];

const difficultyColor = {
  Easy: "bg-[#E8F5E9] text-[#2E7D32] border-[#66BB6A]",
  Medium: "bg-[#FFF9C4] text-[#F57F17] border-[#FFCA28]",
  Hard: "bg-[#FFEBEE] text-[#B71C1C] border-[#EF5350]",
};

export default function DiplomaPage() {
  const waUrl = `https://wa.me/919028833275?text=${encodeURIComponent("Hello! I'm a Diploma student and want to discuss a custom project with Shubdeep Labs.")}`;

  return (
    <div className="min-h-screen bg-[#FAF6EE] pb-24">

      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#FFF9C4] border-b-4 border-[#2C2C2C] pt-28 pb-16 px-4 sm:px-8 overflow-hidden">
        {/* Decorative dots */}
        <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-[#FFCA28] border-2 border-[#2C2C2C]" />
        <div className="absolute top-10 left-14 w-2 h-2 rounded-full bg-[#2C2C2C]" />
        <div className="absolute bottom-8 right-10 w-4 h-4 rounded-full bg-[#FFCA28] border-2 border-[#2C2C2C]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2C2C2C] shadow-[3px_3px_0_#2C2C2C] px-4 py-1.5 rounded-xl mb-6 rotate-[-1deg]">
            <Laptop className="w-4 h-4 text-[#2C2C2C]" />
            <span className="text-xs font-marker font-extrabold text-[#2C2C2C] uppercase tracking-wider">Diploma Level Projects</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-marker font-black text-[#2C2C2C] leading-tight mb-4">
            Diploma Projects<br />
            <span className="underline decoration-[#FFCA28] decoration-4">Starting at Free 🌿</span>
          </h1>

          <p className="text-base sm:text-lg font-sans font-semibold text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed mb-8">
            Syllabus-compliant, clean-code projects built specifically for diploma review standards.
            Full source code · PPT slides · Thesis report · Viva guidance — all included.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2C2C2C] text-[#FFF59D] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#FFF59D] hover:shadow-[2px_3px_0_#FFF59D] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              Order on WhatsApp
            </a>
            <Link
              href="/order?category=Diploma"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2C2C2C] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#2C2C2C] hover:bg-[#FFF9C4] hover:shadow-[2px_3px_0_#2C2C2C] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              Customise My Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Assurance pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {["✓ Source Code Included", "✓ PPT & Report", "✓ Viva Guidance", "✓ Remote Setup", "✓ 100% Original"].map(a => (
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
            🔥 Special Diploma Offers
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Exclusive perks only for diploma students</p>
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

        {/* Claim offer CTA */}
        <div className="mt-8 text-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#A5D6A7] text-[#2C2C2C] font-marker font-extrabold text-sm rounded-xl border-2 border-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            Claim Offer on WhatsApp
          </a>
        </div>
      </section>

      {/* ── PROJECT CATALOGUE ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-marker font-extrabold text-[#2C2C2C]">
            📚 Diploma Project Catalogue
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Choose any project or describe your own — we build it custom</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {DIPLOMA_PROJECTS.map((proj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border-2 border-[#2C2C2C] rounded-2xl overflow-hidden shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-1 transition-all flex flex-col"
            >
              {/* Card top accent */}
              <div className={`h-2 w-full`} style={{ backgroundColor: proj.accent }} />

              <div className="p-5 flex flex-col flex-1">
                {/* Tags */}
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
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black border px-2 py-0.5 rounded-full ${difficultyColor[proj.difficulty]}`}>
                      {proj.difficulty}
                    </span>
                    <span className="font-marker font-extrabold text-[#2C2C2C] text-sm">Approx. {proj.price}</span>
                  </div>
                  <a
                    href={`https://wa.me/919028833275?text=${encodeURIComponent(`Hello! I'm a Diploma student interested in the "${proj.title}" project. Please share details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-marker font-bold text-[#2C2C2C] bg-[#FFF9C4] border border-[#2C2C2C] px-2.5 py-1.5 rounded-lg shadow-[1.5px_2px_0_#2C2C2C] hover:bg-[#FFCA28] transition-all cursor-pointer"
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
        <div className="bg-[#2C2C2C] rounded-3xl p-8 sm:p-12 border-2 border-[#2C2C2C] shadow-[6px_8px_0_#FFCA28] text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-4 right-6 w-16 h-16 rounded-full border-2 border-[#FFF59D]/20" />
          <div className="absolute bottom-4 left-6 w-10 h-10 rounded-full border-2 border-[#FFF59D]/10" />

          <div className="relative z-10">
            <span className="inline-block text-3xl mb-4">🎓</span>
            <h2 className="text-2xl sm:text-3xl font-marker font-extrabold text-[#FFF59D] mb-3">
              Don't see your project idea?
            </h2>
            <p className="text-sm font-sans text-[#A0A0A0] leading-relaxed max-w-lg mx-auto mb-8">
              We build <strong className="text-white">100% custom diploma projects</strong> based on your exact college requirements, technology preference, and submission deadline. Just tell us your idea!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#A5D6A7] text-[#2C2C2C] font-marker font-extrabold text-sm rounded-xl border-2 border-[#FFF59D] shadow-[3px_4px_0_#FFF59D] hover:shadow-[5px_6px_0_#FFF59D] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                Discuss on WhatsApp
              </a>
              <Link
                href="/order?category=Diploma"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-[#FFF59D] font-marker font-extrabold text-sm rounded-xl border-2 border-[#FFF59D]/40 hover:border-[#FFF59D] hover:bg-white/5 transition-all cursor-pointer"
              >
                Fill Order Form
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 pb-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-marker font-extrabold text-[#2C2C2C]">Every Diploma Project Includes</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: Code, label: "Full Source Code" },
            { icon: FileText, label: "PPT Slides" },
            { icon: BookOpen, label: "Thesis Report" },
            { icon: ShieldCheck, label: "Viva Guide" },
            { icon: Zap, label: "Remote Setup" },
            { icon: Sparkles, label: "1 Free Revision" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 bg-white border-2 border-[#2C2C2C] rounded-xl p-4 shadow-[2px_3px_0_#2C2C2C] text-center">
              <div className="w-10 h-10 rounded-xl bg-[#FFF9C4] border-2 border-[#2C2C2C] flex items-center justify-center">
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
