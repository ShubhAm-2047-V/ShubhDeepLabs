import { useState, useEffect, useRef } from "react";
import ThreeCanvas from "./components/ThreeCanvas";
import ErrorBoundary from "./components/ErrorBoundary";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import AcademicProjects from "./components/AcademicProjects";
import RealWebsiteOverlay from "./components/RealWebsiteOverlay";
import Process from "./components/Process";
import Services from "./components/Services";
import Trust from "./components/Trust";
import ClientImpact from "./components/ClientImpact";
import ShubDeepLabs from "./components/ShubDeepLabs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function App() {
  const scrollProgressRef = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAcademicOpen, setIsAcademicOpen] = useState(false);
  const [isRealWebsiteOpen, setIsRealWebsiteOpen] = useState(false);
  const containerRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    if (isLoading) return;

    const isMobile = window.innerWidth < 768;
    let lenis;

    const handleScroll = () => {
      const doc = document.documentElement;
      const totalHeight = doc.scrollHeight - window.innerHeight;
      scrollProgressRef.current = window.scrollY / (totalHeight || 1);
      ScrollTrigger.update();
    };

    if (!isMobile) {
      // Initialize Lenis ONLY on desktop/tablets for smooth scrolling
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", (e) => {
        scrollProgressRef.current = e.progress || 0;
        ScrollTrigger.update();
      });

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      // Use native momentum scroll on mobile, updating progress ref natively
      window.addEventListener("scroll", handleScroll);
    }

    // Initial Page Entrance Animations after preloader completes
    const header = document.querySelector("header");
    
    gsap.fromTo(
      header,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.3 }
    );

    // GSAP ScrollTrigger Animations for section reveals
    const sections = document.querySelectorAll(".section-fade");
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        }
      );
    });

    // Global Click Handler for Smooth Anchor Scrolling
    const handleGlobalClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        setIsMenuOpen(false); // Make sure mobile menu closes on click
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(target);
          } else {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);

    // Text Scramble Effect for Nav elements
    const scrambleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()";
    const handleScramble = (e) => {
      const el = e.currentTarget;
      const originalText = el.getAttribute("data-original") || el.innerText;
      if (!el.getAttribute("data-original")) {
        el.setAttribute("data-original", originalText);
      }
      
      let frame = 0;
      const totalFrames = 12;
      const tick = () => {
        frame++;
        const progress = frame / totalFrames;
        let scrambled = "";
        for (let i = 0; i < originalText.length; i++) {
          if (originalText[i] === " ") {
            scrambled += " ";
          } else if (i < originalText.length * progress) {
            scrambled += originalText[i];
          } else {
            scrambled += scrambleLetters[Math.floor(Math.random() * scrambleLetters.length)];
          }
        }
        el.innerText = scrambled;
        if (frame < totalFrames) {
          requestAnimationFrame(tick);
        }
      };
      tick();
    };

    const scrambleElements = document.querySelectorAll(".scramble-hover");
    scrambleElements.forEach((el) => {
      el.addEventListener("mouseenter", handleScramble);
    });

    return () => {
      scrambleElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleScramble);
      });
      if (isMobile) {
        window.removeEventListener("scroll", handleScroll);
      }
      document.removeEventListener("click", handleGlobalClick);
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isLoading]);

  if (isLoading) {
    return <Preloader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-slate-100 selection:bg-white/20 selection:text-white font-sans overflow-x-hidden premium-bg">
      
      {/* Noise Film Overlay */}
      <div className="noise-overlay" />

      {/* Aurora Ambient blobs */}
      <div className="aurora-container">
        <div className="aurora-blob aurora-1" />
        <div className="aurora-blob aurora-2" />
        <div className="aurora-blob aurora-3" />
      </div>

      {/* 3D Background Canvas */}
      <ErrorBoundary fallback={null}>
        <ThreeCanvas scrollProgressRef={scrollProgressRef} />
      </ErrorBoundary>

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Header / Nav */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#050505]/10 border-b border-white/5 py-5 px-6 sm:px-12 lg:px-24 flex items-center justify-between opacity-0">
        <a href="#" className="font-display font-black text-lg tracking-wider text-white">
          SHUBHAM <span className="text-accent-blue font-medium font-extended tracking-normal">VERNEKAR</span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          <a href="#about" className="hover:text-white transition-colors underline-hover scramble-hover">About</a>
          <a href="#skills" className="hover:text-white transition-colors underline-hover scramble-hover">Skills</a>
          <a href="#projects" className="hover:text-white transition-colors underline-hover scramble-hover">Projects</a>
          <a href="#process" className="hover:text-white transition-colors underline-hover scramble-hover">Process</a>
          <a href="#services" className="hover:text-white transition-colors underline-hover scramble-hover">Services</a>
          <a href="#trust" className="hover:text-white transition-colors underline-hover scramble-hover">Why Me</a>
          <a href="#shubdeeplabs" className="hover:text-white transition-colors underline-hover scramble-hover">Labs</a>
          <a href="#contact" className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white transition-all duration-300">
            Let's Collaborate
          </a>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="flex xl:hidden text-white hover:text-slate-300 transition-colors z-50 p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#050505]/95 border-b border-white/10 backdrop-blur-lg flex flex-col items-center py-6 gap-4 text-xs font-mono text-slate-300 xl:hidden z-40 animate-fade-in uppercase tracking-wider">
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">About</a>
            <a href="#skills" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">Skills</a>
            <a href="#projects" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">Projects</a>
            <a href="#process" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">Process</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">Services</a>
            <a href="#trust" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">Why Me</a>
            <a href="#shubdeeplabs" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors py-2 w-full text-center">Labs</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="px-6 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 mt-2">
              Let's Collaborate
            </a>
          </div>
        )}
      </header>

      {/* Main Sections */}
      <main className="relative z-10">
        <div>
          <Hero />
        </div>
        <div className="section-fade">
          <About />
        </div>
        <div className="section-fade">
          <Skills />
        </div>
        <div>
          <Projects 
            onViewAcademic={() => setIsAcademicOpen(true)} 
            onViewRealWebsite={() => setIsRealWebsiteOpen(true)}
          />
        </div>
        <div className="section-fade">
          <Process />
        </div>
        <div className="section-fade">
          <Services />
        </div>
        <div className="section-fade">
          <Trust />
        </div>
        <div className="section-fade">
          <ClientImpact />
        </div>
        <div className="section-fade">
          <ShubDeepLabs />
        </div>
        <div className="section-fade">
          <Contact />
        </div>
      </main>

      <Footer />

      {/* Separate Academic Projects Website (Doodle Theme) */}
      {isAcademicOpen && (
        <AcademicProjects onClose={() => setIsAcademicOpen(false)} />
      )}

      {/* Real Website Overlay (Iframe with 1-min countdown timer) */}
      {isRealWebsiteOpen && (
        <RealWebsiteOverlay onClose={() => setIsRealWebsiteOpen(false)} />
      )}
    </div>
  );
}

export default App;
