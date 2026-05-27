"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { dbService } from "@/lib/supabase";
import { 
  Gift, Sparkles, Tag, ArrowLeft, Lock, ArrowRight, 
  MessageSquare, AlertCircle, RefreshCw, CheckCircle, Flame, Star
} from "lucide-react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function DailyOffers() {
  const [activeOffer, setActiveOffer] = useState({
    title: "First 8 Special Students of diploma get 30% OFF + Assured Free Gift!",
    subtext: "* Terms & conditions apply. Connect on WhatsApp to reserve code discount spots.",
    ribbon: "Special Offer!",
    emoji: "🎁",
  });
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scratch card / Eraser game states
  const [isRevealed, setIsRevealed] = useState(false);
  const [boosterCode, setBoosterCode] = useState("STUDENT5EXTRA");
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [erasedPercentage, setErasedPercentage] = useState(0);
  const [scratchSettings, setScratchSettings] = useState({ discountPercent: 5, codes: ["STUDENT5EXTRA", "COUPON5HUB", "VIVABOOST5", "FINAL5PASS"] });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      // Fetch active offer
      const active = await dbService.getActiveOffer();
      if (active) {
        setActiveOffer(active);
      }
      
      // Fetch all offers
      const allOffers = await dbService.getOffers();
      setOffers(allOffers);

      // Fetch scratch card settings
      const settings = await dbService.getScratchSettings();
      if (settings) {
        setScratchSettings(settings);
        // Also update the booster code for the scratch card using these new settings!
        const codes = settings.codes || ["STUDENT5EXTRA", "COUPON5HUB", "VIVABOOST5", "FINAL5PASS"];
        let randomCode = codes[Math.floor(Math.random() * codes.length)];
        const percent = settings.discountPercent || 5;
        randomCode = randomCode.replace(/\d+/g, String(percent));
        setBoosterCode(randomCode);
      }
    } catch (e) {
      console.error("Failed to load offers database registries:", e);
      toast.error("Offline Mode: Loaded cached catalog.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize scratch card canvas
  useEffect(() => {
    if (!isRevealed) {
      const timer = setTimeout(() => {
        initCanvas();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, boosterCode, loading]);
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    // Account for device pixel ratio for crisp rendering on high‑DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (rect.width * dpr) || (320 * dpr);
    canvas.height = (rect.height * dpr) || (176 * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Scale context so drawing commands use CSS pixels
    ctx.scale(dpr, dpr);
    
    // Draw thick dark graphite block background
    ctx.fillStyle = "#263238"; // Deep charcoal slate
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Add textured noise for realistic slate graphite dust
    for (let i = 0; i < 2500; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const size = Math.random() * 2;
      ctx.fillStyle = Math.random() > 0.4 ? "#1E272C" : "#37474F";
      ctx.fillRect(x, y, size, size);
    }
    
    // Add messy sketched pencil scribbles
    ctx.strokeStyle = "#1A2327";
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * rect.width, Math.random() * rect.height);
      ctx.lineTo(Math.random() * rect.width, Math.random() * rect.height);
      ctx.stroke();
    }
    
    // Hand-drawn inner dashed yellow safety border
    ctx.strokeStyle = "#FFF59D";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(12, 12, rect.width - 24, rect.height - 24);
    ctx.setLineDash([]); // Reset dash
    
    // Draw Flame icon emoji on canvas
    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🔥", rect.width / 2, rect.height / 2 - 30);
    
    // Write text "GRAPHITE SCRUB AREA"
    ctx.fillStyle = "#FFF9C4";
    ctx.font = "bold 22px 'Patrick Hand', cursive, sans-serif";
    ctx.fillText("GRAPHITE SCRUB AREA", rect.width / 2, rect.height / 2 + 5);
    
    // Write micro-instructions
    ctx.fillStyle = "#ECEFF1";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("✏️ Click & Drag to scratch off layer!", rect.width / 2, rect.height / 2 + 30);
    
    setErasedPercentage(0);
  };

// Reset scratch card whenever the pathname changes (e.g., user navigates back)
const pathname = usePathname();
useEffect(() => {
  resetScratchCard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [pathname]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleStart = (e) => {
    if (isRevealed) return;
    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    setLastPos({ x, y });
    scratchDot(x, y);
  };

  const handleMove = (e) => {
    if (!isDrawing || isRevealed) return;
    
    if (e.cancelable) {
      e.preventDefault();
    }
    
    const { x, y } = getCoordinates(e);
    scratchLine(lastPos.x, lastPos.y, x, y);
    setLastPos({ x, y });
  };

  const handleEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    checkErasedPercent();
  };

  const scratchDot = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  const scratchLine = (x1, y1, x2, y2) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    // Adjust brush size based on device pixel ratio for consistent feel
    const dpr = window.devicePixelRatio || 1;
    ctx.lineWidth = 40 * dpr; // Brush size scales with DPI
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const checkErasedPercent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }
    
    const percent = Math.round((transparentCount / (pixels.length / 4)) * 100);
    setErasedPercentage(percent);
    
    if (percent >= 35 && !isRevealed) {
      setIsRevealed(true);
      toast.success("Booster unlocked! Premium coupon logged! 🎉", {
        id: "scratch-toast",
        icon: "🎁",
        className: "sketch-card border-3 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker text-lg"
      });
    }
  };

  function resetScratchCard() {
  setIsRevealed(false);
  const codes = scratchSettings.codes || ["STUDENT5EXTRA", "COUPON5HUB", "VIVABOOST5", "FINAL5PASS"];
  let randomCode = codes[Math.floor(Math.random() * codes.length)];
  // Replace any digits in the code with the current discount %
  const percent = scratchSettings.discountPercent || 5;
  randomCode = randomCode.replace(/\d+/g, String(percent));
  setBoosterCode(randomCode);
  setErasedPercentage(0);
  // Re‑draw the graphite background
  initCanvas();
}


  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] font-marker pb-24 pt-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Ruled Paper overlay backgrounds */}
      <div className="absolute inset-0 radial-grid opacity-25 pointer-events-none" />
      <div className="ruled-paper absolute top-0 left-0 right-0 h-40 opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto relative">
          {/* Back button */}
          <Link
            href="/"
            className="absolute -top-12 left-0 inline-flex items-center text-sm font-bold text-[#6A6A6A] hover:text-[#2C2C2C] transition-all hover:translate-x-[-3px]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>

          <div className="inline-block px-4 py-1 bg-[#FFF59D] border-2 border-[#2C2C2C] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] rotate-[-1deg] text-xs font-bold tracking-widest mb-3">
            ★ DYNAMIC OFFICE REGISTRY DESK ★
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-hand font-extrabold text-[#2C2C2C] uppercase leading-tight tracking-tight">
            Daily Project Specials
          </h1>
          <p className="text-sm font-sans font-semibold text-[#6A6A6A] mt-2">
            Every morning our coordinators update academic discount tags. Grab your code stamp and claim yours live!
          </p>

          <div className="absolute -right-10 top-0 w-12 h-12 hidden md:block animate-sketch-float">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#2C2C2C] stroke-[4px]">
              <path d="M10,80 L80,10 M60,10 L80,10 L80,30" />
            </svg>
          </div>
        </div>

        {/* Loading Desk State */}
        {loading ? (
          <div className="p-32 flex flex-col justify-center items-center space-y-4">
            <RefreshCw className="w-10 h-10 animate-spin text-[#2C2C2C]" />
            <p className="text-base font-hand font-bold">Opening files, fetching spec sheets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: The Big chalkboard displaying the Active Daily Deal */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="sketch-border bg-[#FCF9F2] p-3 sm:p-8 shadow-[5px_6px_0px_#2C2C2C] relative notebook-ruled overflow-hidden">
                <div className="spiral-binder" />

                {/* Corner Washi Tape decorative stamp */}
                <div className="absolute top-2.5 right-[-30px] bg-[#CE93D8] text-[#2C2C2C] px-10 py-1 text-[10px] font-marker font-bold rotate-[40deg] border-y border-[#2C2C2C] uppercase shadow-[1px_2px_0_rgba(0,0,0,0.05)]">
                  Live Deal
                </div>

                <div className="pl-4 sm:pl-10 space-y-6 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-full bg-white border-2.5 border-[#2C2C2C] flex items-center justify-center text-4xl shadow-[2.5px_3px_0_#2C2C2C] shrink-0 animate-sketch-float">
                      {activeOffer.emoji || "🎁"}
                    </div>
                    <div>
                      <span className="marker-red text-xs font-marker font-extrabold text-[#B71C1C] border border-[#B71C1C] px-2 py-0.5 rounded uppercase tracking-wider">
                        {activeOffer.ribbon || "Special Offer!"}
                      </span>
                      <p className="text-[10px] text-[#6A6A6A] font-sans font-bold uppercase tracking-wider mt-1">Updated Today</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-hand font-extrabold text-[#2C2C2C] leading-snug">
                      {activeOffer.title}
                    </h2>
                    <p className="text-sm font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                      This promo is currently verified active. Provide this specific deal coordinate when you submit your study syllabus structure to lock in this special clearance!
                    </p>
                    <div className="bg-[#FAF6EE] border-2 border-dashed border-[#2C2C2C]/20 p-3.5 rounded-xl text-xs text-[#6A6A6A]">
                      {activeOffer.subtext}
                    </div>
                  </div>

                  {/* Claim Button linking to WhatsApp */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                    <a
                      href={`https://wa.me/919028833275?text=Hello%2C%20I%20want%20to%20claim%20the%20Daily%20Special%20Deal%20"${encodeURIComponent(activeOffer.title)}"!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-sketch w-full sm:w-auto text-center py-4 px-8 inline-flex items-center justify-center shadow-[3px_4px_0_#2C2C2C]"
                    >
                      <MessageSquare className="w-5 h-5 mr-2 text-[#2C2C2C] fill-[#A5D6A7]" />
                      Claim active deal
                    </a>

                    <div className="text-xs font-sans font-semibold text-[#6A6A6A] flex items-center">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400 mr-1 animate-spin-slow" />
                      Spots fill up daily. Claim immediately!
                    </div>
                  </div>
                </div>
              </div>

              {/* Bullet Points of Terms styled as sketch sticky pad */}
              <div className="sketch-card p-6 bg-white border-[#2C2C2C]">
                <h4 className="text-lg font-bold underline decoration-2 decoration-[#90CAF9] mb-3">Clearance Guidelines:</h4>
                <ul className="space-y-2 text-xs font-sans font-semibold text-[#5A5A5A]">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span>Valid for B.Tech, M.Tech, BCA, MCA, and Diploma final year submissions.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span>Code adjustments and minor tech changes are included under the discount plan.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span>Includes high-quality formatted PDF report drafts and presentation templates.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span>Can be combined with your **Eraser Booster Code** on the right!</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right side: Interactive Gamified Pencil Scratch Coupon Box */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="sketch-border bg-[#FFF] p-6 shadow-[5px_6px_0px_#2C2C2C] text-center relative overflow-hidden">
                <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-[#FAF6EE] border border-[#2C2C2C] rounded-full" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#FAF6EE] border border-[#2C2C2C] rounded-full" />
                
                <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] tracking-wider uppercase mb-2">
                  ✏️ Pencil Scrub Game ✏️
                </h3>
                <p className="text-xs font-sans font-semibold text-[#6A6A6A] max-w-xs mx-auto mb-6 leading-tight">
                  Scrub away the dark graphite layers using your pencil to reveal an extra {scratchSettings.discountPercent}% discount code!
                </p>

                {/* The Scratch Card container */}
                <div className="relative w-full h-44 border-3 border-[#2C2C2C] rounded-2xl overflow-hidden bg-[#FFF9C4] flex flex-col justify-center items-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.06)] group">
                  
                  {/* Revealed State */}
                  {isRevealed && (
                      <div className="text-center p-4 space-y-3 z-0">
                        <p className="text-xs font-sans font-extrabold text-[#7B1FA2] uppercase tracking-widest animate-bounce">
                          ★ BOOSTER REVEALED ★
                        </p>
                        <div className="inline-block bg-white border-2 border-dashed border-[#2C2C2C] px-5 py-2.5 rounded-lg shadow-[2px_2.5px_0_#2C2C2C] rotate-[-1deg]">
                          <span className="font-sketch font-bold text-2xl text-[#2C2C2C] tracking-wider select-all">
                            {boosterCode}
                          </span>
                        </div>
                        <p className="text-[10px] font-sans font-bold text-[#6A6A6A] leading-none">
                          (Double-click code to copy)
                        </p>
                      </div>
                    )}

                  {/* Interactive Scratch-off Canvas */}
                  
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                    className="absolute inset-0 w-full h-full cursor-crosshair touch-none select-none rounded-2xl z-10 transition-opacity duration-500"
                    style={{ opacity: isRevealed ? 0 : 1, pointerEvents: isRevealed ? "none" : "auto" }}
                  />

        {!isRevealed && erasedPercentage > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm font-sans font-bold text-[#6A6A6A] bg-white bg-opacity-70 px-2 py-1 rounded">
              Erased: {erasedPercentage}%
            </p>
          </div>
        )}
                </div>

                {/* Revoke/Reset actions */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] font-sans font-bold text-[#6A6A6A]">Combo discount spots:</p>
                    <p className="text-xs font-sans font-extrabold text-[#2C2C2C]">✓ Valid with active specials</p>
                  </div>
                  {isRevealed && (
                    <button
                      onClick={resetScratchCard}
                      className="text-xs text-[#2C2C2C] hover:underline font-bold border border-[#2C2C2C] bg-[#FAF6EE] px-3 py-1 rounded shadow-[1px_1.5px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
                      style={{ display: 'none' }}
                    >
                      Reset card
                    </button>
                  )}
                </div>

                {isRevealed && (
                  <div className="mt-5 pt-4 border-t border-dashed border-[#2C2C2C]/10 animate-fade-in">
                    <a
                      href={`https://wa.me/919028833275?text=Hello%2C%20I%20want%20to%20order%20my%20academic%20project%20and%20use%20the%20active%20Daily%20Offer%20"${encodeURIComponent(activeOffer.title)}"%20plus%20my%20secret%20Booster%20Code%20"${boosterCode}"!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#E1BEE7] border-2 border-[#2C2C2C] rounded-xl text-sm font-bold text-[#2C2C2C] hover:bg-[#CE93D8] transition-all shadow-[2px_2.5px_0_#2C2C2C] hover:translate-y-0.5"
                    >
                      Apply Combo code on WhatsApp
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </a>
                  </div>
                )}

              </div>



            </div>

          </div>
        )}

        {/* Bottom Catalog: The bulletin catalog containing all available specials */}
        {!loading && (
          <div className="pt-10 border-t-3 border-dashed border-[#2C2C2C]/10">
            <h3 className="text-2xl font-hand font-extrabold text-[#2C2C2C] mb-8 underline decoration-[#FFE082] decoration-4">
              All Available Specials & Campaigns
            </h3>

            {offers.length === 0 ? (
              <div className="text-center py-10 bg-white border-2 border-dashed border-[#2C2C2C]/20 rounded-xl">
                <AlertCircle className="w-10 h-10 mx-auto text-[#B71C1C] mb-2" />
                <p className="text-sm text-[#6A6A6A]">No other specials registered. Stay tuned for updates!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((item) => (
                  <div
                    key={item.id}
                    className={`sketch-card p-5 relative overflow-hidden transition-all ${
                      item.isActive
                        ? "bg-[#FFF9C4]/40 border-2.5 border-[#2C2C2C]"
                        : "bg-white/60 opacity-80"
                    }`}
                  >
                    {item.isActive && (
                      <span className="absolute top-2 right-2 bg-[#81C784] border border-[#2C2C2C] font-marker font-bold text-[9px] px-1.5 py-0.5 rounded shadow-[1px_1px_0_#2C2C2C] animate-pulse">
                        ★ LIVE
                      </span>
                    )}

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full border border-[#2C2C2C] bg-white flex items-center justify-center text-xl shadow-[1px_1px_0_#2C2C2C] shrink-0 mt-0.5">
                        {item.emoji}
                      </div>
                      <div>
                        <span className="bg-white border border-[#2C2C2C] font-marker font-bold text-[10px] px-2 py-0.5 rounded shadow-[1px_1px_0_#2C2C2C]">
                          {item.ribbon}
                        </span>
                        <h4 className="text-base font-hand font-extrabold text-[#2C2C2C] mt-2.5 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] font-sans font-semibold text-[#6A6A6A] mt-1.5">
                          {item.subtext}
                        </p>

                        {!item.isActive && (
                          <div className="mt-4 flex items-center space-x-1 text-[10px] font-sans font-bold text-[#B71C1C]">
                            <span>📢 This deal is stored. Contact admin to activate!</span>
                          </div>
                        )}
                        
                        {item.isActive && (
                          <div className="mt-4 flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-[10px] font-sans font-bold text-emerald-600">Active promo - claim spot now!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
