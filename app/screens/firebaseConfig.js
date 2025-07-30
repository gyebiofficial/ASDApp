import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "asdapp1.firebaseapp.com",
  projectId: "asdapp1",
  storageBucket: "asdapp1.firebasestorage.app",
  messagingSenderId: "315461763295",
  appId: "1:315461763295:web:956a2178bcda9fbafa696a",
  measurementId: "G-GRR2W6J6DK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
