// src/firebase.js
// ====================================================
// FIREBASE CONFIGURATION
// ====================================================
// Steps to set up:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Go to Project Settings > General > Your apps > Add app (Web)
// 4. Copy the firebaseConfig object and paste it below
// 5. In Firebase Console, enable "Authentication" > Sign-in method > Email/Password
// 6. In Firebase Console, enable "Firestore Database" (in test mode for now)
// ====================================================

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, 
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, 
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, 
  appId: import.meta.env.VITE_FIREBASE_APP_ID, 
};

// Check if critical configuration variables are present
const isConfigValid = 
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'your_firebase_api_key_here';

let app = null;
let auth = null;
let db = null;

if (isConfigValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Error initializing Firebase services:", error);
  }
} else {
  console.warn(
    "⚠️ Firebase configuration is missing or invalid. Authentication and Database features will not function. " +
    "Please make sure your environment variables (VITE_FIREBASE_*) are set correctly in your environment (local .env or Netlify settings)."
  );
}

export { auth, db };
export default app;
