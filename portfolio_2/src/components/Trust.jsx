import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO = [
  {
    num: "01",
    title: "Personal Attention",
    desc: "I limit active client contracts to 1 or 2 at any given time. This guarantees that your business needs, custom requests, and queries receive my undivided intellectual energy."
  },
  {
    num: "02",
    title: "Fast Communication",
    desc: "No middle management or translation lag. You discuss details directly with the developer coding your site. Daily updates via Slack/WhatsApp keep project goals aligned."
  },
  {
    num: "03",
    title: "Affordable Pricing",
    desc: "Clear milestone-based pricing linked strictly to scope and approved delivery. No hidden agency markups or surprise billing overheads."
  },
  {
    num: "04",
    title: "Modern Technologies",
    desc: "No bloated page builders. Everything is coded from scratch using React, Next.js, and Tailwind CSS, guaranteeing sub-1.5s loads, clean SEO rank, and code longevity."
  },
  {
    num: "05",
    title: "Long-Term Support",
    desc: "Deploying is just step one. I assist with secure hosting configuration, domain routing, Google Search Console audits, and provide packages for updates."
  },
  {
    num: "06",
    title: "Creative Problem Solving",
    desc: "Custom visual layouts, bespoke animations, and interactive intake components designed to engage your specific target audience."
  }
];

export default function Trust() {
  const containerRef = useRef(null);

  useEffect(() => {
    const rows = document.querySelectorAll(".manifesto-row");
    rows.forEach((row) => {
      const title = row.querySelector(".manifesto-title");
      const desc = row.querySelector(".manifesto-desc");

      // Highlight the title (stroke to solid white) when it enters the viewport center
      gsap.fromTo(
        title,
        { webkitTextStroke: "1px rgba(255, 255, 255, 0.15)", color: "transparent" },
        {
          webkitTextStroke: "1px rgba(255, 255, 255, 0.0)",
          color: "#ffffff",
          scrollTrigger: {
            trigger: row,
            start: "top 70%",
            end: "top 40%",
            scrub: true
          }
        }
      );

      // Fade-in the description
      gsap.fromTo(
        desc,
        { opacity: 0.1, y: 15 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: row,
            start: "top 68%",
            end: "top 42%",
            scrub: true
          }
        }
      );
    });
  }, []);

  return (
    <section
      id="trust"
      ref={containerRef}
      className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#030303] border-b border-white/5 z-10"
    >
      <div className="max-w-6xl w-full mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col mb-24 max-w-xl">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">
            06 // Core Philosophy
          </span>
          <h2 className="text-4xl sm:text-6xl font-black font-display text-white uppercase tracking-tight mb-6">
            The <span className="text-gradient-blue">Manifesto</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-sans font-light">
            I approach engineering as a direct partnership. Here are the practical principles and guarantees I bring to every client project.
          </p>
          <div className="w-12 h-[2px] bg-accent-blue mt-6" />
        </div>

        {/* Manifesto Vertical Flow */}
        <div className="flex flex-col border-t border-white/10">
          {MANIFESTO.map((item, idx) => (
            <div 
              key={idx}
              className="manifesto-row border-b border-white/10 py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans"
            >
              {/* Number Index */}
              <div className="lg:col-span-1 font-mono text-slate-500 text-xs sm:text-sm pt-2">
                [{item.num}]
              </div>

              {/* Interactive Title Statement */}
              <div className="lg:col-span-7">
                <h3 className="manifesto-title text-2xl sm:text-4xl lg:text-5xl font-black font-display uppercase tracking-tight leading-none">
                  {item.title}
                </h3>
              </div>

              {/* Description Statement */}
              <div className="lg:col-span-4 manifesto-desc opacity-10">
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
