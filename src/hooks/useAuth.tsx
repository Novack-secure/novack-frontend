"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_creator: boolean;
  profile_image_url?: string;
  supplier?: {
    id: string;
    supplier_name: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadUserFromStorage = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("access_token");
      console.log("🔍 Loading user from storage:", {
        storedUser,
        accessToken: !!accessToken,
      });

      if (storedUser && accessToken) {
        const parsedUser: User = JSON.parse(storedUser);
        console.log("🔍 Parsed user:", parsedUser);
        
        // Si el usuario no tiene supplier, intentar obtenerlo del backend
        if (!parsedUser.supplier) {
          console.log("⚠️ User missing supplier, fetching from backend...");
          try {
            const response = await api.get(`/employees/${parsedUser.id}`);
            if (response.data.supplier) {
              parsedUser.supplier = response.data.supplier;
              localStorage.setItem("user", JSON.stringify(parsedUser));
              console.log("✅ Supplier updated:", parsedUser.supplier);
            }
          } catch (error) {
            console.error("❌ Failed to fetch supplier:", error);
          }
        }
        
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        console.log("❌ No user or token found in storage");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("❌ Failed to load user from storage:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = useCallback(
    (accessToken: string, refreshToken: string, userData: User) => {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      toast.success("Inicio de sesión exitoso");
      router.push("/home");
    },
    [router]
  );

  const logout = useCallback(() => {
    setIsLoading(true);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    toast.info("Sesión cerrada");
    router.push("/login");
    setIsLoading(false);
  }, [router]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
