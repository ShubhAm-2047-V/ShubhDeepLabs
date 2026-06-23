import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import shubhamImg from "../assets/shubham_bw.jpg";
import gearsImg from "../assets/skills_gears.png";
import buildingImg from "../assets/skills_building.png";
import cubesImg from "../assets/skills_cubes.png";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const containerRef = useRef(null);
  const titleGroupRef = useRef(null);
  const gridRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    // Reveal animation driven by ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 78%",
        once: true
      }
    });

    tl.fromTo(
      titleGroupRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }
    );

    tl.fromTo(
      ".constellation-card",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" },
      "-=0.6"
    );

    tl.fromTo(
      ".center-portrait-wrapper",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.4, ease: "power4.out" },
      "-=1.0"
    );

    tl.fromTo(
      buttonsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.8"
    );
  }, []);

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#050505] border-b border-white/5 z-10 overflow-hidden"
    >
      {/* Subtle background stars/dots overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_0%,transparent_70%)]" />

      <div className="max-w-6xl w-full mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div 
          ref={titleGroupRef}
          className="text-center flex flex-col items-center mb-20 max-w-xl opacity-0"
        >
          <span className="text-[10px] font-mono text-accent-blue uppercase tracking-[0.35em] mb-4">
            CHAPTER 02: THE CRAFT
          </span>
          <h2 className="text-4xl sm:text-6xl font-black font-display text-white uppercase tracking-tight leading-none text-center">
            SKILLS <span className="text-accent-blue font-extended">CONSTELLATION</span>
          </h2>
          <div className="w-12 h-[2px] bg-accent-blue mt-6" />
        </div>

        {/* 3-Column Constellation Grid (Desktop) */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full mb-16"
        >
          
          {/* Left Column: Two Cards (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            {/* Card 1: UI/UX & Figma */}
            <div className="constellation-card group relative glass-premium p-6 rounded-xl border border-white/5 flex flex-col gap-4 bg-[#09090b]/40 backdrop-blur-md opacity-0 hover:border-accent-blue/30 transition-all duration-300">
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-white/5 bg-slate-950/60 p-2">
                <img 
                  src={buildingImg} 
                  alt="Futuristic Building dome model" 
                  className="w-full h-full object-contain skills-img-red group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[9px] font-mono text-accent-blue uppercase tracking-widest">// Mastered Design Systems (2018)</span>
                <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">UI/UX & FIGMA</h3>
                <p className="text-xs text-slate-400 font-sans font-light leading-relaxed">
                  Designing custom, pixel-perfect layout architectures and interactive component libraries that align with user goals.
                </p>
              </div>
            </div>

            {/* Card 2: Full-Stack Engineering */}
            <div className="constellation-card group relative glass-premium p-6 rounded-xl border border-white/5 flex flex-col gap-4 bg-[#09090b]/40 backdrop-blur-md opacity-0 hover:border-secondary-violet/30 transition-all duration-300">
              <div className="flex flex-col gap-1 text-left order-2 sm:order-1">
                <span className="text-[9px] font-mono text-secondary-violet uppercase tracking-widest">// React, Python, Node.js. Development (2018)</span>
                <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">FULL-STACK ENGINEERING</h3>
                <p className="text-xs text-slate-400 font-sans font-light leading-relaxed">
                  Building frontends with React and Vite, paired with high-efficiency REST APIs and optimized database index querying.
                </p>
              </div>
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-white/5 bg-slate-950/60 p-2 order-1 sm:order-2">
                <img 
                  src={gearsImg} 
                  alt="3D mechanical gears" 
                  className="w-full h-full object-contain skills-img-white group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Center Column: User Portrait & Hologram (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            
            {/* Hologram Floating polyhedral star above his hand */}
            <div className="absolute top-[-30px] w-24 h-24 z-20 pointer-events-none select-none animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-full h-full relative">
                {/* Outer star shell */}
                <div className="absolute inset-0 rounded-full border border-accent-blue/40 animate-spin" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-2 rounded-full border border-secondary-violet/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                {/* Glowing light rays */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#FF3333,0_0_35px_#FFFFFF]" />
                {/* Vertical ray from hand to star */}
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[1px] h-[70px] bg-gradient-to-t from-accent-blue to-transparent opacity-60" />
              </div>
            </div>

            {/* The Central Portrait */}
            <div className="center-portrait-wrapper w-[200px] sm:w-[250px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 p-1 bg-slate-950/60 shadow-2xl relative z-10 opacity-0 transition-all duration-300 hover:border-accent-blue/30 select-none">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={shubhamImg}
                  alt="Shubham Dinesh Vernekar"
                  className="w-full h-full object-cover object-center filter grayscale contrast-[1.05]"
                />
                {/* Glowing overlays */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/40 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Floating digital scan wave circles */}
            <div className="absolute bottom-[20px] w-48 h-48 border border-white/5 rounded-full z-0 pointer-events-none animate-ping" style={{ animationDuration: '3s' }} />
          </div>

          {/* Right Column: One Card (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            {/* Card 3: AWS & Terraform */}
            <div className="constellation-card group relative glass-premium p-6 rounded-xl border border-white/5 flex flex-col gap-4 bg-[#09090b]/40 backdrop-blur-md opacity-0 hover:border-accent-blue/30 transition-all duration-300">
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-white/5 bg-slate-950/60 p-2">
                <img 
                  src={cubesImg} 
                  alt="3D translucent violet cubes" 
                  className="w-full h-full object-contain skills-img-red group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[9px] font-mono text-accent-blue uppercase tracking-widest">// Founding ShubDeep Labs for innovation (2024)</span>
                <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">AWS & CLOUD SERVICE</h3>
                <p className="text-xs text-slate-400 font-sans font-light leading-relaxed">
                  Configuring cloud architectures, automated workflows, server management, and deployment pipelines for zero downtime.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Buttons at the bottom */}
        <div 
          ref={buttonsRef}
          className="flex flex-wrap items-center justify-center gap-4 w-full opacity-0"
        >
          <a
            href="#projects"
            className="px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold text-white bg-slate-900/85 hover:bg-slate-800 border border-white/10 hover:border-accent-blue/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,217,255,0.03)] hover:shadow-[0_0_15px_rgba(0,217,255,0.12)] text-center w-full sm:w-auto cursor-pointer"
          >
            View Projects
          </a>
          <a
            href="#shubdeeplabs"
            className="px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 hover:border-secondary-violet/50 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.02)] hover:shadow-[0_0_15px_rgba(139,92,246,0.12)] text-center w-full sm:w-auto cursor-pointer"
          >
            Labs Portfolio
          </a>
        </div>

      </div>
    </section>
  );
}
