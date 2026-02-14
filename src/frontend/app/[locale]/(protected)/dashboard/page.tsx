"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { getDashboardAction, upsertRecordAction } from "@/app/actions/wellness";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { LoadingDots } from "@/components/common/LoadingDots";
import { EmptyState } from "@/components/metrics/EmptyState";
import { PageTitle } from "@/components/layout/PageTitle";
import { AlertMessage } from "@/components/common/AlertMessage";
import { SectionCard } from "@/components/layout/SectionCard";
import { MetricsGrid } from "@/components/metrics/MetricsGrid";
import { Button } from "@/components/common/Button";
import { RecordModal } from "@/components/metrics/RecordModal";
import { getTodayISO } from "@/lib/utils/date";
import type { MetricKey } from "@/lib/constants/metrics";
import type { Dashboard, Metrics } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");
  const locale = useLocale();

  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayISO = useMemo(() => getTodayISO(), []);

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await getDashboardAction(todayISO);
      if (response.ok) {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  }, [todayISO]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const todayMetrics = useMemo(() => {
    if (!data?.today) return null;
    return data.today as Record<MetricKey, number>;
  }, [data?.today]);

  const weekMetrics = useMemo(() => {
    if (!data?.week) return null;
    return data.week as Record<MetricKey, number>;
  }, [data?.week]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (date: string, metrics: Metrics) => {
      setIsSubmitting(true);
      try {
        const result = await upsertRecordAction(date, metrics);
        if (result && !result.ok) {
          setError(result.error || "Error saving record");
        } else {
          await fetchDashboard();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error saving record");
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchDashboard]
  );

  const navigationCards = useMemo(
    () => [
      {
        href: `/${locale}/calendar`,
        icon: "📅",
        titleKey: "calendar",
        description: t("goToCalendar"),
        color: "bg-purple-100 dark:bg-purple-900/30",
      },
      {
        href: `/${locale}/analytics`,
        icon: "📈",
        titleKey: "analytics",
        description: t("goToAnalytics"),
        color: "bg-blue-100 dark:bg-blue-900/30",
      },
      {
        href: `/${locale}/recommendations`,
        icon: "💡",
        titleKey: "recommendations",
        description: t("goToRecommendations"),
        color: "bg-yellow-100 dark:bg-yellow-900/30",
      },
    ],
    [locale, t]
  );

  if (loading) {
    return <LoadingDots />;
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title={t("welcome", { username: user?.username || "" })}
        description={t("subtitle")}
      />

      {error && <AlertMessage message={error} variant="danger" />}

      <SectionCard
        title={t("today")}
        action={
          <Button onClick={handleOpenModal}>
            {todayMetrics ? tc("editRecord") : tc("addRecord")}
          </Button>
        }
      >
        {todayMetrics ? (
          <MetricsGrid metrics={todayMetrics} />
        ) : (
          <EmptyState icon="📝" title={t("noRecordToday")} description="" />
        )}
      </SectionCard>

      <SectionCard title={t("weeklyAverage")}>
        {weekMetrics && <MetricsGrid metrics={weekMetrics} forceDecimals />}
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {navigationCards.map((card) => (
          <Link key={card.href} href={card.href} className="group card-surface-hover">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg ${card.color} p-3 text-2xl`}>{card.icon}</div>
              <div>
                <h3 className="font-semibold text-text-primary">{tn(card.titleKey)}</h3>
                <p className="text-sm text-text-secondary group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {card.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <RecordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        date={todayISO}
        initialMetrics={todayMetrics || undefined}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        title={todayMetrics ? tc("editRecord") : tc("addRecord")}
        editLabel={tc("editRecord")}
        addLabel={tc("addRecord")}
      />
    </div>
  );
}
