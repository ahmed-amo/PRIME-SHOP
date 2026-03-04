import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "@/lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  picture?: string | null;
  phone?: string | null;
  address?: string | null;
  role?: string;
  google_id?: string | null;
  email_verified_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setTokenState(storedToken);
      // Fetch user data if token exists
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await axios.get("/api/user");
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Token might be invalid, clear it
      localStorage.removeItem("auth_token");
      setTokenState(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("auth_token", newToken);
      setTokenState(newToken);
      // Fetch user data when token is set
      fetchUser(newToken);
    } else {
      localStorage.removeItem("auth_token");
      setTokenState(null);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      // Revoke token on server
      await axios.delete("/api/logout");
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local state
      localStorage.removeItem("auth_token");
      setTokenState(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    setUser,
    setToken,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
