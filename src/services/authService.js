import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const googleProvider = new GoogleAuthProvider();

export async function register(email, password, name) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update auth profile
  await updateProfile(user, { displayName: name });
  
  // Create user document in Firestore
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    name: name,
    email: email,
    reportsCount: 0,
    avgHealthScore: 0,
    memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    createdAt: serverTimestamp(),
  });
  
  return userCredential;
}

export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return await signOut(auth);
}

export async function googleLogin() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Check if user already exists in Firestore
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "Google User",
      email: user.email,
      reportsCount: 0,
      avgHealthScore: 0,
      memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      createdAt: serverTimestamp(),
    });
  }
  
  return result;
}