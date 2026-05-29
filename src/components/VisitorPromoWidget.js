"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Mail, Gift, Check, ArrowRight, Clipboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function VisitorPromoWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [detectedEmail, setDetectedEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  // If path starts with /admin, do not render or do anything (prevents admin dashboard clutter)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Helper: Register the lead in database & copy coupon code to clipboard
  const registerAutomatedLead = async (capturedEmail, sourceMethod) => {
    if (localStorage.getItem("shubhdeeplabs_promo_claimed") === "true") return;

    setSubmitting(true);
    const savedName = localStorage.getItem("shubhdeeplabs_user_name") || "Auto Captured Visitor";

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: savedName,
          name: savedName,
          email: capturedEmail,
          phone: "Automated System",
          project: `Captured via ${sourceMethod}`,
          category: "Subscriber",
          stack: "Mailing List",
          addons: "None",
          deadline: "Immediate",
          budget: "₹1000 Discount",
          timestamp: new Date().toISOString()
        })
      });

      if (res.ok) {
        // Automatically copy coupon code to clipboard
        const couponCode = "SDL1000WELCOME";
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(couponCode);
        }

        toast.success(`Discount coupon ${couponCode} copied to clipboard!`, {
          className: "sketch-card border-2 border-[#2C2C2C] bg-[#FFF59D] text-[#2C2C2C] font-marker font-bold text-xs"
        });

        toast.success(`Offer captured automatically! Welcome email sent to ${capturedEmail}`, {
          className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-sans font-semibold text-xs",
          duration: 6000
        });

        localStorage.setItem("shubhdeeplabs_promo_claimed", "true");
        localStorage.setItem("shubhdeeplabs_user_email", capturedEmail);
        setIsClaimed(true);
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Failed to register automated lead:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: Check clipboard for any valid email addresses (only triggered by explicit user gesture)
  const readAndVerifyClipboard = async () => {
    try {
      if (typeof window === "undefined" || !navigator.clipboard) return false;
      const text = await navigator.clipboard.readText();
      if (text) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const match = text.match(emailRegex);
        if (match) {
          const matchedEmail = match[0];
          setDetectedEmail(matchedEmail);
          await registerAutomatedLead(matchedEmail, "Clipboard Auto-Copy");
          return true;
        }
      }
    } catch (e) {
      // Clipboard blocked or permission denied
    }
    return false;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const claimed = localStorage.getItem("shubhdeeplabs_promo_claimed");
      if (claimed === "true") {
        setIsClaimed(true);
        return;
      }

      // 1. URL Query Parameter Auto-Capture (Requires zero permission, 100% silent)
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get("email");
      if (urlEmail) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        if (emailRegex.test(urlEmail)) {
          registerAutomatedLead(urlEmail, "URL Auto-Capture");
          return;
        }
      }

      // 2. LocalStorage Auto-Capture (Requires zero permission, 100% silent)
      const savedEmail = localStorage.getItem("shubhdeeplabs_user_email");
      if (savedEmail) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        if (emailRegex.test(savedEmail)) {
          registerAutomatedLead(savedEmail, "Saved Local Profile");
          return;
        }
      }

      // 3. Global Paste Event Listener (Requires zero permission, triggered by user pasting)
      const handleGlobalPaste = (e) => {
        const text = e.clipboardData?.getData("text");
        if (text) {
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
          const match = text.match(emailRegex);
          if (match) {
            registerAutomatedLead(match[0], "Pasted Auto-Capture");
          }
        }
      };

      window.addEventListener("paste", handleGlobalPaste);

      // 4. Open the elegant non-intrusive floating sticky after a brief delay
      // Since silent background reads are blocked by modern browsers, we show the widget
      // to let them trigger autofill or type.
      const timer = setTimeout(() => {
        const stillNotClaimed = localStorage.getItem("shubhdeeplabs_promo_claimed") !== "true";
        if (stillNotClaimed) {
          setIsOpen(true);
        }
      }, 3000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("paste", handleGlobalPaste);
      };
    }
  }, []);

  const handleManualClaim = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    await registerAutomatedLead(email, "Manual Type-In");
  };

  const handleAutofillClick = async () => {
    const success = await readAndVerifyClipboard();
    if (!success) {
      toast.error("No valid email address found in clipboard. Please copy your email first or type it manually below.", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FFCDD2] text-[#B71C1C] text-xs font-semibold"
      });
    }
  };

  if (!isOpen || isClaimed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[120] font-marker max-w-sm w-[90%] sm:w-80">
      <AnimatePresence>
        {isCollapsed ? (
          // Minimized State: Cute floating handwritten tag
          <motion.button
            key="collapsed-promo"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            whileHover={{ scale: 1.05, rotate: -2 }}
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-2 px-4 py-3 bg-[#FFF59D] border-2.5 border-[#2C2C2C] rounded-2xl shadow-[4px_4px_0px_#2C2C2C] text-[#2C2C2C] font-bold text-xs uppercase cursor-pointer hover:bg-white transition-all select-none rotate-[-1deg]"
          >
            <Gift className="w-5 h-5 text-[#EF5350] animate-bounce" />
            <span>🎁 Claim ₹1,000 Offer</span>
          </motion.button>
        ) : (
          // Expanded State: Elegant whiteboard sketchy note/memo taped to screen
          <motion.div
            key="expanded-promo"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="bg-[#FAF6EE] border-3 border-[#2C2C2C] rounded-2xl shadow-[6px_6px_0px_#2C2C2C] p-5 relative overflow-hidden notebook-ruled select-none"
          >
            {/* Washi tape accent drawing */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#FFF59D]/60 border border-dashed border-[#2C2C2C] rotate-[-2deg] opacity-70" />

            {/* Red header ribbon accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#EF5350] border-b-2 border-[#2C2C2C]" />

            {/* Minimize / Close Button */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="absolute top-4 right-4 p-1 rounded-lg border border-[#2C2C2C]/20 hover:border-[#2C2C2C] hover:bg-white transition-all text-[#2C2C2C] cursor-pointer"
            >
              <X size={12} />
            </button>

            {/* Content Body */}
            <div className="space-y-3.5 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF59D] border-2 border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center shadow-[1px_1.5px_0_#2C2C2C] rotate-[-5deg] shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-hand font-extrabold text-[#2C2C2C] tracking-wide uppercase underline decoration-2 decoration-[#FFF59D]">
                  Welcome Promo
                </h3>
              </div>

              <p className="text-[10.5px] text-[#5A5A5A] leading-relaxed font-sans font-semibold">
                Copy your email address to your clipboard and tap Autofill, or use native autofill below to automatically claim your <span className="font-extrabold text-[#2C2C2C]">₹1,000 Welcome Code</span>.
              </p>

              {/* Quick Clipboard Autofill Action */}
              <button
                onClick={handleAutofillClick}
                disabled={submitting}
                className="w-full py-2 bg-[#E3F2FD] hover:bg-[#BBDEFB] text-[#1565C0] border-2 border-[#2C2C2C] rounded-xl font-marker font-bold text-[10.5px] shadow-[2px_2px_0_#2C2C2C] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Clipboard size={12} />
                ⚡ Autofill from Clipboard
              </button>

              <div className="flex items-center my-1 text-[8px] font-sans font-bold text-[#8A8A8A] uppercase">
                <div className="flex-1 h-[1px] bg-gray-300" />
                <span className="px-1.5">or enter email</span>
                <div className="flex-1 h-[1px] bg-gray-300" />
              </div>

              {/* Manual/Autofill input field */}
              <form onSubmit={handleManualClaim} className="space-y-2 text-left">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6A6A6A]" />
                  <input
                    type="email"
                    required
                    name="email"
                    id="promo-email"
                    autocomplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-[11px] pl-9 pr-3 py-2 bg-white border-2 border-[#2C2C2C] rounded-xl text-[#2C2C2C] focus:outline-none focus:bg-[#FFF9C4]/10 shadow-[1px_1.5px_0_#2C2C2C] font-sans font-semibold"
                    placeholder="student@gmail.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !email}
                  className="w-full inline-flex items-center justify-center px-3 py-2 text-[10.5px] font-bold uppercase tracking-wider text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-white rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5 transition-all cursor-pointer"
                >
                  {submitting ? (
                    <span className="w-3.5 h-3.5 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Claim Discount Code
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
