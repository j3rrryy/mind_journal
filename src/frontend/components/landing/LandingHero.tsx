"use client";

import { useTranslations, useLocale } from "next-intl";
import LocaleSwitcher from "@/components/profile/LocaleSwitcher";
import { Button } from "@/components/common/Button";

export default function LandingHero() {
  const t = useTranslations("landing.hero");
  const tc = useTranslations("common");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-10 max-w-2xl text-lg text-text-secondary">{t("subtitle")}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href={`/${locale}/auth/register`} size="lg" className="w-full sm:w-auto">
              {t("cta")}
            </Button>
            <Button
              variant="secondary"
              href={`/${locale}/auth/login`}
              size="lg"
              className="w-full sm:w-auto"
            >
              {tc("login")}
            </Button>
          </div>
          <div className="mt-10 flex justify-center">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </section>
  );
}
