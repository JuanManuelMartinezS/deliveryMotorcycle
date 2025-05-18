import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDRXl1BQLG0-sjRHr31o91fr8jKTJaGItE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rappipro-309f1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rappipro-309f1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rappipro-309f1.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "526165212298",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:526165212298:web:016684290c0cd4a5850173"
};

// Initialize Firebase
let app;
try {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    app = getApp();
    console.log('Using existing Firebase app');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize auth
export const auth = getAuth(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

export default app;