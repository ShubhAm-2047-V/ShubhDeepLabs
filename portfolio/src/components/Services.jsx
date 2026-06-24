import { motion } from "framer-motion";
import { Laptop, Cpu, Cpu as AutoIcon, UserCheck, BarChart, PenTool } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Website Development",
      desc: "Full-cycle custom web applications engineered using the latest technologies like React, Next.js, and Node.js for ultra-fast performance.",
      icon: <Laptop className="w-6 h-6 text-neon-blue" />,
    },
    {
      title: "AI Solutions",
      desc: "Integrating cutting-edge LLMs, OpenAI, custom models, and agent architectures to automate workflows and drive intelligence.",
      icon: <Cpu className="w-6 h-6 text-neon-purple" />,
    },
    {
      title: "Automation Systems",
      desc: "Building reliable custom backend scrapers, scheduled cron jobs, and webhook-driven pipelines to streamline business ops.",
      icon: <AutoIcon className="w-6 h-6 text-neon-pink" />,
    },
    {
      title: "Portfolio Websites",
      desc: "Immersive, premium portfolios that command authority, using rich motion design and interactive 3D assets to tell your story.",
      icon: <UserCheck className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "Business Websites",
      desc: "Conversion-optimized landing pages and marketing websites developed specifically to convert visitors into loyal clients.",
      icon: <BarChart className="w-6 h-6 text-emerald-400" />,
    },
    {
      title: "UI/UX Design",
      desc: "Crafting beautiful, high-fidelity prototypes and full component systems in Figma, ensuring maximum user delight.",
      icon: <PenTool className="w-6 h-6 text-amber-400" />,
    },
  ];

  return (
    <section id="services" className="relative py-24 px-6 sm:px-12 lg:px-24 border-t border-white/5">
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white mb-4">
            Services & Expertise
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto rounded-full" />
          <p className="text-slate-400 mt-4 text-lg">High-value services designed to bring your brand into the future.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-8 flex flex-col items-start gap-4 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide">{service.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
