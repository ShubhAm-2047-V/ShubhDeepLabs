"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home Dashboard", href: "/" },
    { name: "Project Topics", href: "/#categories" },
    { name: "Daily Deals & Offers", href: "/offers" },
    { name: "Blueprints Showcase", href: "/#portfolio" },
    { name: "Get In Touch", href: "/#contact" },
  ];

  const categories = [
    { name: "Diploma Projects", href: "/order?category=Diploma" },
    { name: "Engineering Projects", href: "/order?category=Engineering" },
    { name: "M.Tech Projects", href: "/order?category=M.Tech" },
    { name: "BCA / MCA Projects", href: "/order?category=BCA-MCA" },
    { name: "AI & ML Systems", href: "/order?category=AI-ML" },
    { name: "Web Applications", href: "/order?category=Web-Dev" },
  ];

  const socialLinks = [
    { 
      name: "GitHub", 
      href: "https://github.com/ShubhAm-2047-V", 
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      )
    },
    { 
      name: "LinkedIn", 
      href: "https://linkedin.com", 
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
  ];

  return (
    <footer className="bg-[#EBE5D9] text-[#2C2C2C] pt-16 pb-8 border-t-3 border-[#2C2C2C] transition-colors relative">
      {/* Sketch card holes simulated */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-transparent flex justify-around items-start -translate-y-2 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-5 h-5 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-white border-2 border-[#2C2C2C] overflow-hidden shadow-[2px_2px_0_#2C2C2C]">
                <img src="/logo.jpg" alt="Shubdeep Labs Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-hand font-extrabold text-2.5xl text-[#2C2C2C] flex flex-col leading-none">
                Shubdeep Labs
                <span className="text-[10px] font-marker text-[#6A6A6A] mt-0.5 leading-none">Building Intelligent Solutions</span>
              </span>
            </div>
            <p className="text-sm font-sans text-[#2C2C2C] leading-relaxed">
              We design original, high-quality, and robust academic project codebases and reports. Specially structured to help final year students score top marks.
            </p>
            
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white text-[#2C2C2C] border-2 border-[#2C2C2C] hover:bg-[#FFF59D]/60 hover:-translate-y-0.5 transition-all shadow-[2px_2px_0_#2C2C2C]"
                  aria-label={item.name}
                >
                  {item.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-marker text-lg text-[#2C2C2C] mb-6 underline decoration-2 decoration-[#EF9A9A]">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-[#2C2C2C] hover:underline hover:translate-x-1 inline-flex items-center transition-all duration-150"
                  >
                    <span>→ {link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="font-marker text-lg text-[#2C2C2C] mb-6 underline decoration-2 decoration-[#A5D6A7]">Academic Topics</h3>
            <ul className="space-y-3">
              {categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-[#2C2C2C] hover:underline hover:translate-x-1 inline-flex items-center transition-all duration-150"
                  >
                    <span>* {link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-marker text-lg text-[#2C2C2C] mb-6 underline decoration-2 decoration-[#90CAF9]">Contact Desk</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#2C2C2C] shrink-0 mt-0.5" />
                <div className="text-sm text-[#2C2C2C]">
                  <a href="tel:+919028833275" className="font-bold hover:underline">
                    +91 90288 33275
                  </a>
                  <p className="text-xs text-[#6A6A6A] mt-0.5">Available Mon-Sat 9AM-8PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#2C2C2C] shrink-0 mt-0.5" />
                <span className="text-sm text-[#2C2C2C]">
                  <a href="mailto:shubdeeplabs@gmail.com" className="font-bold hover:underline">
                    shubdeeplabs@gmail.com
                  </a>
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#2C2C2C] shrink-0 mt-0.5" />
                <span className="text-sm text-[#2C2C2C]">
                  Dharwad & Bengaluru, Karnataka, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="pt-8 mt-12 border-t-2 border-[#2C2C2C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6A6A6A] space-y-4 sm:space-y-0">
          <p className="flex items-center">
            &copy; {currentYear} Shubdeep Labs. Made with&nbsp;<Heart className="w-3.5 h-3.5 fill-[#EF9A9A] text-[#EF9A9A] inline" />&nbsp;for Diploma Students.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/admin" className="hover:underline flex items-center">
              Admin Login <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
