import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from "firebase/firestore";
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

    // Fallback logic: Default credentials: admin@projecthub.com / admin123
    if (email === "admin@projecthub.com" && password === "admin123") {
      if (typeof window !== "undefined") {
        localStorage.setItem("projecthub_admin_session", "active");
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
      localStorage.removeItem("projecthub_admin_session");
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
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("projecthub_admin_session");
      callback(session === "active");
      return () => {}; // return empty unsubscribe
    }
    callback(false);
    return () => {};
  }
};
