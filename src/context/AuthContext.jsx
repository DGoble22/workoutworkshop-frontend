import React, { createContext, useState, useEffect, useRef } from 'react';

export const AuthContext = createContext({
  token: null,
  setToken: () => {},
  logout: () => {},
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});

// manual JWT parsing to avoid extra dependencies; returns null if invalid
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// AuthProvider component to wrap the app and provide persistent auth state
export function AuthProvider({ children }) {
  //Token state
  const [token, setTokenState] = useState(() => {
    try {
      return localStorage.getItem('authToken');
    } catch (e) {
      return null;
    }
  });

  //User state
  const [user, setUserState] = useState(() => {
    try {
      const raw = localStorage.getItem('authUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  // Ref to hold the auto-logout timer id
  const logoutTimerRef = useRef(null);

  // Persist token to localStorage whenever it changes
  useEffect(() => {
    try {
      if (token) localStorage.setItem('authToken', token);
      else localStorage.removeItem('authToken');
    } catch (e) {
      // ignore storage errors
    }
  }, [token]);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    try {
      if (user) localStorage.setItem('authUser', JSON.stringify(user));
      else localStorage.removeItem('authUser');
    } catch (e) {
      // ignore storage errors
    }
  }, [user]);

  // Auto-logout: set/clear timer whenever token changes
  useEffect(() => {
    // Clear existing timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    if (!token) return;

    const payload = parseJwt(token);
    if (!payload || !payload.exp) {
      // If token doesn't have exp, we can't auto-logout reliably
      return;
    }

    // JWT expiration calculation
    const expMs = payload.exp * 1000;
    const now = Date.now();
    const msUntilExp = expMs - now;

    //token expired
    if (msUntilExp <= 0) {
      setTokenState(null);
      setUserState(null);
      return;
    }

    // Set timer to logout when token expires
    logoutTimerRef.current = setTimeout(() => {
      setTokenState(null);
      setUserState(null);
      logoutTimerRef.current = null;
    }, msUntilExp);

    // logout or token change
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    };
  }, [token]);

  // Context functions
  const setToken = (t) => setTokenState(t);
  const setUser = (u) => setUserState(u);
  const logout = () => {
    setTokenState(null);
    setUserState(null);
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  // Prefer backend-provided user stored in state; fall back to token payload if absent
  const effectiveUser = user || (token ? parseJwt(token) : null);
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, setToken, logout, user: effectiveUser, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
