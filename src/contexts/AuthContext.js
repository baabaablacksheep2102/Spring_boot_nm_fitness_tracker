import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('smartcoach_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('smartcoach_auth', JSON.stringify({ user, token }));
  }, [user, token]);

  const login = (userObj, jwt) => {
    setUser(userObj);
    setToken(jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
