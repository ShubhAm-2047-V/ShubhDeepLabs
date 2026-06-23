import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

const JOURNEY_TIMELINE = [
  {
    year: "2024",
    title: "Began the Journey",
    desc: "Started learning core programming, computer science principles, and web technologies."
  },
  {
    year: "2025",
    title: "Building & Innovating",
    desc: "Designed and engineered client websites, automation systems, and SaaS interfaces."
  },
  {
    year: "2026",
    title: "Founding ShubDeep Labs",
    desc: "Evolving agency operations to build custom software, AI integration pipelines, and full-stack solutions."
  }
];

export default function About() {
  const containerRef = useRef(null);
  const textContentRef = useRef(null);

  useEffect(() => {
    // Reveal text block
    gsap.fromTo(
      textContentRef.current,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
          once: true
        }
      }
    );

    // Stagger reveal milestone timeline cards
    gsap.fromTo(
      ".journey-timeline-item",
      { opacity: 0, x: 25 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".journey-timeline-item",
          start: "top 80%",
          once: true
        }
      }
    );
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-screen py-32 px-6 sm:px-12 lg:px-24 flex items-center justify-center overflow-hidden z-10 border-b border-white/5 bg-[#050505]"
    >
      <div 
        ref={textContentRef}
        className="max-w-6xl w-full mx-auto flex flex-col gap-16 opacity-0"
      >
        
        {/* Section Header */}
        <div className="flex flex-col max-w-xl">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">
            01 // Narrative & Journey
          </span>
          <h2 className="text-4xl sm:text-6xl font-black font-display text-white uppercase tracking-tight flex flex-wrap gap-x-4">
            <TextReveal>The</TextReveal>
            <TextReveal className="text-gradient-blue">Story</TextReveal>
          </h2>
          <div className="w-12 h-[2px] bg-accent-blue mt-4" />
        </div>

        {/* Story Spread Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start font-sans">
          
          {/* Left Column: Narrative paragraphs (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            <p>
              Driven by a passion for clean code and strong visual layouts, I help business owners translate their product requirements into interactive digital interfaces. I started <strong className="text-white font-medium">ShubDeep Labs</strong> to focus on clean software delivery, cutting out the typical design agency overhead and miscommunication.
            </p>
            <p>
              I bridge the gap between creative frontend design and backend development. I specialize in coding custom react web applications, configuring relational databases, and designing automated data pipelines that hook LLM services directly into your communication pipelines.
            </p>
          </div>

          {/* Right Column: Chronological journey (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col gap-6 border-l border-white/10 pl-6 relative">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
              // Milestones Timeline
            </h3>
            {JOURNEY_TIMELINE.map((item, idx) => (
              <div key={idx} className="journey-timeline-item relative flex flex-col gap-1 opacity-0">
                {/* Node dot on border */}
                <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-accent-blue" />
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-accent-blue">{item.year}</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Visual Progression Line */}
        <div className="border-t border-white/5 pt-10 mt-6 w-full flex flex-col items-center gap-4">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            Identity Progression Path
          </span>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-center select-none font-display font-black text-xs sm:text-sm md:text-base uppercase tracking-widest text-slate-400">
            <span className="hover:text-white transition-colors duration-300">Curiosity</span>
            <span className="text-slate-600 font-sans font-light">&rarr;</span>
            <span className="hover:text-white transition-colors duration-300">Design</span>
            <span className="text-slate-600 font-sans font-light">&rarr;</span>
            <span className="hover:text-white transition-colors duration-300">Development</span>
            <span className="text-slate-600 font-sans font-light">&rarr;</span>
            <span className="hover:text-white transition-colors duration-300 text-gradient-blue">AI</span>
            <span className="text-slate-600 font-sans font-light">&rarr;</span>
            <span className="hover:text-white transition-colors duration-300 text-gradient-purple">Entrepreneurship</span>
          </div>
        </div>

      </div>
    </section>
  );
}
