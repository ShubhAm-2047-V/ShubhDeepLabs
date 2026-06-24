import React from "react";
import { motion } from "framer-motion";
import shubhamSunglasses from "../assets/shubham_sunglasses.png";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden z-10 px-6 sm:px-12 lg:px-24 py-20">
      {/* Background ambient lighting */}
      <div className="absolute top-[20%] left-[10%] w-[35rem] h-[35rem] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text & CTAs */}
        <motion.div
          className="lg:col-span-7 text-left flex flex-col items-start"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 glass mb-8 cursor-default"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan"></span>
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Available for Freelance & Contracts
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight leading-none text-white mb-6"
          >
            Hi, I'm <br />
            <span className="text-gradient-cyan-purple">Shubham Dinesh Vernekar</span>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-lg sm:text-xl lg:text-2xl font-semibold font-display tracking-wide text-slate-200 mb-6"
          >
            Founder of <span className="text-gradient-purple-pink">ShubDeep Labs</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-xl mb-10 leading-relaxed font-sans"
          >
            Crafting next-generation digital products, robust backends, and AI-powered automation systems. Transforming complex challenges into elegant web experiences.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a
              href="#projects"
              className="px-8 py-4 rounded-full font-semibold text-black bg-white hover:bg-neutral-200 hover:-translate-y-0.5 active:translate-y-0 transition duration-300 shadow-lg shadow-white/10 text-center"
            >
              Explore My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-4 rounded-full font-semibold border border-white/20 hover:border-white/40 text-white bg-white/5 hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 transition duration-300 text-center backdrop-blur-sm"
            >
              Let's Build Something
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column: Interactive Holographic Frame */}
        <motion.div
          className="lg:col-span-5 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative w-full max-w-[350px] aspect-[4/5] glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl hover:border-neon-cyan/40 transition-all duration-300">
            {/* The Image */}
            <div className="relative w-full h-[82%] rounded-xl overflow-hidden border border-white/5 bg-slate-950">
              <img
                src={shubhamSunglasses}
                alt="Shubham Dinesh Vernekar"
                className="w-full h-full object-cover object-center filter grayscale contrast-[1.15]"
              />
              
              {/* Laser Scanning Line */}
              <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_10px_#00e5ff] animate-scan" />

              {/* Grid Overlay */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />

              {/* Vignette */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />
            </div>

            {/* Tech Readouts */}
            <div className="h-[15%] flex flex-col justify-between py-1 font-mono text-[9px] text-slate-500">
              <div className="flex justify-between">
                <span>USER: S_D_VERNEKAR</span>
                <span className="text-neon-cyan animate-pulse">SYS: ACTIVE</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-1">
                <span>LOC: 17.6599° N, 75.9064° E</span>
                <span>UNIT: SHUBDEEP_LABS</span>
              </div>
            </div>

            {/* Corner Decorative Borders */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-neon-cyan/60" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-neon-cyan/60" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-neon-cyan/60" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-neon-cyan/60" />
          </div>
        </motion.div>
      </div>

      {/* Floating Mouse Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70">
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Scroll</span>
        <div className="w-[20px] h-[34px] border border-white/20 rounded-full flex justify-center items-start p-1">
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1 h-1 bg-white rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
