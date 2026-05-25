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
        projectTitle: "Smart IoT Attendance System",
        techRequired: "React, Node.js, Express, MongoDB, ESP32",
        deadline: "2026-06-28",
        budget: "3500",
        description: "Attendance management system using RFID reader and web-based dashboard for teachers.",
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

    if (typeof window !== "undefined") {
      localStorage.removeItem("shubdeep_labs_admin_logged");
    }
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
};
