"use client";
 
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Cpu, Award, FileText, Lock, ArrowRight, Sparkles, Terminal, Gift, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
 
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
 
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  const navLinks = [
    { name: "Project Topics", href: "/#categories", icon: Layers },
    { name: "Daily Offer", href: "/offers", icon: Gift },
    { name: "Success Stories", href: "/#portfolio", icon: Award },
    { name: "AI Chatbot", href: "/chatbot", icon: MessageSquare },
    { name: "Common Doubts", href: "/#faq", icon: FileText },
  ];
 
  const handleSystemSync = () => {
    toast.success("All systems ready! Built with focus & care.", {
      icon: "✏️",
      className: "sketch-card text-[#2C2C2C] border-2 border-[#2C2C2C] bg-[#FAF6EE] rounded-xl font-marker text-sm"
    });
  };
 
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF6EE]/95 border-b-3 border-[#2C2C2C] py-2.5 shadow-[0_4px_0_rgba(44,44,44,0.1)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Hand-Drawn Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white border-2.5 border-[#2C2C2C] overflow-hidden relative shadow-[2px_3px_0_#2C2C2C] group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0_#2C2C2C] transition-all duration-150">
              <img src="/logo.jpg" alt="Shubdeep Labs Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-hand font-black text-2xl tracking-tight text-[#2C2C2C] flex flex-col leading-none">
              Shubdeep Labs
              <span className="text-[10px] font-marker text-[#6A6A6A] tracking-wider leading-none">Building Intelligent Solutions</span>
            </span>
          </Link>
 
          {/* Nav Directory */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-marker tracking-wide text-[#2C2C2C] hover:text-[#2C2C2C] hover:bg-[#FFF59D]/60 transition-all duration-150 border-1.5 border-transparent hover:border-[#2C2C2C]"
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
 
          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Friendly Hand-Written status badge */}
            <button
              onClick={handleSystemSync}
              className="px-3.5 py-1.5 rounded-xl text-sm font-hand font-extrabold text-[#2C2C2C] bg-[#C8E6C9] border-2 border-[#2C2C2C] hover:bg-[#A5D6A7] transition-all flex items-center space-x-1.5 cursor-pointer shadow-[2px_3px_0_#2C2C2C]"
            >
              <Sparkles className="w-4 h-4 text-[#2C2C2C]" />
              <span>DONE WITH CARE</span>
            </button>
 
            {/* Admin icon link */}
            <Link
              href="/admin"
              className="p-2 rounded-xl text-[#2C2C2C] hover:bg-[#EBE5D9] border-2 border-[#2C2C2C] bg-white transition-all shadow-[2px_2px_0_#2C2C2C]"
              title="Coordinator Panel"
            >
              <Lock className="w-4 h-4" />
            </Link>
 
            {/* Launch CTA */}
            <Link
              href="/order"
              className="btn-sketch inline-flex items-center justify-center px-4 py-2 text-sm"
            >
              <span>Build My Project!</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#2C2C2C]" />
            </Link>
          </div>
 
          {/* Mobile elements */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={handleSystemSync}
              className="p-2 rounded-xl text-[#2C2C2C] border-2 border-[#2C2C2C] bg-[#C8E6C9] shadow-[1px_2px_0_#2C2C2C]"
            >
              <Sparkles className="w-4 h-4" />
            </button>
 
            <Link
              href="/admin"
              className="p-2 rounded-xl text-[#2C2C2C] border-2 border-[#2C2C2C] bg-white shadow-[1px_2px_0_#2C2C2C]"
            >
              <Lock className="w-4 h-4" />
            </Link>
 
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#2C2C2C] border-2 border-[#2C2C2C] bg-white focus:outline-none shadow-[1px_2px_0_#2C2C2C]"
              aria-label="Toggle Menu"
            >
              <div className="space-y-1">
                <span className={`block w-5 h-0.5 bg-[#2C2C2C] transform transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block w-4 h-0.5 bg-[#2C2C2C] transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
                <span className={`block w-5 h-0.5 bg-[#2C2C2C] transform transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </div>
 
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden bg-[#FAF6EE] border-t-2 border-[#2C2C2C] shadow-lg"
          >
            <div className="px-4 pt-3 pb-6 space-y-2 font-marker text-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-[#2C2C2C] hover:bg-[#FFF59D]/60 transition-colors border-2 border-transparent hover:border-[#2C2C2C]"
                >
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t-2 border-[#2C2C2C] mt-4">
                <Link
                  href="/order"
                  onClick={() => setIsOpen(false)}
                  className="btn-sketch flex items-center justify-center w-full py-3.5 text-center"
                >
                  <span>Build My Project!</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
