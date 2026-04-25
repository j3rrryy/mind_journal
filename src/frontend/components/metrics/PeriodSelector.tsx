"use client";

import { useTranslations } from "next-intl";
import { PERIOD_LIST, type Period } from "@/lib/constants/period";

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
  availablePeriods: Period[];
}

export function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
  availablePeriods,
}: PeriodSelectorProps) {
  const t = useTranslations("analytics");

  return (
    <div className="flex flex-wrap gap-2">
      {PERIOD_LIST.map((period) => {
        const hasData = availablePeriods.includes(period);
        const isSelected = selectedPeriod === period;

        return (
          <button
            key={period}
            onClick={() => hasData && onPeriodChange(period)}
            disabled={!hasData}
            className={`relative rounded-lg px-4 py-2 transition-colors ${
              isSelected
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : hasData
                  ? "border border-gray-300 bg-white text-text-primary hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-text-primary dark:hover:bg-gray-700"
                  : "cursor-not-allowed border border-gray-200 bg-gray-100 text-text-muted dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500"
            }`}
          >
            {t(`periods.${period}`)}
          </button>
        );
      })}
    </div>
  );
}
