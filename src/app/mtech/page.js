"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cpu, ArrowRight, MessageSquare, Zap,
  FileText, ShieldCheck, BookOpen, Sparkles, Code
} from "lucide-react";

const MTECH_PROJECTS = [
  {
    title: "Hybrid Cryptography Cloud Storage",
    tech: "Java + AES + RSA + SHA-256 + Cloud",
    desc: "A secure cloud storage architecture using hybrid encryption (AES-256 for data, RSA-2048 for key sharing, SHA-256 for integrity check). Fully compliant with IEEE cloud parameters.",
    accent: "#EF5350",
    tags: ["Cryptography", "Cloud Security", "IEEE Model"],
  },
  {
    title: "Deep Learning Heart Care Analyzer",
    tech: "Python + TensorFlow + CNN + Flask",
    desc: "A highly precise clinical decision support model trained on medical image datasets. Uses convolutional layers to classify heart anomalies with 98% accuracy metrics.",
    accent: "#EF5350",
    tags: ["Deep Learning", "Healthcare AI", "TensorFlow"],
  },
  {
    title: "Advanced Big Data Analytics Engine",
    tech: "Python + Spark + Hadoop + Dash",
    desc: "A pipeline designed to digest stream datasets, map cluster nodes, compute key-value pairs, and render dynamic predictive metrics on a custom dashboard.",
    accent: "#FFCA28",
    tags: ["Big Data", "Spark/Hadoop", "Predictive"],
  },
  {
    title: "SVM Network Intrusion Detector",
    tech: "Python + Scikit-Learn + Pandas",
    desc: "Security gateway analyzing dynamic data flows. Employs Support Vector Machines (SVM) to detect network attacks and classify anomalies in real-time.",
    accent: "#42A5F5",
    tags: ["ML", "Security", "SVM Classify"],
  },
  {
    title: "Content-Based Image Retrieval Hub",
    tech: "Python + OpenCV + PyTensor",
    desc: "A visual database query engine. Extracts texture, color histogram, and spatial values to fetch structurally identical images from high-volume catalogues.",
    accent: "#AB47BC",
    tags: ["Computer Vision", "OpenCV", "Image Query"],
  },
  {
    title: "WSN Cluster Routing Optimizer",
    tech: "MATLAB / NS3 Simulator",
    desc: "Energy-efficient routing simulation. Utilizes LEACH protocols to optimize sensor node clusters, minimize battery drain, and maximize data pack delivery rates.",
    accent: "#26A69A",
    tags: ["WSN", "LEACH Protocol", "Simulation"],
  },
  {
    title: "Medical Ledger Blockchain",
    tech: "React + Solidity + Ethereum Smart Contracts",
    desc: "Decentralized patient medical record system. Custom smart contracts control record accesses, store cryptographic hashes on IPFS, and log ledger entries.",
    accent: "#EF5350",
    tags: ["Blockchain", "Ethereum", "Solidity"],
  },
  {
    title: "Text Summarizer NLP Model",
    tech: "Python + NLTK + BERT + Flask",
    desc: "A natural language system utilizing transformer models to parse high-volume articles, generate abstractive text summaries, and display key tag terms.",
    accent: "#29B6F6",
    tags: ["NLP", "BERT Model", "Transformers"],
  },
];

const OFFERS = [
  {
    emoji: "📚",
    title: "Plagiarism-Free IEEE Thesis Report",
    desc: "Complete thesis-grade document drafted in official IEEE format with references, diagram flow charts, and zero plagiarism.",
    badge: "RESEARCH-READY",
    badgeColor: "bg-[#EF5350]",
  },
  {
    emoji: "🔍",
    title: "Base Literature Review Draft",
    desc: "All M.Tech research packages include a comprehensive 5+ paper literature analysis document ready for guide submission.",
    badge: "INCLUDED",
    badgeColor: "bg-[#66BB6A]",
  },
  {
    emoji: "⚡",
    title: "Urgent Implementation Mode",
    desc: "Running behind deadline? We speed up key algorithm codebases within 5-7 days for thesis review urgencies.",
    badge: "SUPPORT TIER",
    badgeColor: "bg-[#42A5F5]",
  },
  {
    emoji: "🖥️",
    title: "Full Simulator Setup Support",
    desc: "We perform full MATLAB/Python simulator setups on your machine via secure remote desk access.",
    badge: "COMPLIMENTARY",
    badgeColor: "bg-[#AB47BC]",
  },
];

export default function MTechPage() {
  const waUrl = `https://wa.me/919028833275?text=${encodeURIComponent("Hello! I'm an M.Tech student and want to discuss an academic research project with Shubdeep Labs.")}`;

  return (
    <div className="min-h-screen bg-[#FAF6EE] pb-24">

      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#E1F5FE] border-b-4 border-[#2C2C2C] pt-28 pb-16 px-4 sm:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-[#42A5F5] border-2 border-[#2C2C2C]" />
        <div className="absolute bottom-8 right-10 w-4 h-4 rounded-full bg-[#42A5F5] border-2 border-[#2C2C2C]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2C2C2C] shadow-[3px_3px_0_#2C2C2C] px-4 py-1.5 rounded-xl mb-6 rotate-[-1deg]">
            <Cpu className="w-4 h-4 text-[#2C2C2C]" />
            <span className="text-xs font-marker font-extrabold text-[#2C2C2C] uppercase tracking-wider">M.Tech / Research Level</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-marker font-black text-[#2C2C2C] leading-tight mb-4">
            M.Tech & Research<br />
            <span className="underline decoration-[#42A5F5] decoration-4">Starting at ₹8999</span>
          </h1>

          <p className="text-base sm:text-lg font-sans font-semibold text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed mb-8">
            High-complexity research algorithms, complete IEEE implementation frameworks, and expert math model configurations.
            Codebase · Literature Review · Dissertation Draft · Guide Walkthrough — all integrated.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2C2C2C] text-[#B3E5FC] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#B3E5FC] hover:shadow-[2px_3px_0_#B3E5FC] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              Discuss Research Thesis
            </a>
            <Link
              href="/order?category=M.Tech"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2C2C2C] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#2C2C2C] hover:bg-[#E1F5FE] hover:shadow-[2px_3px_0_#2C2C2C] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              Customise My Thesis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFERS ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-marker font-extrabold text-[#2C2C2C] inline-block">
            🔥 Premium Research Perks
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Thesis-grade support packages engineered specifically for post-graduates</p>
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
            📚 Research Implementations
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Select an existing codebase standard or formulate a customized research plan with us</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {MTECH_PROJECTS.map((proj, i) => (
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
                  <span className="font-marker font-extrabold text-[#2C2C2C] text-base">₹8999</span>
                  <a
                    href={`https://wa.me/919028833275?text=${encodeURIComponent(`Hello! I'm an M.Tech student interested in the "${proj.title}" thesis project. Please share details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-marker font-bold text-[#2C2C2C] bg-[#E1F5FE] border border-[#2C2C2C] px-2.5 py-1.5 rounded-lg shadow-[1.5px_2px_0_#2C2C2C] hover:bg-[#42A5F5] transition-all cursor-pointer"
                  >
                    Get Details <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CUSTOM ORDER SECTION ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
        <div className="bg-[#2C2C2C] rounded-3xl p-8 sm:p-12 border-2 border-[#2C2C2C] shadow-[6px_8px_0_#42A5F5] text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block text-3xl mb-4">🔬</span>
            <h2 className="text-2xl sm:text-3xl font-marker font-extrabold text-[#B3E5FC] mb-3">
              Describe Your Specific Algorithm Ideas
            </h2>
            <p className="text-sm font-sans text-[#A0A0A0] leading-relaxed max-w-lg mx-auto mb-8">
              We implement custom algorithmic setups, complex mathematical formulas, and custom simulated results precisely complying with your specific guide guidelines.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#42A5F5] text-[#2C2C2C] font-marker font-extrabold text-sm rounded-xl border-2 border-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                Discuss Custom Algorithm
              </a>
              <Link
                href="/order?category=M.Tech"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-[#B3E5FC] font-marker font-extrabold text-sm rounded-xl border-2 border-[#42A5F5]/40 hover:border-[#42A5F5] hover:bg-white/5 transition-all cursor-pointer"
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
