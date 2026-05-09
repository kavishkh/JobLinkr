import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCH5ymCWHr4mJ2fUoz6m7pDP-YQgkDwvZY",
  authDomain: "joblinkr-dfc2e.firebaseapp.com",
  projectId: "joblinkr-dfc2e",
  storageBucket: "joblinkr-dfc2e.firebasestorage.app",
  messagingSenderId: "66463853234",
  appId: "1:66463853234:web:2d7a0dbad2b5f6622d37ab",
  measurementId: "G-KZL9WK6TVQ"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics is only available in the browser
let analytics: any;
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) analytics = getAnalytics(app);
  });
}

export { app, auth, db, analytics };
