"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "@/lib/contexts/AuthContext";
import { usePathname } from "next/navigation";

export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("/auth/login") || pathname.includes("/auth/register")) {
      return;
    }

    if (!isLoading && !isAuthenticated) {
      router.replace(`/${locale}/auth/login`);
    }
  }, [isAuthenticated, isLoading, router, locale, pathname]);

  return { isAuthenticated, isLoading };
}
