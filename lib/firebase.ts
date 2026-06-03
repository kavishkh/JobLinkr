import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAFx3T_mRcONAwliCicXpT_MJaei45s8RA",
  authDomain: "joblinkr-5a811.firebaseapp.com",
  projectId: "joblinkr-5a811",
  storageBucket: "joblinkr-5a811.firebasestorage.app",
  messagingSenderId: "1083397520858",
  appId: "1:1083397520858:web:20396f466f1db767fd14e3",
  measurementId: "G-2B1EHJTQYX"
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
