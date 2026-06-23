import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";
import TextReveal from "./TextReveal";

import aiAutomationMockup from "../assets/ai_automation_mockup.png";
import businessDirectoryMockup from "../assets/business_directory_mockup.png";

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ onViewAcademic, onViewRealWebsite }) {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const clickTimeoutRef = useRef(null);

  const handleClicks = (e) => {
    if (e.detail === 1) {
      clickTimeoutRef.current = setTimeout(() => {
        onViewAcademic();
      }, 250);
    } else if (e.detail === 2) {
      clearTimeout(clickTimeoutRef.current);
      onViewRealWebsite();
    }
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const panels = document.querySelectorAll(".project-panel");
    let ctx = gsap.context(() => {
      // 1. Desktop Pin & Horizontal Scroll (Only for screens 1024px and wider)
      if (!isMobile) {
        let totalWidth = 0;
        panels.forEach((panel) => {
          totalWidth += panel.offsetWidth;
        });

        // Master scroll-scrub timeline (added scroll distance for zoom hold)
        const masterTL = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            pin: true,
            scrub: 1.2,
            start: "top top",
            end: () => `+=${totalWidth - window.innerWidth + 5000}`,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        });

        const panel0Width = panels[0].offsetWidth;
        const panel1Width = panels[1].offsetWidth;
        const panel2Width = panels[2].offsetWidth;

        const panel1Details = panels[1].querySelector(".case-study-details");
        const panel1PhoneWrapper = panels[1].querySelector(".phone-zoom-wrapper");
        const panel1PhoneScreen = panels[1].querySelector(".phone-zoom-screen");
        const panel1Label = panels[1].querySelector(".phone-instruction-label");
        const panel1Notch = panels[1].querySelector(".phone-notch");

        const panel2Details = panels[2].querySelector(".case-study-details");
        const panel2PhoneWrapper = panels[2].querySelector(".phone-zoom-wrapper");
        const panel2PhoneScreen = panels[2].querySelector(".phone-zoom-screen");
        const panel2Label = panels[2].querySelector(".phone-instruction-label");
        const panel2Notch = panels[2].querySelector(".phone-notch");

        const panel3Details = panels[3].querySelector(".case-study-details");
        const panel3PhoneWrapper = panels[3].querySelector(".phone-zoom-wrapper");
        const panel3PhoneScreen = panels[3].querySelector(".phone-zoom-screen");
        const panel3Label = panels[3].querySelector(".phone-instruction-label");
        const panel3Notch = panels[3].querySelector(".phone-notch");

        // Step A: Scroll horizontally to Panel 1 (Shubdeep Labs panel)
        masterTL.to(pinRef.current, {
          x: -panel0Width,
          ease: "none",
          duration: 1
        });

        // Step B: Zoom and Rotate the Shubdeep Phone to Landscape, Centering in Viewport
        masterTL.to(panel1Details, {
          opacity: 0,
          scale: 0.8,
          visibility: "hidden", // Disable rendering completely to prevent backdrop-filter clipping bugs
          pointerEvents: "none",
          duration: 0.6,
          ease: "power2.out"
        })
        .to(panel1Label, {
          x: () => window.innerWidth * 0.285,
          scale: 1.1,
          color: "#FF3333", // Change color to highlight/red theme color during zoom
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel1PhoneWrapper, {
          rotate: 90,
          scale: () => {
            const targetHeight = window.innerHeight * 0.82;
            const targetScaleHeight = targetHeight / 190; // phone is 190px wide (height in landscape)
            const targetScaleWidth = (window.innerWidth * 0.82) / 400; // phone is 400px high (width in landscape)
            return Math.min(targetScaleHeight, targetScaleWidth);
          },
          x: () => window.innerWidth * 0.285,
          // Clear overflow clip during zoom so rotated wider child renders fully
          overflow: "visible",
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel1PhoneScreen, {
          rotate: -90,
          width: 400,
          height: 190,
          borderRadius: "22px",
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel1Notch, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "<");

        // Step C: Scroll Pause / Hold to showcase the Shubdeep video in landscape
        masterTL.to({}, { duration: 2.0 });

        // Step D: Reverse zoom, rotate back, and restore panel text
        masterTL.to(panel1PhoneScreen, {
          rotate: 0,
          width: "100%",
          height: "100%",
          duration: 1.0,
          ease: "power2.inOut"
        })
        .to(panel1PhoneWrapper, {
          rotate: 0,
          scale: 1,
          x: 0,
          overflow: "hidden",
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel1Label, {
          x: 0,
          scale: 1,
          color: "#94a3b8", // text-slate-400 equivalent
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel1Details, {
          opacity: 1,
          scale: 1,
          visibility: "visible", // Restore rendering
          pointerEvents: "auto",
          duration: 0.6,
          ease: "power2.in"
        }, ">-0.4")
        .to(panel1Notch, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.in"
        }, ">-0.4");

        // Step E: Scroll horizontally to Panel 2 (Saira Outlet panel)
        masterTL.to(pinRef.current, {
          x: -(panel0Width + panel1Width),
          ease: "none",
          duration: 1
        });

        // Step F: Zoom and Rotate the Saira Phone to Landscape, Centering in Viewport
        masterTL.to(panel2Details, {
          opacity: 0,
          scale: 0.8,
          visibility: "hidden",
          pointerEvents: "none",
          duration: 0.6,
          ease: "power2.out"
        })
        .to(panel2Label, {
          x: () => window.innerWidth * 0.285,
          scale: 1.1,
          color: "#a855f7", // purple accent color for Saira
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel2PhoneWrapper, {
          rotate: 90,
          scale: () => {
            const targetHeight = window.innerHeight * 0.82;
            const targetScaleHeight = targetHeight / 190;
            const targetScaleWidth = (window.innerWidth * 0.82) / 400;
            return Math.min(targetScaleHeight, targetScaleWidth);
          },
          x: () => window.innerWidth * 0.285,
          overflow: "visible",
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel2PhoneScreen, {
          rotate: -90,
          width: 400,
          height: 190,
          borderRadius: "22px",
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel2Notch, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "<");

        // Step G: Scroll Pause / Hold to showcase the Saira video in landscape
        masterTL.to({}, { duration: 2.0 });

        // Step H: Reverse zoom, rotate back, and restore panel text
        masterTL.to(panel2PhoneScreen, {
          rotate: 0,
          width: "100%",
          height: "100%",
          duration: 1.0,
          ease: "power2.inOut"
        })
        .to(panel2PhoneWrapper, {
          rotate: 0,
          scale: 1,
          x: 0,
          overflow: "hidden",
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel2Label, {
          x: 0,
          scale: 1,
          color: "#94a3b8",
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel2Details, {
          opacity: 1,
          scale: 1,
          visibility: "visible",
          pointerEvents: "auto",
          duration: 0.6,
          ease: "power2.in"
        }, ">-0.4")
        .to(panel2Notch, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.in"
        }, ">-0.4");

        // Step I: Scroll horizontally to Panel 3 (GreenVision panel)
        masterTL.to(pinRef.current, {
          x: -(panel0Width + panel1Width + panel2Width),
          ease: "none",
          duration: 1
        });

        // Step J: Zoom and Rotate the GreenVision Phone to Landscape, Centering in Viewport
        masterTL.to(panel3Details, {
          opacity: 0,
          scale: 0.8,
          visibility: "hidden",
          pointerEvents: "none",
          duration: 0.6,
          ease: "power2.out"
        })
        .to(panel3Label, {
          x: () => window.innerWidth * 0.285,
          scale: 1.1,
          color: "#10b981", // emerald accent color for GreenVision
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel3PhoneWrapper, {
          rotate: 90,
          scale: () => {
            const targetHeight = window.innerHeight * 0.82;
            const targetScaleHeight = targetHeight / 190;
            const targetScaleWidth = (window.innerWidth * 0.82) / 400;
            return Math.min(targetScaleHeight, targetScaleWidth);
          },
          x: () => window.innerWidth * 0.285,
          overflow: "visible",
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel3PhoneScreen, {
          rotate: -90,
          width: 400,
          height: 190,
          borderRadius: "22px",
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel3Notch, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "<");

        // Step K: Scroll Pause / Hold to showcase the GreenVision video in landscape
        masterTL.to({}, { duration: 2.0 });

        // Step L: Reverse zoom, rotate back, and restore panel text
        masterTL.to(panel3PhoneScreen, {
          rotate: 0,
          width: "100%",
          height: "100%",
          duration: 1.0,
          ease: "power2.inOut"
        })
        .to(panel3PhoneWrapper, {
          rotate: 0,
          scale: 1,
          x: 0,
          overflow: "hidden",
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel3Label, {
          x: 0,
          scale: 1,
          color: "#94a3b8",
          duration: 1.0,
          ease: "power2.inOut"
        }, "<")
        .to(panel3Details, {
          opacity: 1,
          scale: 1,
          visibility: "visible",
          pointerEvents: "auto",
          duration: 0.6,
          ease: "power2.in"
        }, ">-0.4")
        .to(panel3Notch, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.in"
        }, ">-0.4");

        // Step M: Scroll horizontally through remaining panels (Panels 4 and 5)
        masterTL.to(pinRef.current, {
          x: () => -(totalWidth - window.innerWidth),
          ease: "none",
          duration: 2
        });
      } else {
        // 2. Mobile vertical scroll reveal animation
        const reveals = document.querySelectorAll(".project-reveal-mobile");
        reveals.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 1.0,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 82%",
                once: true
              }
            }
          );
        });
      }
    }, wrapperRef);

    // 3. Card spotlight mouse tracker
    const handleSpotlight = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    const spotlightCards = document.querySelectorAll(".card-spotlight");
    spotlightCards.forEach((card) => {
      card.addEventListener("mousemove", handleSpotlight);
    });

    return () => {
      ctx.revert();
      spotlightCards.forEach((card) => {
        card.removeEventListener("mousemove", handleSpotlight);
      });
    };
  }, [isMobile]);

  return (
    <div 
      ref={wrapperRef} 
      id="projects"
      className="relative bg-[#030303] border-b border-white/5 z-10"
    >
      <div 
        ref={pinRef}
        className="w-full lg:h-screen lg:overflow-visible flex flex-col lg:flex-row items-stretch"
      >
        
        {/* PANEL 0: Intro Section */}
        <div className="project-panel shrink-0 w-full lg:w-[45vw] h-auto lg:h-full flex flex-col justify-center px-6 sm:px-12 lg:px-24 border-b lg:border-b-0 lg:border-r border-white/5 py-24 lg:py-0">
          <div className="projects-intro-content flex flex-col max-w-xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">
              03 // Selective Case Studies
            </span>
            <h2 className="text-4xl sm:text-6xl font-black font-display text-white uppercase tracking-tight mb-6 flex flex-wrap gap-x-4 leading-none">
              <TextReveal className="text-accent-blue font-extended">Featured</TextReveal>
              <TextReveal className="text-gradient-blue">Projects</TextReveal>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-sans font-light mb-6">
              Real solutions designed for real business problems. Exploring the challenges, approaches, and actual outcomes achieved.
            </p>
            <div className="w-12 h-[2px] bg-accent-blue" />
          </div>
        </div>

        {/* PANEL 1: Case Study 1 - ShubDeep Labs */}
        <div className="project-panel project-reveal-mobile shrink-0 w-full lg:w-[85vw] h-auto lg:h-full flex flex-col lg:flex-row items-center justify-center gap-12 px-6 sm:px-12 lg:px-20 border-b lg:border-b-0 lg:border-r border-white/5 py-24 lg:py-0 bg-[#050505]/30 relative">
          
          {/* Left: Interactive Phone Mockup with Cursor Label */}
          <div 
            className="w-full lg:w-1/2 flex flex-col justify-center items-center gap-4 relative z-30"
            data-cursor-label="View"
            onClick={handleClicks}
          >
            {/* Instruction Label above the phone */}
            <div className="phone-instruction-label text-[11px] sm:text-xs font-mono tracking-widest text-slate-400 uppercase select-none flex items-center gap-2 mb-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-blue animate-ping" />
              <span>⚡ Double click video to visit the website</span>
            </div>

            {/* Container for the phone */}
            <div className="flex flex-row items-center justify-center w-full">
              {/* Phone: ShubDeep Labs Platform */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="phone-zoom-wrapper relative w-[140px] sm:w-[160px] aspect-[9/19] rounded-[30px] border-[8px] border-slate-900 bg-slate-950 shadow-xl shadow-accent-blue/10 flex items-stretch z-30 transition-all duration-300 hover:scale-[1.02] hover:border-slate-800">
                  {/* Dynamic Island / Notch */}
                  <div className="phone-notch absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black rounded-full z-20 flex items-center justify-end px-2">
                    <div className="w-1 h-1 rounded-full bg-slate-900" />
                  </div>
                  {/* Screen Content - Video */}
                  <div className="phone-zoom-screen absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-hidden rounded-[22px] bg-slate-950 z-10">
                    <video 
                      id="shubdeeplabs-phone-video"
                      src="/shubdeeplabs_video.mp4" 
                      loop 
                      muted 
                      autoPlay
                      playsInline 
                      className="absolute w-full h-full object-cover pointer-events-none z-10"
                    />
                    <div className="reflection-overlay phone-hardware absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-20 rounded-[22px]" />
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider text-center">01. Labs Platform</span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Detail Card with Spotlight */}
          <div className="case-study-details w-full lg:w-1/2 flex flex-col justify-center card-spotlight p-8 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[16px] font-mono font-bold text-accent-blue">01 //</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Web & Mobile Platforms
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white uppercase tracking-tight mb-4">
              ShubDeep Labs Platform
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6 font-light">
              A highly optimized dashboard and custom operations platform designed to manage internal workflows, customer client accounts, and project metrics.
            </p>

            <div className="space-y-4 border-t border-white/5 pt-5 mb-6 text-xs font-sans">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Problem</span>
                <p className="col-span-9 text-slate-400 font-light">Traditional agency dashboards are bloated, load slowly, and fail to provide direct connection to developer environments.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Process</span>
                <p className="col-span-9 text-slate-400 font-light font-sans leading-relaxed">Designed desktop database portals, optimized complex PostgreSQL relational queries, and integrated real-time state sync.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Solution</span>
                <p className="col-span-9 text-slate-400 font-light font-sans leading-relaxed">Engineered a custom admin portal using React, Vite, and Tailwind CSS, backed by a robust Express/PostgreSQL API.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Outcome</span>
                <p className="col-span-9 text-slate-200 font-medium font-sans leading-relaxed font-medium">+40% speed boost on administrative dashboards; 100% data consistency across client pipelines.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Technologies</span>
                <p className="col-span-9 text-slate-400 font-light font-mono text-[10px]">React, Vite, Tailwind CSS, Node.js, Express, PostgreSQL</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-5 flex items-center justify-between">
              <span className="text-[9px] font-mono text-slate-500">// Web & Mobile Platforms</span>
              <button 
                onClick={onViewAcademic}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-slate-900 border border-white/10 hover:border-accent-blue/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,217,255,0.1)] cursor-pointer"
              >
                <span>Open website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* PANEL 2: Case Study 2 - Saira Fashion Outlet */}
        <div className="project-panel project-reveal-mobile shrink-0 w-full lg:w-[85vw] h-auto lg:h-full flex flex-col lg:flex-row items-center justify-center gap-12 px-6 sm:px-12 lg:px-20 border-b lg:border-b-0 lg:border-r border-white/5 py-24 lg:py-0 bg-[#050505]/30 relative">
          
          {/* Left: Interactive Phone Mockup with Cursor Label */}
          <div 
            className="w-full lg:w-1/2 flex flex-col justify-center items-center gap-4 relative z-30"
          >
            {/* Instruction Label above the phone */}
            <div className="phone-instruction-label text-[11px] sm:text-xs font-mono tracking-widest text-slate-400 uppercase select-none flex items-center gap-2 mb-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
              <span>⚡ Mobile Storefront Case Study</span>
            </div>

            {/* Container for the phone */}
            <div className="flex flex-row items-center justify-center w-full">
              {/* Phone: Saira Outlet */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="phone-zoom-wrapper relative w-[140px] sm:w-[160px] aspect-[9/19] rounded-[30px] border-[8px] border-slate-900 bg-slate-950 shadow-xl shadow-purple-500/10 flex items-stretch z-30 transition-all duration-300 hover:scale-[1.02] hover:border-slate-800">
                  {/* Dynamic Island / Notch */}
                  <div className="phone-notch absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black rounded-full z-20 flex items-center justify-end px-2">
                    <div className="w-1 h-1 rounded-full bg-slate-900" />
                  </div>
                  {/* Screen Content - Video */}
                  <div className="phone-zoom-screen absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-hidden rounded-[22px] bg-slate-950 z-10">
                    <video 
                      id="saira-phone-video"
                      src="/saira _fo.mp4" 
                      loop 
                      muted 
                      autoPlay
                      playsInline 
                      className="absolute w-full h-full object-cover pointer-events-none z-10"
                    />
                    <div className="reflection-overlay phone-hardware absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-20 rounded-[22px]" />
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider text-center">02. Saira Outlet</span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Detail Card with Spotlight */}
          <div className="case-study-details w-full lg:w-1/2 flex flex-col justify-center card-spotlight p-8 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[16px] font-mono font-bold text-purple-400">02 //</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Web & Mobile Platforms
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white uppercase tracking-tight mb-4">
              Saira Fashion Outlet
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6 font-light">
              A premium boutique mobile storefront and custom e-commerce solution designed for seamless customer checkouts and high conversion rates.
            </p>

            <div className="space-y-4 border-t border-white/5 pt-5 mb-6 text-xs font-sans">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Problem</span>
                <p className="col-span-9 text-slate-400 font-light">Standard e-commerce platforms rely on high fee third-party software, bloated templates, and slow product catalogs that disrupt user conversion.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Process</span>
                <p className="col-span-9 text-slate-400 font-light font-sans leading-relaxed">Designed elegant mobile-first storefront pages, optimized catalog imagery, and integrated secure payment pipelines.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Solution</span>
                <p className="col-span-9 text-slate-400 font-light font-sans leading-relaxed">Engineered a custom React mobile-optimized e-commerce portal utilizing MongoDB and fast image caching.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Outcome</span>
                <p className="col-span-9 text-slate-200 font-medium font-sans leading-relaxed font-medium">+18% improvement in customer conversion rates; sub-second page loads on catalog browsing.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Technologies</span>
                <p className="col-span-9 text-slate-400 font-light font-mono text-[10px]">React, Vite, Tailwind CSS, Node.js, Express, MongoDB</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-5">
              <span className="text-[9px] font-mono text-purple-400">// Mobile E-Commerce Showcase</span>
            </div>
          </div>
        </div>

        {/* PANEL 3: Case Study 3 - GreenVision */}
        <div className="project-panel project-reveal-mobile shrink-0 w-full lg:w-[85vw] h-auto lg:h-full flex flex-col lg:flex-row items-center justify-center gap-12 px-6 sm:px-12 lg:px-20 border-b lg:border-b-0 lg:border-r border-white/5 py-24 lg:py-0 bg-[#050505]/30 relative">
          
          {/* Left: Interactive Phone Mockup with Cursor Label */}
          <div 
            className="w-full lg:w-1/2 flex flex-col justify-center items-center gap-4 relative z-30"
          >
            {/* Instruction Label above the phone */}
            <div className="phone-instruction-label text-[11px] sm:text-xs font-mono tracking-widest text-slate-400 uppercase select-none flex items-center gap-2 mb-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>⚡ Eco-Tracking Case Study</span>
            </div>

            {/* Container for the phone */}
            <div className="flex flex-row items-center justify-center w-full">
              {/* Phone: GreenVision */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="phone-zoom-wrapper relative w-[140px] sm:w-[160px] aspect-[9/19] rounded-[30px] border-[8px] border-slate-900 bg-slate-950 shadow-xl shadow-emerald-500/10 flex items-stretch z-30 transition-all duration-300 hover:scale-[1.02] hover:border-slate-800">
                  {/* Dynamic Island / Notch */}
                  <div className="phone-notch absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black rounded-full z-20 flex items-center justify-end px-2">
                    <div className="w-1 h-1 rounded-full bg-slate-900" />
                  </div>
                  {/* Screen Content - Video */}
                  <div className="phone-zoom-screen absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-hidden rounded-[22px] bg-slate-950 z-10">
                    <video 
                      id="greenvision-phone-video"
                      src="/greenvision.mp4" 
                      loop 
                      muted 
                      autoPlay
                      playsInline 
                      className="absolute w-full h-full object-cover pointer-events-none z-10"
                    />
                    <div className="reflection-overlay phone-hardware absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-20 rounded-[22px]" />
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider text-center">03. GreenVision Portal</span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Detail Card with Spotlight */}
          <div className="case-study-details w-full lg:w-1/2 flex flex-col justify-center card-spotlight p-8 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[16px] font-mono font-bold text-emerald-400">03 //</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Eco-Tracking & ESG Platform
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white uppercase tracking-tight mb-4">
              GreenVision Portal
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6 font-light">
              An interactive mobile-first platform designed to monitor energy usage, ESG metrics, and carbon emissions for sustainable resource optimization.
            </p>

            <div className="space-y-4 border-t border-white/5 pt-5 mb-6 text-xs font-sans">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Problem</span>
                <p className="col-span-9 text-slate-400 font-light">Organizations struggle to monitor carbon emissions, waste compliance, and ESG goals in real-time, relying on outdated annual spreadsheets.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Process</span>
                <p className="col-span-9 text-slate-400 font-light font-sans leading-relaxed">Designed data-rich mobile dashboards, connected cloud IoT sensors, developed automated Carbon Footprint calculation modules, and visualised compliance curves.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Solution</span>
                <p className="col-span-9 text-slate-400 font-light font-sans leading-relaxed">Created GreenVision - an interactive mobile dashboard leveraging Next.js-inspired React, Fast IoT APIs, and responsive data charts.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Outcome</span>
                <p className="col-span-9 text-slate-200 font-medium font-sans leading-relaxed font-medium">Successfully reduced corporate client energy consumption by 24% and simplified regulatory auditing from 3 weeks to 1 hour.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Technologies</span>
                <p className="col-span-9 text-slate-400 font-light font-mono text-[10px]">React, Vite, Tailwind CSS, Node.js, IoT Telemetry, Chart.js</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-5">
              <span className="text-[9px] font-mono text-emerald-400">// Smart Green Tech Ecosystem</span>
            </div>
          </div>
        </div>

        {/* PANEL 4: Case Study 4 */}
        <div className="project-panel project-reveal-mobile shrink-0 w-full lg:w-[85vw] h-auto lg:h-full flex flex-col lg:flex-row items-center justify-center gap-12 px-6 sm:px-12 lg:px-20 border-b lg:border-b-0 lg:border-r border-white/5 py-24 lg:py-0 bg-[#030303]">
          
          {/* Left: Interactive Mockup */}
          <div 
            className="w-full lg:w-1/2 group cursor-pointer order-1 lg:order-2"
            data-cursor-label="View"
          >
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-950 p-2 shadow-2xl group-hover:border-white/20 transition-all duration-500">
              <img 
                src={aiAutomationMockup} 
                alt="AI Workflow Automation Portal"
                className="w-full aspect-[16/10] object-cover object-top rounded-lg group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right: Editorial Detail Card with Spotlight */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center order-2 lg:order-1 card-spotlight p-8 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[16px] font-mono font-bold text-accent-blue">04 //</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Enterprise AI Integration
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white uppercase tracking-tight mb-4">
              AI Automation Portal
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6 font-light">
              An intelligent system that leverages large language models to scan, categorize, and route incoming support tickets to correct team members.
            </p>

            <div className="space-y-4 border-t border-white/5 pt-5 mb-6 text-xs font-sans">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Problem</span>
                <p className="col-span-9 text-slate-400 font-light">A service provider was losing 12 hours of manual employee labor every week simply reading, classifying, and transferring support requests.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Process</span>
                <p className="col-span-9 text-slate-400 font-light font-sans leading-relaxed">Audited existing email streams and ticketing patterns, developed semantic classification benchmarks, built a FastAPI middleware pipeline for asynchronous model calls, and established automated validation loops to monitor classification drift.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Solution</span>
                <p className="col-span-9 text-slate-400 font-light font-sans leading-relaxed">Designed a Node.js automation pipeline utilizing LangChain, OpenAI APIs, and vector embeddings for semantic classification.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Outcome</span>
                <p className="col-span-9 text-slate-200 font-medium font-sans leading-relaxed font-medium">Reduced sorting time to under 10 seconds, saving 12 hours/week and cutting response lag by 30%.</p>
              </div>
              <div className="grid grid-cols-12 gap-2 border-t border-white/5 pt-3">
                <span className="col-span-3 font-mono text-[9px] text-slate-500 uppercase">Technologies</span>
                <p className="col-span-9 text-slate-400 font-light font-mono text-[10px]">Node.js, LangChain, OpenAI API, Python, FastAPI, Docker</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-5">
              <span className="text-[9px] font-mono text-slate-500">// Support Automation Middleware</span>
            </div>
          </div>
        </div>

        {/* PANEL 5: Case Study 5 */}
        <div className="project-panel project-reveal-mobile shrink-0 w-full lg:w-[95vw] h-auto lg:h-full flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20 py-24 lg:py-0 bg-[#050505]/40">
          
          {/* Top Banner Mockup with Cursor Label */}
          <div 
            className="w-full group cursor-pointer mb-12"
            data-cursor-label="View"
          >
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-950 p-2 shadow-2xl group-hover:border-white/20 transition-all duration-500">
              <img 
                src={businessDirectoryMockup} 
                alt="Solapur Business Directory Map"
                className="w-full aspect-[21/9] object-cover object-center rounded-lg group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Bottom Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            {/* Category info */}
            <div className="lg:col-span-4 flex flex-col justify-between card-spotlight p-6 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-[16px] font-mono font-bold text-accent-blue">05 //</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    Geographical SEO Directory
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-display text-white uppercase tracking-tight">
                  Solapur Vendor Directory
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed font-light mb-4">
                  A fast, responsive search directory designed to connect Solapur clients directly with local service providers and map routing.
                </p>
              </div>
              <div className="flex flex-col gap-2 border-t border-white/5 pt-4 mt-4">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Technologies Used</span>
                <p className="text-slate-400 font-light font-mono text-[10px]">React, Vite, Tailwind CSS, Google Maps API, Local SEO Schema</p>
              </div>
            </div>

            {/* Problem & Process */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-6 text-xs font-sans font-light card-spotlight p-6 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Problem</span>
                <p className="text-slate-300 leading-relaxed">Local service vendors in Solapur lacked a unified digital search listing, making them dependent on expensive offline advertising or lead brokers.</p>
              </div>
              <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Process</span>
                <p className="text-slate-300 leading-relaxed font-light">Researched local search queries in Solapur, mapped regional database schemas, designed an optimized GeoJSON search query index, and built a static page builder to pre-render vendor pages.</p>
              </div>
            </div>

            {/* Solution & Outcome */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-6 text-xs font-sans font-light card-spotlight p-6 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Solution</span>
                <p className="text-slate-300 leading-relaxed font-light">Developed a fast search directory utilising structured schema markup for local SEO rankings, static React page caching, and map locations.</p>
              </div>
              <div className="flex flex-col gap-2 border-t border-white/5 pt-4 text-xs font-sans">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Outcome</span>
                <p className="text-slate-200 font-medium leading-relaxed">Achieved top 3 Google local search rankings for main keywords, driving direct, organic phone calls and leads to listed vendors.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
