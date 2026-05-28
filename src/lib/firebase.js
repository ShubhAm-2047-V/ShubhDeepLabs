import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, collection, addDoc, getDocs, updateDoc, doc, 
  deleteDoc, query, orderBy, where, setDoc, getDoc 
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let app;
let firestore;
let auth;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    firestore = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization failed, switching to fallback", error);
  }
}

// -------------------------------------------------------------
// LOCALSTORAGE FALLBACK ENGINE (For instant review and testing)
// -------------------------------------------------------------
const getLocalOrders = () => {
  if (typeof window === "undefined") return [];
  const local = localStorage.getItem("projecthub_orders");
  if (!local) {
    // Generate some initial high-quality seed data so the dashboard is not empty!
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

export const dbService = {
  isMock: !isFirebaseConfigured,

  // ORDER MANAGEMENT
  async addOrder(orderData) {
    const enrichedOrder = {
      ...orderData,
      projectStatus: orderData.projectStatus || "Pending",
      paymentStatus: orderData.paymentStatus || "Unpaid",
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = await addDoc(collection(firestore, "orders"), enrichedOrder);
        return { id: docRef.id, ...enrichedOrder };
      } catch (e) {
        console.error("Firestore addOrder error, falling back to LocalStorage:", e);
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
    if (isFirebaseConfigured && firestore) {
      try {
        const q = query(collection(firestore, "orders"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedOrders = [];
        snapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });
        return fetchedOrders;
      } catch (e) {
        console.error("Firestore getOrders error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    return getLocalOrders();
  },

  async updateOrderStatus(orderId, status) {
    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = doc(firestore, "orders", orderId);
        await updateDoc(docRef, { projectStatus: status });
        return true;
      } catch (e) {
        console.error("Firestore updateOrderStatus error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    const orders = getLocalOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, projectStatus: status } : o));
    saveLocalOrders(updated);
    return true;
  },

  async updatePaymentStatus(orderId, status) {
    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = doc(firestore, "orders", orderId);
        await updateDoc(docRef, { paymentStatus: status });
        return true;
      } catch (e) {
        console.error("Firestore updatePaymentStatus error, falling back to LocalStorage:", e);
      }
    }

    // Fallback logic
    const orders = getLocalOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o));
    saveLocalOrders(updated);
    return true;
  },

  async deleteOrder(orderId) {
    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = doc(firestore, "orders", orderId);
        await deleteDoc(docRef);
        return true;
      } catch (e) {
        console.error("Firestore deleteOrder error, falling back to LocalStorage:", e);
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
      createdAt: leadData.createdAt || new Date().toISOString()
    };
    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = await addDoc(collection(firestore, "leads"), enrichedLead);
        return { id: docRef.id, ...enrichedLead };
      } catch (e) {
        console.error("Firestore addLead error:", e);
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
    if (isFirebaseConfigured && firestore) {
      try {
        const q = query(collection(firestore, "leads"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedLeads = [];
        snapshot.forEach((doc) => {
          fetchedLeads.push({ id: doc.id, ...doc.data() });
        });
        return fetchedLeads;
      } catch (e) {
        console.error("Firestore getLeads error:", e);
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
    if (isFirebaseConfigured && firestore) {
      try {
        const q = query(collection(firestore, "offers"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedOffers = [];
        snapshot.forEach((doc) => {
          fetchedOffers.push({ id: doc.id, ...doc.data() });
        });
        return fetchedOffers;
      } catch (e) {
        console.error("Firestore getOffers error, falling back:", e);
      }
    }
    return getLocalOffers();
  },

  async addOffer(offerData) {
    const enrichedOffer = {
      ...offerData,
      isActive: false,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = await addDoc(collection(firestore, "offers"), enrichedOffer);
        return { id: docRef.id, ...enrichedOffer };
      } catch (e) {
        console.error("Firestore addOffer error, falling back:", e);
      }
    }

    const offers = getLocalOffers();
    const newOffer = { id: `off-${Date.now()}`, ...enrichedOffer };
    offers.unshift(newOffer);
    saveLocalOffers(offers);
    return newOffer;
  },

  async deleteOffer(offerId) {
    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = doc(firestore, "offers", offerId);
        await deleteDoc(docRef);
        return true;
      } catch (e) {
        console.error("Firestore deleteOffer error, falling back:", e);
      }
    }

    const offers = getLocalOffers();
    const filtered = offers.filter((o) => o.id !== offerId);
    saveLocalOffers(filtered);
    return true;
  },

  async setActiveOffer(offerId) {
    if (isFirebaseConfigured && firestore) {
      try {
        const q = query(collection(firestore, "offers"));
        const snapshot = await getDocs(q);
        const batchPromises = [];
        snapshot.forEach((d) => {
          const docRef = doc(firestore, "offers", d.id);
          batchPromises.push(updateDoc(docRef, { isActive: d.id === offerId }));
        });
        await Promise.all(batchPromises);
        return true;
      } catch (e) {
        console.error("Firestore setActiveOffer error, falling back:", e);
      }
    }

    const offers = getLocalOffers();
    const updated = offers.map((o) => ({
      ...o,
      isActive: o.id === offerId,
    }));
    saveLocalOffers(updated);
    return true;
  },

  async getActiveOffer() {
    if (isFirebaseConfigured && firestore) {
      try {
        const q = query(collection(firestore, "offers"));
        const snapshot = await getDocs(q);
        let active = null;
        snapshot.forEach((d) => {
          const data = d.data();
          if (data.isActive) {
            active = { id: d.id, ...data };
          }
        });
        if (active) return active;
      } catch (e) {
        console.error("Firestore getActiveOffer error, falling back:", e);
      }
    }

    const offers = getLocalOffers();
    const active = offers.find((o) => o.isActive);
    if (active) return active;
    
    // Seed default offer
    return {
      id: "off-default",
      title: "First 8 Special Students get 30% OFF + Assured Free Gift!",
      subtext: "* Terms & conditions apply. Connect on WhatsApp to reserve code discount spots.",
      ribbon: "Special Offer!",
      emoji: "🎁",
      isActive: true
    };
  },

  // SCRATCH CARD SETTINGS
  async getScratchSettings() {
    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = doc(firestore, "scratch_settings", "default_settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
      } catch (e) {
        console.error("Firestore getScratchSettings error, falling back:", e);
      }
    }

    // Fallback logic
    if (typeof window === "undefined") return null;
    const local = localStorage.getItem("projecthub_scratch_settings");
    if (local) return JSON.parse(local);
    return { discountPercent: 5, codes: ["STUDENT5EXTRA", "COUPON5HUB", "VIVABOOST5", "FINAL5PASS"] };
  },

  async saveScratchSettings(settings) {
    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = doc(firestore, "scratch_settings", "default_settings");
        await setDoc(docRef, settings, { merge: true });
        return true;
      } catch (e) {
        console.error("Firestore saveScratchSettings error, falling back:", e);
      }
    }

    // Fallback logic
    if (typeof window !== "undefined") {
      localStorage.setItem("projecthub_scratch_settings", JSON.stringify(settings));
    }
    return true;
  },

  // CUSTOMIZER PRICING SETTINGS
  async getCustomizerPrices() {
    if (isFirebaseConfigured && firestore) {
      try {
        const querySnapshot = await getDocs(collection(firestore, "customizer_prices"));
        const pricesMap = {};
        querySnapshot.forEach((doc) => {
          pricesMap[doc.id] = doc.data().price;
        });
        if (Object.keys(pricesMap).length > 0) {
          return pricesMap;
        }
      } catch (e) {
        console.error("Firestore getCustomizerPrices error, falling back:", e);
      }
    }

    if (typeof window === "undefined") return {};
    const local = localStorage.getItem("projecthub_customizer_prices");
    return local ? JSON.parse(local) : {};
  },

  async saveCustomizerPrices(pricesMap) {
    if (isFirebaseConfigured && firestore) {
      try {
        const promises = Object.entries(pricesMap).map(([id, price]) => {
          const docRef = doc(firestore, "customizer_prices", id);
          return setDoc(docRef, { price }, { merge: true });
        });
        await Promise.all(promises);
        return true;
      } catch (e) {
        console.error("Firestore saveCustomizerPrices error, falling back:", e);
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("projecthub_customizer_prices", JSON.stringify(pricesMap));
    }
    return true;
  },

  // CHAT SYSTEM METHODS
  async getOrCreateChatSession(sessionType, sessionKey, contactName) {
    if (isFirebaseConfigured && firestore) {
      try {
        const q = query(
          collection(firestore, "chat_sessions"),
          where("sessionKey", "==", sessionKey)
        );
        const querySnapshot = await getDocs(q);
        let foundDoc = null;
        querySnapshot.forEach((doc) => {
          foundDoc = { id: doc.id, ...doc.data() };
        });

        if (foundDoc) {
          return {
            ...foundDoc,
            session_type: foundDoc.sessionType,
            session_key: foundDoc.sessionKey,
            contact_name: foundDoc.contactName,
            customizer_state: foundDoc.customizerState,
            updated_at: foundDoc.updatedAt
          };
        }

        const newSession = {
          sessionType,
          sessionKey,
          contactName: contactName || "Visitor",
          status: "AI Bot",
          customizerState: {},
          updatedAt: new Date().toISOString(),
          // include snake_case fields for query compatibility
          session_type: sessionType,
          session_key: sessionKey,
          contact_name: contactName || "Visitor",
          customizer_state: {},
          updated_at: new Date().toISOString()
        };

        const docRef = await addDoc(collection(firestore, "chat_sessions"), newSession);
        return {
          id: docRef.id,
          ...newSession
        };
      } catch (e) {
        console.error("Firestore getOrCreateChatSession error, falling back:", e);
      }
    }

    const getLocalChatSessions = () => {
      if (typeof window === "undefined") return [];
      const local = localStorage.getItem("projecthub_chat_sessions");
      if (!local) return [];
      return JSON.parse(local);
    };

    const saveLocalChatSessions = (sessions) => {
      if (typeof window === "undefined") return;
      localStorage.setItem("projecthub_chat_sessions", JSON.stringify(sessions));
    };

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
        updatedAt: new Date().toISOString(),
        session_type: sessionType,
        session_key: sessionKey,
        contact_name: contactName || "Visitor",
        customizer_state: {},
        updated_at: new Date().toISOString()
      };
      sessions.unshift(session);
      saveLocalChatSessions(sessions);
    }
    return session;
  },

  async getChatSessions() {
    if (isFirebaseConfigured && firestore) {
      try {
        const q = query(collection(firestore, "chat_sessions"), orderBy("updatedAt", "desc"));
        const snapshot = await getDocs(q);
        const sessions = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          sessions.push({
            id: doc.id,
            ...data,
            session_type: data.sessionType || data.session_type,
            session_key: data.sessionKey || data.session_key,
            contact_name: data.contactName || data.contact_name,
            customizer_state: data.customizerState || data.customizer_state,
            updated_at: data.updatedAt || data.updated_at
          });
        });
        return sessions;
      } catch (e) {
        console.error("Firestore getChatSessions error, falling back:", e);
      }
    }

    const getLocalChatSessions = () => {
      if (typeof window === "undefined") return [];
      const local = localStorage.getItem("projecthub_chat_sessions");
      if (!local) return [];
      return JSON.parse(local);
    };
    return getLocalChatSessions();
  },

  async updateChatSessionStatus(sessionId, status) {
    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = doc(firestore, "chat_sessions", sessionId);
        const timestamp = new Date().toISOString();
        await updateDoc(docRef, {
          status,
          updatedAt: timestamp,
          updated_at: timestamp
        });
        return true;
      } catch (e) {
        console.error("Firestore updateChatSessionStatus error, falling back:", e);
      }
    }

    const getLocalChatSessions = () => {
      if (typeof window === "undefined") return [];
      const local = localStorage.getItem("projecthub_chat_sessions");
      if (!local) return [];
      return JSON.parse(local);
    };

    const saveLocalChatSessions = (sessions) => {
      if (typeof window === "undefined") return;
      localStorage.setItem("projecthub_chat_sessions", JSON.stringify(sessions));
    };

    const sessions = getLocalChatSessions();
    const updated = sessions.map(s => s.id === sessionId ? {
      ...s,
      status,
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } : s);
    saveLocalChatSessions(updated);
    return true;
  },

  async updateChatSessionCustomizer(sessionId, customizerState) {
    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = doc(firestore, "chat_sessions", sessionId);
        const timestamp = new Date().toISOString();
        await updateDoc(docRef, {
          customizerState,
          customizer_state: customizerState,
          updatedAt: timestamp,
          updated_at: timestamp
        });
        return true;
      } catch (e) {
        console.error("Firestore updateChatSessionCustomizer error, falling back:", e);
      }
    }

    const getLocalChatSessions = () => {
      if (typeof window === "undefined") return [];
      const local = localStorage.getItem("projecthub_chat_sessions");
      if (!local) return [];
      return JSON.parse(local);
    };

    const saveLocalChatSessions = (sessions) => {
      if (typeof window === "undefined") return;
      localStorage.setItem("projecthub_chat_sessions", JSON.stringify(sessions));
    };

    const sessions = getLocalChatSessions();
    const updated = sessions.map(s => s.id === sessionId ? {
      ...s,
      customizerState,
      customizer_state: customizerState,
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } : s);
    saveLocalChatSessions(updated);
    return true;
  },

  async getChatMessages(sessionId) {
    if (isFirebaseConfigured && firestore) {
      try {
        const q = query(
          collection(firestore, "chat_messages"),
          where("sessionId", "==", sessionId),
          orderBy("createdAt", "asc")
        );
        const snapshot = await getDocs(q);
        const messages = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          messages.push({
            id: doc.id,
            ...data,
            session_id: data.sessionId,
            message_text: data.messageText,
            created_at: data.createdAt
          });
        });
        return messages;
      } catch (e) {
        console.error("Firestore getChatMessages error, falling back:", e);
      }
    }

    const getLocalChatMessages = () => {
      if (typeof window === "undefined") return [];
      const local = localStorage.getItem("projecthub_chat_messages");
      if (!local) return [];
      return JSON.parse(local);
    };

    const messages = getLocalChatMessages();
    return messages.filter(m => m.sessionId === sessionId || m.session_id === sessionId);
  },

  async addChatMessage(sessionId, sender, messageText) {
    const timestamp = new Date().toISOString();
    const newMessage = {
      sessionId,
      sender,
      messageText,
      createdAt: timestamp,
      // compatibility fields
      session_id: sessionId,
      message_text: messageText,
      created_at: timestamp
    };

    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = await addDoc(collection(firestore, "chat_messages"), newMessage);
        
        // update chat session timestamp
        const sessionRef = doc(firestore, "chat_sessions", sessionId);
        await updateDoc(sessionRef, {
          updatedAt: timestamp,
          updated_at: timestamp
        });

        return { id: docRef.id, ...newMessage };
      } catch (e) {
        console.error("Firestore addChatMessage error, falling back:", e);
      }
    }

    const getLocalChatMessages = () => {
      if (typeof window === "undefined") return [];
      const local = localStorage.getItem("projecthub_chat_messages");
      if (!local) return [];
      return JSON.parse(local);
    };

    const saveLocalChatMessages = (messages) => {
      if (typeof window === "undefined") return;
      localStorage.setItem("projecthub_chat_messages", JSON.stringify(messages));
    };

    const getLocalChatSessions = () => {
      if (typeof window === "undefined") return [];
      const local = localStorage.getItem("projecthub_chat_sessions");
      if (!local) return [];
      return JSON.parse(local);
    };

    const saveLocalChatSessions = (sessions) => {
      if (typeof window === "undefined") return;
      localStorage.setItem("projecthub_chat_sessions", JSON.stringify(sessions));
    };

    const messages = getLocalChatMessages();
    const fallbackMessage = {
      id: `msg-${Date.now()}`,
      ...newMessage
    };
    messages.push(fallbackMessage);
    saveLocalChatMessages(messages);

    const sessions = getLocalChatSessions();
    const updatedSessions = sessions.map(s => s.id === sessionId ? {
      ...s,
      updatedAt: timestamp,
      updated_at: timestamp
    } : s);
    saveLocalChatSessions(updatedSessions);

    return fallbackMessage;
  },

  // SECURITY & AUTH
  async loginAdmin(email, password) {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    // Fallback logic: Default credentials matching user rules and admin dashboard
    if (email === "admin@shubdeeplabs.com" && password === "admin123") {
      if (typeof window !== "undefined") {
        localStorage.setItem("shubdeep_labs_admin_logged", "true");
      }
      return { success: true, user: { email, uid: "mock-admin-uid" } };
    } else {
      return { success: false, error: "Invalid admin email or password." };
    }
  },

  async logoutAdmin() {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
      return true;
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("shubdeep_labs_admin_logged");
    }
    return true;
  },

  async checkAdminAuth(callback) {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (user) => {
        callback(!!user);
      });
    }

    // Fallback check
    const checkState = () => {
      if (typeof window !== "undefined") {
        const session = localStorage.getItem("shubdeep_labs_admin_logged") === "true";
        callback(session);
      }
    };
    checkState();

    const interval = setInterval(checkState, 1000);
    return () => clearInterval(interval);
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

    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = doc(firestore, "site_settings", "default_settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data();
        }
      } catch (e) {
        console.error("Firestore getSiteSettings error, falling back:", e);
      }
    }

    if (typeof window === "undefined") return defaultSiteSettings;
    const local = localStorage.getItem("projecthub_site_settings");
    return local ? JSON.parse(local) : defaultSiteSettings;
  },

  async saveSiteSettings(settings) {
    if (isFirebaseConfigured && firestore) {
      try {
        const docRef = doc(firestore, "site_settings", "default_settings");
        await setDoc(docRef, settings, { merge: true });
        return true;
      } catch (e) {
        console.error("Firestore saveSiteSettings error, falling back:", e);
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("projecthub_site_settings", JSON.stringify(settings));
    }
    return true;
  }
};

