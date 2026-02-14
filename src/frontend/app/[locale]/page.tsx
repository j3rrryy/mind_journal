"use client";

import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useTranslations, useLocale } from "next-intl";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingMetrics from "@/components/landing/LandingMetrics";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingDots } from "@/components/common/LoadingDots";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/common/Button";

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("nav");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(`/${locale}/dashboard`);
    }
  }, [isAuthenticated, isLoading, locale, router]);

  if (isLoading) {
    return <LoadingDots />;
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-bold text-text-primary">MindJournal</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/auth/login`}
                className="text-sm text-text-primary transition-colors hover:text-indigo-600 dark:text-text-primary dark:hover:text-indigo-400"
              >
                {t("signIn")}
              </Link>
              <Button href={`/${locale}/auth/register`} size="sm">
                {t("getStarted")}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <LandingHero />
      <LandingFeatures />
      <LandingMetrics />
      <LandingHowItWorks />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
