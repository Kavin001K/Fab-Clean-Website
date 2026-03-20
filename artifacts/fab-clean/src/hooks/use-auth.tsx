import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProfile } from "@workspace/api-client-react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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
    window.location.href = "/";
  };

  // Setup generic fetch options for Orval hooks if needed
  // This is a simple implementation. In a real app, you'd integrate this into custom-fetch.ts
  if (token) {
    window.localStorage.setItem("fabclean_token", token);
  }

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
  const { data: profile, isLoading } = useGetProfile({
    query: {
      enabled: isAuthenticated,
      retry: false
    }
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !profile)) {
      // Small delay to prevent layout thrashing
      const t = setTimeout(() => {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 100);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated, profile, isLoading]);

  return { profile: profile?.data, isLoading };
}
