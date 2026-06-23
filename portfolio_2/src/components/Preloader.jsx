import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const progressLineRef = useRef(null);

  useEffect(() => {
    // 1. Progress Counter Animation
    const obj = { val: 0 };
    const timeline = gsap.timeline({
      onComplete: () => {
        // Smooth cinematic transition out (shutter fade & zoom)
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.05,
          filter: "blur(15px)",
          duration: 1.0,
          ease: "power4.inOut",
          onComplete: onComplete
        });
      }
    });

    timeline.to(obj, {
      val: 100,
      duration: 1.8,
      ease: "power3.inOut",
      onUpdate: () => {
        setProgress(Math.floor(obj.val));
      }
    });

    // 2. Title cinematic blur-to-sharp scale reveal
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, scale: 0.88, filter: "blur(15px)" },
      { opacity: 1, scale: 1.02, filter: "blur(0px)", duration: 1.6, ease: "power4.out", delay: 0.1 }
    );

    return () => {
      timeline.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505] select-none overflow-hidden"
    >
      <div className="flex flex-col items-center max-w-sm w-full px-6">
        {/* Name Title */}
        <h2 
          ref={titleRef}
          className="text-white text-sm font-display tracking-[0.3em] uppercase mb-12 opacity-0"
        >
          SHUBHAM <span className="text-accent-blue font-extended">VERNEKAR</span>
        </h2>

        {/* Minimal Progress Line */}
        <div className="w-full h-[1px] bg-white/10 relative mb-4">
          <div 
            ref={progressLineRef}
            className="absolute top-0 left-0 h-full bg-accent-blue transition-all duration-75 shadow-[0_0_8px_rgba(255,51,51,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="flex justify-between w-full text-slate-500 font-mono text-[10px] tracking-widest">
          <span>CREATIVE PORTFOLIO</span>
          <span className="text-white font-medium">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
