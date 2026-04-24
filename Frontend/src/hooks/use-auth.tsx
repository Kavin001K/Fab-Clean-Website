import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProfile, setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { getApiBaseUrl } from "@/lib/api-base";

// Initialize API
setBaseUrl(getApiBaseUrl());

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem("fabclean_token");
  });
  const queryClient = useQueryClient();

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("fabclean_token", newToken);
    } else {
      localStorage.removeItem("fabclean_token");
    }
    setTokenState(newToken);
  };

  const logout = () => {
    setToken(null);
    queryClient.clear();
    setLocation("/");
  };

  // Setup API auth token
  useEffect(() => {
    setAuthTokenGetter(() => token);
  }, [token]);

  // 4-month (120 days) inactivity expiry
  useEffect(() => {
    if (!token) return;

    const FOUR_MONTHS_MS = 120 * 24 * 60 * 60 * 1000;
    
    const checkExpiry = () => {
      const lastAccessRaw = localStorage.getItem("fabclean_last_access");
      const now = Date.now();
      
      if (lastAccessRaw) {
        const lastAccess = parseInt(lastAccessRaw, 10);
        if (now - lastAccess > FOUR_MONTHS_MS) {
          logout();
          return;
        }
      }
      localStorage.setItem("fabclean_last_access", now.toString());
    };

    // Check on mount/token change
    checkExpiry();

    // Update last access timestamp on key interactions
    let throttleTimer: number | null = null;
    const handleActivity = () => {
      if (!throttleTimer) {
        throttleTimer = window.setTimeout(() => {
          localStorage.setItem("fabclean_last_access", Date.now().toString());
          throttleTimer = null;
        }, 10000); // Throttle to max once every 10 seconds
      }
    };

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach(event => document.addEventListener(event, handleActivity, { passive: true }));
    
    return () => {
      if (throttleTimer) window.clearTimeout(throttleTimer);
      events.forEach(event => document.removeEventListener(event, handleActivity));
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated: !!token, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const { data: profile, isLoading } = useGetProfile({
    query: {
      enabled: isAuthenticated,
      retry: false
    } as any
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !profile)) {
      const t = setTimeout(() => {
        const redirectTarget = location.split("?")[0] || "/";
        setLocation(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
      }, 100);
      return () => clearTimeout(t);
    }
    return () => {};
  }, [isAuthenticated, location, profile, isLoading, setLocation]);

  return { profile: profile?.data, isLoading };
}
