"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { dbService } from "@/lib/supabase";
import { 
  Lock, Mail, Key, Shield, RefreshCw, Trash2, CheckCircle, 
  Plus, AlertCircle, LogOut, ArrowLeft, Tag, HelpCircle, Star,
  Percent, Settings, X
} from "lucide-react";
import toast from "react-hot-toast";

export default function OffersManager() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  // Form parameters
  const [formData, setFormData] = useState({
    title: "",
    subtext: "",
    ribbon: "Special Offer!",
    emoji: "🎁",
  });
  const [loading, setLoading] = useState(false);

  // Scratch card settings
  const [scratchDiscount, setScratchDiscount] = useState(5);
  const [scratchCodes, setScratchCodes] = useState(["STUDENT5EXTRA", "COUPON5HUB", "VIVABOOST5", "FINAL5PASS"]);
  const [newCode, setNewCode] = useState("");
  const [scratchSaving, setScratchSaving] = useState(false);

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
      toast.success("Key verified! Agenda registry unlocked.", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker text-lg"
      });
      fetchOffers();
    } else {
      toast.error(result.error || "Credentials failed.");
    }
  };

  const handleLogout = async () => {
    await dbService.logoutAdmin();
    setIsLoggedIn(false);
    toast.success("Coordination desk locked.");
  };

  const fetchOffers = async () => {
    setOffersLoading(true);
    try {
      const data = await dbService.getOffers();
      setOffers(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to read offers database registry.");
    } finally {
      setOffersLoading(false);
    }
  };

  const fetchScratchSettings = async () => {
    try {
      const settings = await dbService.getScratchSettings();
      if (settings) {
        setScratchDiscount(settings.discountPercent || 5);
        setScratchCodes(settings.codes || ["STUDENT5EXTRA", "COUPON5HUB", "VIVABOOST5", "FINAL5PASS"]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsubscribe = dbService.checkAdminAuth((userStatus) => {
      setIsLoggedIn(userStatus);
      if (userStatus) {
        fetchOffers();
        fetchScratchSettings();
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const handleSaveScratchSettings = async () => {
    setScratchSaving(true);
    try {
      await dbService.saveScratchSettings({
        discountPercent: scratchDiscount,
        codes: scratchCodes,
      });
      toast.success("Scratch card settings saved!", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to save scratch settings.");
    } finally {
      setScratchSaving(false);
    }
  };

  const handleDiscountChange = (val) => {
    setScratchDiscount(val);
    setScratchCodes((prev) =>
      prev.map((code) => code.replace(/\d+/g, String(val)))
    );
  };

  const handleAddCode = () => {
    let code = newCode.trim().toUpperCase();
    if (!code) return;
    
    // Auto-update digits in the code string to match the current percentage
    code = code.replace(/\d+/g, String(scratchDiscount));
    
    if (scratchCodes.includes(code)) {
      toast.error("Code already exists!");
      return;
    }
    setScratchCodes([...scratchCodes, code]);
    setNewCode("");
  };

  const handleRemoveCode = (codeToRemove) => {
    if (scratchCodes.length <= 1) {
      toast.error("At least 1 code is required!");
      return;
    }
    setScratchCodes(scratchCodes.filter((c) => c !== codeToRemove));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subtext) {
      toast.error("Please specify offer details.");
      return;
    }

    setLoading(true);
    try {
      await dbService.addOffer(formData);
      toast.success("New deal logged in agenda list!", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
      });
      setFormData({ title: "", subtext: "", ribbon: "Special Offer!", emoji: "🎁" });
      fetchOffers();
    } catch (e) {
      console.error(e);
      toast.error("Failed to register offer.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (offerId) => {
    try {
      await dbService.setActiveOffer(offerId);
      toast.success("Offer set as ACTIVE deal!", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
      });
      fetchOffers();
    } catch (e) {
      console.error(e);
      toast.error("Failed to activate deal.");
    }
  };

  const handleDelete = (offerId) => {
    setConfirmModal({
      isOpen: true,
      message: "Lodging permanent record deletion. Proceed?",
      onConfirm: async () => {
        try {
          await dbService.deleteOffer(offerId);
          toast.success("Offer record expunged.");
          fetchOffers();
        } catch (e) {
          console.error(e);
          toast.error("Deletion failed.");
        }
      }
    });
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
                  UNLOCK REGISTRY
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
  // DAILY OFFERS DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 mt-16 bg-[#FAF6EE] text-[#2C2C2C] font-marker">
      
      {/* Console Header */}
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
              <Tag className="w-6 h-6 mr-2 text-[#2C2C2C] shrink-0" />
              DAILY DEALS COORDINATOR DESK
            </h1>
            <p className="text-sm font-marker text-[#6A6A6A] mt-1">
              Add new promotional tags and change active student specials dynamically.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchOffers}
            className="p-2.5 rounded-xl border-2 border-[#2C2C2C] bg-white hover:bg-[#FAF6EE] text-[#2C2C2C] transition-all cursor-pointer shadow-[2px_2px_0_#2C2C2C]"
            title="Reload Agendas"
          >
            <RefreshCw className={`w-4 h-4 ${offersLoading ? "animate-spin" : ""}`} />
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form: Add Daily Special (Lined Notebook form) */}
        <div className="lg:col-span-5">
          <div className="sketch-border bg-[#FCF9F2] p-3 sm:p-6 shadow-[4px_5px_0_#2C2C2C] notebook-ruled">
            <h3 className="text-xl font-marker font-extrabold text-[#2C2C2C] mb-6 underline decoration-2 decoration-[#A5D6A7] flex items-center pl-4 sm:pl-10">
              <Plus className="w-5 h-5 mr-1 text-[#2C2C2C]" />
              Add Daily Deal Special
            </h3>

            <form onSubmit={handleAddOffer} className="space-y-4 pl-4 sm:pl-10 relative z-10">
              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1 tracking-wider">Ribbon Tag Accent *</label>
                <input
                  type="text"
                  name="ribbon"
                  value={formData.ribbon}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm px-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker"
                  placeholder="e.g. Special Offer!, Monday Deal!"
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1 tracking-wider">Offer Badge Emoji</label>
                  <select
                    name="emoji"
                    value={formData.emoji}
                    onChange={handleInputChange}
                    className="w-full text-sm px-3 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker"
                  >
                    <option value="🎁">🎁 Gift Box</option>
                    <option value="🔥">🔥 Hot Fire</option>
                    <option value="🎉">🎉 Party Popper</option>
                    <option value="⭐">⭐ Spark Star</option>
                    <option value="📢">📢 Loud Speaker</option>
                    <option value="⚡">⚡ Lightning Deal</option>
                  </select>
                </div>
                <div className="col-span-1 flex items-end justify-center">
                  <div className="w-12 h-11 bg-white border-2 border-[#2C2C2C] rounded-xl flex items-center justify-center text-2xl shadow-[1px_2px_0_#2C2C2C]">
                    {formData.emoji}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1 tracking-wider">Offer Deal Headline Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm px-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker"
                  placeholder="e.g. First 8 students get 30% OFF!"
                />
              </div>

              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1 tracking-wider">Subtext / Terms *</label>
                <textarea
                  name="subtext"
                  value={formData.subtext}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full text-sm px-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker"
                  placeholder="e.g. * Terms apply. Valid till midnight today."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-sketch w-full py-3.5 text-base flex items-center justify-center cursor-pointer"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2.5 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Log in Agenda list
                    <Plus className="w-5 h-5 ml-1.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Scratch Card Booster Settings */}
          <div className="sketch-border bg-[#FCF9F2] p-3 sm:p-6 shadow-[4px_5px_0_#2C2C2C] notebook-ruled mt-6">
            <h3 className="text-xl font-marker font-extrabold text-[#2C2C2C] mb-6 underline decoration-2 decoration-[#E1BEE7] flex items-center pl-4 sm:pl-10">
              <Settings className="w-5 h-5 mr-1 text-[#2C2C2C]" />
              Scratch Card Booster Settings
            </h3>

            <div className="space-y-5 pl-4 sm:pl-10 relative z-10">
              {/* Discount Percentage */}
              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1 tracking-wider">
                  Booster Discount %
                </label>
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <Percent className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A6A6A]" />
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={scratchDiscount}
                      onChange={(e) => handleDiscountChange(parseInt(e.target.value) || 0)}
                      className="w-full text-sm px-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker pr-10"
                      placeholder="5"
                    />
                  </div>
                  <div className="w-14 h-11 bg-[#E1BEE7] border-2 border-[#2C2C2C] rounded-xl flex items-center justify-center text-base font-bold text-[#2C2C2C] shadow-[1px_2px_0_#2C2C2C]">
                    {scratchDiscount}%
                  </div>
                </div>
                <p className="text-[10px] font-sans font-semibold text-[#6A6A6A] mt-1">
                  This % is shown to students after they scratch the card.
                </p>
              </div>

              {/* Codes List */}
              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1 tracking-wider">
                  Booster Coupon Codes
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {scratchCodes.map((code) => (
                    <div
                      key={code}
                      className="inline-flex items-center bg-white border-2 border-[#2C2C2C] px-3 py-1.5 rounded-xl text-xs font-bold font-marker text-[#2C2C2C] shadow-[1px_1.5px_0_#2C2C2C]"
                    >
                      {code}
                      <button
                        onClick={() => handleRemoveCode(code)}
                        className="ml-2 text-[#B71C1C] hover:text-[#D32F2F] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCode(); } }}
                    className="flex-1 text-sm px-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker"
                    placeholder="e.g. NEWCODE10"
                  />
                  <button
                    type="button"
                    onClick={handleAddCode}
                    className="p-2.5 border-2 border-[#2C2C2C] bg-[#C8E6C9] hover:bg-[#A5D6A7] text-[#2C2C2C] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] font-sans font-semibold text-[#6A6A6A] mt-1">
                  One random code from this list is shown after scratching.
                </p>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveScratchSettings}
                disabled={scratchSaving}
                className="btn-sketch w-full py-3.5 text-base flex items-center justify-center cursor-pointer"
              >
                {scratchSaving ? (
                  <span className="w-5 h-5 border-2.5 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Save Scratch Settings
                    <CheckCircle className="w-5 h-5 ml-1.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* List of registered deals (Chalkboard dashboard agenda list) */}
        <div className="lg:col-span-7">
          <div className="sketch-border bg-[#FFF] p-6 shadow-[5px_6px_0px_#2C2C2C] min-h-[500px]">
            <h3 className="text-xl font-marker font-extrabold text-[#2C2C2C] mb-6 underline decoration-2 decoration-[#90CAF9] flex items-center">
              <Tag className="w-5 h-5 mr-1.5 text-[#2C2C2C]" />
              Daily Agenda Deals Registry
            </h3>

            {offersLoading ? (
              <div className="p-20 flex justify-center items-center">
                <span className="w-8 h-8 border-4 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : offers.length === 0 ? (
              <div className="p-16 text-center text-[#6A6A6A] flex flex-col items-center">
                <AlertCircle className="w-12 h-12 mb-3 text-[#B71C1C]" />
                <p className="text-base font-extrabold">NO OFFERS IN OFFICE REGISTRY</p>
                <p className="text-xs text-[#6A6A6A] mt-1">Specify new deals on the chalkboard ledger on the left.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map((item) => (
                  <div
                    key={item.id}
                    className={`sketch-border-thin p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      item.isActive 
                        ? "bg-[#FFE082]/65 shadow-[2px_3px_0_#2C2C2C]" 
                        : "bg-[#FAF6EE]/35"
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      {/* Emoji badge */}
                      <div className="w-12 h-12 rounded-full border-2 border-[#2C2C2C] bg-white flex items-center justify-center text-2xl shadow-[1px_2.5px_0_#2C2C2C] shrink-0 mt-0.5">
                        {item.emoji}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-white border border-[#2C2C2C] font-marker font-bold text-xs px-2 py-0.5 rounded shadow-[1px_1px_0_#2C2C2C]">
                            {item.ribbon}
                          </span>
                          {item.isActive && (
                            <span className="bg-[#81C784] border border-[#2C2C2C] font-marker font-bold text-xs px-2 py-0.5 rounded text-white shadow-[1px_1px_0_#2C2C2C] animate-pulse">
                              ★ LIVE NOW
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-hand font-extrabold text-[#2C2C2C] mt-2.5 leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#6A6A6A] font-sans font-semibold mt-1">
                          {item.subtext}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                      {!item.isActive && (
                        <button
                          onClick={() => handleActivate(item.id)}
                          className="px-3.5 py-2 text-xs font-bold font-marker border-2 border-[#2C2C2C] bg-[#C8E6C9] hover:bg-[#A5D6A7] text-[#2C2C2C] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
                        >
                          Activate
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
                        title="Delete Deal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      {/* Custom Hand-Drawn Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-[#2C2C2C]/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-sm sketch-border bg-[#FCF9F2] p-6 shadow-[5px_6px_0px_#2C2C2C] relative overflow-hidden notebook-ruled">
            <div className="spiral-binder" />
            <div className="pl-6 sm:pl-10 space-y-5 text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#FFCDD2] border-2 border-[#2C2C2C] text-[#B71C1C] flex items-center justify-center mx-auto shadow-[2px_2.5px_0_#2C2C2C] rotate-[-5deg] animate-sketch-float">
                <AlertCircle className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-hand font-extrabold text-[#2C2C2C] tracking-wide uppercase underline decoration-2 decoration-[#EF9A9A]">
                Confirm Action
              </h3>
              
              <p className="text-sm font-sans font-semibold text-[#5A5A5A] leading-relaxed">
                {confirmModal.message}
              </p>
              
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={() => {
                    setConfirmModal({ isOpen: false, message: "", onConfirm: null });
                  }}
                  className="px-4 py-2 text-xs font-bold font-marker border-2 border-[#2C2C2C] bg-white hover:bg-[#FAF6EE] text-[#2C2C2C] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (confirmModal.onConfirm) {
                      await confirmModal.onConfirm();
                    }
                    setConfirmModal({ isOpen: false, message: "", onConfirm: null });
                  }}
                  className="px-4 py-2 text-xs font-bold font-marker border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>

    </div>
  );
}
