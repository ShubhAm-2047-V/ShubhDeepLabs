import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Projects() {
  const projects = [
    {
      title: "ChatVVP",
      description: "An AI-powered conversational chatbot system integrated with multiple platforms to automate customer service, internal query resolution, and data extraction with natural language processing.",
      tech: ["Python", "OpenAI", "React", "Node.js", "MongoDB"],
      link: "#",
      github: "#",
      color: "from-cyan-500 to-blue-600",
      image: "🤖"
    },
    {
      title: "Plant Disease Detection",
      description: "An advanced Deep Learning application that uses computer vision models to identify crop diseases from leaf images, assisting farmers in real-time diagnosis and crop protection.",
      tech: ["Python", "TensorFlow", "FastAPI", "React Native", "AWS"],
      link: "#",
      github: "#",
      color: "from-emerald-400 to-teal-600",
      image: "🌱"
    },
    {
      title: "ShubDeep Labs",
      description: "Official agency platform showcasing modern web architectures, customized AI models, and automation workflows tailored to businesses globally.",
      tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Vercel"],
      link: "#",
      github: "#",
      color: "from-purple-500 to-indigo-600",
      image: "🧪"
    },
    {
      title: "AI Desktop Assistant",
      description: "A local, voice-activated virtual assistant capable of controlling local system processes, scraping web data, summarizing articles, and executing dev environment commands.",
      tech: ["Python", "SpeechRecognition", "PyQt5", "OpenAI API", "SQLite"],
      link: "#",
      github: "#",
      color: "from-rose-500 to-red-600",
      image: "🎙️"
    },
    {
      title: "Business Web Projects",
      description: "A portfolio of high-performing, custom landing pages, e-commerce solutions, and admin panels built for a variety of global clients focusing on performance and UX.",
      tech: ["React", "Wordpress", "Tailwind CSS", "SEO Optimization", "NodeJS"],
      link: "#",
      github: "#",
      color: "from-amber-400 to-orange-600",
      image: "💼"
    }
  ];

  return (
    <section id="projects" className="relative py-24 px-6 sm:px-12 lg:px-24 border-t border-white/5">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-neon-pink/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white mb-4">
            Featured Projects
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto rounded-full" />
          <p className="text-slate-400 mt-4 text-lg">A showcase of some of my finest technical work & innovations.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card flex flex-col justify-between overflow-hidden rounded-2xl group border border-white/5 hover:border-white/10"
            >
              <div>
                {/* Image / Icon Area */}
                <div className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                  <span className="text-6xl z-10 filter drop-shadow-md select-none transform group-hover:scale-110 transition-transform duration-300">
                    {project.image}
                  </span>
                  
                  {/* Decorative grid overlay */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 font-sans">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-mono bg-white/5 border border-white/10 text-slate-300 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-4">
                  <a
                    href={project.link}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white font-mono transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                  <a
                    href={project.github}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white font-mono transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" /> Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
