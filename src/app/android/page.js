"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Smartphone, ArrowRight, MessageSquare, Zap,
  FileText, ShieldCheck, BookOpen, Sparkles, Code
} from "lucide-react";

const ANDROID_PROJECTS = [
  {
    title: "Student Attendance App",
    tech: "Android Studio + Java + SQLite",
    desc: "A neat native app designed to register student lists, mark daily attendance in a local database, and view simple attendance charts.",
    accent: "#66BB6A",
    tags: ["SQLite", "Java", "Native App"],
  },
  {
    title: "Expense Tracker App",
    tech: "Flutter + Dart + Hive Database",
    desc: "A cross-platform mobile tracker app. Records daily income/expense logs, visualizes monthly expenditures using charts, and sets budgets.",
    accent: "#42A5F5",
    tags: ["Flutter", "Hive", "Cross Platform"],
  },
  {
    title: "Online Food Delivery App",
    tech: "React Native + Node.js + Express + MongoDB",
    desc: "An interactive mobile store displaying food catalog items, active shopping cart counters, mock secure payments checkout, and order tracking pages.",
    accent: "#FFA726",
    tags: ["React Native", "Food App", "Database"],
  },
  {
    title: "Movie Booking App",
    tech: "Android Studio + Kotlin + Firebase",
    desc: "A visual ticket selector. Users can browse movies, pick seat availability cards, trigger mock payments, and access active tickets lists.",
    accent: "#26A69A",
    tags: ["Kotlin", "Firebase", "Seat Picker"],
  },
  {
    title: "Bluetooth Chat App",
    tech: "Android Studio + Java + Bluetooth API",
    desc: "A direct offline peer-to-peer message logger. Automatically discovers nearby devices, establishes RFCOMM channels, and transfers messages.",
    accent: "#AB47BC",
    tags: ["Bluetooth", "Offline Chat", "Native"],
  },
  {
    title: "E-Commerce App with Admin Desk",
    tech: "React Native + Firebase Store + Firestore",
    desc: "A full online store dashboard. Features product categories, real-time cart, push notifications, and administrative panel to manage inventory.",
    accent: "#EF5350",
    tags: ["Firebase Auth", "Firestore", "React Native"],
  },
  {
    title: "GPS Real-time Vehicle Tracker",
    tech: "Android Studio + Kotlin + Google Maps API",
    desc: "A location tracker app mapping real-time coordinates, plotting routes on Google Maps, calculating travel distances, and logging logs in Firebase.",
    accent: "#EF5350",
    tags: ["Maps API", "GPS Locate", "Kotlin"],
  },
  {
    title: "QR-code Attendance App",
    tech: "Android Studio + Java + ZXing Decoder",
    desc: "A fast scanner portal allowing students to scan dynamic generator QR codes to log class attendance in real-time.",
    accent: "#29B6F6",
    tags: ["QR Scanner", "ZXing Decoder", "SQLite"],
  },
];

const OFFERS = [
  {
    emoji: "📱",
    title: "Full Android package (APK)",
    desc: "Includes the compiled production APK file ready for installation on any standard Android phone.",
    badge: "DELIVERABLE",
    badgeColor: "bg-[#EF5350]",
  },
  {
    emoji: "📄",
    title: "Complete SRS & Thesis Report",
    desc: "All mobile projects come with a completely formatted Software Requirement Specification (SRS) report draft.",
    badge: "FREE",
    badgeColor: "bg-[#66BB6A]",
  },
  {
    emoji: "🖥️",
    title: "Remote Emulator setup support",
    desc: "We perform full Android Studio, emulator, and SDK package configuration on your machine via Zoom/AnyDesk.",
    badge: "SETUP COMPLIMENTARY",
    badgeColor: "bg-[#AB47BC]",
  },
  {
    emoji: "🎓",
    title: "Expected Viva preparation sheet",
    desc: "Expected examiner questions regarding mobile activity lifecycles, database syncs, and XML designs.",
    badge: "GUIDE SHEET",
    badgeColor: "bg-[#42A5F5]",
  },
];

export default function AndroidPage() {
  const waUrl = `https://wa.me/919028833275?text=${encodeURIComponent("Hello! I'm an Android student and want to discuss a mobile application project with Shubdeep Labs.")}`;

  return (
    <div className="min-h-screen bg-[#FAF6EE] pb-24">

      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#E8F5E9] border-b-4 border-[#2C2C2C] pt-28 pb-16 px-4 sm:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-[#26A69A] border-2 border-[#2C2C2C]" />
        <div className="absolute bottom-8 right-10 w-4 h-4 rounded-full bg-[#26A69A] border-2 border-[#2C2C2C]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2C2C2C] shadow-[3px_3px_0_#2C2C2C] px-4 py-1.5 rounded-xl mb-6 rotate-[-1deg]">
            <Smartphone className="w-4 h-4 text-[#2C2C2C]" />
            <span className="text-xs font-marker font-extrabold text-[#2C2C2C] uppercase tracking-wider">Android mobile Tiers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-marker font-black text-[#2C2C2C] leading-tight mb-4">
            Android Mobile Apps<br />
            <span className="underline decoration-[#26A69A] decoration-4">Starting at ₹5499</span>
          </h1>

          <p className="text-base sm:text-lg font-sans font-semibold text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed mb-8">
            Native and cross-platform mobile systems, clean activity controllers, and secure database Sync integrations mapped for mobile reviewers.
            Compiled APK · Source Code · SRS reports · Remote simulator setups — all package-included.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2C2C2C] text-[#A7FFEB] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#A7FFEB] hover:shadow-[2px_3px_0_#A7FFEB] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              Order Mobile App
            </a>
            <Link
              href="/order?category=Android"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2C2C2C] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#2C2C2C] hover:bg-[#E8F5E9] hover:shadow-[2px_3px_0_#2C2C2C] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              Customise My App
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFERS ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-marker font-extrabold text-[#2C2C2C] inline-block">
            🔥 Mobile App Perks
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Premium packages engineered specifically for Android & iOS development</p>
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
            📚 Mobile Project Catalogue
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Select an existing mobile package or define a custom specification with us</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ANDROID_PROJECTS.map((proj, i) => (
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
                  <span className="font-marker font-extrabold text-[#2C2C2C] text-base">₹5499</span>
                  <a
                    href={`https://wa.me/919028833275?text=${encodeURIComponent(`Hello! I'm an Android student interested in the "${proj.title}" app project. Please share details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-marker font-bold text-[#2C2C2C] bg-[#E8F5E9] border border-[#2C2C2C] px-2.5 py-1.5 rounded-lg shadow-[1.5px_2px_0_#2C2C2C] hover:bg-[#26A69A] transition-all cursor-pointer"
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
        <div className="bg-[#2C2C2C] rounded-3xl p-8 sm:p-12 border-2 border-[#2C2C2C] shadow-[6px_8px_0_#26A69A] text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block text-3xl mb-4">📱</span>
            <h2 className="text-2xl sm:text-3xl font-marker font-extrabold text-[#A7FFEB] mb-3">
              Need a Custom Android System?
            </h2>
            <p className="text-sm font-sans text-[#A0A0A0] leading-relaxed max-w-lg mx-auto mb-8">
              We design original native or hybrid mobile codebases customized fully to your specifications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#26A69A] text-[#2C2C2C] font-marker font-extrabold text-sm rounded-xl border-2 border-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                Discuss on WhatsApp
              </a>
              <Link
                href="/order?category=Android"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-[#A7FFEB] font-marker font-extrabold text-sm rounded-xl border-2 border-[#26A69A]/40 hover:border-[#26A69A] hover:bg-white/5 transition-all cursor-pointer"
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
