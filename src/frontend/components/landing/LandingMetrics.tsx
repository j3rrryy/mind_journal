import { useTranslations } from "next-intl";
import type { MetricKey } from "@/lib/constants/metrics";
import { METRIC_LIST } from "@/lib/constants/metrics";
import { Smile, Moon, Activity, Thermometer, Zap, Target } from "lucide-react";

export default function LandingMetrics() {
  const t = useTranslations("landing.metrics");
  const icons: Record<MetricKey, React.ElementType> = {
    mood: Smile,
    sleep_hours: Moon,
    activity: Activity,
    stress: Thermometer,
    energy: Zap,
    focus: Target,
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">{t("title")}</h2>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {METRIC_LIST.map((key) => {
            const Icon = icons[key];
            return (
              <div key={key} className="flex gap-4 rounded-xl card-surface-hover">
                <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                  <Icon size={32} />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-text-primary">
                    {t(`${key}.name`)}
                  </h3>
                  <p className="text-sm text-text-secondary">{t(`${key}.description`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
