"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getRecommendationsAction } from "@/app/actions/wellness";
import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/layout/Card";
import { LoadingDots } from "@/components/common/LoadingDots";
import { EmptyState } from "@/components/metrics/EmptyState";
import { PageTitle } from "@/components/layout/PageTitle";
import { AlertMessage } from "@/components/common/AlertMessage";
import { TipCard } from "@/components/common/TipCard";
import { PriorityBadge } from "@/components/metrics/PriorityBadge";
import { sortByPriority } from "@/lib/utils/priority";
import { formatDate } from "@/lib/utils/date";
import type { Recommendations } from "@/types";

export default function RecommendationsPage() {
  const t = useTranslations("recommendations");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [data, setData] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRecommendationsAction();
      if (response.ok) {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading recommendations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const sortedRecommendations = useMemo(() => {
    if (!data?.recommendations) return [];
    return sortByPriority(data.recommendations);
  }, [data?.recommendations]);

  if (loading) {
    return <LoadingDots />;
  }

  return (
    <div className="space-y-6">
      <PageTitle title={t("title")} description={t("subtitle")} />

      {error && <AlertMessage message={error} variant="danger" />}

      {sortedRecommendations.length > 0 ? (
        <>
          {data?.generated_at && (
            <div className="text-sm text-text-secondary">
              {tc("lastUpdated", { date: formatDate(data.generated_at, locale) })}
            </div>
          )}

          <div className="space-y-4">
            {sortedRecommendations.map((rec, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={rec.priority} />
                  </div>
                </div>
                <p className="text-lg text-text-primary">
                  {t(`items.${rec.recommendation}`, rec.parameters)}
                </p>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon="chart"
          title={tc("notEnoughData")}
          description={tc("notEnoughDataDesc")}
        />
      )}

      <TipCard title={t("tip")} description={t("tipDesc")} />
    </div>
  );
}
