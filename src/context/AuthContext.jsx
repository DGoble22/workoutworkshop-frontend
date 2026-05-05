import React, { createContext, useState, useEffect, useRef } from 'react';
import {io} from 'socket.io-client';

export const AuthContext = createContext({
  token: null,
  setToken: () => {},
  logout: () => {},
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  socket: null,
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
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('authToken');
    } catch (e) {
      return null;
    }
  });

  //User state
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('authUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  // socket state
  const [socket, setSocket] = useState(null);

  // Ref to hold the auto-logout timer id
  const logoutTimerRef = useRef(null);

  // Socket Lifecycle
  useEffect(() => {
    let newSocket = null;

    if (token) {
      const payload = parseJwt(token);
      const currentUserId = payload?.sub;

      if(!currentUserId) {console.error("Socket failed: No user ID found in token.");}
      if (currentUserId) {
        newSocket = io(import.meta.env.VITE_API_URL, {
          query: { user_id: currentUserId },
          transports: ["websocket"],
          upgrade: false,
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
          console.log(` Socket connected: User ${currentUserId}`);
        });

        newSocket.on("connect_error", (err) => {
          console.error(" Socket connection error:", err.message);
        });
      }
    }

    // Cleanup: Disconnect the socket when user logs out or token changes
    return () => {
      if (newSocket) {
        console.log("Disconnecting socket...");
        newSocket.disconnect();
        setSocket(null);
      }
    };
  }, [token, user]);

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
      return;
    }

    // JWT expiration calculation
    const expMs = payload.exp * 1000;
    const now = Date.now();
    const msUntilExp = expMs - now;

    //token expired
    if (msUntilExp <= 0) {
      logout();
      return;
    }

    // Set timer to logout when token expires
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, msUntilExp);

    // logout or token change
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    // Socket will be cleaned up by the useEffect above, but explicit disconnect is safer
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  // Prefer backend-provided user stored in state; fall back to token payload if absent
  const effectiveUser = user || (token ? parseJwt(token) : null);
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, setToken, logout, user: effectiveUser, setUser, isAuthenticated, socket}}>
      {children}
    </AuthContext.Provider>
  );
}
