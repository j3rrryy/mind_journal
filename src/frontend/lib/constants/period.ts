export type Period = "week" | "month" | "quarter" | "half_year" | "year";

export const PERIOD_LABELS: Record<Period, { en: string; ru: string }> = {
  week: { en: "Week", ru: "Неделя" },
  month: { en: "Month", ru: "Месяц" },
  quarter: { en: "Quarter", ru: "Квартал" },
  half_year: { en: "Half Year", ru: "Полгода" },
  year: { en: "Year", ru: "Год" },
} as const;

export const PERIOD_LIST: Period[] = ["week", "month", "quarter", "half_year", "year"] as const;
