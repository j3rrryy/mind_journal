import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/common/Button";

export default function LandingCTA() {
  const t = useTranslations("landing.cta");
  const tc = useTranslations("common");
  const locale = useLocale();

  return (
    <section className="bg-indigo-600 py-20 dark:bg-indigo-500">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            variant="white"
            href={`/${locale}/auth/register`}
            size="lg"
            className="w-full sm:w-auto"
          >
            {t("button")}
          </Button>
          <Button
            variant="outline"
            href={`/${locale}/auth/login`}
            size="lg"
            className="w-full sm:w-auto"
          >
            {tc("login")}
          </Button>
        </div>
      </div>
    </section>
  );
}
