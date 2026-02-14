import type { MetricKey } from "@/lib/constants/metrics";
import { METRIC_COLORS, METRIC_LABELS, getMetricColorLevel } from "@/lib/constants/metrics";

export function getMetricColorClasses(key: MetricKey, value: number, max: number = 10): string {
  const level = getMetricColorLevel(key, value, max);
  const colors = METRIC_COLORS[level];
  return `${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}`;
}

export function getMetricBackgroundClass(key: MetricKey, value: number, max: number = 10): string {
  const level = getMetricColorLevel(key, value, max);
  return METRIC_COLORS[level].bg + " " + METRIC_COLORS[level].darkBg;
}

export function getMetricTextColorClass(key: MetricKey, value: number, max: number = 10): string {
  const level = getMetricColorLevel(key, value, max);
  return METRIC_COLORS[level].text + " " + METRIC_COLORS[level].darkText;
}

export function getMetricLabel(key: MetricKey, locale: string = "ru"): string {
  return METRIC_LABELS[key][locale as keyof (typeof METRIC_LABELS)[MetricKey]] || key;
}

export function getMetricUnit(key: MetricKey, locale: string = "ru"): string {
  const unit = METRIC_LABELS[key].unit;
  if (!unit) return "";

  if (key === "sleep_hours") {
    return locale === "ru" ? " ч" : " h";
  }
  return unit;
}

export function formatMetricValue(
  value: number | null,
  key: MetricKey,
  forceDecimals: boolean = false
): string {
  if (value === null) return "—";

  if (key === "sleep_hours") {
    return value.toFixed(1);
  }

  if (forceDecimals) {
    return value.toFixed(1);
  }

  return Math.round(value).toString();
}

export function getMoodBarColor(mood: number): string {
  const level = getMetricColorLevel("mood", mood, 10);
  switch (level) {
    case "high":
      return "bg-green-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-red-500";
  }
}
