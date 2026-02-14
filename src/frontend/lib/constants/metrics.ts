export type MetricKey = "mood" | "sleep_hours" | "activity" | "stress" | "energy" | "focus";

export const METRIC_LABELS: Record<MetricKey, { en: string; ru: string; unit?: string }> = {
  mood: { en: "Mood", ru: "Настроение", unit: "/10" },
  sleep_hours: { en: "Sleep", ru: "Сон", unit: "h" },
  activity: { en: "Activity", ru: "Активность", unit: "/10" },
  stress: { en: "Stress", ru: "Стресс", unit: "/10" },
  energy: { en: "Energy", ru: "Энергия", unit: "/10" },
  focus: { en: "Focus", ru: "Внимание", unit: "/10" },
} as const;

export type MetricColorLevel = "high" | "medium" | "low";

function getPositiveMetricColorLevel(value: number, max: number = 10): MetricColorLevel {
  const percentage = (value / max) * 100;
  if (percentage >= 70) return "high";
  if (percentage >= 40) return "medium";
  return "low";
}

function getNegativeMetricColorLevel(value: number, max: number = 10): MetricColorLevel {
  const percentage = (value / max) * 100;
  if (percentage <= 40) return "high";
  if (percentage <= 70) return "medium";
  return "low";
}

function getSleepColorLevel(value: number): MetricColorLevel {
  if (value >= 7 && value <= 9) return "high";
  if (value >= 6 && value <= 12) return "medium";
  return "low";
}

export function getMetricColorLevel(
  key: MetricKey,
  value: number,
  max: number = 10
): MetricColorLevel {
  switch (key) {
    case "stress":
      return getNegativeMetricColorLevel(value, max);
    case "sleep_hours":
      return getSleepColorLevel(value);
    default:
      return getPositiveMetricColorLevel(value, max);
  }
}

export const METRIC_COLORS: Record<
  MetricColorLevel,
  { bg: string; text: string; darkBg: string; darkText: string }
> = {
  high: {
    bg: "bg-green-50",
    text: "text-green-600",
    darkBg: "dark:bg-green-900/30",
    darkText: "dark:text-green-400",
  },
  medium: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    darkBg: "dark:bg-yellow-900/30",
    darkText: "dark:text-yellow-400",
  },
  low: {
    bg: "bg-red-50",
    text: "text-red-600",
    darkBg: "dark:bg-red-900/30",
    darkText: "dark:text-red-400",
  },
} as const;

export const METRIC_LIST: MetricKey[] = [
  "mood",
  "sleep_hours",
  "activity",
  "stress",
  "energy",
  "focus",
];
