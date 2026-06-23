import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RESULTS_HIGHLIGHTS = [
  {
    metric: "+40%",
    start: 0,
    target: 40,
    prefix: "+",
    suffix: "%",
    title: "Page Speed Boost",
    desc: "React code optimization and static data caching."
  },
  {
    metric: "12 hrs",
    start: 0,
    target: 12,
    prefix: "",
    suffix: " hrs",
    title: "Weekly Labor Saved",
    desc: "AI workflow parsing and ticket categorization."
  },
  {
    metric: "Top 3",
    start: 10,
    target: 3,
    prefix: "Top ",
    suffix: "",
    title: "Local SEO Rankings",
    desc: "Map integrations and structured schemas."
  }
];

export default function ClientImpact() {
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

    // Animate counter metrics on scroll
    const counters = document.querySelectorAll(".metric-counter");
    counters.forEach((counter) => {
      const target = parseFloat(counter.getAttribute("data-target"));
      const prefix = counter.getAttribute("data-prefix") || "";
      const suffix = counter.getAttribute("data-suffix") || "";
      const startVal = parseFloat(counter.getAttribute("data-start")) || 0;
      
      const obj = { val: startVal };
      gsap.to(obj, {
        val: target,
        duration: 2.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: counter,
          start: "top 85%",
          once: true
        },
        onUpdate: () => {
          const currentVal = Math.floor(obj.val);
          counter.textContent = `${prefix}${currentVal}${suffix}`;
        }
      });
    });
  }, []);

  return (
    <section
      id="impact"
      ref={containerRef}
      className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#030303] border-b border-white/5 z-10 opacity-0"
    >
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Oversized Factual Metrics Stack (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-12 pt-2">
          
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-4 block">
              07 // Client Success
            </span>
            <h2 className="text-4xl sm:text-6xl font-black font-display text-white uppercase tracking-tight">
              Factual <br />
              <span className="text-gradient-blue">Outcomes</span>
            </h2>
            <div className="w-12 h-[2px] bg-accent-blue mt-4" />
          </div>

          <div className="flex flex-col gap-10">
            {RESULTS_HIGHLIGHTS.map((res, idx) => (
              <div key={idx} className="flex items-start gap-6 font-sans">
                <span 
                  className="metric-counter text-4xl sm:text-5xl font-black font-display text-white tracking-tight leading-none w-28 flex-shrink-0 select-none"
                  data-start={res.start}
                  data-target={res.target}
                  data-prefix={res.prefix}
                  data-suffix={res.suffix}
                >
                  {res.metric}
                </span>
                <div className="flex flex-col gap-1 pt-0.5">
                  <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider">
                    {res.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                    {res.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Layered Magazine Testimonial Spread (7 cols) */}
        <div className="lg:col-span-7 w-full border-t lg:border-t-0 lg:border-l border-white/10 pt-12 lg:pt-0 lg:pl-16 relative">
          
          {/* Giant decorative quotation mark */}
          <span className="text-[140px] font-display font-black text-white/5 absolute -top-20 left-4 lg:left-12 select-none pointer-events-none">
            “
          </span>

          <div className="flex flex-col gap-8 relative z-10">
            <p className="text-lg sm:text-2xl text-slate-200 font-sans font-light leading-relaxed italic pr-4">
              "Working with Shubham was smooth and direct. He understood our workflow requirements, automated the email backlog, and saved our team hours of manual data entry every single week. The communication was direct, the pricing was transparent, and the product was delivered exactly on schedule."
            </p>
            
            <div className="flex flex-col gap-1.5 border-t border-white/5 pt-6 max-w-sm">
              <span className="text-xs font-bold font-display text-white uppercase tracking-wider">
                Local Service Business Operations
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                Automated Support Intake Client
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
