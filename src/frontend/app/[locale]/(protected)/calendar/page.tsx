"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getRecordsAction, upsertRecordAction } from "@/app/actions/wellness";
import { useTranslations } from "next-intl";
import { LoadingDots } from "@/components/common/LoadingDots";
import { PageTitle } from "@/components/layout/PageTitle";
import { AlertMessage } from "@/components/common/AlertMessage";
import { RecordModal } from "@/components/metrics/RecordModal";
import { Calendar } from "@/components/calendar/Calendar";
import { Charts } from "@/components/calendar/Charts";
import { TabNavigation } from "@/components/layout/TabNavigation";
import type { RecordInfo, Metrics } from "@/types";
import { type MetricKey } from "@/lib/constants/metrics";

export default function CalendarPage() {
  const t = useTranslations("calendar");
  const tc = useTranslations("common");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<RecordInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"calendar" | "charts">("calendar");
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>([
    "mood",
    "sleep_hours",
    "activity",
    "stress",
    "energy",
    "focus",
  ]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRecordsAction(year, month + 1);
      if (response.ok) {
        setRecords(response.data.records as RecordInfo[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading calendar");
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(year, month - 1, 1));
  }, [year, month]);

  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(year, month + 1, 1));
  }, [year, month]);

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
          await fetchRecords();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error saving record");
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchRecords]
  );

  const today = useMemo(() => new Date(), []);
  const isCurrentMonth = useMemo(
    () => year === today.getFullYear() && month === today.getMonth(),
    [year, month, today]
  );

  const isFutureDate = useCallback(
    (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      return dateStr > todayStr;
    },
    [year, month, today]
  );

  const selectedRecord = useMemo(() => {
    if (!selectedDate) return null;
    return records.find((r) => r.date === selectedDate);
  }, [selectedDate, records]);

  const toggleMetric = useCallback((metric: MetricKey) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  }, []);

  const calendarTabs = useMemo(
    () => [
      { id: "calendar", label: t("tabs.calendar") },
      { id: "charts", label: t("tabs.charts") },
    ],
    [t]
  );

  if (loading) {
    return <LoadingDots />;
  }

  return (
    <div className="space-y-6">
      <PageTitle title={t("title")} description={t("subtitle")} />

      {error && <AlertMessage message={error} variant="danger" />}

      <TabNavigation
        tabs={calendarTabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as "calendar" | "charts")}
        variant="underline"
        size="md"
      />

      {activeTab === "calendar" ? (
        <Calendar
          year={year}
          month={month}
          records={records}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          isCurrentMonth={isCurrentMonth}
          onAddRecord={handleOpenModal}
          selectedRecord={selectedRecord}
          isFutureDate={isFutureDate}
        />
      ) : (
        <Charts
          records={records}
          year={year}
          month={month}
          selectedMetrics={selectedMetrics}
          onToggleMetric={toggleMetric}
        />
      )}

      <RecordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        date={selectedDate || ""}
        initialMetrics={selectedRecord?.metrics}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        title={selectedRecord ? tc("editRecord") : tc("addRecord")}
        editLabel={tc("editRecord")}
        addLabel={tc("addRecord")}
      />
    </div>
  );
}
