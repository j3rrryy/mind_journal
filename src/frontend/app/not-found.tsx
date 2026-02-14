import { cookies } from "next/headers";
import { Button } from "@/components/common/Button";

const translations = {
  ru: {
    title: "Страница не найдена",
    description: "Извините, мы не смогли найти страницу, которую вы ищете.",
    goHome: "На главную",
  },
  en: {
    title: "Page Not Found",
    description: "Sorry, we couldn't find the page you're looking for.",
    goHome: "Go to Homepage",
  },
} as const;

type Locale = keyof typeof translations;

export default async function NotFound() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("user_locale")?.value || "ru";
  const t = translations[locale.toLowerCase() as Locale];

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="relative mb-4">
          <h1 className="text-[200px] font-bold text-indigo-600/30 dark:text-indigo-400/60 select-none leading-none">
            404
          </h1>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-text-primary">{t.title}</h2>
          <p className="text-text-secondary text-sm max-w-sm mx-auto">{t.description}</p>
        </div>

        <div className="mt-8">
          <Button href={`/${locale}`}>{t.goHome}</Button>
        </div>
      </div>
    </div>
  );
}
