import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import shubhamImg from "../assets/shubham_sunglasses_transparent.png";

export default function Hero() {
  const containerRef = useRef(null);
  const textGroupRef = useRef(null);
  const imageContainerRef = useRef(null);
  const bottomGridRef = useRef(null);
  const viewWorkBtnRef = useRef(null);
  const exploreBtnRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });

    // 1. Text slide & blur reveal
    tl.fromTo(
      ".hero-bg-text-line",
      { y: 50, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 0.85, filter: "blur(0px)", duration: 1.2, stagger: 0.15, ease: "power4.out" }
    );

    // 2. Image scale & mask reveal
    tl.fromTo(
      imageContainerRef.current,
      { scale: 0.9, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 1.4, ease: "power3.out" },
      "-=0.8"
    );

    // 3. Bottom grid reveal
    tl.fromTo(
      bottomGridRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
      "-=0.9"
    );

    // 4. Magnetic hover effect for CTA buttons
    const buttons = [viewWorkBtnRef.current, exploreBtnRef.current];
    const handleMagneticMouseMove = (e) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMagneticMouseLeave = (e) => {
      const btn = e.currentTarget;
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    };

    buttons.forEach((btn) => {
      if (btn) {
        btn.addEventListener("mousemove", handleMagneticMouseMove);
        btn.addEventListener("mouseleave", handleMagneticMouseLeave);
      }
    });

    return () => {
      buttons.forEach((btn) => {
        if (btn) {
          btn.removeEventListener("mousemove", handleMagneticMouseMove);
          btn.removeEventListener("mouseleave", handleMagneticMouseLeave);
        }
      });
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-24 py-24 z-10 overflow-hidden bg-transparent select-none"
    >
      {/* Background Tech Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />

      {/* Main Content Area: Centered layout */}
      <div className="flex-grow flex items-center justify-center relative w-full max-w-7xl mx-auto my-auto z-10 mt-12">
        
        {/* Massive Background Typography Layer */}
        <div 
          ref={textGroupRef}
          className="text-center font-display font-black text-[8vw] sm:text-[75px] md:text-[95px] lg:text-[118px] xl:text-[132px] leading-[0.95] text-white tracking-tighter uppercase flex flex-col items-center justify-center relative select-none"
        >
          <span className="hero-bg-text-line block opacity-0 relative z-0 pointer-events-none">BUILDING DIGITAL</span>
          <span className="hero-bg-text-line block opacity-0 text-stroke relative z-0 pointer-events-none">PRODUCTS FOR THE</span>
          <span className="hero-bg-text-line block opacity-0 text-accent-blue relative z-0 pointer-events-none">NEXT GENERATION</span>

          {/* Foreground User Portrait Image Layer (Background-free and borderless) */}
          <div 
            ref={imageContainerRef}
            className="absolute inset-0 m-auto w-[280px] sm:w-[380px] md:w-[460px] aspect-[849/1024] z-10 transition-all duration-500 group cursor-pointer opacity-0"
            data-cursor-label="Explore"
          >
            <img
              src={shubhamImg}
              alt="Shubham Vernekar portrait"
              className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
            />
          </div>
        </div>

      </div>



      {/* Bottom Grid: Editorial Layout Details */}
      <div 
        ref={bottomGridRef}
        className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-t border-white/5 pt-10 z-20 opacity-0"
      >
        {/* Intro statement (left-aligned) */}
        <div className="md:col-span-6 flex flex-col items-start text-left gap-3">
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-md font-light">
            Hi, I'm <strong className="text-white font-medium">Shubham Vernekar</strong>. Developer, Designer, AI Builder, and Founder of ShubDeep Labs. <strong className="text-white font-medium">I create websites, software, and AI-powered solutions</strong> that help businesses grow.
          </p>
        </div>

        {/* Action Buttons (centered/right-aligned) */}
        <div className="md:col-span-6 flex flex-wrap md:justify-end items-center gap-4 w-full">
          <a
            ref={viewWorkBtnRef}
            href="#projects"
            className="px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-accent-blue/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,217,255,0.03)] hover:shadow-[0_0_15px_rgba(0,217,255,0.15)] text-center w-full sm:w-auto cursor-pointer"
          >
            View Work
          </a>
          <a
            ref={exploreBtnRef}
            href="#about"
            className="px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 hover:border-secondary-violet/50 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.02)] hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] text-center w-full sm:w-auto cursor-pointer"
          >
            Explore Journey
          </a>
        </div>
      </div>
      
    </section>
  );
}
