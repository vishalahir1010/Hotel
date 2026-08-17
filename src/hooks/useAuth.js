// src/hooks/useAuth.js
// Firebase Authentication based auth hook
import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState('login');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (!auth) {
      setError("Firebase Authentication is not configured.");
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get extra info (role etc.) from Firestore
        try {
          if (!db) {
            throw new Error("Firestore not initialized");
          }
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.exists() ? userDoc.data() : {};
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || userData.name || 'Guest',
            email: firebaseUser.email,
            role: userData.role || 'user'
          });
        } catch (err) {
          // Fallback if Firestore fails
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Guest',
            email: firebaseUser.email,
            role: 'user'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setSuccessMsg(null);
    if (!auth) {
      setError("Authentication is currently unavailable. Please verify Firebase configuration.");
      return { success: false };
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Role check from Firestore
      let role = 'user';
      if (db) {
        try {
          const userDocRef = doc(db, 'users', result.user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            role = userDoc.data().role;
          }
        } catch (err) {
          console.warn("Could not fetch user role from Firestore:", err);
        }
      }

      // Log login event
      if (db) {
        try {
          await addDoc(collection(db, 'authEvents'), {
            uid: result.user.uid,
            email: result.user.email,
            eventType: 'login',
            timestamp: serverTimestamp(),
          });
        } catch (err) {
          console.warn("Could not log auth event to Firestore:", err);
        }
      }

      return { success: true, role };
    } catch (err) {
      const msg = getFirebaseErrorMessage(err.code);
      setError(msg);
      return { success: false };
    }
  };

  const signup = async (name, email, password) => {
    setError(null);
    setSuccessMsg(null);
    if (!auth) {
      setError("Registration is currently unavailable. Please verify Firebase configuration.");
      return false;
    }
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all details.');
      return false;
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name
      await updateProfile(result.user, { displayName: name });
      
      // Save to Firestore
      if (db) {
        try {
          await setDoc(doc(db, 'users', result.user.uid), {
            name,
            email,
            role: 'user',
            createdAt: serverTimestamp()
          });
          // Log signup event
          await addDoc(collection(db, 'authEvents'), {
            uid: result.user.uid,
            name,
            email,
            eventType: 'signup',
            timestamp: serverTimestamp(),
          });
        } catch (err) {
          console.warn("Could not save user profile to Firestore:", err);
        }
      }
      return true;
    } catch (err) {
      const msg = getFirebaseErrorMessage(err.code);
      setError(msg);
      return false;
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
  };

  const sendPasswordReset = async (email) => {
    setError(null);
    if (!auth) {
      setError("Password reset is currently unavailable. Please verify Firebase configuration.");
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthStep('reset-sent');
      return true;
    } catch (err) {
      const msg = getFirebaseErrorMessage(err.code);
      setError(msg);
      return false;
    }
  };

  return {
    user,
    loading,
    authStep,
    setAuthStep,
    error,
    setError,
    successMsg,
    login,
    signup,
    logout,
    sendPasswordReset
  };
};

// Firebase error code to human readable message
function getFirebaseErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
