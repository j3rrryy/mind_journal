"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getAnalyticsAction } from "@/app/actions/wellness";
import { useTranslations, useLocale } from "next-intl";
import { LoadingDots } from "@/components/common/LoadingDots";
import { EmptyState } from "@/components/metrics/EmptyState";
import { PageTitle } from "@/components/layout/PageTitle";
import { AlertMessage } from "@/components/common/AlertMessage";
import { SectionCard } from "@/components/layout/SectionCard";
import { PeriodSelector } from "@/components/metrics/PeriodSelector";
import { TipCard } from "@/components/common/TipCard";
import { Button } from "@/components/common/Button";
import { PriorityBadge } from "@/components/metrics/PriorityBadge";
import type { Priority } from "@/lib/constants/priority";
import type { Period } from "@/lib/constants/period";
import type { MetricKey } from "@/lib/constants/metrics";
import { METRIC_LABELS } from "@/lib/constants/metrics";
import type { PeriodAnalytics } from "@/types";
import { formatDate } from "@/lib/utils/date";

export default function AnalyticsPage() {
  const t = useTranslations("analytics");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [analytics, setAnalytics] = useState<PeriodAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAnalyticsAction();
      if (response.ok) {
        const roundedAnalytics = response.data.analytics.map((period) => ({
          ...period,
          insights: period.insights.map((insight) => ({
            ...insight,
            parameters: Object.fromEntries(
              Object.entries(insight.parameters).map(([key, value]) => [
                key,
                Math.round(value * 10) / 10,
              ])
            ),
          })),
        }));
        setAnalytics(roundedAnalytics);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const availablePeriods = useMemo(() => analytics.map((a) => a.period), [analytics]);
  useEffect(() => {
    if (availablePeriods.length > 0 && !availablePeriods.includes(selectedPeriod)) {
      setSelectedPeriod(availablePeriods[0]);
    }
  }, [availablePeriods, selectedPeriod]);

  const currentAnalytics = useMemo(() => {
    return analytics.find((a) => a.period === selectedPeriod);
  }, [analytics, selectedPeriod]);

  const sortedInsights = useMemo(() => {
    if (!currentAnalytics?.insights) return [];
    return [...currentAnalytics.insights].sort((a, b) => {
      const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority as Priority] - priorityOrder[b.priority as Priority];
    });
  }, [currentAnalytics?.insights]);

  if (loading) {
    return <LoadingDots />;
  }

  return (
    <div className="space-y-6">
      <PageTitle title={t("title")} description={t("subtitle")} />

      {error && <AlertMessage message={error} variant="danger" />}

      {analytics.length > 0 ? (
        <>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            availablePeriods={analytics.map((a) => a.period)}
          />

          {currentAnalytics?.generated_at && (
            <div className="text-sm text-text-secondary">
              {tc("lastUpdated", { date: formatDate(currentAnalytics.generated_at) })}
            </div>
          )}

          {currentAnalytics ? (
            <>
              <SectionCard title={t("featureImportance")}>
                <div className="space-y-4">
                  {Object.entries(currentAnalytics.feature_importance).map(([key, value]) => {
                    const label =
                      METRIC_LABELS[key as MetricKey]?.[
                        locale as keyof (typeof METRIC_LABELS)[MetricKey]
                      ] || key;
                    const percentage = (value * 100).toFixed(0);

                    return (
                      <div key={key}>
                        <div className="mb-1 flex justify-between">
                          <span className="text-text-label">{label}</span>
                          <span className="text-sm text-text-secondary">{percentage}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-indigo-600 transition-all dark:bg-indigo-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard title={t("insights")}>
                {sortedInsights.length > 0 ? (
                  <div className="space-y-4">
                    {sortedInsights.map((insight, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/50"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <PriorityBadge priority={insight.priority} />
                        </div>
                        <p className="text-text-primary">
                          {t(`items.${insight.insight}`, insight.parameters)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="📊" title={t("insightsEmpty")} />
                )}
              </SectionCard>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <EmptyState icon="📊" title={tc("notEnoughData")} description={tc("notEnoughDataDesc")} />
      )}

      <TipCard
        title={t("goToRecommendations")}
        description={t("goToRecommendationsDesc")}
        action={<Button href={`/${locale}/recommendations`}>{tc("go")}</Button>}
      />
    </div>
  );
}
