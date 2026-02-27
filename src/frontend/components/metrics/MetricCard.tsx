import React from "react";
import type { MetricKey } from "@/lib/constants/metrics";
import {
  getMetricBackgroundClass,
  getMetricTextColorClass,
  formatMetricValue,
  getMetricLabel,
  getMetricUnit,
} from "@/lib/utils/metrics";
import { useLocale } from "next-intl";

interface MetricCardProps {
  metricKey: MetricKey;
  value: number | null;
  max?: number;
  forceDecimals?: boolean;
}

export const MetricCard = React.memo(function MetricCard({
  metricKey,
  value,
  max = 10,
  forceDecimals = false,
}: MetricCardProps) {
  const locale = useLocale();
  const displayValue = formatMetricValue(value, metricKey, forceDecimals);
  const unit = getMetricUnit(metricKey, locale);
  const label = getMetricLabel(metricKey, locale);

  const backgroundClass =
    value !== null
      ? getMetricBackgroundClass(metricKey, value, max)
      : "bg-gray-50 dark:bg-gray-800";
  const textClass =
    value !== null
      ? getMetricTextColorClass(metricKey, value, max)
      : "text-text-muted dark:text-text-muted";

  return (
    <div className={`${backgroundClass} rounded-xl p-4 transition-all hover:shadow-md`}>
      <p className="text-sm text-text-secondary">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${textClass}`}>
        {displayValue}
        {unit && <span className="text-sm font-normal"> {unit}</span>}
      </p>
    </div>
  );
});
