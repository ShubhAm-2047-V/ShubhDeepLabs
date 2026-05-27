"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { dbService } from "@/lib/supabase";
import { 
  Lock, Mail, Key, Shield, RefreshCw, CheckCircle, 
  AlertCircle, LogOut, ArrowLeft, Coins, Landmark, Zap, ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";

const PRICE_ITEMS = [
  {
    group: "🎓 Pick Your Field (Base Prices)",
    items: [
      { id: "diploma", label: "Diploma", defaultPrice: 1999 },
      { id: "engineering", label: "Engineering (B.E./B.Tech)", defaultPrice: 4999 },
      { id: "mtech", label: "M.Tech / Research", defaultPrice: 8999 },
      { id: "bca-mca", label: "BCA / MCA", defaultPrice: 3999 },
      { id: "ai-ml", label: "AI / ML", defaultPrice: 6999 },
      { id: "android", label: "Android App", defaultPrice: 5499 },
    ]
  },
  {
    group: "⚙️ Choose Stack (Add-on Prices)",
    items: [
      { id: "html", label: "HTML / CSS / JS", defaultPrice: 0 },
      { id: "python-flask", label: "Python + Flask", defaultPrice: 999 },
      { id: "react", label: "React.js", defaultPrice: 1499 },
      { id: "nextjs", label: "Next.js", defaultPrice: 1999 },
      { id: "mern", label: "MERN Stack", defaultPrice: 2999 },
      { id: "android-dev", label: "Android (Java/Kotlin)", defaultPrice: 3499 },
      { id: "firebase", label: "Firebase Integration", defaultPrice: 999 },
      { id: "db", label: "MySQL / MongoDB", defaultPrice: 799 },
      { id: "ai-integration", label: "AI Integration", defaultPrice: 2499 },
      { id: "ml-model", label: "ML Model", defaultPrice: 3499 },
      { id: "opencv", label: "OpenCV / Face Detection", defaultPrice: 2999 },
      { id: "fullstack", label: "Full Stack + Deploy", defaultPrice: 4499 },
      { id: "blockchain", label: "Blockchain / Web3", defaultPrice: 5999 },
    ]
  },
  {
    group: "✨ Add-Ons (Delivery Deliverables)",
    items: [
      { id: "ppt", label: "PPT Presentation", defaultPrice: 499 },
      { id: "report", label: "Thesis Report", defaultPrice: 999 },
      { id: "viva", label: "Viva Guidance Sheet", defaultPrice: 399 },
      { id: "remote", label: "Remote Setup (Zoom)", defaultPrice: 699 },
      { id: "deployment", label: "Cloud Deployment", defaultPrice: 1499 },
      { id: "docs", label: "Code Walkthrough Doc", defaultPrice: 599 },
    ]
  },
  {
    group: "⏱️ Deadline (Schedule Charges)",
    items: [
      { id: "urgent", label: "1–3 Days (Urgent)", defaultPrice: 2499 },
      { id: "normal", label: "4–7 Days (Standard)", defaultPrice: 999 },
      { id: "relaxed", label: "8–14 Days (Relaxed)", defaultPrice: 0 },
      { id: "flexible", label: "Flexible / No Rush", defaultPrice: 0 },
    ]
  }
];

export default function PricingManager() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoginLoading(true);
    const result = await dbService.loginAdmin(email, password);
    setLoginLoading(false);

    if (result.success) {
      setIsLoggedIn(true);
      toast.success("Key verified! Pricing ledger unlocked.", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker text-lg"
      });
      fetchPrices();
    } else {
      toast.error(result.error || "Credentials failed.");
    }
  };

  const handleLogout = async () => {
    await dbService.logoutAdmin();
    setIsLoggedIn(false);
    toast.success("Coordination desk locked.");
  };

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const data = await dbService.getCustomizerPrices();
      // Initialize price state with database values or default values
      const initialPrices = {};
      PRICE_ITEMS.forEach(group => {
        group.items.forEach(item => {
          initialPrices[item.id] = data[item.id] !== undefined ? data[item.id] : item.defaultPrice;
        });
      });
      setPrices(initialPrices);
    } catch (e) {
      console.error(e);
      toast.error("Failed to read custom prices from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = dbService.checkAdminAuth((userStatus) => {
      setIsLoggedIn(userStatus);
      if (userStatus) {
        fetchPrices();
      }
    });
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const handlePriceChange = (id, value) => {
    const numericVal = parseInt(value);
    setPrices(prev => ({
      ...prev,
      [id]: isNaN(numericVal) ? 0 : Math.max(0, numericVal)
    }));
  };

  const handleSavePrices = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dbService.saveCustomizerPrices(prices);
      toast.success("Pricing configurations saved successfully!", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
      });
      fetchPrices();
    } catch (e) {
      console.error(e);
      toast.error("Failed to register prices in DB.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    const defaults = {};
    PRICE_ITEMS.forEach(group => {
      group.items.forEach(item => {
        defaults[item.id] = item.defaultPrice;
      });
    });
    setPrices(defaults);
    toast.success("Reset inputs to initial default guidelines.");
  };

  // -------------------------------------------------------------
  // SECURE AUTH VAULT LOCKSCREEN
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 mt-16 bg-[#FAF6EE]">
        <div className="w-full max-w-md chalkboard-panel p-8 flex flex-col relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] flex items-center justify-center mx-auto mb-4 shadow-[2px_3px_0_#2C2C2C] rotate-[-5deg]">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-marker font-extrabold tracking-widest text-[#F8F9FA] uppercase underline decoration-[#FFF59D] decoration-2">COORDINATOR DESK</h1>
            <p className="mt-2 text-sm text-[#EBE5D9] font-marker">
              Office auth required. Enter your coordinator credentials to access the desk.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-marker text-[#F8F9FA] uppercase mb-1 tracking-widest">COORDINATOR ID</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#EBE5D9]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-base pl-11 pr-4 py-3 bg-[#FAF6EE]/10 border-2 border-[#FAF6EE] rounded-xl focus:outline-none focus:bg-[#FAF6EE]/20 text-[#FFF59D] font-marker"
                  placeholder="admin@shubdeeplabs.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-marker text-[#F8F9FA] uppercase mb-1 tracking-widest">ACCESS KEY</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#EBE5D9]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-base pl-11 pr-4 py-3 bg-[#FAF6EE]/10 border-2 border-[#FAF6EE] rounded-xl focus:outline-none focus:bg-[#FAF6EE]/20 text-[#FFF59D] font-marker"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full inline-flex items-center justify-center px-4 py-4 text-base font-marker font-bold tracking-widest text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF] rounded-xl shadow-[3px_4px_0_#2C2C2C] hover:translate-y-0.5 active:translate-y-1.5 transition-all cursor-pointer"
            >
              {loginLoading ? (
                <span className="w-5 h-5 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  UNLOCK DESK
                  <Lock className="w-4 h-4 ml-1.5 text-[#2C2C2C]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // PRICING MANAGEMENT DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 mt-16 bg-[#FAF6EE] text-[#2C2C2C] font-marker">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2.5 border-[#2C2C2C]/10 pb-5">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="p-2.5 rounded-xl border-2 border-[#2C2C2C] bg-white hover:bg-[#FAF6EE] text-[#2C2C2C] transition-all shadow-[2px_2px_0_#2C2C2C]"
            title="Back to Orders Coordinator Desk"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-3xl font-hand font-extrabold text-[#2C2C2C] flex items-center">
              <Coins className="w-6.5 h-6.5 mr-2 text-[#2C2C2C] shrink-0" />
              PRICING MODULE COORDINATOR DESK
            </h1>
            <p className="text-sm font-marker text-[#6A6A6A] mt-1">
              Modify the pricing rates for customize options, addon packs, and project levels dynamically.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchPrices}
            className="p-2.5 rounded-xl border-2 border-[#2C2C2C] bg-white hover:bg-[#FAF6EE] text-[#2C2C2C] transition-all cursor-pointer shadow-[2px_2px_0_#2C2C2C]"
            title="Reload prices"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#B71C1C] bg-[#FFCDD2] border-2 border-[#2C2C2C] hover:bg-[#EF9A9A] rounded-xl shadow-[2px_2.5px_0_#2C2C2C]"
          >
            LOCK DESK
            <LogOut className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSavePrices} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PRICE_ITEMS.map((group) => (
            <div key={group.group} className="sketch-border bg-[#FCF9F2] p-3 sm:p-6 shadow-[4px_5px_0_#2C2C2C] notebook-ruled">
              <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] mb-4 pb-2 border-b-2 border-dashed border-[#2C2C2C]/25 flex items-center pl-4 sm:pl-10">
                {group.group}
              </h3>
              
              <div className="space-y-3.5 pl-4 sm:pl-10 relative z-10">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold font-marker text-[#5A5A5A]">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#6A6A6A]">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={prices[item.id] !== undefined ? prices[item.id] : item.defaultPrice}
                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                        className="w-28 text-sm px-3 py-1.5 bg-white border-2 border-[#2C2C2C] rounded-lg focus:outline-none text-[#2C2C2C] font-mono font-bold text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Panel */}
        <div className="sketch-card bg-[#FAF6EE] border-3 border-[#2C2C2C] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center text-xs text-[#6A6A6A] font-sans font-semibold">
            <AlertCircle className="w-5 h-5 mr-2 text-[#2C2C2C] shrink-0" />
            <span>Changing prices will update customizer options, RAG chat files, and AI instructions.</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold font-marker border-2 border-[#2C2C2C] bg-white hover:bg-[#FAF6EE] text-[#5A5A5A] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
            >
              Reset to Defaults
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold font-marker border-2 border-[#2C2C2C] bg-[#FFF59D] hover:bg-[#FFF9C4] text-[#2C2C2C] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Save All Prices
                  <CheckCircle className="w-4 h-4 ml-1.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
