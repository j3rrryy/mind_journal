"use client";

import React, { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/common/Button";
import type { MetricKey } from "@/lib/constants/metrics";
import { METRIC_LIST, METRIC_LABELS, getMetricColorLevel } from "@/lib/constants/metrics";
import type { Metrics } from "@/types";
import {
  getMetricBackgroundClass,
  getMetricTextColorClass,
  formatMetricValue,
} from "@/lib/utils/metrics";

interface MetricsFormProps {
  initialMetrics?: Metrics;
  onSubmit: (metrics: Metrics) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const DEFAULT_METRICS: Metrics = {
  mood: 5,
  sleep_hours: 7,
  activity: 5,
  stress: 5,
  energy: 5,
  focus: 5,
};

const METRIC_RANGES: Record<MetricKey, { min: number; max: number; step: number }> = {
  mood: { min: 0, max: 10, step: 1 },
  sleep_hours: { min: 0, max: 24, step: 0.5 },
  activity: { min: 0, max: 10, step: 1 },
  stress: { min: 0, max: 10, step: 1 },
  energy: { min: 0, max: 10, step: 1 },
  focus: { min: 0, max: 10, step: 1 },
};

export const MetricsForm = React.memo(function MetricsForm({
  initialMetrics,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: MetricsFormProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics || DEFAULT_METRICS);

  const handleMetricChange = useCallback((key: MetricKey, value: number) => {
    setMetrics((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onSubmit(metrics);
    },
    [metrics, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {METRIC_LIST.map((key) => {
        const range = METRIC_RANGES[key];
        const value = metrics[key];
        const max = range.max;
        const label = METRIC_LABELS[key][locale as keyof (typeof METRIC_LABELS)[MetricKey]];
        const bgClass = getMetricBackgroundClass(key, value, max);
        const textClass = getMetricTextColorClass(key, value, max);
        const level = getMetricColorLevel(key, value, max);
        const sliderColor =
          level === "high" ? "#22c55e" : level === "medium" ? "#eab308" : "#ef4444";

        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-text-label">{label}</label>
              <span className={`text-lg font-bold ${textClass}`}>
                {formatMetricValue(value, key)}
                {key === "sleep_hours" ? (locale === "ru" ? " ч" : "h") : `/${max}`}
              </span>
            </div>
            <div className={`rounded-lg p-3 ${bgClass}`}>
              <input
                type="range"
                min={range.min}
                max={range.max}
                step={range.step}
                value={value}
                onChange={(e) => handleMetricChange(key, parseFloat(e.target.value))}
                className="slider h-2 w-full appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                style={{
                  background: `linear-gradient(to right,
                    ${sliderColor} 0%,
                    #e5e7eb ${(value / max) * 100}%,
                    #e5e7eb 100%)`,
                }}
              />
            </div>
          </div>
        );
      })}

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            {t("cancel")}
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
});
