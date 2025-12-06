"use client";

import { defaultLocale, locales } from "@/i18n/config";
import { fetchApi } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserRole = "ADMIN" | "MASTER" | "PLAYER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname
  const getCurrentLocale = () => {
    const pathSegments = pathname?.split("/").filter(Boolean) || [];
    return locales.includes(pathSegments[0] as any)
      ? pathSegments[0]
      : defaultLocale;
  };

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Validate token by fetching current user
          try {
            const data = await fetchApi<{ user: User }>("/auth/me");
            setUser(data.user);
            localStorage.setItem("auth_user", JSON.stringify(data.user));
          } catch (error) {
            console.error("Error validating token:", error);
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await fetchApi<{ access_token: string; user: User }>(
        "/auth/login",
        {
          method: "POST",
          body: { email, password },
          requiresAuth: false,
        },
      );

      setToken(data.access_token);
      setUser(data.user);

      // Persist to localStorage
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      const locale = getCurrentLocale();
      router.push(`/${locale}`);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const data = await fetchApi<{ access_token: string; user: User }>(
        "/auth/register",
        {
          method: "POST",
          body: { email, password, name },
          requiresAuth: false,
        },
      );

      setToken(data.access_token);
      setUser(data.user);

      // Persist to localStorage
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      const locale = getCurrentLocale();
      router.push(`/${locale}`);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    const locale = getCurrentLocale();
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push(`/${locale}/login`);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        hasRole,
      }}
    >
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
