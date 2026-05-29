"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { dbService } from "@/lib/supabase";
import { 
  Lock, Mail, Key, Shield, Search, Filter, RefreshCw, 
  Trash2, CheckCircle, TrendingUp, AlertCircle, Clock, 
  LogOut, ClipboardList, MapPin, User, Tag, Terminal, Cpu, FileText,
  Coins, Landmark, Zap, ShieldCheck, Plus, HelpCircle, Star, Percent, Settings, X
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

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [branchFilter, setBranchFilter] = useState("ALL");

  const [activeTab, setActiveTab] = useState("ledger");
  const [chats, setChats] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [inboxLoading, setInboxLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Custom Website Editor State
  const [siteSettings, setSiteSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Customizer Pricing State
  const [prices, setPrices] = useState({});
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesSaving, setPricesSaving] = useState(false);

  // Daily Offers & Scratch Booster State
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersFormData, setOffersFormData] = useState({
    title: "",
    subtext: "",
    ribbon: "Special Offer!",
    emoji: "🎁",
  });
  const [addOfferLoading, setAddOfferLoading] = useState(false);

  const [scratchDiscount, setScratchDiscount] = useState(5);
  const [scratchCodes, setScratchCodes] = useState(["STUDENT5EXTRA", "COUPON5HUB", "VIVABOOST5", "FINAL5PASS"]);
  const [newScratchCode, setNewScratchCode] = useState("");
  const [scratchSaving, setScratchSaving] = useState(false);

  const fetchSiteSettings = async () => {
    setSettingsLoading(true);
    try {
      const data = await dbService.getSiteSettings();
      setSiteSettings(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load site layout configuration.");
    } finally {
      setSettingsLoading(false);
    }
  };

  const updateHeroField = (key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          [key]: val
        }
      };
    });
  };

  const updateContactField = (key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        contact: {
          ...prev.contact,
          [key]: val
        }
      };
    });
  };

  const updateWelcomeOfferField = (key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        welcomeOffer: {
          ...((prev.welcomeOffer || {
            title: "Welcome Promo",
            discountAmount: 1000,
            couponCode: "SDL1000WELCOME",
            description: "Copy your email address to your clipboard and tap Autofill, or use native autofill below to automatically claim your ₹1,000 Welcome Code."
          })),
          [key]: val
        }
      };
    });
  };

  const updateFeature = (index, key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.features];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, features: updated };
    });
  };

  const updateCategory = (index, key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.categories];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, categories: updated };
    });
  };

  const addCategory = () => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: [...prev.categories, { title: "New Study Area", desc: "Brief description of syllabus compliance.", icon: "Laptop", href: "/order", border: "border-t-[#FFCA28]" }]
      };
    });
  };

  const deleteCategory = (index) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.filter((_, idx) => idx !== index)
      };
    });
  };

  const updateBlueprint = (index, key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.portfolio];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, portfolio: updated };
    });
  };

  const addBlueprint = () => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        portfolio: [...prev.portfolio, { title: "New Project Blueprint", tech: "React, Node.js, MongoDB", desc: "Detailed explanation of core logic systems.", markerColor: "marker-green" }]
      };
    });
  };

  const deleteBlueprint = (index) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        portfolio: prev.portfolio.filter((_, idx) => idx !== index)
      };
    });
  };

  const updateTestimonial = (index, key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.testimonials];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, testimonials: updated };
    });
  };

  const addTestimonial = () => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        testimonials: [...prev.testimonials, { name: "Student Name", role: "MCA/CS Student", review: "The solution was built perfectly compliance-ready...", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" }]
      };
    });
  };

  const deleteTestimonial = (index) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        testimonials: prev.testimonials.filter((_, idx) => idx !== index)
      };
    });
  };

  const updateFAQ = (index, key, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, faqs: updated };
    });
  };

  const addFAQ = () => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        faqs: [...prev.faqs, { q: "New Question?", a: "Answer details go here." }]
      };
    });
  };

  const deleteFAQ = (index) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        faqs: prev.faqs.filter((_, idx) => idx !== index)
      };
    });
  };

  const updateAssurance = (index, val) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      const updated = [...prev.hero.assurances];
      updated[index] = val;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          assurances: updated
        }
      };
    });
  };

  const addAssurance = () => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          assurances: [...prev.hero.assurances, "✓ New Assurance Title"]
        }
      };
    });
  };

  const deleteAssurance = (index) => {
    setSiteSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          assurances: prev.hero.assurances.filter((_, idx) => idx !== index)
        }
      };
    });
  };

  const handleSaveSiteSettings = async () => {
    if (!siteSettings) return;
    setSaveLoading(true);
    try {
      await dbService.saveSiteSettings(siteSettings);
      toast.success("Site layout settings published successfully!", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to publish layout settings.");
    } finally {
      setSaveLoading(false);
    }
  };

  // -------------------------------------------------------------
  // CONSOLIDATED PRICING HANDLERS
  // -------------------------------------------------------------
  const fetchPrices = async () => {
    setPricesLoading(true);
    try {
      const data = await dbService.getCustomizerPrices();
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
      setPricesLoading(false);
    }
  };

  const handlePriceChange = (id, value) => {
    const numericVal = parseInt(value);
    setPrices(prev => ({
      ...prev,
      [id]: isNaN(numericVal) ? 0 : Math.max(0, numericVal)
    }));
  };

  const handleSavePrices = async (e) => {
    e.preventDefault();
    setPricesSaving(true);
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
      setPricesSaving(false);
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
  // CONSOLIDATED OFFERS & SCRATCH CODES HANDLERS
  // -------------------------------------------------------------
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

  const handleAddScratchCode = () => {
    let code = newScratchCode.trim().toUpperCase();
    if (!code) return;
    
    code = code.replace(/\d+/g, String(scratchDiscount));
    
    if (scratchCodes.includes(code)) {
      toast.error("Code already exists!");
      return;
    }
    setScratchCodes([...scratchCodes, code]);
    setNewScratchCode("");
  };

  const handleRemoveScratchCode = (codeToRemove) => {
    if (scratchCodes.length <= 1) {
      toast.error("At least 1 code is required!");
      return;
    }
    setScratchCodes(scratchCodes.filter((c) => c !== codeToRemove));
  };

  const handleOffersFormChange = (e) => {
    const { name, value } = e.target;
    setOffersFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    if (!offersFormData.title || !offersFormData.subtext) {
      toast.error("Please specify offer details.");
      return;
    }

    setAddOfferLoading(true);
    try {
      await dbService.addOffer(offersFormData);
      toast.success("New deal logged in agenda list!", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
      });
      setOffersFormData({ title: "", subtext: "", ribbon: "Special Offer!", emoji: "🎁" });
      fetchOffers();
    } catch (e) {
      console.error(e);
      toast.error("Failed to register offer.");
    } finally {
      setAddOfferLoading(false);
    }
  };

  const handleActivateOffer = async (offerId) => {
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

  const handleDeleteOffer = (offerId) => {
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
      toast.success("ID key verified! Coordination desk active.", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
      });
      fetchOrders();
      fetchChats();
      fetchSiteSettings();
      fetchPrices();
      fetchOffers();
      fetchScratchSettings();
    } else {
      toast.error(result.error || "Verification failed. Check credentials.");
    }
  };

  const handleLogout = async () => {
    await dbService.logoutAdmin();
    setIsLoggedIn(false);
    toast.success("Coordinator desk locked.", {
      className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
    });
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await dbService.getOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to read database ledger.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchChats = async () => {
    setInboxLoading(true);
    try {
      const res = await fetch("/api/admin/chat");
      if (res.ok) {
        const data = await res.json();
        setChats(data.sessions || []);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to read active discussions.");
    } finally {
      setInboxLoading(false);
    }
  };

  const fetchMessages = async (sessionId) => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/admin/chat?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load message registry.");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendAdminReply = async () => {
    if (!replyText.trim() || !selectedSessionId) return;

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          messageText: replyText
        })
      });

      if (res.ok) {
        setReplyText("");
        fetchMessages(selectedSessionId);
        toast.success("Manual reply dispatched.");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to dispatch reply.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error dispatching manual reply.");
    }
  };

  const handleToggleBotStatus = async (sessionId, currentStatus) => {
    const nextStatus = currentStatus === "AI Bot" ? "Manual Intervention" : "AI Bot";
    try {
      const res = await fetch("/api/admin/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          status: nextStatus
        })
      });

      if (res.ok) {
        toast.success(`Session workflow set to: ${nextStatus}`);
        fetchChats();
        setChats(prev => prev.map(c => c.id === sessionId ? { ...c, status: nextStatus } : c));
      } else {
        toast.error("Failed to update session status.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error updating chat status.");
    }
  };

  useEffect(() => {
    const unsubscribe = dbService.checkAdminAuth((userStatus) => {
      setIsLoggedIn(userStatus);
      if (userStatus) {
        fetchOrders();
        fetchChats();
        fetchSiteSettings();
        fetchPrices();
        fetchOffers();
        fetchScratchSettings();
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "inbox" || !selectedSessionId) return;
    const interval = setInterval(() => {
      fetchMessages(selectedSessionId);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab, selectedSessionId]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await dbService.updateOrderStatus(orderId, newStatus);
      toast.success(`Workflow changed: ${newStatus}`);
      fetchOrders();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status.");
    }
  };

  const handleUpdatePayment = async (orderId, newPayment) => {
    try {
      await dbService.updatePaymentStatus(orderId, newPayment);
      toast.success(`Financial record updated: ${newPayment}`);
      fetchOrders();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update payment.");
    }
  };

  const handleDelete = (orderId) => {
    setConfirmModal({
      isOpen: true,
      message: "Permanent deletion of this student ledger record. Proceed?",
      onConfirm: async () => {
        try {
          await dbService.deleteOrder(orderId);
          toast.success("Ledger record expunged.");
          fetchOrders();
        } catch (e) {
          console.error(e);
          toast.error("Deletion failed.");
        }
      }
    });
  };

  // Analytics Math
  const metrics = {
    total: orders.length,
    pending: orders.filter(o => o.projectStatus === "Pending").length,
    inProgress: orders.filter(o => o.projectStatus === "In Progress").length,
    delivered: orders.filter(o => o.projectStatus === "Delivered").length,
    revenue: orders.reduce((sum, o) => sum + (parseInt(o.budget) || 0), 0)
  };

  // Filter Matching
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      (order.fullName && order.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.collegeName && order.collegeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.projectTitle && order.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.techRequired && order.techRequired.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || order.projectStatus === statusFilter;
    
    const matchesBranch = branchFilter === "ALL" || 
      (order.branch && order.branch.toLowerCase().includes(branchFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesBranch;
  });

  const uniqueBranches = ["ALL", ...new Set(orders.map(o => o.branch).filter(Boolean))];

  // -------------------------------------------------------------
  // SECURE CHALKBOARD LOCKSCREEN
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
              <label className="block text-sm font-marker text-[#F8F9FA] uppercase mb-1 tracking-widest">COORDINATOR ID (EMAIL)</label>
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
              <label className="block text-sm font-marker text-[#F8F9FA] uppercase mb-1 tracking-widest">ACCESS KEY PASSPHRASE</label>
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
                  UNLOCK DESK LEDGER
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
  // SECURE WHITEBOARD OFFICE DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 mt-16 bg-[#FAF6EE] text-[#2C2C2C] font-marker">
      
      {/* Console Topbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2.5 border-[#2C2C2C]/10 pb-5">
        <div>
          <h1 className="text-3xl font-hand font-extrabold text-[#2C2C2C] flex items-center">
            <Cpu className="w-7 h-7 mr-2 text-[#2C2C2C] shrink-0" />
            PROJECTS COORDINATOR DESK
          </h1>
          <p className="text-sm font-marker text-[#6A6A6A] mt-1">
            Real-time active student registries, blueprints costing, and ledger files.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/leads"
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#2C2C2C] bg-[#C8E6C9] border-2 border-[#2C2C2C] hover:bg-[#A5D6A7] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5"
          >
            Leads Board
          </Link>
          
          <button
            onClick={() => {
              fetchOrders();
              fetchChats();
              fetchSiteSettings();
              fetchPrices();
              fetchOffers();
              fetchScratchSettings();
            }}
            className="p-2.5 rounded-xl border-2 border-[#2C2C2C] bg-white hover:bg-[#FAF6EE] text-[#2C2C2C] transition-all cursor-pointer shadow-[2px_2px_0_#2C2C2C]"
            title="Reload Dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${ordersLoading || inboxLoading || settingsLoading || pricesLoading || offersLoading ? "animate-spin" : ""}`} />
          </button>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2.5 text-sm font-bold tracking-wider text-[#B71C1C] bg-[#FFCDD2] border-2 border-[#2C2C2C] hover:bg-[#EF9A9A] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5"
          >
            LOCK DESK
            <LogOut className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>

      {/* Tab Control */}
      <div className="flex flex-wrap gap-2 border-b-2 border-[#2C2C2C]/20 pb-0 shrink-0">
        <button
          onClick={() => setActiveTab("ledger")}
          className={`px-5 py-2.5 rounded-t-xl font-marker font-bold text-sm border-2 border-[#2C2C2C] border-b-0 -mb-[2px] transition-all cursor-pointer ${
            activeTab === "ledger"
              ? "bg-white text-[#2C2C2C] shadow-[0_2px_0_white]"
              : "bg-[#FAF6EE] text-[#6A6A6A] hover:bg-white/50"
          }`}
        >
          📜 Ledger Registry
        </button>
        <button
          onClick={() => {
            setActiveTab("customize");
            fetchSiteSettings();
          }}
          className={`px-5 py-2.5 rounded-t-xl font-marker font-bold text-sm border-2 border-[#2C2C2C] border-b-0 -mb-[2px] transition-all cursor-pointer ${
            activeTab === "customize"
              ? "bg-white text-[#2C2C2C] shadow-[0_2px_0_white]"
              : "bg-[#FAF6EE] text-[#6A6A6A] hover:bg-white/50"
          }`}
        >
          ✍️ Website Copy
        </button>
        <button
          onClick={() => {
            setActiveTab("pricing");
            fetchPrices();
          }}
          className={`px-5 py-2.5 rounded-t-xl font-marker font-bold text-sm border-2 border-[#2C2C2C] border-b-0 -mb-[2px] transition-all cursor-pointer ${
            activeTab === "pricing"
              ? "bg-white text-[#2C2C2C] shadow-[0_2px_0_white]"
              : "bg-[#FAF6EE] text-[#6A6A6A] hover:bg-white/50"
          }`}
        >
          💰 Course Pricing
        </button>
        <button
          onClick={() => {
            setActiveTab("offers");
            fetchOffers();
            fetchScratchSettings();
          }}
          className={`px-5 py-2.5 rounded-t-xl font-marker font-bold text-sm border-2 border-[#2C2C2C] border-b-0 -mb-[2px] transition-all cursor-pointer ${
            activeTab === "offers"
              ? "bg-white text-[#2C2C2C] shadow-[0_2px_0_white]"
              : "bg-[#FAF6EE] text-[#6A6A6A] hover:bg-white/50"
          }`}
        >
          🎁 Daily Offers
        </button>
      </div>

      {activeTab === "ledger" && (
        <>
          {/* Chalkboard statistics items (styled as sketch notes) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "QUEUED STACKS", val: metrics.total, icon: ClipboardList, color: "text-[#2C2C2C]", bg: "bg-[#E6DFD3]" },
              { label: "QUEUED CHECKS", val: metrics.pending, icon: AlertCircle, color: "text-[#B71C1C]", bg: "bg-[#FFCDD2]" },
              { label: "ACTIVE COMPILES", val: metrics.inProgress, icon: Clock, color: "text-[#6A1B9A]", bg: "bg-[#E1BEE7]" },
              { label: "DELIVERED SYSTEMS", val: metrics.delivered, icon: CheckCircle, color: "text-[#1B5E20]", bg: "bg-[#C8E6C9]" },
              { label: "TOTAL ESTIMATE REVENUE", val: `₹${metrics.revenue}`, icon: TrendingUp, color: "text-[#0D47A1]", bg: "bg-[#BBDEFB]", span: "col-span-2 lg:col-span-1" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`sketch-card p-5 flex flex-col justify-between ${item.bg} ${item.span || ""}`}
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2C2C2C]">{item.label}</span>
                  <div className="flex items-baseline justify-between mt-3">
                    <span className={`text-3xl font-black ${item.color}`}>{item.val}</span>
                    <span className={`p-1.5 rounded-lg border-2 border-[#2C2C2C] bg-white ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Workload Pencil graph */}
          <div className="sketch-card border-3 border-[#2C2C2C] p-6 rounded-2xl bg-white">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#6A6A6A]">HAND-PLOTTED ACTIVE WORKLOAD PIPELINE</span>
            <div className="h-28 w-full mt-4 relative">
              <svg className="w-full h-full text-[#2C2C2C]" viewBox="0 0 500 100" preserveAspectRatio="none">
                <path
                  d="M 0 80 Q 85 30 170 60 T 340 20 T 470 50 L 500 50 L 500 100 L 0 100 Z"
                  fill="url(#chart-grad)"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="opacity-70"
                />
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2C2C2C" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-2 left-4 text-[10px] font-mono text-[#6A6A6A]">LEDGER_LOAD: ACTIVE</div>
              <div className="absolute top-2 right-4 text-[9px] sm:text-xs text-[#1B5E20] flex items-center bg-[#C8E6C9] px-2.5 py-0.5 border border-[#1B5E20] rounded-full whitespace-nowrap">
                <span className="w-2 h-2 bg-[#1B5E20] rounded-full mr-1.5 animate-ping shrink-0" />
                <span className="hidden sm:inline">REGISTRY SYNCHRONIZATION ESTABLISHED</span>
                <span className="inline sm:hidden">REGISTRY SYNCED</span>
              </div>
            </div>
          </div>

          {/* Query filters */}
          <div className="sketch-card p-4 bg-[#FCF9F2] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="relative md:col-span-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2C2C2C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-11 pr-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/15 text-[#2C2C2C] font-marker"
                placeholder="Search details: student, college, branch, specs..."
              />
            </div>

            <div className="flex items-center space-x-2 md:col-span-3">
              <Filter className="w-4.5 h-4.5 text-[#2C2C2C] shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-sm px-3 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker"
              >
                <option value="ALL">All Project Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 md:col-span-3">
              <Tag className="w-4.5 h-4.5 text-[#2C2C2C] shrink-0" />
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full text-sm px-3 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker"
              >
                <option value="ALL">All Specializations</option>
                {uniqueBranches.filter(b => b !== "ALL").map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ledger sheet table */}
          <div className="sketch-card bg-white overflow-hidden shadow-lg border-3 border-[#2C2C2C]">
            {ordersLoading ? (
              <div className="p-20 flex justify-center items-center">
                <span className="w-8 h-8 border-4 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-20 text-center text-[#6A6A6A] flex flex-col items-center">
                <AlertCircle className="w-12 h-12 mb-3 text-[#B71C1C] opacity-80" />
                <p className="text-base font-extrabold tracking-wider">NO MATCHING ENTRIES IN OFFICE LEDGER</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] border-b-2.5 border-[#2C2C2C] text-[#2C2C2C] uppercase tracking-wider text-[11px] font-extrabold">
                      <th className="p-4">STUDENT LEDGER DATA</th>
                      <th className="p-4">SPECIFICATIONS & SCOPE</th>
                      <th className="p-4">SCHEDULE DEADLINE</th>
                      <th className="p-4">PRICE BUDGET</th>
                      <th className="p-4">WORKFLOW</th>
                      <th className="p-4 text-center">COORDINATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[#2C2C2C]/10 text-sm font-semibold text-[#2C2C2C]">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#FAF6EE]/55 transition-colors">
                        <td className="p-4 space-y-1.5 max-w-[200px]">
                          <div className="font-extrabold text-[#2C2C2C] flex items-center">
                            <User className="w-4 h-4 mr-1 text-[#6A6A6A]" />
                            {order.fullName}
                          </div>
                          <div className="text-xs text-[#6A6A6A] flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-[#6A6A6A]" />
                            {order.collegeName}
                          </div>
                          <div className="text-[11px] text-[#6A6A6A]">
                            {order.branch} ({order.year || "N/A"})
                          </div>
                        </td>
                        <td className="p-4 space-y-1.5 max-w-[280px]">
                          <div className="font-extrabold text-[#2C2C2C] leading-tight">
                            {order.projectTitle}
                          </div>
                          <div className="inline-block bg-[#FAF6EE] text-[#2C2C2C] px-2.5 py-0.5 rounded-lg border-1.5 border-[#2C2C2C] text-xs">
                            {order.techRequired}
                          </div>
                          {order.description && (
                            <p className="text-xs text-[#6A6A6A] truncate max-w-[260px]" title={order.description}>
                              {order.description}
                            </p>
                          )}
                        </td>
                        <td className="p-4 space-y-2">
                          <div className="font-extrabold text-[#2C2C2C] flex items-center">
                            <Clock className="w-4.5 h-4.5 mr-1.5 stroke-2" />
                            {order.deadline}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {order.needPPT && (
                              <span className="bg-[#E1BEE7] border border-[#2C2C2C] px-1.5 py-0.5 rounded text-[10px] font-bold">PPT</span>
                            )}
                            {order.needReport && (
                              <span className="bg-[#BBDEFB] border border-[#2C2C2C] px-1.5 py-0.5 rounded text-[10px] font-bold">Report</span>
                            )}
                            {order.needVivaGuidance && (
                              <span className="bg-[#FFCDD2] border border-[#2C2C2C] px-1.5 py-0.5 rounded text-[10px] font-bold">Viva</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-black text-[#2C2C2C] text-base">
                            ₹{order.budget}
                          </div>
                          <div className="mt-1.5">
                            <select
                              value={order.paymentStatus || "Unpaid"}
                              onChange={(e) => handleUpdatePayment(order.id, e.target.value)}
                              className={`text-xs font-bold px-2 py-1 rounded-lg border-2 border-[#2C2C2C] focus:outline-none cursor-pointer shadow-[1px_1.5px_0_#2C2C2C] ${
                                order.paymentStatus === "Paid"
                                  ? "bg-[#C8E6C9]"
                                  : order.paymentStatus === "Partial"
                                  ? "bg-[#FFE082]"
                                  : "bg-[#FFCDD2]"
                              }`}
                            >
                              <option value="Unpaid">Unpaid</option>
                              <option value="Partial">Partial</option>
                              <option value="Paid">Paid</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.projectStatus || "Pending"}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border-2 border-[#2C2C2C] focus:outline-none cursor-pointer shadow-[1px_1.5px_0_#2C2C2C] ${
                              order.projectStatus === "Delivered"
                                ? "bg-[#C8E6C9]"
                                : order.projectStatus === "In Progress"
                                ? "bg-[#BBDEFB]"
                                : "bg-[#FFE082]"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <a
                              href={`https://wa.me/919028833275?text=Hello%20${encodeURIComponent(order.fullName)}%2C%20regarding%20your%20project%20order%20"${encodeURIComponent(order.projectTitle)}"...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl border-2 border-[#2C2C2C] bg-[#C8E6C9] hover:bg-[#A5D6A7] text-[#2C2C2C] transition-all shadow-[1.5px_2px_0_#2C2C2C]"
                              title="Contact WhatsApp"
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.462 3.473 1.336 4.988L2 22l5.176-1.359a9.924 9.924 0 004.836 1.247h.005c5.502 0 9.983-4.482 9.983-9.988 0-2.662-1.036-5.163-2.92-7.051C17.195 3.038 14.69 2 12.012 2zm4.566 12.092c-.25-.124-1.477-.729-1.705-.811-.228-.083-.393-.124-.559.124-.166.249-.642.811-.787.977-.145.166-.29.186-.54.062-.25-.124-1.055-.389-2.01-1.242-.743-.662-1.245-1.48-1.39-1.73-.145-.25-.015-.385.11-.509.112-.112.25-.29.375-.436.124-.145.166-.25.25-.415.083-.166.042-.311-.02-.436-.063-.124-.559-1.349-.766-1.848-.201-.483-.404-.418-.559-.426-.145-.008-.31-.008-.476-.008a.916.916 0 00-.663.311c-.228.249-.871.851-.871 2.076 0 1.225.892 2.41 1.016 2.576.125.166 1.756 2.682 4.254 3.757.595.256 1.059.409 1.422.525.597.19 1.14.163 1.57.099.479-.071 1.477-.602 1.684-1.183.208-.582.208-1.08.146-1.183-.063-.105-.229-.166-.479-.29z" />
                              </svg>
                            </a>
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="p-2 rounded-xl border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] transition-all shadow-[1.5px_2px_0_#2C2C2C]"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}



      {activeTab === "customize" && (
        <div className="space-y-8 animate-fade-in">
          {/* Top action header */}
          <div className="sketch-card p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 border-3 border-[#2C2C2C]">
            <div>
              <h3 className="text-xl font-hand font-extrabold text-[#2C2C2C]">
                🎨 DRAFT & PUBLISH LIVE WEBSITE LAYOUTS
              </h3>
              <p className="text-xs text-[#6A6A6A] font-marker mt-1">
                Modify title copy, catalog directories, student reviews, and FAQs dynamically. Click Publish to persist modifications.
              </p>
            </div>
            
            <button
              onClick={handleSaveSiteSettings}
              disabled={saveLoading || settingsLoading || !siteSettings}
              className="inline-flex items-center px-6 py-3 font-marker font-bold tracking-widest text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-xl shadow-[3px_4px_0_#2C2C2C] active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {saveLoading ? (
                <span className="w-5 h-5 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "PUBLISH DRAFT TO LIVE SITE"
              )}
            </button>
          </div>

          {settingsLoading ? (
            <div className="sketch-card bg-white p-20 flex justify-center items-center border-3 border-[#2C2C2C]">
              <span className="w-8 h-8 border-4 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : !siteSettings ? (
            <div className="sketch-card bg-white p-20 text-center border-3 border-[#2C2C2C] text-[#6A6A6A]">
              <p>Failed to sync website draft schema registry.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
              
              {/* Left Column: Core Sections (Hero, Contact, Assurances, Features) */}
              <div className="lg:col-span-6 space-y-8">
                
                {/* 1. HERO SECTION EDIT */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <h4 className="text-lg font-hand font-extrabold border-b-2 border-[#2C2C2C]/10 pb-2 text-[#3F51B5] uppercase">
                    1. Hero Section Content
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Left Word 1</label>
                      <input 
                        type="text" 
                        value={siteSettings.hero.titleYour || ""} 
                        onChange={(e) => updateHeroField("titleYour", e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                        placeholder="e.g. Your"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Left Word 2</label>
                      <input 
                        type="text" 
                        value={siteSettings.hero.titleOur || ""} 
                        onChange={(e) => updateHeroField("titleOur", e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                        placeholder="e.g. Our"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Right Word 1 (roject)</label>
                      <input 
                        type="text" 
                        value={siteSettings.hero.titleProject || ""} 
                        onChange={(e) => updateHeroField("titleProject", e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                        placeholder="e.g. roject"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Right Word 2 (assion)</label>
                      <input 
                        type="text" 
                        value={siteSettings.hero.titlePassion || ""} 
                        onChange={(e) => updateHeroField("titlePassion", e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                        placeholder="e.g. assion"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Badge Tagline Subtext</label>
                    <input 
                      type="text" 
                      value={siteSettings.hero.tagline || ""} 
                      onChange={(e) => updateHeroField("tagline", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                      placeholder="e.g. SIMPLE PROJECTS. SMART SOLUTIONS."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Description Paragraph</label>
                    <textarea 
                      rows={4}
                      value={siteSettings.hero.description || ""} 
                      onChange={(e) => updateHeroField("description", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                      placeholder="Describe what Shubdeep Labs does..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">WhatsApp Chat Discussion Seed Text</label>
                    <input 
                      type="text" 
                      value={siteSettings.hero.whatsappText || ""} 
                      onChange={(e) => updateHeroField("whatsappText", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                      placeholder="Seed message students send when tapping WhatsApp Hero button..."
                    />
                  </div>
                </div>

                {/* 2. CORE CONTACT DETAILS */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <h4 className="text-lg font-hand font-extrabold border-b-2 border-[#2C2C2C]/10 pb-2 text-[#CE93D8] uppercase">
                    2. Primary Contact Details
                  </h4>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Desk Mobile Number</label>
                    <input 
                      type="text" 
                      value={siteSettings.contact.phone || ""} 
                      onChange={(e) => updateContactField("phone", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                      placeholder="e.g. +91 90288 33275"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Desk Office Email</label>
                    <input 
                      type="email" 
                      value={siteSettings.contact.email || ""} 
                      onChange={(e) => updateContactField("email", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                      placeholder="e.g. shubdeeplabs@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Desk Office Address Location</label>
                    <input 
                      type="text" 
                      value={siteSettings.contact.address || ""} 
                      onChange={(e) => updateContactField("address", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                      placeholder="e.g. Solapur, Maharashtra"
                    />
                  </div>
                </div>

                {/* 2.5. WELCOME PROMO OFFER DETAILS */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <h4 className="text-lg font-hand font-extrabold border-b-2 border-[#2C2C2C]/10 pb-2 text-[#EF5350] uppercase">
                    2.5. Welcome Promo Offer Configuration
                  </h4>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Promo Offer Title</label>
                    <input 
                      type="text" 
                      value={siteSettings.welcomeOffer?.title || "Welcome Promo"} 
                      onChange={(e) => updateWelcomeOfferField("title", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                      placeholder="e.g. Welcome Promo"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Discount Coupon Code</label>
                      <input 
                        type="text" 
                        value={siteSettings.welcomeOffer?.couponCode || "SDL1000WELCOME"} 
                        onChange={(e) => updateWelcomeOfferField("couponCode", e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                        placeholder="e.g. SDL1000WELCOME"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Discount Amount (₹ INR)</label>
                      <input 
                        type="number" 
                        value={siteSettings.welcomeOffer?.discountAmount || 1000} 
                        onChange={(e) => updateWelcomeOfferField("discountAmount", parseInt(e.target.value) || 0)}
                        className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                        placeholder="e.g. 1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A6A6A] font-bold mb-1">Offer Brief Description</label>
                    <textarea 
                      rows={3}
                      value={siteSettings.welcomeOffer?.description || ""} 
                      onChange={(e) => updateWelcomeOfferField("description", e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                      placeholder="Enter promo guidelines..."
                    />
                  </div>
                </div>

                {/* 3. ASSURANCES CHECKLIST */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#2C2C2C]/10 pb-2">
                    <h4 className="text-lg font-hand font-extrabold text-[#66BB6A] uppercase">
                      3. Student Assurances List
                    </h4>
                    <button 
                      onClick={addAssurance}
                      className="text-[10px] bg-[#C8E6C9] hover:bg-[#A5D6A7] border-2 border-[#2C2C2C] px-3 py-1 rounded-lg font-bold font-marker"
                    >
                      + Add Check
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {siteSettings.hero.assurances?.map((ass, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={ass} 
                          onChange={(e) => updateAssurance(index, e.target.value)}
                          className="flex-1 text-xs p-2.5 bg-[#FAF6EE]/50 border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                          placeholder="e.g. ✓ 100% Original Work"
                        />
                        <button 
                          onClick={() => deleteAssurance(index)}
                          className="p-2.5 text-xs font-bold border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-lg transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. FEATURE CARDS */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <h4 className="text-lg font-hand font-extrabold border-b-2 border-[#2C2C2C]/10 pb-2 text-[#FFA726] uppercase">
                    4. Core Features Checklist
                  </h4>
                  
                  <div className="space-y-6">
                    {siteSettings.features?.map((feat, index) => (
                      <div key={index} className="p-4 bg-[#FAF6EE]/30 border-2 border-dashed border-[#2C2C2C]/20 rounded-xl space-y-3">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Feature Title</label>
                            <input 
                              type="text" 
                              value={feat.title || ""} 
                              onChange={(e) => updateFeature(index, "title", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                          <div className="w-24">
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Icon Name</label>
                            <input 
                              type="text" 
                              value={feat.icon || ""} 
                              onChange={(e) => updateFeature(index, "icon", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                              placeholder="e.g. Code"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Description Paragraph</label>
                          <textarea 
                            rows={2}
                            value={feat.desc || ""} 
                            onChange={(e) => updateFeature(index, "desc", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Advanced Sections (Categories, Blueprints, Testimonials, FAQs) */}
              <div className="lg:col-span-6 space-y-8">
                
                {/* 5. ACADEMIC DIRECTORIES / CATEGORIES */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#2C2C2C]/10 pb-2">
                    <h4 className="text-lg font-hand font-extrabold text-[#42A5F5] uppercase">
                      5. Syllabus Study Areas
                    </h4>
                    <button 
                      onClick={addCategory}
                      className="text-[10px] bg-[#E1F5FE] hover:bg-[#B3E5FC] border-2 border-[#2C2C2C] px-2 py-1 rounded-lg font-bold font-marker"
                    >
                      + Add Area
                    </button>
                  </div>

                  <div className="space-y-6">
                    {siteSettings.categories?.map((cat, index) => (
                      <div key={index} className="p-4 bg-[#FCF9F2] border-2 border-[#2C2C2C] rounded-xl space-y-3 relative">
                        <button
                          onClick={() => deleteCategory(index)}
                          className="absolute top-2 right-2 p-1.5 text-[10px] font-bold border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-lg"
                          title="Delete area"
                        >
                          ✕
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Area Title</label>
                            <input 
                              type="text" 
                              value={cat.title || ""} 
                              onChange={(e) => updateCategory(index, "title", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Icon Name</label>
                            <input 
                              type="text" 
                              value={cat.icon || ""} 
                              onChange={(e) => updateCategory(index, "icon", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Route Href</label>
                          <input 
                            type="text" 
                            value={cat.href || ""} 
                            onChange={(e) => updateCategory(index, "href", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Description text</label>
                          <textarea 
                            rows={2}
                            value={cat.desc || ""} 
                            onChange={(e) => updateCategory(index, "desc", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. PORTFOLIO BLUEPRINTS */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#2C2C2C]/10 pb-2">
                    <h4 className="text-lg font-hand font-extrabold text-[#AB47BC] uppercase">
                      6. Showcase Blueprints
                    </h4>
                    <button 
                      onClick={addBlueprint}
                      className="text-[10px] bg-[#F3E5F5] hover:bg-[#E1BEE7] border-2 border-[#2C2C2C] px-2 py-1 rounded-lg font-bold font-marker"
                    >
                      + Add Project
                    </button>
                  </div>

                  <div className="space-y-6">
                    {siteSettings.portfolio?.map((proj, index) => (
                      <div key={index} className="p-4 bg-[#FCF9F2] border-2 border-[#2C2C2C] rounded-xl space-y-3 relative">
                        <button
                          onClick={() => deleteBlueprint(index)}
                          className="absolute top-2 right-2 p-1.5 text-[10px] font-bold border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-lg"
                          title="Delete blueprint"
                        >
                          ✕
                        </button>
                        
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Project Name</label>
                          <input 
                            type="text" 
                            value={proj.title || ""} 
                            onChange={(e) => updateBlueprint(index, "title", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Technology Specifications</label>
                          <input 
                            type="text" 
                            value={proj.tech || ""} 
                            onChange={(e) => updateBlueprint(index, "tech", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Brief description</label>
                          <textarea 
                            rows={3}
                            value={proj.desc || ""} 
                            onChange={(e) => updateBlueprint(index, "desc", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. STUDENT REVIEWS / TESTIMONIALS */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#2C2C2C]/10 pb-2">
                    <h4 className="text-lg font-hand font-extrabold text-[#EF5350] uppercase">
                      7. Student Testimonial Sheets
                    </h4>
                    <button 
                      onClick={addTestimonial}
                      className="text-[10px] bg-[#FFEBEE] hover:bg-[#FFCDD2] border-2 border-[#2C2C2C] px-2 py-1 rounded-lg font-bold font-marker"
                    >
                      + Add Review
                    </button>
                  </div>

                  <div className="space-y-6">
                    {siteSettings.testimonials?.map((test, index) => (
                      <div key={index} className="p-4 bg-[#FCF9F2] border-2 border-[#2C2C2C] rounded-xl space-y-3 relative">
                        <button
                          onClick={() => deleteTestimonial(index)}
                          className="absolute top-2 right-2 p-1.5 text-[10px] font-bold border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-lg"
                          title="Delete review"
                        >
                          ✕
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Student Name</label>
                            <input 
                              type="text" 
                              value={test.name || ""} 
                              onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Academic Degree/Role</label>
                            <input 
                              type="text" 
                              value={test.role || ""} 
                              onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                              className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Avatar Image link (Unsplash or URL)</label>
                          <input 
                            type="text" 
                            value={test.avatar || ""} 
                            onChange={(e) => updateTestimonial(index, "avatar", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Feedback Review copy</label>
                          <textarea 
                            rows={3}
                            value={test.review || ""} 
                            onChange={(e) => updateTestimonial(index, "review", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 8. FAQ ACCORDIONS */}
                <div className="sketch-card p-6 bg-white border-3 border-[#2C2C2C] space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-[#2C2C2C]/10 pb-2">
                    <h4 className="text-lg font-hand font-extrabold text-[#795548] uppercase">
                      8. Common Doubts (FAQs)
                    </h4>
                    <button 
                      onClick={addFAQ}
                      className="text-[10px] bg-[#EFEBE9] hover:bg-[#D7CCC8] border-2 border-[#2C2C2C] px-2 py-1 rounded-lg font-bold font-marker"
                    >
                      + Add FAQ
                    </button>
                  </div>

                  <div className="space-y-6">
                    {siteSettings.faqs?.map((faq, index) => (
                      <div key={index} className="p-4 bg-[#FCF9F2] border-2 border-[#2C2C2C] rounded-xl space-y-3 relative">
                        <button
                          onClick={() => deleteFAQ(index)}
                          className="absolute top-2 right-2 p-1.5 text-[10px] font-bold border-2 border-[#2C2C2C] bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#B71C1C] rounded-lg"
                          title="Delete FAQ"
                        >
                          ✕
                        </button>
                        
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Question Title</label>
                          <input 
                            type="text" 
                            value={faq.q || ""} 
                            onChange={(e) => updateFAQ(index, "q", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-mono focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6A6A6A] mb-0.5">Answer text explanation</label>
                          <textarea 
                            rows={3}
                            value={faq.a || ""} 
                            onChange={(e) => updateFAQ(index, "a", e.target.value)}
                            className="w-full text-xs p-2 bg-white border-2 border-[#2C2C2C] rounded-lg text-[#2C2C2C] font-sans font-semibold focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Bottom actions header */}
          <div className="sketch-card p-6 bg-white flex items-center justify-between border-3 border-[#2C2C2C] mt-8">
            <span className="text-xs font-bold font-marker text-[#6A6A6A]">Verify all segments before publishing draft.</span>
            <button
              onClick={handleSaveSiteSettings}
              disabled={saveLoading || settingsLoading || !siteSettings}
              className="inline-flex items-center px-6 py-3 font-marker font-bold tracking-widest text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-xl shadow-[3px_4px_0_#2C2C2C] active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {saveLoading ? (
                <span className="w-5 h-5 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "PUBLISH DRAFT TO LIVE SITE"
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === "pricing" && (
        <div className="space-y-8 animate-fade-in">
          <div className="sketch-card p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 border-3 border-[#2C2C2C]">
            <div>
              <h3 className="text-xl font-hand font-extrabold text-[#2C2C2C] flex items-center">
                <Coins className="w-6 h-6 mr-2 text-[#2C2C2C]" />
                💰 CUSTOMIZER PRICING RATE SHEET
              </h3>
              <p className="text-xs text-[#6A6A6A] font-marker mt-1">
                Modify base prices, add-on stack prices, deliverables, and schedule deadlines dynamically.
              </p>
            </div>
            
            <button
              onClick={handleSavePrices}
              disabled={pricesSaving || pricesLoading}
              className="inline-flex items-center px-6 py-3 font-marker font-bold tracking-widest text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-xl shadow-[3px_4px_0_#2C2C2C] active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap shrink-0 animate-sketch-float"
            >
              {pricesSaving ? (
                <span className="w-5 h-5 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  PUBLISH PRICE RATES
                  <CheckCircle className="w-4 h-4 ml-1.5" />
                </>
              )}
            </button>
          </div>

          {pricesLoading ? (
            <div className="sketch-card bg-white p-20 flex justify-center items-center border-3 border-[#2C2C2C]">
              <span className="w-8 h-8 border-4 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : (
            <form onSubmit={handleSavePrices} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {PRICE_ITEMS.map((group) => (
                  <div key={group.group} className="sketch-border bg-[#FCF9F2] p-6 shadow-[4px_5px_0_#2C2C2C] notebook-ruled">
                    <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] mb-4 pb-2 border-b-2 border-dashed border-[#2C2C2C]/25 flex items-center pl-10">
                      {group.group}
                    </h3>
                    
                    <div className="space-y-3.5 pl-10 relative z-10">
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
                              className="w-28 text-sm px-3 py-1.5 bg-white border-2 border-[#2C2C2C] rounded-lg focus:outline-none text-[#2C2C2C] font-mono font-bold text-right shadow-[1px_1.5px_0_#2C2C2C]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Panel */}
              <div className="sketch-card bg-white border-3 border-[#2C2C2C] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
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
                    disabled={pricesSaving}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold font-marker border-2 border-[#2C2C2C] bg-[#FFF59D] hover:bg-[#FFF9C4] text-[#2C2C2C] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
                  >
                    {pricesSaving ? (
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
          )}
        </div>
      )}

      {activeTab === "offers" && (
        <div className="space-y-8 animate-fade-in">
          {/* Daily Specials Header */}
          <div className="sketch-card p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 border-3 border-[#2C2C2C]">
            <div>
              <h3 className="text-xl font-hand font-extrabold text-[#2C2C2C] flex items-center">
                <Tag className="w-6 h-6 mr-2 text-[#2C2C2C]" />
                🎁 PROMOTIONS & DEALS DESK
              </h3>
              <p className="text-xs text-[#6A6A6A] font-marker mt-1">
                Establish active promotions, manage student coupons, and customize interactive scratch cards.
              </p>
            </div>
            
            <button
              onClick={fetchOffers}
              disabled={offersLoading}
              className="inline-flex items-center px-5 py-2.5 font-marker font-bold text-xs text-[#2C2C2C] bg-white border-2 border-[#2C2C2C] hover:bg-[#FAF6EE] rounded-xl shadow-[2px_2.5px_0_#2C2C2C] active:translate-y-0.5 transition-all cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${offersLoading ? "animate-spin" : ""}`} />
              Reload Promotions
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form: Add Daily Special */}
            <div className="lg:col-span-5 space-y-6">
              <div className="sketch-border bg-[#FCF9F2] p-6 shadow-[4px_5px_0_#2C2C2C] notebook-ruled">
                <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] mb-6 underline decoration-2 decoration-[#A5D6A7] flex items-center pl-10">
                  <Plus className="w-5 h-5 mr-1 text-[#2C2C2C]" />
                  Add Daily Deal Special
                </h3>

                <form onSubmit={handleAddOffer} className="space-y-4 pl-10 relative z-10">
                  <div>
                    <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1 tracking-wider">Ribbon Tag Accent *</label>
                    <input
                      type="text"
                      name="ribbon"
                      value={offersFormData.ribbon}
                      onChange={handleOffersFormChange}
                      required
                      className="w-full text-sm px-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker shadow-[1px_1.5px_0_#2C2C2C]"
                      placeholder="e.g. Special Offer!, Monday Deal!"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-3">
                      <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1 tracking-wider">Offer Badge Emoji</label>
                      <select
                        name="emoji"
                        value={offersFormData.emoji}
                        onChange={handleOffersFormChange}
                        className="w-full text-sm px-3 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker shadow-[1px_1.5px_0_#2C2C2C]"
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
                        {offersFormData.emoji}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1 tracking-wider">Offer Deal Headline Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={offersFormData.title}
                      onChange={handleOffersFormChange}
                      required
                      className="w-full text-sm px-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker shadow-[1px_1.5px_0_#2C2C2C]"
                      placeholder="e.g. First 8 students get 30% OFF!"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] uppercase mb-1 tracking-wider">Subtext / Terms *</label>
                    <textarea
                      name="subtext"
                      value={offersFormData.subtext}
                      onChange={handleOffersFormChange}
                      required
                      rows="3"
                      className="w-full text-sm px-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker shadow-[1px_1.5px_0_#2C2C2C]"
                      placeholder="e.g. * Terms apply. Valid till midnight today."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={addOfferLoading}
                    className="w-full inline-flex items-center justify-center px-6 py-3 font-marker font-bold tracking-widest text-[#2C2C2C] bg-[#FFF59D] border-2 border-[#2C2C2C] hover:bg-[#FFF9C4] rounded-xl shadow-[2px_3px_0_#2C2C2C] active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap"
                  >
                    {addOfferLoading ? (
                      <span className="w-5 h-5 border-2.5 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        Log in Agenda list
                        <Plus className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Scratch Card Booster Settings */}
              <div className="sketch-border bg-[#FCF9F2] p-6 shadow-[4px_5px_0_#2C2C2C] notebook-ruled">
                <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] mb-6 underline decoration-2 decoration-[#E1BEE7] flex items-center pl-10">
                  <Settings className="w-5 h-5 mr-1 text-[#2C2C2C]" />
                  Scratch Card Booster Settings
                </h3>

                <div className="space-y-5 pl-10 relative z-10">
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
                          className="w-full text-sm px-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker pr-10 shadow-[1px_1.5px_0_#2C2C2C]"
                          placeholder="5"
                        />
                      </div>
                      <div className="w-14 h-11 bg-[#E1BEE7] border-2 border-[#2C2C2C] rounded-xl flex items-center justify-center text-base font-bold text-[#2C2C2C] shadow-[1px_2px_0_#2C2C2C] shrink-0">
                        {scratchDiscount}%
                      </div>
                    </div>
                    <p className="text-[10px] font-sans font-semibold text-[#6A6A6A] mt-1">
                      This % is shown to students after they scratch the card.
                    </p>
                  </div>

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
                            onClick={() => handleRemoveScratchCode(code)}
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
                        value={newScratchCode}
                        onChange={(e) => setNewScratchCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddScratchCode(); } }}
                        className="flex-1 text-sm px-4 py-2.5 bg-white border-2 border-[#2C2C2C] rounded-xl focus:outline-none text-[#2C2C2C] font-marker shadow-[1px_1.5px_0_#2C2C2C]"
                        placeholder="e.g. NEWCODE10"
                      />
                      <button
                        type="button"
                        onClick={handleAddScratchCode}
                        className="p-2.5 border-2 border-[#2C2C2C] bg-[#C8E6C9] hover:bg-[#A5D6A7] text-[#2C2C2C] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] font-sans font-semibold text-[#6A6A6A] mt-1">
                      One random code from this list is shown after scratching.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveScratchSettings}
                    disabled={scratchSaving}
                    className="w-full inline-flex items-center justify-center px-6 py-3 font-marker font-bold tracking-widest text-[#2C2C2C] bg-white border-2 border-[#2C2C2C] hover:bg-[#FAF6EE] rounded-xl shadow-[2px_3px_0_#2C2C2C] active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap"
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

            {/* List of registered deals */}
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

                        <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                          {!item.isActive && (
                            <button
                              onClick={() => handleActivateOffer(item.id)}
                              className="px-3.5 py-2 text-xs font-bold font-marker border-2 border-[#2C2C2C] bg-[#C8E6C9] hover:bg-[#A5D6A7] text-[#2C2C2C] rounded-xl shadow-[1.5px_2px_0_#2C2C2C] active:translate-y-0.5 cursor-pointer"
                            >
                              Activate
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteOffer(item.id)}
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
          </div>
        </div>
      )}

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
  );
}
