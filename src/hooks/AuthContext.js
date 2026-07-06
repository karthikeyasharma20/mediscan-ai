import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { login, register, logout, googleLogin } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // Clean up previous profile listener if any
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (user) {
        // Set up real-time listener for user profile document
        const userRef = doc(db, "users", user.uid);
        unsubscribeProfile = onSnapshot(
          userRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setCurrentUser({
                ...user,
                ...docSnap.data(),
              });
            } else {
              setCurrentUser(user);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Firestore user profile sync error:", error);
            setCurrentUser(user);
            setLoading(false);
          }
        );
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const value = {
    user: currentUser,
    loading,
    login,
    register,
    logout,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
