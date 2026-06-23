import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Target, Rocket } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ShubDeepLabs() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 76%",
          once: true
        }
      }
    );
  }, []);

  return (
    <section
      id="shubdeeplabs"
      ref={containerRef}
      className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#050505] border-b border-white/5 z-10 opacity-0"
    >
      <div className="max-w-6xl w-full mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col mb-24 max-w-xl">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">
            08 // Agency Brand Profile
          </span>
          <h2 className="text-4xl sm:text-6xl font-black font-display text-white uppercase tracking-tight mb-6">
            ShubDeep <span className="text-gradient-red font-extended">Labs</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-sans font-light">
             Bypassing traditional agency overhead to deliver premium, bespoke software and AI systems directly to modern businesses.
          </p>
          <div className="w-12 h-[2px] bg-secondary-violet mt-6" />
        </div>

        {/* Editorial Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start font-sans">
          
          {/* Left Column: Vision & Founder Story (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono text-secondary-violet uppercase tracking-widest">
                // Founder Vision & Story
              </span>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-light">
                ShubDeep Labs was founded to solve a critical business problem: the communication gap and bloating that occurs when creative design is separated from raw technology development. By merging custom user experience wireframes directly with high-performance React and Node codebases, we ensure your product requirements translate exactly into production.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-white/5 pt-8 mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <ShieldCheck className="w-4 h-4 text-secondary-violet" />
                  <span className="text-xs uppercase tracking-wider font-display font-bold">Reliable Execution</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  We write clean, documented React and Node.js solutions designed to remain stable as your user traffic scales.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Target className="w-4 h-4 text-secondary-violet" />
                  <span className="text-xs uppercase tracking-wider font-display font-bold">Client Alignment</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Your milestone scopes, budgets, and communication channels are configured direct to the source.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Branded Ecosystem Details (5 cols) */}
          <div className="lg:col-span-5 glass-premium p-8 border border-white/5 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                Ecosystem Metrics
              </span>
              <h3 className="text-xl font-bold font-display text-white uppercase tracking-tight">
                Current Focus
              </h3>
            </div>

            <div className="flex flex-col gap-6 text-xs leading-relaxed">
              <div className="flex flex-col gap-1.5 pb-4 border-b border-white/5">
                <span className="font-mono text-[9px] text-slate-500 uppercase">Core Services</span>
                <p className="text-slate-300 font-light">
                  Bespoke Website Development, Business Mockups, and Automated Support Ticketing Pipelines.
                </p>
              </div>

              <div className="flex flex-col gap-1.5 pb-4 border-b border-white/5">
                <span className="font-mono text-[9px] text-slate-500 uppercase">Future Ambition</span>
                <p className="text-slate-300 font-light">
                  Expanding our workflow automation suite to build proprietary, developer-first tooling and intelligent agency dashboards.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[9px] text-slate-500 uppercase">Related Projects</span>
                <p className="text-slate-300 font-light">
                  ShubDeep Labs Client Operations Platform, Automated LLM support pipeline, Solapur Business listings mapping.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
