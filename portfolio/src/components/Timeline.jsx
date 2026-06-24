import React from "react";
import { motion } from "framer-motion";

export default function Timeline() {
  const timelineData = [
    {
      year: "2024",
      title: "Began the Journey",
      desc: "Started learning core programming, computer science principles, and web technologies.",
    },
    {
      year: "2025",
      title: "Building & Innovating",
      desc: "Developed various full-stack web applications and AI-driven applications like ChatVVP.",
    },
    {
      year: "2025",
      title: "Founding ShubDeep Labs",
      desc: "Launched a software agency to building production-grade digital and AI solutions.",
    },
    {
      year: "2026",
      title: "Scaling Client Success",
      desc: "Expanding offerings, working with international clients, and developing enterprise automation pipelines.",
    },
  ];

  return (
    <section id="timeline" className="relative py-24 px-6 sm:px-12 lg:px-24 border-t border-white/5">
      <div className="absolute top-1/2 left-[10%] w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white mb-4">
            Roadmap & Journey
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto rounded-full" />
          <p className="text-slate-400 mt-4 text-lg">My growth, achievements, and future targets.</p>
        </div>

        {/* Timeline body */}
        <div className="relative border-l border-white/10 ml-4 md:ml-32 py-4 space-y-12">
          {timelineData.map((item, index) => (
            <div key={index} className="relative pl-6 md:pl-12">
              {/* Year Label for larger screens */}
              <div className="hidden md:block absolute right-full mr-8 text-right top-0 mt-1">
                <span className="text-2xl font-black font-display text-gradient-cyan-purple bg-clip-text">
                  {item.year}
                </span>
              </div>

              {/* Glowing Node on Timeline Line */}
              <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-[#050816] border-2 border-neon-blue flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
              </div>

              {/* Mobile Year Badge */}
              <div className="md:hidden mb-2">
                <span className="px-3 py-1 text-xs font-mono font-bold text-dark-bg bg-gradient-to-r from-neon-blue to-neon-purple rounded-full">
                  {item.year}
                </span>
              </div>

              {/* Card content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
