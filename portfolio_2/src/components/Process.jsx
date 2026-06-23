import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, PenTool, Code, Rocket, LifeBuoy } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discover",
    icon: Search,
    color: "#FF3333",
    desc: "We start with deep research and requirements gathering. I analyze your business goals, target audience, and functional specifications to map out the exact system boundaries."
  },
  {
    step: "02",
    title: "Design",
    icon: PenTool,
    color: "#FFFFFF",
    desc: "Crafting custom UI mockups, typography scales, and user flows in Figma. You see and approve the exact pixel blueprints of your application before a single line of code is written."
  },
  {
    step: "03",
    title: "Build",
    icon: Code,
    color: "#FF5E5E",
    desc: "Translating layouts into performant, clean React code. I implement responsive styling, optimize asset rendering, structure relational schemas, and integrate LLM automation pipelines."
  },
  {
    step: "04",
    title: "Launch",
    icon: Rocket,
    color: "#FFFFFF",
    desc: "Configuring secure domains, hosting setups, and database connections. We run page-speed tests and validate local SEO schema tags to ensure the launch is flawless."
  },
  {
    step: "05",
    title: "Support",
    icon: LifeBuoy,
    color: "#FF3333",
    desc: "Post-deployment monitoring and ongoing maintenance. I assist with analytics dashboards, hosting maintenance, performance audits, and long-term capability updates."
  }
];

export default function Process() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Reveal header
    gsap.fromTo(
      ".process-reveal-header",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".process-reveal-header",
          start: "top 80%",
          once: true
        }
      }
    );

    // Staggered timeline path and step reveal
    const stepCards = document.querySelectorAll(".process-step-card");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 65%",
        end: "bottom 85%",
        scrub: 1.2,
      }
    });

    // 1. Draw the vertical red line down the path
    tl.to("#process-timeline-line", {
      scaleY: 1,
      ease: "none",
      duration: stepCards.length * 0.8
    }, 0);

    // 2. Light up each step node and reveal the card content as the line reaches it
    stepCards.forEach((card, index) => {
      const node = card.querySelector(".process-node");
      const dot = card.querySelector(".process-node-dot");
      const innerCard = card.querySelector(".glass-premium");
      const label = card.querySelector(".flex.items-center");

      // Node highlight
      if (node && dot) {
        const stepColor = PROCESS_STEPS[index].color;
        tl.to(node, {
          borderColor: stepColor,
          boxShadow: `0 0 15px ${stepColor}40`,
          scale: 1.15,
          duration: 0.4,
          ease: "power2.out"
        }, index * 0.8);
        
        tl.to(dot, {
          backgroundColor: stepColor,
          duration: 0.4
        }, index * 0.8);
      }

      // Card reveal
      tl.fromTo(
        [innerCard, label],
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out"
        },
        index * 0.8 + 0.1
      );
    });
  }, []);

  return (
    <section
      id="process"
      ref={containerRef}
      className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#050505] border-b border-white/5 z-10"
    >
      <div className="max-w-6xl w-full mx-auto">
        
        {/* Section Header */}
        <div className="process-reveal-header flex flex-col mb-24 max-w-xl">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">
            04 // Development Process
          </span>
          <h2 className="text-4xl sm:text-6xl font-black font-display text-white uppercase tracking-tight mb-6">
            How I <span className="text-gradient-blue">Build</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-sans font-light">
            A reliable and professional 5-step engineering framework designed to translate your ideas into robust software solutions.
          </p>
          <div className="w-12 h-[2px] bg-accent-blue mt-6" />
        </div>

        {/* Timeline Flow */}
        <div className="relative ml-4 sm:ml-12 pl-8 sm:pl-16 space-y-12 max-w-4xl">
          {/* Vertical timeline line background */}
          <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-white/5" />
          
          {/* Animated red timeline line drawing downwards */}
          <div 
            id="process-timeline-line" 
            className="absolute left-0 top-2 w-[1px] bg-accent-blue origin-top scale-y-0" 
            style={{ height: 'calc(100% - 16px)' }}
          />

          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="process-step-card relative flex flex-col lg:flex-row gap-6 lg:gap-12 items-start"
              >
                {/* Glowing Node on Timeline Line */}
                <div 
                  className="process-node absolute -left-[41px] sm:-left-[73px] top-1.5 w-6 h-6 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center transition-all duration-300 z-10"
                >
                  <div className="process-node-dot w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>

                {/* Left block: Step number and title */}
                <div className="flex items-center gap-4 min-w-[200px] opacity-0">
                  <span className="text-2xl font-black font-display text-slate-600">
                    {step.step}
                  </span>
                  <h3 className="text-xl font-bold font-display text-white uppercase tracking-wider">
                    {step.title}
                  </h3>
                </div>

                {/* Right block: Description Card */}
                <div className="flex-1 glass-premium p-6 w-full opacity-0">
                  <div className="flex items-start gap-4 mb-4">
                    <Icon className="w-5 h-5 mt-0.5" style={{ color: step.color }} />
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest pt-1">
                      Phase {step.step} // Specifications
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans font-light">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
