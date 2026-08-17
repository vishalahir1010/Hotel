// src/hooks/useAuth.js
// localStorage-based auth (no Firebase dependency)
import { useState, useEffect } from 'react';

const USERS_KEY = 'aurelia_users';
const SESSION_KEY = 'aurelia_user';

// Pre-seeded admin account
const ADMIN_USER = {
  id: 'admin-001',
  name: 'Aurelia Admin',
  email: 'admin@aurelia.com',
  password: 'admin@1234',
  role: 'admin'
};

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [ADMIN_USER];
  } catch {
    return [ADMIN_USER];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState('login');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    setSuccessMsg(null);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    const users = getStoredUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      setError('Invalid email or password. Please try again.');
      return { success: false };
    }

    const sessionUser = { id: found.id, name: found.name, email: found.email, role: found.role || 'user' };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { success: true, role: found.role || 'user' };
  };

  const signup = async (name, email, password) => {
    setError(null);
    setSuccessMsg(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all details.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }

    await new Promise(r => setTimeout(r, 600));

    const users = getStoredUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setError('An account with this email already exists.');
      return false;
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      password,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);

    const sessionUser = { id: newUser.id, name, email, role: 'user' };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const sendPasswordReset = async (email) => {
    setError(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    await new Promise(r => setTimeout(r, 600));
    setAuthStep('reset-sent');
    return true;
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
