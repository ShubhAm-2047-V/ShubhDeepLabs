"use client";

import { useState, useEffect } from "react";
import { X, Mail, Sparkles, Gift, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function VisitorPromoWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if already claimed or dismissed
      const claimed = localStorage.getItem("shubhdeeplabs_promo_claimed");
      if (!claimed) {
        // Show offer popup after a short 3-second delay for organic engagement
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClaimOffer = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please provide both name and email.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Save lead to database/dashboard under leads table
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          name: name,
          email: email,
          phone: "Web Visitor Leads Form",
          project: "Welcome Offer Promotion Claimed",
          category: "Subscriber",
          stack: "Mailing List",
          addons: "None",
          deadline: "Immediate",
          budget: "₹1000 Discount",
          timestamp: new Date().toISOString()
        })
      });

      if (res.ok) {
        // 2. Automatically copy the coupon code to their clipboard
        const couponCode = "SDL1000WELCOME";
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(couponCode);
        }

        // 3. Show beautiful notification of email dispatch and clipboard copy
        toast.success(`Discount coupon ${couponCode} copied to clipboard!`, {
          className: "sketch-card border-2 border-[#2C2C2C] bg-[#FFF59D] text-[#2C2C2C] font-marker font-bold"
        });
        
        toast.success(`Welcome offer email dispatched to ${email}!`, {
          className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-sans font-semibold",
          duration: 5000
        });

        localStorage.setItem("shubhdeeplabs_promo_claimed", "true");
        setIsClaimed(true);
        
        // Close modal after brief success window
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        toast.error("Failed to claim offer. Please try again.");
      }
    } catch (err) {
      console.error("Error claiming welcome offer:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="promo-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-marker"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="w-full max-w-md bg-[#FAF6EE] border-3 border-[#2C2C2C] rounded-2xl shadow-[6px_8px_0px_#2C2C2C] relative p-6 overflow-hidden notebook-ruled"
          >
            {/* Red header ribbon accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#EF5350] border-b-2 border-[#2C2C2C]" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg border border-[#2C2C2C]/20 hover:border-[#2C2C2C] hover:bg-white transition-all text-[#2C2C2C] cursor-pointer"
            >
              <X size={15} />
            </button>

            {/* Gift Icon Badge */}
            <div className="w-14 h-14 rounded-full bg-[#FFF59D] border-2 border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center mx-auto mt-2 mb-4 shadow-[2px_3px_0_#2C2C2C] rotate-[-5deg]">
              <Gift className="w-7 h-7" />
            </div>

            {!isClaimed ? (
              <div className="space-y-4 text-center">
                <h3 className="text-xl sm:text-2xl font-hand font-extrabold text-[#2C2C2C] tracking-wide uppercase underline decoration-3 decoration-[#FFF59D]">
                  🎁 Claim Your Welcome Offer
                </h3>
                <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed font-sans font-semibold">
                  Get <span className="font-extrabold text-[#2C2C2C]">₹1,000 OFF</span> on your academic project! Enter your email to claim the coupon code instantly.
                </p>

                <form onSubmit={handleClaimOffer} className="space-y-3 pt-2 text-left">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] tracking-wider mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-3 bg-white border-2 border-[#2C2C2C] rounded-xl text-[#2C2C2C] focus:outline-none focus:bg-[#FFF9C4]/10 shadow-[1px_1.5px_0_#2C2C2C]"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] tracking-wider mb-1">Your Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A6A6A]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs pl-10 pr-4 py-3 bg-white border-2 border-[#2C2C2C] rounded-xl text-[#2C2C2C] focus:outline-none focus:bg-[#FFF9C4]/10 shadow-[1px_1.5px_0_#2C2C2C]"
                        placeholder="rahul@domain.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 inline-flex items-center justify-center px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-white rounded-xl shadow-[3px_4px_0_#2C2C2C] active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <span className="w-5 h-5 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        Claim Discount Code
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-10 h-10 rounded-full bg-[#C8E6C9] border-2 border-[#2C2C2C] text-[#2E7D32] flex items-center justify-center mx-auto shadow-[1.5px_2px_0_#2C2C2C] rotate-[8deg]">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-hand font-extrabold text-[#2C2C2C] uppercase tracking-wide">
                  Welcome Code Claimed!
                </h3>
                <div className="bg-white border-2 border-dashed border-[#2C2C2C]/30 rounded-xl p-3 inline-block shadow-[1px_2px_0_#2C2C2C]">
                  <span className="font-mono font-bold text-sm tracking-widest text-[#2C2C2C] select-all">SDL1000WELCOME</span>
                </div>
                <p className="text-[11px] font-sans font-semibold text-[#6A6A6A]">
                  Code copied to your clipboard! Share this code with coordinates on WhatsApp to activate your ₹1,000 welcome credit.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
