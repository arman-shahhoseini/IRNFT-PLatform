// پیکربندی فایربیس
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// تنظیمات فایربیس
const firebaseConfig = {
  apiKey: "AIzaSyDzovIXHsl4h9qPlWB8xt92p9Yw_mrPUIU",
  authDomain: "irnftplatforn-database.firebaseapp.com",
  projectId: "irnftplatforn-database",
  storageBucket: "irnftplatforn-database.firebasestorage.app",
  messagingSenderId: "443800997169",
  appId: "1:443800997169:web:2145a8d4b710c741d2f410",
  measurementId: "G-FXEWS782V5"
};

// راه‌اندازی فایربیس
const app = initializeApp(firebaseConfig);

// دسترسی به Firestore
const db = getFirestore(app);

// دسترسی به Storage
const storage = getStorage(app);

// راه‌اندازی Analytics در صورت اجرا در مرورگر
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, db, storage, analytics }; 