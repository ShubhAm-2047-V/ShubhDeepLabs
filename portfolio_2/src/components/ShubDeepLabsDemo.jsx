import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  X, 
  GraduationCap, 
  Lightbulb, 
  Cpu, 
  Database, 
  Globe, 
  Smartphone, 
  Terminal, 
  Code, 
  Award, 
  Clock, 
  FileSpreadsheet, 
  CheckCircle,
  MessageSquare, 
  Star,
  BookOpen,
  ArrowRight
} from "lucide-react";

export default function ShubDeepLabsDemo({ isMobilePreview = false, autoScroll = true, onClose }) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!isMobilePreview || !autoScroll) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    // Small delay to ensure scrollHeight is populated
    const timer = setTimeout(() => {
      const scrollMax = container.scrollHeight - container.clientHeight;
      if (scrollMax <= 0) return;

      const scrollTween = gsap.fromTo(container, 
        { scrollTop: 0 },
        {
          scrollTop: scrollMax,
          duration: 30,
          ease: "linear",
          repeat: -1,
          yoyo: true,
          repeatDelay: 3
        }
      );

      const pauseScroll = () => scrollTween.pause();
      const resumeScroll = () => scrollTween.play();

      container.addEventListener("mouseenter", pauseScroll);
      container.addEventListener("mouseleave", resumeScroll);
      container.addEventListener("touchstart", pauseScroll);
      container.addEventListener("touchend", resumeScroll);

      return () => {
        scrollTween.kill();
        container.removeEventListener("mouseenter", pauseScroll);
        container.removeEventListener("mouseleave", resumeScroll);
        container.removeEventListener("touchstart", pauseScroll);
        container.removeEventListener("touchend", resumeScroll);
      };
    }, 500);

    return () => clearTimeout(timer);
  }, [isMobilePreview]);

  // Handle WhatsApp Link Click
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/919970732890", "_blank");
  };

  return (
    <div 
      ref={scrollContainerRef}
      className={`w-full h-full text-[#0c0a09] selection:bg-[#0c0a09]/10 selection:text-[#0c0a09] font-doodle-comic relative select-text phone-screen-scroll-container
        ${isMobilePreview ? "overflow-y-auto overflow-x-hidden scrollbar-none text-[11px] pb-6" : "fixed inset-0 w-screen h-screen overflow-y-auto z-[100] cursor-doodle pb-12"}
        bg-[#fbf8eb] bg-[radial-gradient(#0c0a09_1.2px,transparent_1.2px)] bg-[size:24px_24px] bg-repeat`}
      style={!isMobilePreview ? {
        cursor: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><path d=\'M4 4l20 8-10 4 6 12-4 2-6-12-6 6z\' fill=\'%230c0a09\' stroke=\'%230c0a09\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/></svg>"), auto'
      } : {}}
    >
      {/* ----------------- FULLSCREEN ONLY ELEMENTS ----------------- */}
      {!isMobilePreview && (
        <>
          {/* Dynamic Spiral Binding (Notebook Rings sidebar) */}
          <div className="hidden lg:flex fixed left-5 top-0 bottom-0 w-[40px] flex-col justify-around py-12 pointer-events-none z-50">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="w-[35px] h-[14px] border-[2.5px] border-[#444] rounded-full bg-[#ddd] -rotate-[12deg] shadow-[2px_2px_4px_rgba(0,0,0,0.15)]" />
            ))}
          </div>

          {/* Red Notebook Margin Line */}
          <div className="hidden lg:block fixed left-[80px] top-0 bottom-0 w-[1.5px] bg-[#ef4444]/40 z-30 pointer-events-none" />

          {/* Top Header Controls (Fixed) */}
          <div className="fixed top-6 right-6 lg:right-12 z-50 flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-[20px] border-[2.5px] border-[#0c0a09] bg-white font-doodle font-bold text-xs uppercase tracking-wider hover:bg-[#f3f0e0] shadow-[3px_3px_0px_#0c0a09] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#0c0a09] transition-all cursor-doodle flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Close Demo</span>
            </button>
          </div>
        </>
      )}

      {/* ----------------- CORE WEBSITE CONTENT ----------------- */}
      <div className={`w-full flex flex-col items-center ${isMobilePreview ? "px-3" : "px-6 lg:pl-[120px] lg:pr-24"}`}>
        
        {/* ================= NAVBAR ================= */}
        <header className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between py-6 border-b border-[#0c0a09]/10 relative z-20 gap-4">
          {/* Logo with sketchy yellow lightbulb */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Sketchy Circle Border */}
              <svg className="absolute inset-0 w-full h-full text-[#0c0a09]" viewBox="0 0 100 100" fill="none">
                <path d="M15,50 C15,25 25,15 50,15 C75,15 85,25 85,50 C85,75 75,85 50,85 C25,85 15,75 15,50 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              {/* Bulb SVG */}
              <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .4 2.2 1.5 3 .7.7 1.3 1.5 1.5 2.5" fill="#fef08a" stroke="#0c0a09" strokeWidth="2" />
                <path d="M9 18h6M10 22h4" stroke="#0c0a09" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-doodle font-black text-lg tracking-tight text-[#0c0a09]">Shubdeep Labs</span>
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider font-bold">Building Intelligent Solutions</span>
            </div>
          </div>

          {/* Navigation Links - Hidden in Mobile Preview to save space */}
          {!isMobilePreview && (
            <nav className="flex items-center gap-6 font-doodle font-bold text-xs uppercase tracking-wide text-stone-700">
              <a href="#topics" className="hover:text-stone-900 transition-colors">Project Topics</a>
              <a href="#offer" className="hover:text-stone-900 transition-colors">Daily Offer</a>
              <a href="#success" className="hover:text-stone-900 transition-colors">Success Stories</a>
              <a href="#doubts" className="hover:text-stone-900 transition-colors">Common Doubts</a>
            </nav>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {/* Cap & Book outline badge */}
            <div className="w-10 h-8 border-2 border-[#0c0a09] rounded-full bg-white flex items-center justify-center shadow-[1.5px_1.5px_0px_#0c0a09]">
              <GraduationCap className="w-4 h-4" />
            </div>
            
            {/* DONE WITH CARE button */}
            <div className="px-3 py-1.5 border-2 border-[#0c0a09] rounded-full bg-green-200 text-[10px] font-doodle font-bold uppercase tracking-wider shadow-[1.5px_1.5px_0px_#0c0a09] flex items-center gap-1 text-green-900">
              <span>★ Done with Care</span>
            </div>

            {/* Profile Avatar */}
            <div className="w-8 h-8 border-2 border-[#0c0a09] rounded-full bg-white flex items-center justify-center text-[10px] font-mono font-bold shadow-[1.5px_1.5px_0px_#0c0a09]">
              👤
            </div>

            {/* BUILD MY PROJECT button */}
            <button 
              onClick={handleWhatsAppClick}
              className="px-4 py-2 rounded-[15px] border-2 border-[#0c0a09] bg-stone-900 text-white font-doodle font-bold text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_#0c0a09] hover:bg-stone-800 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Build My Project!</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* ================= HERO SECTION ================= */}
        <section className={`w-full max-w-6xl ${isMobilePreview ? "py-8" : "py-16"} border-b border-dashed border-[#0c0a09]/10 relative z-10 flex flex-col`}>
          
          {/* Yellow Badge */}
          <div className="self-start mb-6">
            <span className="px-3.5 py-1.5 rounded-[12px] border-2 border-[#0c0a09] bg-yellow-200 text-[10px] font-mono font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_#0c0a09] flex items-center gap-1">
              ⭐ Simple Projects. Smart Solutions.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
              
              {/* Headline with Giant P */}
              <div className="flex items-center select-none w-full">
                <div className="flex flex-col text-3xl sm:text-5xl lg:text-6xl font-black font-doodle uppercase tracking-tight text-blue-600 leading-[0.95]">
                  <span>Your</span>
                  <span>Our</span>
                </div>
                {/* Giant Letter P */}
                <div className="text-8xl sm:text-9xl lg:text-[13rem] font-black leading-none font-sans text-stone-900 mx-2 select-none">
                  P
                </div>
                <div className="flex flex-col text-3xl sm:text-5xl lg:text-6xl font-black font-doodle uppercase tracking-tight text-stone-900 leading-[0.95] pt-2">
                  <span className="relative">
                    roject
                    {/* Sketchy Green Underline */}
                    <svg className="absolute left-0 bottom-[-4px] w-full h-2 text-green-500 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0,5 Q50,1 100,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="relative mt-2">
                    assion
                    {/* Sketchy Red Underline */}
                    <svg className="absolute left-0 bottom-[-4px] w-full h-2 text-red-500 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Subtitle / Paragraph */}
              <p className="text-stone-600 text-xs sm:text-sm font-sans font-light leading-relaxed max-w-xl">
                From Idea to Implementation, We Build Intelligent Academic Solutions. Next-generation web portals, machine learning algorithms, and IoT prototypes built with clean, premium codebases. Complete with PPT slides, comprehensive thesis reports, and mock viva tutoring.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-2">
                {/* LET'S BUILD IT button */}
                <button 
                  onClick={handleWhatsAppClick}
                  className="px-6 py-3.5 rounded-[15px] border-[2.5px] border-[#0c0a09] bg-white text-[#0c0a09] font-doodle font-bold text-xs uppercase tracking-wider hover:bg-stone-50 shadow-[3.5px_3.5px_0px_#0c0a09] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1.5px_1.5px_0px_#0c0a09] transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Let's Build It!</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* WhatsApp button */}
                <button 
                  onClick={handleWhatsAppClick}
                  className="px-6 py-3.5 rounded-[15px] border-[2.5px] border-[#0c0a09] bg-white text-stone-700 font-doodle font-bold text-xs uppercase tracking-wider hover:bg-stone-50 shadow-[3.5px_3.5px_0px_#0c0a09] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1.5px_1.5px_0px_#0c0a09] transition-all cursor-pointer flex items-center gap-2"
                >
                  {/* WhatsApp green icon */}
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px]">
                    💬
                  </div>
                  <span>WhatsApp Discussion</span>
                </button>
              </div>

              {/* Checklists */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-[10px] text-stone-500 font-mono">
                <span>✓ Simple Projects</span>
                <span>✓ Smart Solutions</span>
                <span>✓ Done with Focus & Care</span>
                <span>✓ For Diploma & Degree Only</span>
              </div>

            </div>

            {/* Right Column - Beautiful SVGs representing 3D notebooks */}
            <div className={`lg:col-span-5 relative flex justify-center items-center ${isMobilePreview ? "h-[200px]" : "h-[320px]"} w-full`}>
              
              {/* Green notebook (rotated left) */}
              <div className="absolute left-[5%] top-[10%] w-[45%] aspect-[3/4] rotate-[-15deg] group hover:rotate-[-5deg] transition-transform duration-500 z-10">
                <svg className="w-full h-full drop-shadow-[5px_5px_10px_rgba(0,0,0,0.15)]" viewBox="0 0 150 200" fill="none">
                  {/* Notebook cover */}
                  <rect x="15" y="10" width="120" height="180" rx="6" fill="#a7f3d0" stroke="#0c0a09" strokeWidth="2.5" />
                  <rect x="22" y="10" width="3" height="180" fill="#6ee7b7" />
                  {/* Pages inside */}
                  <rect x="12" y="15" width="4" height="170" fill="#fff" stroke="#0c0a09" strokeWidth="1.5" />
                  {/* Notebook rings */}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <path key={i} d={`M8,${25 + i * 18} C8,${20 + i * 18} 18,${20 + i * 18} 18,${25 + i * 18}`} stroke="#0c0a09" strokeWidth="2" strokeLinecap="round" fill="none" />
                  ))}
                  {/* Label sketch */}
                  <rect x="40" y="40" width="70" height="30" rx="3" fill="#fff" stroke="#0c0a09" strokeWidth="1.5" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="#0c0a09" strokeWidth="1" />
                  <line x1="50" y1="60" x2="90" y2="60" stroke="#0c0a09" strokeWidth="1" />
                </svg>
              </div>

              {/* Tan notebook (rotated right) */}
              <div className="absolute right-[5%] top-[15%] w-[48%] aspect-[3/4] rotate-[10deg] group hover:rotate-[3deg] transition-transform duration-500 z-20">
                <svg className="w-full h-full drop-shadow-[8px_8px_12px_rgba(0,0,0,0.18)]" viewBox="0 0 150 200" fill="none">
                  {/* Notebook cover */}
                  <rect x="15" y="10" width="120" height="180" rx="6" fill="#e9d5ff" stroke="#0c0a09" strokeWidth="2.5" />
                  <rect x="22" y="10" width="3" height="180" fill="#d8b4fe" />
                  {/* Pages inside */}
                  <rect x="12" y="15" width="4" height="170" fill="#fff" stroke="#0c0a09" strokeWidth="1.5" />
                  {/* Notebook rings */}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <path key={i} d={`M8,${25 + i * 18} C8,${20 + i * 18} 18,${20 + i * 18} 18,${25 + i * 18}`} stroke="#0c0a09" strokeWidth="2" strokeLinecap="round" fill="none" />
                  ))}
                  {/* Custom badge label: "3D drafting active" */}
                  <g transform="translate(30, 80) rotate(-5)">
                    <rect x="0" y="0" width="90" height="24" rx="4" fill="#fff" stroke="#0c0a09" strokeWidth="2" />
                    <text x="8" y="15" fill="#0c0a09" fontSize="8" fontFamily="monospace" fontWeight="bold">✏️ 3D drafting active</text>
                  </g>
                </svg>
              </div>

              {/* Floating sketchy decorations */}
              <div className="absolute top-[5%] right-[15%] w-8 h-8 text-yellow-500 animate-bounce">
                <Star className="w-full h-full fill-yellow-300" stroke="#0c0a09" strokeWidth="2" />
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY STUDENTS TRUST US ================= */}
        <section id="success" className={`w-full max-w-6xl ${isMobilePreview ? "py-8" : "py-16"} border-b border-dashed border-[#0c0a09]/10 relative z-10`}>
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black font-doodle uppercase tracking-tight text-[#0c0a09] relative inline-block">
              Why Students Trust Us
              <svg className="absolute left-0 bottom-[-8px] w-full h-3 text-green-500 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,3 Q50,7 100,3 M0,7 Q50,11 100,7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-6 leading-relaxed font-sans font-light">
              We supply top-grade code resources alongside explanation tools to help you verify logic.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: 100% Original Work */}
            <div className="p-6 bg-white border-2 border-[#0c0a09] rounded-[20px] shadow-[3px_3px_0px_#0c0a09] hover:-translate-y-1 transition-all flex flex-col gap-4 text-left relative">
              <div className="w-4 h-4 rounded-full border-2 border-[#0c0a09] bg-stone-100 absolute top-3 left-3" />
              <div className="w-10 h-10 border-2 border-[#0c0a09] rounded-lg bg-yellow-200 flex items-center justify-center mt-3 shadow-[1.5px_1.5px_0px_#0c0a09]">
                <Award className="w-5 h-5 text-yellow-800" />
              </div>
              <h3 className="text-sm font-black font-doodle uppercase tracking-tight text-[#0c0a09]">100% Original Work</h3>
              <p className="text-[11px] sm:text-xs text-stone-600 font-sans leading-relaxed font-light">
                No copy-pasted templates. Every codebase is structured freshly according to your specific college needs.
              </p>
            </div>

            {/* Card 2: On-Time Delivery */}
            <div className="p-6 bg-white border-2 border-[#0c0a09] rounded-[20px] shadow-[3px_3px_0px_#0c0a09] hover:-translate-y-1 transition-all flex flex-col gap-4 text-left relative">
              <div className="w-4 h-4 rounded-full border-2 border-[#0c0a09] bg-stone-100 absolute top-3 left-3" />
              <div className="w-10 h-10 border-2 border-[#0c0a09] rounded-lg bg-sky-200 flex items-center justify-center mt-3 shadow-[1.5px_1.5px_0px_#0c0a09]">
                <Clock className="w-5 h-5 text-sky-800" />
              </div>
              <h3 className="text-sm font-black font-doodle uppercase tracking-tight text-[#0c0a09]">On-Time Delivery</h3>
              <p className="text-[11px] sm:text-xs text-stone-600 font-sans leading-relaxed font-light">
                We are extremely strict with dates. Get your complete setup, reports, and slides well before your final submit day.
              </p>
            </div>

            {/* Card 3: PPT & Reports Ready */}
            <div className="p-6 bg-white border-2 border-[#0c0a09] rounded-[20px] shadow-[3px_3px_0px_#0c0a09] hover:-translate-y-1 transition-all flex flex-col gap-4 text-left relative">
              <div className="w-4 h-4 rounded-full border-2 border-[#0c0a09] bg-stone-100 absolute top-3 left-3" />
              <div className="w-10 h-10 border-2 border-[#0c0a09] rounded-lg bg-amber-200 flex items-center justify-center mt-3 shadow-[1.5px_1.5px_0px_#0c0a09]">
                <FileSpreadsheet className="w-5 h-5 text-amber-800" />
              </div>
              <h3 className="text-sm font-black font-doodle uppercase tracking-tight text-[#0c0a09]">PPT & Reports Ready</h3>
              <p className="text-[11px] sm:text-xs text-stone-600 font-sans leading-relaxed font-light">
                Syllabus-compliant, fully formatted presentation drafts and comprehensive project reports included.
              </p>
            </div>

            {/* Card 4: Clean Documented Code */}
            <div className="p-6 bg-white border-2 border-[#0c0a09] rounded-[20px] shadow-[3px_3px_0px_#0c0a09] hover:-translate-y-1 transition-all flex flex-col gap-4 text-left relative">
              <div className="w-4 h-4 rounded-full border-2 border-[#0c0a09] bg-stone-100 absolute top-3 left-3" />
              <div className="w-10 h-10 border-2 border-[#0c0a09] rounded-lg bg-emerald-200 flex items-center justify-center mt-3 shadow-[1.5px_1.5px_0px_#0c0a09]">
                <Code className="w-5 h-5 text-emerald-800" />
              </div>
              <h3 className="text-sm font-black font-doodle uppercase tracking-tight text-[#0c0a09]">Clean Documented Code</h3>
              <p className="text-[11px] sm:text-xs text-stone-600 font-sans leading-relaxed font-light">
                Neat model structures, clean controllers, and comprehensive code comments that make logic review easy.
              </p>
            </div>

          </div>
        </section>

        {/* ================= ACADEMIC STUDY AREAS ================= */}
        <section id="topics" className={`w-full max-w-6xl ${isMobilePreview ? "py-8" : "py-16"} border-b border-dashed border-[#0c0a09]/10 relative z-10`}>
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black font-doodle uppercase tracking-tight text-[#0c0a09]">
              Academic Study Areas
            </h2>
            <div className="w-16 h-1 bg-[#0c0a09] rounded-full mt-3" />
            <p className="text-xs sm:text-sm text-stone-600 mt-6 leading-relaxed font-sans font-light">
              Select your syllabus level or technology stack. We fully customize logic structures based on college reviews.
            </p>
          </div>

          {/* study cards 8 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {[
              { id: "diploma", title: "Diploma Projects", icon: GraduationCap, bg: "bg-blue-100", desc: "Syllabus-compliant, core-logic driven applications scaled perfectly for diploma review parameters." },
              { id: "engineering", title: "Engineering Projects", icon: Terminal, bg: "bg-red-100", desc: "Full-stack architectures, neat database structures, and comprehensive data flows built for B.E. / B.Tech." },
              { id: "mtech", title: "M.Tech Projects", icon: Lightbulb, bg: "bg-yellow-100", desc: "High-grade algorithm modeling, data analysis, and advanced codebase executions for research thesis." },
              { id: "bca_mca", title: "BCA / MCA Projects", icon: Database, bg: "bg-purple-100", desc: "Interactive management portals, dashboard consoles, cloud databases, and clean system layouts." },
              { id: "ai_ml", title: "AI / ML Projects", icon: Cpu, bg: "bg-green-100", desc: "TensorFlow / PyTorch models, visual scans, NLP conversational bots, and predictive analytics pipelines." },
              { id: "web", title: "Web Projects", icon: Globe, bg: "bg-amber-100", desc: "Stunning responsive portals, custom dashboards, single page interfaces, and rich administrative panels." },
              { id: "android", title: "Android Projects", icon: Smartphone, bg: "bg-cyan-100", desc: "Mobile applications, local SQLite databases, customizable API links, and fully functional Android packages." },
              { id: "iot", title: "IoT Projects", icon: Code, bg: "bg-rose-100", desc: "Smart automation designs, hardware controller mapping (Arduino/ESP32), and interactive dashboards." }
            ].map((cat, idx) => {
              const Icon = cat.icon;
              const borderClass = idx % 3 === 0 ? "border-doodle-1" : idx % 3 === 1 ? "border-doodle-2" : "border-doodle-3";
              return (
                <div 
                  key={cat.id}
                  onClick={handleWhatsAppClick}
                  className={`p-6 bg-white flex flex-col justify-between gap-5 hover:-translate-y-1 hover:-translate-x-1 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer ${borderClass}`}
                  style={{ boxShadow: '3.5px 3.5px 0px #0c0a09' }}
                >
                  <div className="flex flex-col gap-4 text-left">
                    <div className={`w-10 h-10 rounded-xl border-2 border-[#0c0a09] flex items-center justify-center ${cat.bg} shadow-[1.5px_1.5px_0px_#0c0a09]`}>
                      <Icon className="w-5 h-5 text-stone-900" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black font-doodle uppercase tracking-tight text-[#0c0a09]">{cat.title}</h3>
                      <p className="text-[10px] text-stone-600 font-sans leading-relaxed font-light mt-2 line-clamp-3">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-[10px] font-doodle font-bold uppercase tracking-wider text-[#0c0a09] mt-2 group-hover:text-blue-600 transition-colors">
                    <span>Select</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              );
            })}

          </div>
        </section>

        {/* ================= PRICING & CONSULTATION ================= */}
        <section id="offer" className={`w-full max-w-6xl ${isMobilePreview ? "py-8" : "py-16"} border-b border-dashed border-[#0c0a09]/10 relative z-10`}>
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black font-doodle uppercase tracking-tight text-[#0c0a09]">
              Custom Project Consultation
            </h2>
            <div className="w-16 h-1 bg-[#0c0a09] rounded-full mt-3" />
            <p className="text-xs sm:text-sm text-stone-600 mt-6 leading-relaxed font-sans font-light">
              We design structured solutions tailored specifically to your college review requirements.
            </p>
          </div>

          {/* Included Banner */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="px-6 py-3 border-2 border-[#0c0a09] rounded-xl bg-yellow-100 text-xs font-doodle font-bold uppercase tracking-wider shadow-[2.5px_2.5px_0px_#0c0a09] flex items-center justify-center gap-2">
              <span className="text-green-600">✓</span>
              <span>PPT AND REPORT ARE INCLUDED IN ALL PLANS!</span>
            </div>
          </div>

          {/* Pricing Table Card */}
          <div className="max-w-xl mx-auto bg-white border-2 border-[#0c0a09] rounded-[24px] shadow-[4px_4px_0px_#0c0a09] p-6 sm:p-8 relative">
            <div className="w-4 h-4 rounded-full border-2 border-[#0c0a09] bg-stone-100 absolute top-4 left-4" />
            <div className="w-4 h-4 rounded-full border-2 border-[#0c0a09] bg-stone-100 absolute top-4 right-4" />
            
            <div className="flex flex-col mb-6 mt-4">
              <span className="px-3 py-1 bg-yellow-200 border-2 border-[#0c0a09] rounded-full text-[10px] font-mono font-bold uppercase tracking-widest self-center shadow-[1.5px_1.5px_0px_#0c0a09]">
                Website Display Pricing
              </span>
              <p className="text-[10px] text-stone-500 leading-relaxed font-sans font-light text-center mt-4">
                Get a transparent overview of our starting costs for various project scales. Every codebase is custom-built to align perfectly with your exact technical requirements and business goals.
              </p>
            </div>

            {/* List Rows */}
            <div className="space-y-3 font-sans text-xs">
              {[
                { label: "Academic Projects", price: "₹1,999", color: "bg-purple-100", icon: GraduationCap },
                { label: "Business Website", price: "₹9,999", color: "bg-blue-100", icon: Globe },
                { label: "E-Commerce Website", price: "₹29,999", color: "bg-amber-100", icon: FileSpreadsheet },
                { label: "Mobile App Development", price: "₹19,999", color: "bg-emerald-100", icon: Smartphone },
                { label: "SaaS Platform Development", price: "₹59,999", color: "bg-rose-100", icon: Cpu }
              ].map((row, index) => {
                const Icon = row.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3.5 border-2 border-[#0c0a09] rounded-xl bg-stone-50 shadow-[1.5px_1.5px_0px_#0c0a09]">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg border-2 border-[#0c0a09] ${row.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-stone-850" />
                      </div>
                      <span className="font-doodle font-bold uppercase text-[10px] sm:text-xs text-stone-800">{row.label}</span>
                    </div>
                    <span className="font-mono font-bold px-3 py-1 bg-yellow-100 border-2 border-[#0c0a09] rounded-full text-[10px] sm:text-xs text-stone-800 shadow-[1px_1px_0px_#0c0a09]">
                      Starting at {row.price}
                    </span>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={handleWhatsAppClick}
              className="w-full mt-6 py-4 rounded-[15px] border-2 border-[#0c0a09] bg-white hover:bg-stone-50 text-stone-900 font-doodle font-bold text-xs uppercase tracking-wider shadow-[3.5px_3.5px_0px_#0c0a09] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#0c0a09] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Request A Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ================= BLUEPRINTS ================= */}
        <section id="doubts" className={`w-full max-w-6xl ${isMobilePreview ? "py-8" : "py-16"} relative z-10`}>
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black font-doodle uppercase tracking-tight text-[#0c0a09]">
              Academic System Blueprints
            </h2>
            <div className="w-16 h-1 bg-[#0c0a09] rounded-full mt-3" />
            <p className="text-xs sm:text-sm text-stone-600 mt-6 leading-relaxed font-sans font-light">
              Explore pre-configured logic outlines. We establish secure databases and layouts perfectly tailored to your project.
            </p>
          </div>

          {/* Blueprint Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI Plant Disease Detector",
                lang: "Python",
                color: "bg-emerald-100",
                stack: "Python, Next.js, TensorFlow, FastAPI",
                desc: "A neural-network visual scanning web application detecting agricultural leaf diseases with detailed metric analytics."
              },
              {
                title: "Advanced AI Customer Care Chatbot",
                lang: "React",
                color: "bg-blue-100",
                stack: "React, Node.js, Express, OpenAI API",
                desc: "Intelligent messaging center with customizable document indexing (RAG) and interactive dashboard console log views."
              },
              {
                title: "Face Recognition Attendance system",
                lang: "Python",
                color: "bg-emerald-100",
                stack: "Python, OpenCV, Tkinter, SQLite",
                desc: "Real-time face detection tracker featuring automated CSV sheets generation and attendance log exports."
              },
              {
                title: "Hospital Management Core Desk",
                lang: "Next.js",
                color: "bg-purple-100",
                stack: "Next.js, MongoDB, Tailwind, Node.js",
                desc: "Full clinic portal with scheduling grids, active invoice trackers, and secure digital prescription vaults."
              },
              {
                title: "Expense Tracker with AI Insights",
                lang: "React",
                color: "bg-blue-100",
                stack: "React, Node.js, MongoDB, Gemini API",
                desc: "Personal finance portal offering automated category tagging, monthly budget forecasting, and AI-driven spending recommendations."
              },
              {
                title: "Smart Notes Summarizer",
                lang: "React",
                color: "bg-blue-100",
                stack: "React, FastAPI, Python, Hugging Face",
                desc: "Collaborative document pad that auto-generates structured summaries, highlights action items, and generates flashcards using NLP."
              }
            ].map((bp, index) => {
              const borderClass = index % 3 === 0 ? "border-doodle-1" : index % 3 === 1 ? "border-doodle-2" : "border-doodle-3";
              return (
                <div 
                  key={index}
                  onClick={handleWhatsAppClick}
                  className={`bg-white p-6 flex flex-col justify-between gap-4 text-left hover:-translate-y-1 hover:-translate-x-1 transition-all cursor-pointer ${borderClass} relative`}
                  style={{ boxShadow: '3.5px 3.5px 0px #0c0a09' }}
                >
                  {/* Badge */}
                  <span className={`absolute top-4 right-4 px-2 py-0.5 border border-[#0c0a09] rounded-md ${bp.color} text-[8px] font-mono font-bold uppercase shadow-[1px_1px_0px_#0c0a09]`}>
                    {bp.lang}
                  </span>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-black font-doodle uppercase tracking-tight text-[#0c0a09] max-w-[80%]">
                      {bp.title}
                    </h3>
                    
                    <div className="border-t border-[#0c0a09]/10 pt-3">
                      <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest font-bold">Tech Stack specifications:</span>
                      <p className="text-[9px] font-mono text-[#0c0a09]/80 font-bold mt-1">{bp.stack}</p>
                    </div>

                    <p className="text-[10px] text-stone-600 font-sans leading-relaxed font-light mt-1">
                      {bp.desc}
                    </p>
                  </div>

                  <div className="border-t border-[#0c0a09]/10 pt-4 flex items-center justify-between text-[10px] font-doodle font-bold uppercase tracking-wider text-stone-800">
                    <span>Request Demo Output</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
