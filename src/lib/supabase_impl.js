import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

let supabase = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Supabase client initialization failed, switching to fallback:", error);
  }
}

// -------------------------------------------------------------
// LOCALSTORAGE FALLBACK ENGINE (For sandboxed local preview)
// -------------------------------------------------------------
const getLocalOrders = () => {
  if (typeof window === "undefined") return [];
  const local = localStorage.getItem("projecthub_orders");
  if (!local) {
    const seed = [
      {
        id: "ord-1",
        fullName: "Rahul Sharma",
        collegeName: "V.J.T.I. Mumbai",
        branch: "Computer Engineering",
        year: "Final Year",
        projectTitle: "AI-Powered Plant Disease Detection",
        techRequired: "Next.js, Python, FastAPI, TensorFlow",
        deadline: "2026-06-15",
        budget: "4500",
        description: "Need a web application that takes plant leaf images and predicts the disease using a CNN model.",
        needPPT: true,
        needReport: true,
        needVivaGuidance: true,
        projectStatus: "In Progress",
        paymentStatus: "Partial",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 3).toISOString()
      },
      {
        id: "ord-2",
        fullName: "Ananya Patel",
        collegeName: "B.M.S. College of Engineering",
        branch: "Information Technology",
        year: "Third Year",
        projectTitle: "Expense Tracker with AI Insights",
        techRequired: "React, Node.js, MongoDB, Gemini API",
        deadline: "2026-06-28",
        budget: "3500",
        description: "Personal finance tracker featuring automated category tagging, monthly budget forecasting, and AI-driven expense recommendations.",
        needPPT: true,
        needReport: true,
        needVivaGuidance: false,
        projectStatus: "Pending",
        paymentStatus: "Unpaid",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 1).toISOString()
      },
      {
        id: "ord-3",
        fullName: "Vikram Singh",
        collegeName: "Thapar Institute of Technology",
        branch: "Computer Science",
        year: "M.Tech 1st Year",
        projectTitle: "Advanced Customer Support AI Chatbot",
        techRequired: "React, Python, PyTorch, OpenAI API",
        deadline: "2026-06-10",
        budget: "4599",
        description: "An advanced chatbot that uses NLP/RAG to reply to queries using custom database docs.",
        needPPT: true,
        needReport: true,
        needVivaGuidance: true,
        projectStatus: "Delivered",
        paymentStatus: "Paid",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 7).toISOString()
      }
    ];
    localStorage.setItem("projecthub_orders", JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(local);
};

const saveLocalOrders = (orders) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("projecthub_orders", JSON.stringify(orders));
};

const getLocalOffers = () => {
  if (typeof window === "undefined") return [];
  const local = localStorage.getItem("projecthub_offers");
  if (!local) {
    const seed = [
      {
        id: "off-1",
        title: "First 8 Special Students of diploma get 30% OFF + Assured Free Gift!",
        subtext: "* Terms & conditions apply. Connect on WhatsApp to reserve code discount spots.",
        ribbon: "Special Offer!",
        emoji: "🎁",
        isActive: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString()
      },
      {
        id: "off-2",
        title: "Monday Special Deal: Flat 15% discount on all Medium plans!",
        subtext: "* Valid till midnight. Bring your syllabus and draft structure to lock.",
        ribbon: "Monday Deal!",
        emoji: "🔥",
        isActive: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 1).toISOString()
      }
    ];
    localStorage.setItem("projecthub_offers", JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(local);
};

const saveLocalOffers = (offers) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("projecthub_offers", JSON.stringify(offers));
};

const getLocalChatSessions = () => {
  if (typeof window === "undefined") return [];
  const local = localStorage.getItem("projecthub_chat_sessions");
  if (!local) {
    const seed = [
      {
        id: "sess-1",
        sessionType: "whatsapp",
        sessionKey: "919028833275",
        contactName: "Arjun Mehta",
        status: "AI Bot",
        customizerState: {},
        updatedAt: new Date().toISOString()
      },
      {
        id: "sess-2",
        sessionType: "website",
        sessionKey: "web-anon-123",
        contactName: "Website Visitor",
        status: "Manual Intervention",
        customizerState: { category: "engineering", tech: ["react", "db"] },
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem("projecthub_chat_sessions", JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(local);
};

const saveLocalChatSessions = (sessions) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("projecthub_chat_sessions", JSON.stringify(sessions));
};

const getLocalChatMessages = () => {
  if (typeof window === "undefined") return [];
  const local = localStorage.getItem("projecthub_chat_messages");
  if (!local) {
    const seed = [
      {
        id: "msg-1",
        sessionId: "sess-1",
        sender: "user",
        messageText: "Hi, do you offer MERN stack projects?",
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: "msg-2",
        sessionId: "sess-1",
        sender: "bot",
        messageText: "Yes, we build custom MERN stack projects starting from ₹4,999! Do you want me to recommend a topic?",
        createdAt: new Date(Date.now() - 4.5 * 60 * 1000).toISOString()
      },
      {
        id: "msg-3",
        sessionId: "sess-2",
        sender: "user",
        messageText: "Hello, I need help. My project is not compiling.",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem("projecthub_chat_messages", JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(local);
};

const saveLocalChatMessages = (messages) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("projecthub_chat_messages", JSON.stringify(messages));
};

export const dbService = {
  isMock: !isSupabaseConfigured,

  // ORDER MANAGEMENT
  async addOrder(orderData) {
    const enrichedOrder = {
      ...orderData,
      projectStatus: orderData.projectStatus || "Pending",
      paymentStatus: orderData.paymentStatus || "Unpaid",
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .insert([enrichedOrder])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (e) {
        console.error("Supabase addOrder error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    const orders = getLocalOrders();
    const newOrder = { id: `ord-${Date.now()}`, ...enrichedOrder };
    orders.unshift(newOrder);
    saveLocalOrders(orders);
    return newOrder;
  },

  async getOrders() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("createdAt", { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (e) {
        console.error("Supabase getOrders error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    return getLocalOrders();
  },

  async updateOrderStatus(orderId, status) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("orders")
          .update({ projectStatus: status })
          .eq("id", orderId);

        if (error) throw error;
        return true;
      } catch (e) {
        console.error("Supabase updateOrderStatus error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    const orders = getLocalOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, projectStatus: status } : o));
    saveLocalOrders(updated);
    return true;
  },

  async updatePaymentStatus(orderId, status) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("orders")
          .update({ paymentStatus: status })
          .eq("id", orderId);

        if (error) throw error;
        return true;
      } catch (e) {
        console.error("Supabase updatePaymentStatus error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    const orders = getLocalOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o));
    saveLocalOrders(updated);
    return true;
  },

  async deleteOrder(orderId) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("orders")
          .delete()
          .eq("id", orderId);

        if (error) throw error;
        return true;
      } catch (e) {
        console.error("Supabase deleteOrder error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    const orders = getLocalOrders();
    const filtered = orders.filter((o) => o.id !== orderId);
    saveLocalOrders(filtered);
    return true;
  },

  // LEAD MANAGEMENT
  async addLead(leadData) {
    const enrichedLead = {
      ...leadData,
      created_at: leadData.createdAt || leadData.created_at || new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("leads")
          .insert([enrichedLead])
          .select()
          .single();
        if (error) throw error;
        return {
          id: data.id,
          ...data,
          createdAt: data.created_at
        };
      } catch (e) {
        console.error("Supabase addLead error:", e);
      }
    }
    // Fallback logic
    if (typeof window !== "undefined") {
      const leads = JSON.parse(localStorage.getItem("projecthub_leads") || "[]");
      const newLead = { id: `lead-${Date.now()}`, ...enrichedLead };
      leads.unshift(newLead);
      localStorage.setItem("projecthub_leads", JSON.stringify(leads));
      return newLead;
    }
    return enrichedLead;
  },

  async getLeads() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data || []).map(lead => ({
          ...lead,
          createdAt: lead.created_at
        }));
      } catch (e) {
        console.error("Supabase getLeads error:", e);
      }
    }
    // Fallback logic
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("projecthub_leads") || "[]");
    }
    return [];
  },

  // DYNAMIC DAILY OFFERS
  async getOffers() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("offers")
          .select("*")
          .order("createdAt", { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (e) {
        console.error("Supabase getOffers error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    return getLocalOffers();
  },

  async addOffer(offerData) {
    const enrichedOffer = {
      ...offerData,
      isActive: false,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("offers")
          .insert([enrichedOffer])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (e) {
        console.error("Supabase addOffer error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    const offers = getLocalOffers();
    const newOffer = { id: `off-${Date.now()}`, ...enrichedOffer };
    offers.unshift(newOffer);
    saveLocalOffers(offers);
    return newOffer;
  },

  async deleteOffer(offerId) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("offers")
          .delete()
          .eq("id", offerId);

        if (error) throw error;
        return true;
      } catch (e) {
        console.error("Supabase deleteOffer error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    const offers = getLocalOffers();
    const filtered = offers.filter((o) => o.id !== offerId);
    saveLocalOffers(filtered);
    return true;
  },

  async setActiveOffer(offerId) {
    if (isSupabaseConfigured && supabase) {
      try {
        // 1. Deactivate all others
        const { error: deactivateError } = await supabase
          .from("offers")
          .update({ isActive: false })
          .neq("id", offerId);
        
        if (deactivateError) throw deactivateError;

        // 2. Activate this one
        const { error: activateError } = await supabase
          .from("offers")
          .update({ isActive: true })
          .eq("id", offerId);

        if (activateError) throw activateError;
        return true;
      } catch (e) {
        console.error("Supabase setActiveOffer error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    const offers = getLocalOffers();
    const updated = offers.map((o) => ({
      ...o,
      isActive: o.id === offerId,
    }));
    saveLocalOffers(updated);
    return true;
  },

  async getActiveOffer() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("offers")
          .select("*")
          .eq("isActive", true)
          .limit(1);

        if (error) throw error;
        if (data && data.length > 0) {
          return data[0];
        }
      } catch (e) {
        console.error("Supabase getActiveOffer error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    const offers = getLocalOffers();
    const active = offers.find((o) => o.isActive);
    return active || null;
  },

  // SCRATCH CARD SETTINGS
  async getScratchSettings() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("scratch_settings")
          .select("*")
          .limit(1);

        if (error) throw error;
        if (data && data.length > 0) {
          return data[0];
        }
      } catch (e) {
        console.error("Supabase getScratchSettings error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    if (typeof window === "undefined") return null;
    const local = localStorage.getItem("projecthub_scratch_settings");
    if (local) return JSON.parse(local);
    return { discountPercent: 5, codes: ["STUDENT5EXTRA", "COUPON5HUB", "VIVABOOST5", "FINAL5PASS"] };
  },

  async saveScratchSettings(settings) {
    if (isSupabaseConfigured && supabase) {
      try {
        // Upsert: update if exists, insert if not
        const { data: existing } = await supabase
          .from("scratch_settings")
          .select("id")
          .limit(1);

        if (existing && existing.length > 0) {
          const { error } = await supabase
            .from("scratch_settings")
            .update(settings)
            .eq("id", existing[0].id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("scratch_settings")
            .insert([settings]);
          if (error) throw error;
        }
        return true;
      } catch (e) {
        console.error("Supabase saveScratchSettings error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    if (typeof window !== "undefined") {
      localStorage.setItem("projecthub_scratch_settings", JSON.stringify(settings));
    }
    return true;
  },

  // AUTHENTICATION DESK
  async loginAdmin(email, password) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return { success: true, user: data.user };
      } catch (e) {
        console.error("Supabase loginAdmin error:", e);
        return { success: false, error: e.message || "Authentication credentials failed." };
      }
    }

    // Mock Login Credentials matching Firebase desk
    if (email === "admin@shubdeeplabs.com" && password === "admin123") {
      if (typeof window !== "undefined") {
        localStorage.setItem("shubdeep_labs_admin_logged", "true");
      }
      return { success: true };
    }
    return { success: false, error: "Invalid office credentials." };
  },

  async logoutAdmin() {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error(e);
      }
      return;
    }

  },

  // CUSTOMIZER PRICING SETTINGS
  async getCustomizerPrices() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("customizer_prices")
          .select("*");
        if (error) throw error;
        if (data && data.length > 0) {
          const pricesMap = {};
          data.forEach(row => {
            pricesMap[row.id] = row.price;
          });
          return pricesMap;
        }
      } catch (e) {
        console.error("Supabase getCustomizerPrices error, falling back to LocalStorage:", e);
      }
    }

    if (typeof window === "undefined") return {};
    const local = localStorage.getItem("projecthub_customizer_prices");
    return local ? JSON.parse(local) : {};
  },

  async saveCustomizerPrices(pricesMap) {
    if (isSupabaseConfigured && supabase) {
      try {
        // Upsert all keys
        const rows = Object.entries(pricesMap).map(([id, price]) => ({ id, price }));
        const { error } = await supabase
          .from("customizer_prices")
          .upsert(rows);
        if (error) throw error;
        return true;
      } catch (e) {
        console.error("Supabase saveCustomizerPrices error, falling back to LocalStorage:", e);
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("projecthub_customizer_prices", JSON.stringify(pricesMap));
    }
    return true;
  },

  checkAdminAuth(callback) {
    if (isSupabaseConfigured && supabase) {
      try {
        // Initial state load
        supabase.auth.getSession().then(({ data: { session } }) => {
          callback(!!session);
        });

        // Event listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            callback(!!session);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback Mock State listener
    const checkState = () => {
      if (typeof window !== "undefined") {
        const status = localStorage.getItem("shubdeep_labs_admin_logged") === "true";
        callback(status);
      }
    };
    checkState();

    // Poll periodically to catch updates
    const interval = setInterval(checkState, 1000);
    return () => clearInterval(interval);
  },

  // CHAT SYSTEM METHODS
  async getOrCreateChatSession(sessionType, sessionKey, contactName) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("chat_sessions")
          .select("*")
          .eq("session_type", sessionType)
          .eq("session_key", sessionKey)
          .maybeSingle();

        if (error) throw error;
        if (data) return data;

        const newSession = {
          session_type: sessionType,
          session_key: sessionKey,
          contact_name: contactName || "Visitor",
          status: "AI Bot",
          customizer_state: {},
          updated_at: new Date().toISOString()
        };

        const { data: inserted, error: insertError } = await supabase
          .from("chat_sessions")
          .insert([newSession])
          .select()
          .single();

        if (insertError) throw insertError;
        return inserted;
      } catch (e) {
        console.error("Supabase getOrCreateChatSession error, falling back to LocalStorage:", e);
      }
    }

    const sessions = getLocalChatSessions();
    let session = sessions.find(s => s.sessionType === sessionType && s.sessionKey === sessionKey);
    if (!session) {
      session = {
        id: `sess-${Date.now()}`,
        sessionType,
        sessionKey,
        contactName: contactName || "Visitor",
        status: "AI Bot",
        customizerState: {},
        updatedAt: new Date().toISOString()
      };
      sessions.unshift(session);
      saveLocalChatSessions(sessions);
    }
    return session;
  },

  async getChatSessions() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("chat_sessions")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (e) {
        console.error("Supabase getChatSessions error, falling back to LocalStorage:", e);
      }
    }

    return getLocalChatSessions();
  },

  async updateChatSessionStatus(sessionId, status) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("chat_sessions")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", sessionId);

        if (error) throw error;
        return true;
      } catch (e) {
        console.error("Supabase updateChatSessionStatus error, falling back to LocalStorage:", e);
      }
    }

    const sessions = getLocalChatSessions();
    const updated = sessions.map(s => s.id === sessionId ? { ...s, status, updatedAt: new Date().toISOString() } : s);
    saveLocalChatSessions(updated);
    return true;
  },

  async updateChatSessionCustomizer(sessionId, customizerState) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("chat_sessions")
          .update({ customizer_state: customizerState, updated_at: new Date().toISOString() })
          .eq("id", sessionId);

        if (error) throw error;
        return true;
      } catch (e) {
        console.error("Supabase updateChatSessionCustomizer error, falling back to LocalStorage:", e);
      }
    }

    const sessions = getLocalChatSessions();
    const updated = sessions.map(s => s.id === sessionId ? { ...s, customizerState, updatedAt: new Date().toISOString() } : s);
    saveLocalChatSessions(updated);
    return true;
  },

  async getChatMessages(sessionId) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        return data || [];
      } catch (e) {
        console.error("Supabase getChatMessages error, falling back to LocalStorage:", e);
      }
    }

    const messages = getLocalChatMessages();
    return messages.filter(m => m.sessionId === sessionId);
  },

  async addChatMessage(sessionId, sender, messageText) {
    const newMessage = {
      session_id: sessionId,
      sender,
      message_text: messageText,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .insert([newMessage])
          .select()
          .single();

        if (error) throw error;

        await supabase
          .from("chat_sessions")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", sessionId);

        return data;
      } catch (e) {
        console.error("Supabase addChatMessage error, falling back to LocalStorage:", e);
      }
    }

    const messages = getLocalChatMessages();
    const fallbackMessage = {
      id: `msg-${Date.now()}`,
      sessionId,
      sender,
      messageText,
      createdAt: new Date().toISOString()
    };
    messages.push(fallbackMessage);
    saveLocalChatMessages(messages);

    const sessions = getLocalChatSessions();
    const updatedSessions = sessions.map(s => s.id === sessionId ? { ...s, updatedAt: new Date().toISOString() } : s);
    saveLocalChatSessions(updatedSessions);

    return fallbackMessage;
  },

  // WEBSITE CONTENT SETTINGS
  async getSiteSettings() {
    const defaultSiteSettings = {
      hero: {
        titleYour: "Your",
        titleOur: "Our",
        titleProject: "roject",
        titlePassion: "assion",
        tagline: "SIMPLE PROJECTS. SMART SOLUTIONS.",
        description: "From Idea to Implementation, We Build Intelligent Academic Solutions. Next-generation web portals, machine learning algorithms, and IoT prototypes built with clean, premium codebases. Complete with PPT slides, comprehensive thesis reports, and mock viva tutoring.",
        assurances: [
          "✓ Simple Projects",
          "✓ Smart Solutions",
          "✓ Done with Focus & Care",
          "✓ For Diploma & Degree Only"
        ],
        whatsappText: "Hello, ShubDeep I want to discuss my academic project."
      },
      contact: {
        phone: "+91 90288 33275",
        email: "shubdeeplabs@gmail.com",
        address: "Solapur, Maharashtra"
      },
      welcomeOffer: {
        title: "Welcome Promo",
        discountAmount: 1000,
        couponCode: "SDL1000WELCOME",
        description: "Copy your email address to your clipboard and tap Autofill, or use native autofill below to automatically claim your ₹1,000 Welcome Code."
      },
      features: [
        { title: "100% Original Work", desc: "No copy-pasted templates. Every codebase is structured freshly according to your specific college needs.", icon: "CheckSquare", border: "border-t-[#66BB6A]" },
        { title: "On-Time Delivery", desc: "We are extremely strict with dates. Get your complete setup, reports, and slides well before your final submit day.", icon: "Clock", border: "border-t-[#42A5F5]" },
        { title: "PPT & Reports Ready", desc: "Syllabus-compliant, fully formatted presentation drafts and comprehensive project reports included.", icon: "FileText", border: "border-t-[#FFCA28]" },
        { title: "Clean Documented Code", desc: "Neat model structures, clean controllers, and comprehensive code comments that make logic review easy.", icon: "Code", border: "border-t-[#EF5350]" }
      ],
      categories: [
        { title: "Diploma Projects", icon: "Laptop", desc: "Syllabus-compliant, core-logic driven applications scaled perfectly for diploma review parameters.", href: "/diploma", border: "border-t-[#FFCA28]" },
        { title: "Engineering Projects", icon: "Code", desc: "Full-stack architectures, neat database structures, and comprehensive data flows built for B.E. / B.Tech.", href: "/engineering", border: "border-t-[#66BB6A]" },
        { title: "M.Tech Projects", icon: "Cpu", desc: "High-grade algorithm modeling, data analysis, and advanced codebase executions for research thesis.", href: "/mtech", border: "border-t-[#42A5F5]" },
        { title: "BCA / MCA Projects", icon: "Database", desc: "Interactive management portals, dashboard consoles, cloud databases, and clean system layouts.", href: "/bca-mca", border: "border-t-[#AB47BC]" },
        { title: "AI / ML Projects", icon: "Brain", desc: "TensorFlow / PyTorch models, visual scans, NLP conversational bots, and predictive analytics pipelines.", href: "/ai-ml", border: "border-t-[#EF5350]" },
        { title: "Web Projects", icon: "Sparkles", desc: "Stunning responsive portals, custom dashboards, single page interfaces, and rich administrative panels.", href: "/web-dev", border: "border-t-[#FFA726]" },
        { title: "Android Projects", icon: "Smartphone", desc: "Mobile applications, local SQLite databases, customizable API links, and fully functional Android packages.", href: "/android", border: "border-t-[#66BB6A]" },
        { title: "IoT Projects", icon: "Network", desc: "Smart automation designs, hardware controller mapping (Arduino/ESP32), and interactive dashboards.", href: "/iot", border: "border-t-[#42A5F5]" }
      ],
      portfolio: [
        { title: "AI Plant Disease Detector", tech: "Python, Next.js, TensorFlow, FastAPI", desc: "A neural-network visual scanning web application detecting agricultural leaf diseases with detailed metric analytics.", markerColor: "marker-green" },
        { title: "Advanced AI Customer Care Chatbot", tech: "React, Node.js, Express, OpenAI API", desc: "Intelligent messaging center with customizable document indexing (RAG) and interactive dashboard console log views.", markerColor: "marker-purple" },
        { title: "Face Recognition Attendance system", tech: "Python, OpenCV, Tkinter, SQLite", desc: "Real-time face detection tracker featuring automated CSV sheets generation and attendance log exports.", markerColor: "marker-blue" },
        { title: "Hospital Management Core Desk", tech: "Next.js, MongoDB, Tailwind, Node.js", desc: "Full clinic portal with scheduling grids, active invoice trackers, and secure digital prescription vaults.", markerColor: "marker-orange" },
        { title: "Expense Tracker with AI Insights", tech: "React, Node.js, MongoDB, Gemini API", desc: "Personal finance portal offering automated category tagging, monthly budget forecasting, and AI-driven spending recommendations.", markerColor: "marker-yellow" },
        { title: "Smart Notes Summarizer", tech: "React, FastAPI, Python, Hugging Face", desc: "Collaborative document pad that auto-generates structured summaries, highlights action items, and generates flashcards using NLP.", markerColor: "marker-red" }
      ],
      testimonials: [
        { name: "Saurabh Deshmukh", role: "B.Tech CS Student", review: "The Shubdeep Labs team is amazing! They delivered my IoT project well before my college presentation. The explanation guidelines sheet made my viva exams simple. Highly recommend their Medium package!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
        { name: "Priyanka Naik", role: "MCA Final Year Student", review: "I ordered the AI leaf scanner project. The beautiful dashboard layout completely wowed the external examiner! Having the structured report draft included saved me from college revision loops.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
        { name: "Aditya Verma", role: "Diploma Computer Engineering", review: "Fast execution and wonderful support. Setting up database configurations on Windows can be frustrating, but they configured it for me over Zoom. Got full grades in our semester reviews!", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" }
      ],
      faqs: [
        { q: "How long does delivery take?", a: "Simple/Easy projects are typically delivered within 3-5 days. Medium projects take 5-7 days, while Advanced/Hard projects requiring deep integrations take 8-12 days. Urgent timelines can be arranged on inquiry!" },
        { q: "Do we receive the full source code?", a: "Yes, absolutely! You receive 100% full ownership of the source code, database structures, assets, installation guides, and presentation documents." },
        { q: "Is viva guidance included?", a: "Yes, our Medium and Hard project plans include detailed viva prep sheets. Hard projects also feature a dedicated 1-on-1 code walkthrough session to explain exact controllers and database interactions." },
        { q: "Can we request custom modifications?", a: "Definitely. We customize logic modules, database structures, interface styling, and third-party APIs to suit your specific syllabus requirements." },
        { q: "Do you provide remote system setup support?", a: "Yes! The Hard package includes direct deployment support. We can connect via Zoom or AnyDesk to compile and set up backend runtimes on your machine." }
      ]
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", "default_settings")
          .maybeSingle();

        if (error) throw error;
        if (data && data.value) {
          return data.value;
        }
      } catch (e) {
        console.error("Supabase getSiteSettings error, falling back to LocalStorage:", e);
      }
    }

    if (typeof window === "undefined") return defaultSiteSettings;
    const local = localStorage.getItem("projecthub_site_settings");
    return local ? JSON.parse(local) : defaultSiteSettings;
  },

  async saveSiteSettings(settings) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ id: "default_settings", value: settings, updated_at: new Date().toISOString() });
        if (error) throw error;
        return true;
      } catch (e) {
        console.error("Supabase saveSiteSettings error, falling back to LocalStorage:", e);
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("projecthub_site_settings", JSON.stringify(settings));
    }
    return true;
  },
};

