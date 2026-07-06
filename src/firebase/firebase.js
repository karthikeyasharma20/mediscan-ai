import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-EAWYKvdUhOaR4rvyFvJTIywp25K2Hmc",
  authDomain: "mediscan-ai-ce012.firebaseapp.com",
  projectId: "mediscan-ai-ce012",
  storageBucket: "mediscan-ai-ce012.firebasestorage.app",
  messagingSenderId: "1023813030360",
  appId: "1:1023813030360:web:804f171a4827ff3a3a22ad",
  measurementId: "G-SGE24Z30D1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);