import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Layout, Globe, Server } from "lucide-react";
import cockpitBg from "../assets/services_bg.png";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const containerRef = useRef(null);
  const titleGroupRef = useRef(null);
  const gridRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 76%",
        once: true
      }
    });

    tl.fromTo(
      titleGroupRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }
    );

    tl.fromTo(
      ".service-hud-card",
      { opacity: 0, x: (i) => (i % 2 === 0 ? -40 : 40) },
      { opacity: 1, x: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" },
      "-=0.7"
    );

    tl.fromTo(
      buttonsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );
  }, []);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#030303] border-b border-white/5 z-10 overflow-hidden"
    >
      {/* Cockpit HUD Console Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-screen pointer-events-none opacity-[0.07] sm:opacity-[0.14] z-0"
        style={{ backgroundImage: `url(${cockpitBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] pointer-events-none z-0" />

      <div className="max-w-6xl w-full mx-auto flex flex-col items-center relative z-10">
        
        {/* Section Header */}
        <div 
          ref={titleGroupRef}
          className="text-center flex flex-col items-center mb-20 max-w-xl opacity-0"
        >
          <span className="text-[10px] font-mono text-highlight-green uppercase tracking-[0.35em] mb-4">
            CHAPTER 05: CORE SOLUTIONS
          </span>
          <h2 className="text-4xl sm:text-6xl font-black font-display text-white uppercase tracking-tight leading-none text-center">
            ENGINEERING <span className="text-accent-blue font-extended">SERVICES</span>
          </h2>
          <div className="w-12 h-[2px] bg-highlight-green mt-6" />
        </div>

        {/* HUD Grid Layout */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full mb-16"
        >
          
          {/* Left Column: Services 01 & 02 */}
          <div className="flex flex-col gap-10">
            {/* Service 01: AI & Data Solutions */}
            <div className="service-hud-card group relative glass-premium p-8 rounded-xl border border-white/5 bg-[#09090b]/50 backdrop-blur-md opacity-0 hover:border-accent-blue/30 transition-all duration-300">
              {/* Glow accent */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-blue" />
              
              <div className="flex items-start gap-5">
                <div className="p-3.5 rounded-lg border border-accent-blue/10 bg-slate-950/60 text-accent-blue">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">// Service 01 // 2025</span>
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">AI & DATA SOLUTIONS</h3>
                  <p className="text-xs text-slate-300 font-sans font-light leading-relaxed">
                    Predictive modeling, data pipeline architecture, and machine learning model deployment (2025). Custom prompt templates and model pipelines built to automate back-office workflows.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 02: Custom UI/UX Design */}
            <div className="service-hud-card group relative glass-premium p-8 rounded-xl border border-white/5 bg-[#09090b]/50 backdrop-blur-md opacity-0 hover:border-secondary-violet/30 transition-all duration-300">
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-secondary-violet" />
              
              <div className="flex items-start gap-5">
                <div className="p-3.5 rounded-lg border border-secondary-violet/10 bg-slate-950/60 text-secondary-violet">
                  <Layout className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">// Service 02 // 2025</span>
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">CUSTOM UI/UX DESIGN</h3>
                  <p className="text-xs text-slate-300 font-sans font-light leading-relaxed">
                    High-fidelity mockups, interaction design, and design system creation for web and mobile (2025). Delivering user journeys that drive real conversions and look award-winning.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Services 03 & 04 */}
          <div className="flex flex-col gap-10">
            {/* Service 03: Full-Stack Development */}
            <div className="service-hud-card group relative glass-premium p-8 rounded-xl border border-white/5 bg-[#09090b]/50 backdrop-blur-md opacity-0 hover:border-highlight-green/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-highlight-green" />
              
              <div className="flex items-start gap-5">
                <div className="p-3.5 rounded-lg border border-highlight-green/10 bg-slate-950/60 text-highlight-green">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">// Service 03 // 2025</span>
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">FULL-STACK DEVELOPMENT</h3>
                  <p className="text-xs text-slate-300 font-sans font-light leading-relaxed">
                    End-to-end software development, microservices architecture, and cloud-native application building (2025). Fast React layouts connected to modular APIs and clean databases.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 04: DevOps & Cloud Infrastructure */}
            <div className="service-hud-card group relative glass-premium p-8 rounded-xl border border-white/5 bg-[#09090b]/50 backdrop-blur-md opacity-0 hover:border-white/20 transition-all duration-300">
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white" />
              
              <div className="flex items-start gap-5">
                <div className="p-3.5 rounded-lg border border-white/10 bg-slate-950/60 text-white">
                  <Server className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">// Service 04 // 2025</span>
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">DEVOPS & INFRASTRUCTURE</h3>
                  <p className="text-xs text-slate-300 font-sans font-light leading-relaxed">
                    Automated infrastructure provisioning, CI/CD pipeline management, and multi-cloud optimization (2025). Making sure your software loads immediately and stays online.
                  </p>
                </div>
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
            href="#contact"
            className="px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold text-white bg-slate-900/85 hover:bg-slate-800 border border-white/10 hover:border-highlight-green/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,178,0.03)] hover:shadow-[0_0_15px_rgba(0,255,178,0.12)] text-center w-full sm:w-auto cursor-pointer"
          >
            Explore Service Details
          </a>
          <a
            href="#projects"
            className="px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 hover:border-accent-blue/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,217,255,0.02)] hover:shadow-[0_0_15px_rgba(0,217,255,0.12)] text-center w-full sm:w-auto cursor-pointer"
          >
            Client Portfolio
          </a>
        </div>

      </div>
    </section>
  );
}
