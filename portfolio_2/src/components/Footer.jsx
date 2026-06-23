export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-transparent py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h4 className="text-white font-display font-bold text-lg tracking-wider">
            Shubham Dinesh Vernekar
          </h4>
          <p className="text-sm text-slate-500 font-mono mt-1">
            Founder of <span className="text-white">ShubDeep Labs</span>
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2">
          <p className="text-xs text-slate-500 font-mono">
            &copy; {currentYear} ShubDeep Labs. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-end text-xs font-mono text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#process" className="hover:text-white transition-colors">Process</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#shubdeeplabs" className="hover:text-white transition-colors">Labs</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
