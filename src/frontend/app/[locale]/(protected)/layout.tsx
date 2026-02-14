"use client";

import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import Navigation from "@/components/layout/Navigation";
import { LoadingDots } from "@/components/common/LoadingDots";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useProtectedRoute();

  if (isLoading) {
    return <LoadingDots />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
