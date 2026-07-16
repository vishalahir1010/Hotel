import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState('login');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Load user session from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aurelia_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('aurelia_user');
      }
    }
  }, []);

  const login = async (email, envPassword) => {
    setError(null);
    setSuccessMsg(null);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Pre-seeded user check
    if (email.toLowerCase() === 'lord@aurelia.com' && envPassword === 'password123') {
      const loggedUser = { name: 'Lord Alexander', email };
      setUser(loggedUser);
      localStorage.setItem('aurelia_user', JSON.stringify(loggedUser));
      return true;
    }

    // Mock dynamic registered users check
    const registeredUsersStr = localStorage.getItem('aurelia_mock_users');
    if (registeredUsersStr) {
      try {
        const users = JSON.parse(registeredUsersStr);
        const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === envPassword);
        if (match) {
          const loggedUser = { name: match.name, email: match.email };
          setUser(loggedUser);
          localStorage.setItem('aurelia_user', JSON.stringify(loggedUser));
          return true;
        }
      } catch (e) {
        console.error('Error reading mock users database', e);
      }
    }

    setError('Invalid email address or passcode. Please try again.');
    return false;
  };

  const signup = async (name, email, envPassword) => {
    setError(null);
    setSuccessMsg(null);

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple validation
    if (!name.trim() || !email.trim() || !envPassword.trim()) {
      setError('Please fill in all details.');
      return false;
    }

    // Check if email already used (specifically lord@aurelia.com)
    if (email.toLowerCase() === 'lord@aurelia.com') {
      setError('An account with this email address already exists.');
      return false;
    }

    const registeredUsersStr = localStorage.getItem('aurelia_mock_users') || '[]';
    try {
      const users = JSON.parse(registeredUsersStr);
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setError('An account with this email address already exists.');
        return false;
      }

      // Add to mock database
      const newUser = { name, email, password: envPassword };
      users.push(newUser);
      localStorage.setItem('aurelia_mock_users', JSON.stringify(users));

      // Login immediately
      const sessionUser = { name, email };
      setUser(sessionUser);
      localStorage.setItem('aurelia_user', JSON.stringify(sessionUser));
      return true;
    } catch {
      setError('Registration failed. Try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aurelia_user');
  };

  const sendPasswordReset = async (email) => {
    setError(null);
    
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }

    setAuthStep('reset-sent');
    return true;
  };

  return {
    user,
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
