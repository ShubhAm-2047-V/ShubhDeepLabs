import { useState, useEffect, useRef } from "react";
import ThreeCanvas from "./components/ThreeCanvas";
import ErrorBoundary from "./components/ErrorBoundary";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function App() {
  const scrollProgressRef = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", (e) => {
      scrollProgressRef.current = e.progress || 0;
      ScrollTrigger.update();
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // GSAP ScrollTrigger Animations for sections (fade in)
    const sections = document.querySelectorAll(".section-fade");
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    // Scroll-triggered background color themes per section
    const colorThemes = [
      { id: "#about",    bg: "#05091a", glow1: "rgba(59,130,246,0.12)",  glow2: "rgba(139,92,246,0.06)"  },
      { id: "#skills",   bg: "#060b14", glow1: "rgba(14,165,233,0.14)",  glow2: "rgba(59,130,246,0.06)"  },
      { id: "#projects", bg: "#08051a", glow1: "rgba(139,92,246,0.14)",  glow2: "rgba(217,70,239,0.07)"  },
      { id: "#timeline", bg: "#0a0514", glow1: "rgba(217,70,239,0.12)",  glow2: "rgba(139,92,246,0.07)"  },
      { id: "#services", bg: "#04100a", glow1: "rgba(16,185,129,0.12)",  glow2: "rgba(14,165,233,0.06)"  },
      { id: "#contact",  bg: "#0a0505", glow1: "rgba(239,68,68,0.10)",   glow2: "rgba(217,70,239,0.06)"  },
    ];

    const root = document.documentElement;
    const defaultBg    = "#030712";
    const defaultGlow1 = "rgba(0,242,254,0.08)";
    const defaultGlow2 = "rgba(191,85,236,0.04)";

    colorThemes.forEach(({ id, bg, glow1, glow2 }) => {
      const el = document.querySelector(id);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          gsap.to(root, { "--scroll-bg": bg,    duration: 0.8, ease: "power2.out" });
          gsap.to(root, { "--glow1": glow1, "--glow2": glow2, duration: 0.8, ease: "power2.out" });
          gsap.to("body", { backgroundColor: bg, duration: 0.8, ease: "power2.out" });
          gsap.to(".bg-dark-bg", { backgroundColor: bg, duration: 0.8, ease: "power2.out" });
        },
        onLeave: () => {
          gsap.to("body", { backgroundColor: defaultBg, duration: 0.6, ease: "power2.inOut" });
          gsap.to(".bg-dark-bg", { backgroundColor: defaultBg, duration: 0.6, ease: "power2.inOut" });
        },
        onEnterBack: () => {
          gsap.to("body", { backgroundColor: bg, duration: 0.8, ease: "power2.out" });
          gsap.to(".bg-dark-bg", { backgroundColor: bg, duration: 0.8, ease: "power2.out" });
        },
        onLeaveBack: () => {
          gsap.to("body", { backgroundColor: defaultBg, duration: 0.6, ease: "power2.inOut" });
          gsap.to(".bg-dark-bg", { backgroundColor: defaultBg, duration: 0.6, ease: "power2.inOut" });
        },
      });
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-dark-bg text-slate-100 selection:bg-neon-blue/30 selection:text-neon-cyan font-sans overflow-x-hidden">
      {/* 3D Background Canvas */}
      <ErrorBoundary fallback={
        <div className="fixed inset-0 z-[-1] bg-dark-bg w-full h-full overflow-hidden">
          <div className="grid-bg absolute inset-0 opacity-40" />
          <div className="absolute top-[20%] left-[10%] w-[35rem] h-[35rem] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] bg-neon-purple/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        </div>
      }>
        <ThreeCanvas scrollProgressRef={scrollProgressRef} />
      </ErrorBoundary>

      {/* Global Background Grid and Glow */}
      <div className="grid-bg fixed inset-0 pointer-events-none z-[-1]" />
      <div className="grid-bg-glow fixed inset-0 pointer-events-none z-[-1]" />

      {/* Custom Cursor Glow */}
      <CustomCursor />

      {/* Header/Nav */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-dark-bg/40 border-b border-white/5 py-4 px-6 sm:px-12 lg:px-24 flex items-center justify-between">
        <a href="#" className="font-display font-black text-xl tracking-wider text-white hover:opacity-85 transition-opacity">
          SHUBDEEP <span className="text-gradient-cyan-purple">LABS</span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-mono text-slate-400">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#timeline" className="hover:text-white transition-colors">Timeline</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#contact" className="px-4 py-1.5 rounded-full border border-white/10 hover:border-neon-cyan/40 bg-white/5 hover:bg-white/10 text-white transition-all duration-300">
            Let's Talk
          </a>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="flex md:hidden text-white hover:text-neon-cyan transition-colors z-50 p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-dark-bg/95 border-b border-white/10 backdrop-blur-lg flex flex-col items-center py-6 gap-4 text-sm font-mono text-slate-300 md:hidden glass z-40 animate-fade-in">
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">About</a>
            <a href="#skills" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">Skills</a>
            <a href="#projects" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">Projects</a>
            <a href="#timeline" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">Timeline</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">Services</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="px-6 py-2 rounded-full border border-neon-cyan/40 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 mt-2">
              Let's Talk
            </a>
          </div>
        )}
      </header>

      {/* Main Sections */}
      <main className="relative z-10">
        <div className="section-fade">
          <Hero />
        </div>
        <div className="section-fade">
          <About />
        </div>
        <div className="section-fade">
          <Skills />
        </div>
        <div className="section-fade">
          <Projects />
        </div>
        <div className="section-fade">
          <Timeline />
        </div>
        <div className="section-fade">
          <Services />
        </div>
        <div className="section-fade">
          <Contact />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
