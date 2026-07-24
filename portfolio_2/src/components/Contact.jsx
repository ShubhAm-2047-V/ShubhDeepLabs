import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, CheckCircle, Mail, MapPin, Phone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef(null);
  const infoRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "Website Development",
    message: ""
  });

  const [status, setStatus] = useState("idle"); // idle, submitting, success

  useEffect(() => {
    gsap.fromTo(
      infoRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 78%",
          once: true
        }
      }
    );

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
          once: true
        }
      }
    );
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate submission
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", projectType: "Website Development", message: "" });
    }, 1500);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#030303] z-10 border-b border-white/5 overflow-hidden"
    >
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Intake title & location (5 cols) */}
        <div ref={infoRef} className="lg:col-span-5 flex flex-col items-start gap-8 opacity-0">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-4 block">
              09 // Project Briefing
            </span>
            <h2 className="text-4xl sm:text-5xl font-black font-display text-white uppercase tracking-tight leading-none mb-6">
              Let's build <br />
              something great <br />
              <span className="text-gradient-blue">together.</span>
            </h2>
            <div className="w-12 h-[2px] bg-accent-blue mt-4" />
          </div>

          <p className="text-sm text-slate-400 font-sans leading-relaxed max-w-sm font-light">
            Fill in the brief sentence intake on the right. Whether you need a web app, SEO directories, or AI pipelines, I will get back to you with a project timeline inside 24 hours.
          </p>

          <div className="space-y-4 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-accent-blue" />
              <a href="mailto:dvernekar59@gmail.com" className="hover:text-white transition-colors underline-hover">
                dvernekar59@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-accent-blue" />
              <a href="tel:+919028833275" className="hover:text-white transition-colors underline-hover">
                +91 90288 33275
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-accent-blue" />
              <span>Solapur, Maharashtra, India</span>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="flex gap-4 border-t border-white/5 pt-6 w-full">
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/shubham-vernekar-99a8a1337" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            {/* GitHub */}
            <a 
              href="https://github.com/ShubhAm-2047-V" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* Email */}
            <a 
              href="mailto:dvernekar59@gmail.com" 
              className="p-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
              aria-label="Email"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.777l10 8.104 10-8.104v11.777h-20z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column: Sentence Intake Form (7 cols) */}
        <div ref={formRef} className="lg:col-span-7 w-full opacity-0">
          {status === "success" ? (
            <div className="glass-premium p-8 text-center flex flex-col items-center justify-center gap-4 py-16">
              <CheckCircle className="w-12 h-12 text-accent-blue" />
              <h3 className="text-xl font-bold font-display text-white uppercase tracking-wider">
                Intake Received
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-xs font-light">
                I have received your sentence brief and will reach out shortly.
              </p>
              <button 
                onClick={() => setStatus("idle")}
                className="mt-4 text-xs font-mono uppercase tracking-widest text-slate-300 hover:text-white underline cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              
              {/* Sentence Form Paragraph Wrapper */}
              <div className="text-lg sm:text-2xl lg:text-3xl font-light font-sans text-slate-400 leading-loose sm:leading-[1.7]">
                Hello, my name is{" "}
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-b border-white/20 focus:border-white focus:outline-none bg-transparent text-white px-2 py-1 font-medium placeholder:text-slate-700 min-w-[120px] max-w-full text-center transition-colors"
                />{" "}
                and you can reach me at{" "}
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-b border-white/20 focus:border-white focus:outline-none bg-transparent text-white px-2 py-1 font-medium placeholder:text-slate-700 min-w-[160px] max-w-full text-center transition-colors"
                />
                . I am looking to build a{" "}
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="border-b border-white/20 focus:border-white focus:outline-none bg-transparent text-white px-2 py-1 font-medium cursor-pointer transition-colors"
                >
                  <option value="Website Development" className="bg-[#030303]">Website</option>
                  <option value="Business Software Portal" className="bg-[#030303]">Software Portal</option>
                  <option value="AI Solutions & Automation" className="bg-[#030303]">AI Automation</option>
                  <option value="UI/UX Wireframe & Design" className="bg-[#030303]">UI/UX Design</option>
                  <option value="Other Project" className="bg-[#030303]">Other Project</option>
                </select>{" "}
                and my message is:{" "}
                <input
                  type="text"
                  name="message"
                  required
                  placeholder="briefly describe your goals..."
                  value={formData.message}
                  onChange={handleChange}
                  className="border-b border-white/20 focus:border-white focus:outline-none bg-transparent text-white px-2 py-1 font-medium placeholder:text-slate-700 w-full block transition-colors mt-2 text-left"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "submitting"}
                data-cursor-label="Talk"
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-lg text-xs font-mono uppercase tracking-widest font-bold bg-white text-black hover:bg-slate-200 disabled:bg-slate-700 disabled:text-slate-400 transition duration-300 cursor-pointer"
              >
                {status === "submitting" ? (
                  <span>SUBMITTING BRIEF...</span>
                ) : (
                  <>
                    <span>SUBMIT PROJECT BRIEF</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
