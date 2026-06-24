import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "web",
    budget: "1000",
    message: "",
  });
  
  const [status, setStatus] = useState("idle"); // 'idle', 'submitting', 'success'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }
    setStatus("submitting");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        projectType: "web",
        budget: "1000",
        message: "",
      });
    }, 1500);
  };

  return (
    <section id="contact" className="relative py-24 px-6 sm:px-12 lg:px-24 border-t border-white/5">
      <div className="absolute top-[10%] right-[10%] w-[35rem] h-[35rem] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white mb-4">
            Let's Collaborate
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto rounded-full" />
          <p className="text-slate-400 mt-4 text-lg">Have a project in mind or want to work together?</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 sm:p-12 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-300 font-sans"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-300 font-sans"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Project Type</label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="bg-[#0b0c16] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-300 font-sans cursor-pointer"
                    >
                      <option value="web">Web Application</option>
                      <option value="ai">AI Integration / LLM</option>
                      <option value="automation">Workflow Automation</option>
                      <option value="landing">Landing Page</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Estimated Budget ($)</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="bg-[#0b0c16] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-300 font-sans cursor-pointer"
                    >
                      <option value="1000">$1,000 - $3,000</option>
                      <option value="3000">$3,000 - $7,000</option>
                      <option value="7000">$7,000 - $15,000</option>
                      <option value="15000">$15,000+</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell me about your project or general inquiry..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-300 font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-neon-blue to-neon-purple text-dark-bg font-semibold py-4 rounded-xl shadow-lg hover:shadow-neon-blue/20 hover:scale-[1.01] active:scale-[0.99] transition duration-300 disabled:opacity-50"
                >
                  {status === "submitting" ? (
                    <div className="w-5 h-5 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-6 animate-pulse">
                  <CheckCircle className="w-16 h-16 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3 font-display">Message Sent!</h3>
                <p className="text-slate-400 max-w-md">
                  Thank you for reaching out. I'll review your project details and get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-8 px-6 py-2.5 rounded-full font-semibold border border-white/10 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition duration-300"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
