"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest, AuthResponse, UserSummary } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserSummary | null;
  token: string | null;
  loading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = async (savedToken: string) => {
    try {
      const userData = await apiRequest<UserSummary>("/auth/me");
      setUser(userData);
      setToken(savedToken);
    } catch {
      localStorage.removeItem("skillchain_token");
      localStorage.removeItem("skillchain_user");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("skillchain_token");
    if (savedToken) {
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = (data: AuthResponse) => {
    localStorage.setItem("skillchain_token", data.token);
    setToken(data.token);
    setUser({
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      enabled: true,
      createdAt: new Date().toISOString(),
    });

    if (data.role === "STUDENT") {
      router.push("/dashboard/student");
    } else if (data.role === "RECRUITER") {
      router.push("/dashboard/recruiter");
    } else if (data.role === "ADMIN") {
      router.push("/dashboard/admin");
    } else {
      router.push("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("skillchain_token");
    localStorage.removeItem("skillchain_user");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  const refreshUser = async () => {
    const savedToken = localStorage.getItem("skillchain_token");
    if (savedToken) {
      await fetchCurrentUser(savedToken);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
