import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap, Briefcase, Award, Calendar, MapPin, CheckCircle, Languages } from "lucide-react";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

const EDUCATION_DATA = [
  {
    institution: "VVP Polytechnic, Solapur",
    degree: "Diploma in Computer Science",
    duration: "2023 - 2030",
    status: "2nd Year (3 Year Diploma)",
    grade: "Percentage: 80%",
    location: "Solapur, Maharashtra, India"
  }
];

const EXPERIENCE_DATA = [
  {
    role: "Paid Client Work",
    company: "Web Developer",
    desc: "Successfully delivered projects for clients with modern designs and responsive functionality, ensuring performance and user experience standards."
  },
  {
    role: "Freelance Developer",
    company: "Web Solutions",
    desc: "Developed websites for various clients, delivered custom end-to-end solutions, managed deployments, and ensured customer satisfaction."
  },
  {
    role: "Internship",
    company: "Web Development",
    desc: "Worked on real-world projects, gained hands-on experience in modern web development methodologies, and collaborated effectively within teams."
  }
];

const CERTIFICATIONS = [
  "C Programming",
  "C++ Programming",
  "Web Development",
  "Java Programming"
];

const ACHIEVEMENTS = [
  "Participated in 3 to 4 Hackathons and Won 3",
  "Received College Awards for Academic & Technical Excellence",
  "Actively contributed to technical events and competitions"
];

const LANGUAGE_DATA = [
  { name: "English", level: "Professional" },
  { name: "Hindi", level: "Fluent" },
  { name: "Marathi", level: "Native" }
];

export default function Resume() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    // Reveal Header
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 78%",
          once: true
        }
      }
    );

    // Staggered reveal for cards
    gsap.fromTo(
      ".resume-reveal-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".resume-reveal-card",
          start: "top 80%",
          once: true
        }
      }
    );
  }, []);

  return (
    <section
      id="resume"
      ref={containerRef}
      className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#050505] border-b border-white/5 z-10 overflow-hidden"
    >
      {/* Background radial gradient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_left_bottom,rgba(255,51,51,0.03)_0%,transparent_50%)]" />

      <div className="max-w-6xl w-full mx-auto flex flex-col gap-16">
        
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col max-w-xl opacity-0">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">
            02.5 // Credentials & Background
          </span>
          <h2 className="text-4xl sm:text-6xl font-black font-display text-white uppercase tracking-tight flex flex-wrap gap-x-4">
            <TextReveal>Education</TextReveal>
            <TextReveal className="text-gradient-red">&</TextReveal>
            <TextReveal className="text-gradient-blue">Experience</TextReveal>
          </h2>
          <div className="w-12 h-[2px] bg-accent-blue mt-4" />
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Education, Certs, Languages */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            
            {/* EDUCATION CARD */}
            <div className="resume-reveal-card glass-premium p-8 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md opacity-0">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-5 h-5 text-accent-blue" />
                <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">Education</h3>
              </div>

              <div className="relative border-l border-white/10 pl-6 space-y-6">
                {EDUCATION_DATA.map((edu, idx) => (
                  <div key={idx} className="relative flex flex-col gap-2">
                    {/* Bullet marker on line */}
                    <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-accent-blue" />
                    
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white tracking-wide uppercase">{edu.institution}</h4>
                      <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {edu.duration}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-accent-blue uppercase tracking-wide">
                      {edu.degree}
                    </p>
                    
                    <span className="text-[10px] font-mono font-medium text-slate-300 uppercase tracking-widest px-2.5 py-0.5 rounded border border-white/10 bg-white/5 w-fit">
                      {edu.status}
                    </span>

                    <p className="text-xs text-slate-400 font-sans font-light mt-1">
                      Grade / Performance: <strong className="text-white font-medium">{edu.grade}</strong>
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-sans mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{edu.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CERTIFICATIONS CARD */}
            <div className="resume-reveal-card glass-premium p-8 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md opacity-0">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-accent-blue" />
                <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">Certifications</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CERTIFICATIONS.map((cert, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-lg border border-white/5 bg-[#050505]/40 hover:border-accent-blue/30 transition-all duration-300 flex items-center gap-3"
                  >
                    <CheckCircle className="w-4 h-4 text-accent-blue shrink-0" />
                    <span className="text-xs font-mono text-slate-300 font-medium uppercase tracking-wide">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LANGUAGES CARD */}
            <div className="resume-reveal-card glass-premium p-8 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md opacity-0">
              <div className="flex items-center gap-3 mb-6">
                <Languages className="w-5 h-5 text-accent-blue" />
                <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">Languages</h3>
              </div>

              <div className="flex flex-wrap gap-4">
                {LANGUAGE_DATA.map((lang, idx) => (
                  <div 
                    key={idx} 
                    className="px-4 py-2.5 rounded-lg border border-white/5 bg-[#050505]/40 flex flex-col gap-1 min-w-[100px] text-center"
                  >
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{lang.name}</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Experience, Achievements */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            
            {/* EXPERIENCE CARD */}
            <div className="resume-reveal-card glass-premium p-8 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md opacity-0">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-5 h-5 text-accent-blue" />
                <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">Work Experience</h3>
              </div>

              <div className="relative border-l border-white/10 pl-6 space-y-8">
                {EXPERIENCE_DATA.map((exp, idx) => (
                  <div key={idx} className="relative flex flex-col gap-2">
                    {/* Bullet marker on line */}
                    <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-accent-blue" />
                    
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white tracking-wide uppercase">{exp.role}</h4>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2.5 py-0.5 rounded border border-white/10 bg-white/5">
                        {exp.company}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-sans font-light leading-relaxed mt-1">
                      {exp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ACHIEVEMENTS CARD */}
            <div className="resume-reveal-card glass-premium p-8 rounded-xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md opacity-0">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-accent-blue" />
                <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">Key Achievements</h3>
              </div>

              <div className="flex flex-col gap-4">
                {ACHIEVEMENTS.map((ach, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-lg border border-white/5 bg-[#050505]/40 hover:border-accent-blue/30 transition-all duration-300 flex items-start gap-4"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-mono font-bold shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 font-sans font-light leading-relaxed">{ach}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
