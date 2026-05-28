"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain, ArrowRight, MessageSquare, Zap,
  FileText, ShieldCheck, BookOpen, Sparkles, Code
} from "lucide-react";

const AI_ML_PROJECTS = [
  {
    title: "AI Resume Screening Desk",
    tech: "Python + NLP + Spacy + Flask",
    desc: "An intelligent resume reviewer that extracts skills, logs contact details, matches text against job descriptions, and calculates percentage fits.",
    accent: "#66BB6A",
    tags: ["NLP", "Resume Parse", "Spacy"],
  },
  {
    title: "Smart Notes Summarizer",
    tech: "Python + Transformers + Flask + React",
    desc: "Document summarizer utilizing transformer models to parse high-volume articles, generate bullet summaries, and extract core keywords.",
    accent: "#42A5F5",
    tags: ["BERT Model", "Summarize", "React"],
  },
  {
    title: "AI Plant Disease Detector",
    tech: "Python + TensorFlow + CNN + Flask",
    desc: "A neural-network visual scanning web application detecting agricultural leaf diseases with detailed metric analytics.",
    accent: "#FFA726",
    tags: ["CNN", "TensorFlow", "Computer Vision"],
  },
  {
    title: "Real-time Face Attendance",
    tech: "Python + OpenCV + SQLite + Tkinter",
    desc: "Webcam face-detection attendance logger. Recognizes faces, auto-timestamps records into a SQLite database, and exports daily CSV sheets.",
    accent: "#26A69A",
    tags: ["OpenCV", "Face ID", "SQLite"],
  },
  {
    title: "AI Background Remover",
    tech: "Python + Flask + U2Net Model",
    desc: "Upload a portrait and the U2Net neural model isolates foreground subjects, wipes background segments, and downloads a clean PNG.",
    accent: "#AB47BC",
    tags: ["Image Segmentation", "Flask", "AI Tool"],
  },
  {
    title: "Advanced RAG Support Chatbot",
    tech: "React + Node.js + Pinecone DB + Gemini API",
    desc: "Intelligent messaging center with customizable document indexing (RAG) and interactive dashboard console log views.",
    accent: "#EF5350",
    tags: ["RAG Chatbot", "Vector DB", "Gemini API"],
  },
  {
    title: "Stock Market LSTM Predictor",
    tech: "Python + LSTM + Pandas + Streamlit",
    desc: "Deep learning model utilizing Long Short-Term Memory (LSTM) layers to parse historical stock charts and forecast next-day values.",
    accent: "#EF5350",
    tags: ["LSTM Network", "Deep Learning", "Streamlit"],
  },
  {
    title: "Credit Card Fraud Detector",
    tech: "Python + Scikit-Learn + Random Forest",
    desc: "A machine learning pipeline that scales transaction records, handles unbalanced datasets, and flags fraudulent transactions.",
    accent: "#29B6F6",
    tags: ["Machine Learning", "Fraud Check", "Pandas"],
  },
];

const OFFERS = [
  {
    emoji: "🧠",
    title: "Model training explanation guides",
    desc: "Includes step-by-step guides showing how the dataset was processed, models trained, and accurate metrics derived.",
    badge: "GUIDE BOOK",
    badgeColor: "bg-[#EF5350]",
  },
  {
    emoji: "📄",
    title: "Full Thesis Report & Flowcharts",
    desc: "A completely formatted documentation report including dataset descriptions, confusion matrices, and logic diagrams.",
    badge: "FREE",
    badgeColor: "bg-[#66BB6A]",
  },
  {
    emoji: "🖥️",
    title: "Remote Environment configuration",
    desc: "We perform full virtual environment, Anaconda, CUDA, and model package setups on your PC via AnyDesk/Zoom.",
    badge: "INSTALL SUPPORT",
    badgeColor: "bg-[#AB47BC]",
  },
  {
    emoji: "🎓",
    title: "Viva preparation sheet",
    desc: "Includes expected examiner questions and answers regarding neural layers, model metrics, and libraries.",
    badge: "BONUS",
    badgeColor: "bg-[#42A5F5]",
  },
];

export default function AiMlPage() {
  const waUrl = `https://wa.me/919028833275?text=${encodeURIComponent("Hello! I'm an AI/ML student and want to discuss a custom intelligence project with Shubdeep Labs.")}`;

  return (
    <div className="min-h-screen bg-[#FAF6EE] pb-24">

      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#FFEBEE] border-b-4 border-[#2C2C2C] pt-28 pb-16 px-4 sm:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-[#EF5350] border-2 border-[#2C2C2C]" />
        <div className="absolute bottom-8 right-10 w-4 h-4 rounded-full bg-[#EF5350] border-2 border-[#2C2C2C]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2C2C2C] shadow-[3px_3px_0_#2C2C2C] px-4 py-1.5 rounded-xl mb-6 rotate-[-1deg]">
            <Brain className="w-4 h-4 text-[#2C2C2C]" />
            <span className="text-xs font-marker font-extrabold text-[#2C2C2C] uppercase tracking-wider">AI / ML Tiers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-marker font-black text-[#2C2C2C] leading-tight mb-4">
            AI & Machine Learning<br />
            <span className="underline decoration-[#EF5350] decoration-4">Starting at ₹6999</span>
          </h1>

          <p className="text-base sm:text-lg font-sans font-semibold text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed mb-8">
            Advanced neural networks, neural image segmentation tools, computer vision platforms, and customized transformer models.
            Trained weights · Clean scripts · Technical report · Remote environment setup — all package-included.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2C2C2C] text-[#FFCDD2] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#FFCDD2] hover:shadow-[2px_3px_0_#FFCDD2] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              Order AI/ML Project
            </a>
            <Link
              href="/order?category=AI-ML"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2C2C2C] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#2C2C2C] hover:bg-[#FFEBEE] hover:shadow-[2px_3px_0_#2C2C2C] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              Customise My Model
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFERS ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-marker font-extrabold text-[#2C2C2C] inline-block">
            🔥 Specialized AI Benefits
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">High-end support packages engineered specifically for model training & visualization</p>
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
            📚 AI / ML Project Catalogue
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Choose a pre-configured model setup or outline your custom intelligence architecture</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {AI_ML_PROJECTS.map((proj, i) => (
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
                  <span className="font-marker font-extrabold text-[#2C2C2C] text-base">₹6999</span>
                  <a
                    href={`https://wa.me/919028833275?text=${encodeURIComponent(`Hello! I'm an AI/ML student interested in the "${proj.title}" project. Please share details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-marker font-bold text-[#2C2C2C] bg-[#FFEBEE] border border-[#2C2C2C] px-2.5 py-1.5 rounded-lg shadow-[1.5px_2px_0_#2C2C2C] hover:bg-[#EF5350] transition-all cursor-pointer"
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
        <div className="bg-[#2C2C2C] rounded-3xl p-8 sm:p-12 border-2 border-[#2C2C2C] shadow-[6px_8px_0_#EF5350] text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block text-3xl mb-4">🤖</span>
            <h2 className="text-2xl sm:text-3xl font-marker font-extrabold text-[#FFCDD2] mb-3">
              Need a Custom Trained Neural Network?
            </h2>
            <p className="text-sm font-sans text-[#A0A0A0] leading-relaxed max-w-lg mx-auto mb-8">
              We clean specific dataset structures, configure customized model architectures (CNN, LSTM, transformers), and deliver verified training models according to your syllabus.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#EF5350] text-[#2C2C2C] font-marker font-extrabold text-sm rounded-xl border-2 border-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                Discuss on WhatsApp
              </a>
              <Link
                href="/order?category=AI-ML"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-[#FFCDD2] font-marker font-extrabold text-sm rounded-xl border-2 border-[#EF5350]/40 hover:border-[#EF5350] hover:bg-white/5 transition-all cursor-pointer"
              >
                Custom Model Request
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
