"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { getProfileAction, logoutAction } from "@/app/actions/auth";
import type { Profile } from "@/types";

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: (allowLoginRedirect?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const isAuthenticated = !!user;
  const isPublicPage = pathname === `/${locale}` || pathname.includes(`/${locale}/auth/`);

  const refreshUser = useCallback(async (allowLoginRedirect: boolean = true) => {
    const result = await getProfileAction(allowLoginRedirect);
    setUser(result.ok ? result.data : null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser(!isPublicPage);
      setIsLoading(false);
    };

    initAuth();
  }, [isPublicPage, refreshUser]);

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
    router.replace(`/${locale}/auth/login`);
  }, [router, locale]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        refreshUser,
        logout,
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
