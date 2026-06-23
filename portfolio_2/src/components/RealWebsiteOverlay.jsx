import React, { useState, useEffect } from "react";
import { X, Clock, ExternalLink } from "lucide-react";

export default function RealWebsiteOverlay({ onClose }) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    // Scroll lock the body when overlay is open
    document.body.style.overflow = "hidden";

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      document.body.style.overflow = "";
      clearInterval(timer);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black z-[150] flex flex-col font-sans">
      
      {/* Top Floating Glass Header Bar */}
      <div className="w-full h-14 backdrop-blur-md bg-black/75 border-b border-white/10 px-6 flex items-center justify-between z-50 shrink-0">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">Live Site: Shubdeep Labs</span>
          <a 
            href="https://shubh-deep-labs.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-500 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Center: Countdown Timer Widget */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-yellow-400" />
          <span>Auto-returning in <span className="font-bold text-yellow-400 font-mono">{timeLeft}s</span></span>
        </div>

        {/* Right: Manual Close Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/20 hover:border-white/50 bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <span>Return Now</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Website Frame */}
      <div className="w-full flex-grow bg-zinc-900 relative">
        {/* Iframe loading the user's real website */}
        <iframe 
          src="https://shubh-deep-labs.vercel.app/" 
          className="w-full h-full border-none bg-white"
          title="Shubdeep Labs Live Website"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        />
      </div>

    </div>
  );
}
