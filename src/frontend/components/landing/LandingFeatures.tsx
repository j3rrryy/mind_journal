import { useTranslations } from "next-intl";
import { FileText, BarChart3, TrendingUp, Lightbulb, Calendar, Search } from "lucide-react";

export default function LandingFeatures() {
  const t = useTranslations("landing.features");

  const features = [
    { key: "daily", icon: FileText },
    { key: "dashboard", icon: BarChart3 },
    { key: "analytics", icon: TrendingUp },
    { key: "recommendations", icon: Lightbulb },
    { key: "calendar", icon: Calendar },
    { key: "insights", icon: Search },
  ] as const;

  return (
    <section className="bg-white py-20 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">{t("title")}</h2>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.key} className="card-surface-alt">
                <div className="mb-4 text-indigo-600 dark:text-indigo-400">
                  <Icon size={32} />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-text-primary">
                  {t(`${feature.key}.title`)}
                </h3>
                <p className="text-text-secondary">{t(`${feature.key}.description`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
