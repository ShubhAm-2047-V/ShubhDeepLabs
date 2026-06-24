import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  Code, 
  Server, 
  Cpu, 
  Cpu as AutoIcon, 
  Cloud 
} from "lucide-react";

const FigmaIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1-3.5 3.5V2z" />
    <path d="M12 9h3.5A3.5 3.5 0 1 1 12 12.5V9z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v3.5A3.5 3.5 0 0 1 5 12.5z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5A3.5 3.5 0 0 1 8.5 23A3.5 3.5 0 0 1 5 19.5z" />
  </svg>
);

function TiltCard({ children, className, glowColor }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Rotate max 12 degrees
    const rX = -(mouseY / (height / 2)) * 12;
    const rY = (mouseX / (width / 2)) * 12;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
        transformStyle: "preserve-3d",
      }}
      className={`glass-card relative p-8 cursor-pointer overflow-hidden rounded-2xl ${className}`}
    >
      {/* Background glow on hover */}
      <div 
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 180px at 50% 50%, ${glowColor}15, transparent)`,
          opacity: isHovered ? 1 : 0
        }}
      />
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <Code className="w-8 h-8 text-neon-blue" />,
      glow: "#00f2fe",
      skills: ["React.js", "Next.js", "Tailwind CSS", "JavaScript (ES6+)", "HTML5 / CSS3", "Responsive UI"]
    },
    {
      title: "Backend Development",
      icon: <Server className="w-8 h-8 text-neon-purple" />,
      glow: "#bf55ec",
      skills: ["Node.js", "Express.js", "Python", "RESTful APIs", "PostgreSQL", "MongoDB"]
    },
    {
      title: "AI Integration",
      icon: <Cpu className="w-8 h-8 text-neon-pink" />,
      glow: "#ff007f",
      skills: ["OpenAI API", "LangChain", "Vector DBs", "Prompt Engineering", "Custom Chatbots", "NLP Models"]
    },
    {
      title: "UI/UX Design",
      icon: <FigmaIcon className="w-8 h-8 text-cyan-400" />,
      glow: "#22d3ee",
      skills: ["Figma", "Interaction Design", "Wireframing", "Prototyping", "Design Systems", "Web Animation"]
    },
    {
      title: "Workflow Automation",
      icon: <AutoIcon className="w-8 h-8 text-emerald-400" />,
      glow: "#34d399",
      skills: ["Python Scripting", "Make / Zapier", "Web Scraping", "Telegram & Discord Bots", "Cron Jobs"]
    },
    {
      title: "Hosting & Cloud",
      icon: <Cloud className="w-8 h-8 text-amber-400" />,
      glow: "#fbbf24",
      skills: ["Vercel / Netlify", "AWS Cloud", "Docker Containers", "Git & GitHub", "CI / CD Pipelines", "Domain & DNS"]
    }
  ];

  return (
    <section id="skills" className="relative py-24 px-6 sm:px-12 lg:px-24 border-t border-white/5">
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white mb-4">
            Technical Arsenal
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto rounded-full" />
          <p className="text-slate-400 mt-4 text-lg">The tools and technologies I use to build cutting-edge solutions.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TiltCard glowColor={category.glow}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    {category.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-wide">{category.title}</h4>
                </div>
                <ul className="space-y-3">
                  {category.skills.map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
                      <span className="font-sans text-sm font-medium">{skill}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
