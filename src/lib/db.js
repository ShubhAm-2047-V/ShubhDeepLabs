import { dbService as firebaseDbService } from "./firebase";
import { dbService as supabaseDbService } from "./supabase_impl";

// Determine which database is active based on available credentials
const isFirebaseActive = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export const dbService = isFirebaseActive ? firebaseDbService : supabaseDbService;
