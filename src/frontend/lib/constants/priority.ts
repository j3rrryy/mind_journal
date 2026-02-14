export type Priority = "high" | "medium" | "low";

export const PRIORITY_LABELS: Record<Priority, { en: string; ru: string }> = {
  high: { en: "High", ru: "Высокий" },
  medium: { en: "Medium", ru: "Средний" },
  low: { en: "Low", ru: "Низкий" },
} as const;

export const PRIORITY_COLORS: Record<
  Priority,
  { bg: string; text: string; darkBg: string; darkText: string }
> = {
  high: {
    bg: "bg-red-100",
    text: "text-red-800",
    darkBg: "dark:bg-red-900/30",
    darkText: "dark:text-red-300",
  },
  medium: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    darkBg: "dark:bg-yellow-900/30",
    darkText: "dark:text-yellow-300",
  },
  low: {
    bg: "bg-green-100",
    text: "text-green-800",
    darkBg: "dark:bg-green-900/30",
    darkText: "dark:text-green-400",
  },
} as const;

export const PRIORITY_ORDER: Priority[] = ["high", "medium", "low"] as const;
