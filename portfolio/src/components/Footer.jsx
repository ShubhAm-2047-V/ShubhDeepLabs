export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-[#050816] py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h4 className="text-white font-display font-bold text-lg tracking-wider">
            Shubham Dinesh Vernekar
          </h4>
          <p className="text-sm text-slate-500 font-mono mt-1">
            Founder of <span className="text-neon-cyan">ShubDeep Labs</span>
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2">
          <p className="text-xs text-slate-500 font-mono">
            &copy; {currentYear} ShubDeep Labs. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-mono text-slate-400">
            <a href="#about" className="hover:text-neon-blue transition-colors">About</a>
            <a href="#projects" className="hover:text-neon-blue transition-colors">Projects</a>
            <a href="#contact" className="hover:text-neon-blue transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
