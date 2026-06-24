import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import shubhamImg from "../assets/shubham_bw.jpg";

function Counter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = parseInt(value, 10);
      if (isNaN(end)) return;
      
      const duration = 2000; // ms
      const incrementTime = Math.max(Math.floor(duration / end), 15);
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  const info = [
    { label: "Full Name", value: "Shubham Dinesh Vernekar" },
    { label: "Location", value: "Solapur, Maharashtra" },
    { label: "Founder Of", value: "ShubDeep Labs" },
    { label: "Education", value: "Diploma in Computer Science" },
  ];

  const stats = [
    { label: "Projects Built", value: "10", suffix: "+" },
    { label: "Learning Hours", value: "1000", suffix: "+" },
    { label: "Technologies mastered", value: "15", suffix: "+" },
    { label: "Client Solutions", value: "100", suffix: "%" },
  ];

  return (
    <section id="about" className="relative py-24 px-6 sm:px-12 lg:px-24 border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white mb-4">
            About Me
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto rounded-full" />
          <p className="text-slate-400 mt-4 text-lg">Who is behind the code and vision?</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {/* Profile Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-4 flex flex-col justify-center items-center relative group"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl border border-white/10 group-hover:border-neon-cyan/50 transition-colors duration-300">
              <img 
                src={shubhamImg} 
                alt="Shubham Dinesh Vernekar" 
                className="w-full h-full object-cover object-center filter grayscale hover:grayscale-0 contrast-[1.1] group-hover:scale-[1.03] transition-all duration-500"
              />
              {/* Scanline overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-repeat-y opacity-[0.07] pointer-events-none bg-[linear-gradient(to_bottom,rgba(0,242,254,0.4)_2px,transparent_2px)] bg-[size:100%_6px]" />
            </div>
          </motion.div>

          {/* Bio info card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Profile Overview</h3>
              <div className="space-y-6">
                {info.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">{item.label}</span>
                    <span className="text-base font-semibold text-slate-200 mt-1 sm:mt-0">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* About Text card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-8 flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">My Mission</h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              I am a passionate Computer Science student, full-stack developer, and the founder of <strong>ShubDeep Labs</strong>.
              My goal is to construct extremely high-performance, visually stunning, and highly functional digital experiences.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4 text-sm">
              Specializing in both world-class Frontend and Backend, I build cutting-edge web applications, automated business pipelines, and AI-driven systems. I help companies step into the future of digital automation and UI/UX excellence.
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-6 text-center hover:border-neon-cyan/30 transition-all duration-300 group"
            >
              <div className="text-3xl sm:text-5xl font-black text-white font-display mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs uppercase tracking-widest font-mono text-slate-500 group-hover:text-neon-blue transition-colors duration-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
