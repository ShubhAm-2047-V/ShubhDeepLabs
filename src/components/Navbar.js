"use client";
 
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Cpu, Award, FileText, Lock, ArrowRight, Sparkles, Terminal, Gift, MessageSquare, Briefcase, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
 
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isStudentPage = pathname === '/student';
  const isBusinessPage = !isStudentPage;
 
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  const businessNavLinks = [
    { name: "Solutions", href: "/#services", icon: Briefcase },
    { name: "Customizer", href: "/#customizer", icon: Layers },
    { name: "Student Desk", href: "/student", icon: GraduationCap },
    { name: "Blueprints", href: "/student#portfolio", icon: Award },
    { name: "FAQs", href: "/#faq", icon: FileText },
  ];

  const studentNavLinks = [
    { name: "Student Desk", href: "/student", icon: GraduationCap },
    { name: "Business Solutions", href: "/", icon: Briefcase },
    { name: "Daily Offer", href: "/offers", icon: Gift },
    { name: "Blueprints", href: "/student#portfolio", icon: Award },
    { name: "Portfolio PDF", href: "/portfolio-pdf", icon: FileText },
  ];

  const navLinks = isStudentPage ? studentNavLinks : businessNavLinks;
 
  const handleSystemSync = () => {
    toast.success("ShubDeep Labs systems active & ready!", {
      icon: "✨",
      style: {
        background: isStudentPage ? '#FAF6EE' : '#3B2818',
        color: isStudentPage ? '#2C2C2C' : '#FFF7EE',
        border: isStudentPage ? '2px solid #2C2C2C' : '1.5px solid #CFE3D2',
        borderRadius: '12px'
      }
    });
  };
 
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print ${
        scrolled
          ? isStudentPage
            ? "bg-[#FAF6EE]/95 border-b-3 border-[#2C2C2C] py-2.5 shadow-[0_4px_0_rgba(44,44,44,0.1)]"
            : "bg-[#FFF7EE]/90 backdrop-blur-md border-b border-[#D5C4A6]/50 py-2.5 shadow-sm"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className={`w-10 h-10 rounded-xl bg-white overflow-hidden relative transition-all duration-150 ${
              isStudentPage 
                ? "border-2.5 border-[#2C2C2C] shadow-[2px_3px_0_#2C2C2C]" 
                : "border-1.5 border-[#A8C9AD] shadow-sm"
            }`}>
              <img src="/logo.jpg" alt="Shubdeep Labs Logo" className="w-full h-full object-cover" />
            </div>
            <span className={`font-black text-xl sm:text-2xl tracking-tight flex flex-col leading-none ${
              isStudentPage ? "font-hand text-[#2C2C2C]" : "font-sans text-[#3B2818]"
            }`}>
              Shubdeep Labs
              <span className={`text-[10px] tracking-wider leading-none ${
                isStudentPage ? "font-marker text-[#6A6A6A]" : "font-sans font-semibold text-[#4A3525]"
              }`}>
                {isStudentPage ? "Building Academic Solutions" : "Enterprise Digital Solutions"}
              </span>
            </span>
          </Link>
 
          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isStudentPage
                      ? "font-marker text-[#2C2C2C] hover:bg-[#FFF59D]/60 border-1.5 border-transparent hover:border-[#2C2C2C]"
                      : "font-sans text-[#3B2818] hover:bg-[#CFE3D2]/50 hover:text-[#2E3B2B]"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
 
          {/* Action CTAs & Toggle Button */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* High Impact Mode Switch Toggle */}
            <div className={`flex items-center p-1 rounded-full border transition-all ${
              isStudentPage 
                ? "bg-white border-2 border-[#2C2C2C] shadow-[2px_2px_0_#2C2C2C]" 
                : "bg-white/90 backdrop-blur-sm border-1.5 border-[#A8C9AD] shadow-sm"
            }`}>
              <Link 
                href="/"
                className={`px-3 py-1 rounded-full flex items-center space-x-1.5 text-xs font-bold transition-all ${
                  isBusinessPage 
                    ? "bg-[#CFE3D2] text-[#2E3B2B] shadow-sm" 
                    : "text-[#5A5A5A] hover:text-[#2C2C2C]"
                }`}
                title="Business Solutions Page"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Business</span>
              </Link>
              
              <Link
                href="/student"
                className={`px-3 py-1 rounded-full flex items-center space-x-1.5 text-xs font-bold transition-all ${
                  isStudentPage 
                    ? "bg-[#FFF59D] text-[#2C2C2C] border border-[#2C2C2C]" 
                    : "text-[#5A5A5A] hover:text-[#3B2818]"
                }`}
                title="Student Projects Page"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Students</span>
              </Link>
            </div>

            {/* Admin icon link */}
            <Link
              href="/admin"
              className={`p-2 rounded-xl transition-all ${
                isStudentPage
                  ? "text-[#2C2C2C] hover:bg-[#EBE5D9] border-2 border-[#2C2C2C] bg-white shadow-[2px_2px_0_#2C2C2C]"
                  : "text-[#3B2818] hover:bg-[#EADCC6] border border-[#D5C4A6] bg-white/90"
              }`}
              title="Admin Panel"
            >
              <Lock className="w-4 h-4" />
            </Link>
 
            {/* Launch CTA */}
            {isStudentPage ? (
              <Link
                href="/order"
                className="btn-sketch inline-flex items-center justify-center px-4 py-2 text-sm"
              >
                <span>Build My Project!</span>
                <ArrowRight className="w-4 h-4 ml-1.5 text-[#2C2C2C]" />
              </Link>
            ) : (
              <a
                href="#consultation"
                className="btn-sage-green inline-flex items-center justify-center px-4 py-2 text-sm"
              >
                <span>Get Consultation</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </a>
            )}
          </div>
 
          {/* Mobile mode elements */}
          <div className="flex md:hidden items-center space-x-2">
            
            {/* Mobile Mode Switcher */}
            <div className={`flex items-center p-0.5 rounded-full border ${
              isStudentPage ? "bg-white border-2 border-[#2C2C2C]" : "bg-white border border-[#A8C9AD]"
            }`}>
              <Link 
                href="/"
                className={`px-2 py-1 rounded-full text-[11px] font-bold ${
                  isBusinessPage ? "bg-[#CFE3D2] text-[#2E3B2B]" : "text-gray-500"
                }`}
              >
                Biz
              </Link>
              <Link
                href="/student"
                className={`px-2 py-1 rounded-full text-[11px] font-bold ${
                  isStudentPage ? "bg-[#FFF59D] text-[#2C2C2C]" : "text-gray-500"
                }`}
              >
                Student
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl focus:outline-none ${
                isStudentPage
                  ? "text-[#2C2C2C] border-2 border-[#2C2C2C] bg-white shadow-[1px_2px_0_#2C2C2C]"
                  : "text-[#3B2818] border border-[#D5C4A6] bg-white"
              }`}
              aria-label="Toggle Menu"
            >
              <div className="space-y-1">
                <span className={`block w-5 h-0.5 ${isStudentPage ? "bg-[#2C2C2C]" : "bg-[#3B2818]"} transform transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block w-4 h-0.5 ${isStudentPage ? "bg-[#2C2C2C]" : "bg-[#3B2818]"} transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
                <span className={`block w-5 h-0.5 ${isStudentPage ? "bg-[#2C2C2C]" : "bg-[#3B2818]"} transform transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
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
            className={`md:hidden ${
              isStudentPage 
                ? "bg-[#FAF6EE] border-t-2 border-[#2C2C2C] shadow-lg" 
                : "bg-[#FFF7EE] border-t border-[#D5C4A6] shadow-lg"
            }`}
          >
            <div className="px-4 pt-3 pb-6 space-y-2 font-semibold">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isStudentPage
                      ? "text-[#2C2C2C] hover:bg-[#FFF59D]/60 font-marker"
                      : "text-[#3B2818] hover:bg-[#EADCC6]/60"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-[#D5C4A6] mt-4 space-y-2">
                <Link
                  href={isStudentPage ? "/order" : "/#consultation"}
                  onClick={() => setIsOpen(false)}
                  className={isStudentPage ? "btn-sketch flex items-center justify-center w-full py-3 text-center" : "btn-sage-green flex items-center justify-center w-full py-3 text-center"}
                >
                  <span>{isStudentPage ? "Build My Project!" : "Request Consultation"}</span>
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
