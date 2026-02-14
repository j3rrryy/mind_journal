"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getRecordsAction, upsertRecordAction } from "@/app/actions/wellness";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/layout/Card";
import { LoadingDots } from "@/components/common/LoadingDots";
import { PageTitle } from "@/components/layout/PageTitle";
import { AlertMessage } from "@/components/common/AlertMessage";
import { SectionCard } from "@/components/layout/SectionCard";
import { MetricsGrid } from "@/components/metrics/MetricsGrid";
import { Button } from "@/components/common/Button";
import { RecordModal } from "@/components/metrics/RecordModal";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  getDayOfWeekNames,
  formatDateShort,
} from "@/lib/utils/date";
import { getMoodBarColor } from "@/lib/utils/metrics";
import type { RecordInfo, Metrics } from "@/types";

export default function CalendarPage() {
  const t = useTranslations("calendar");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<RecordInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const getRecordForDate = useCallback(
    (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return records.find((r) => r.date === dateStr);
    },
    [year, month, records]
  );

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

  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const firstDay = useMemo(() => getFirstDayOfMonth(year, month), [year, month]);
  const monthName = useMemo(() => getMonthName(month, locale), [month, locale]);
  const dayNames = useMemo(() => getDayOfWeekNames(locale), [locale]);

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

  if (loading) {
    return <LoadingDots />;
  }

  return (
    <div className="space-y-6">
      <PageTitle title={t("title")} description={t("subtitle")} />

      {error && <AlertMessage message={error} variant="danger" />}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary order-first sm:order-none text-center min-w-[120px]">
          {monthName} {year}
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={prevMonth}
            className="flex-1 sm:flex-none text-sm px-2 sm:px-4"
          >
            {t("prevMonth")}
          </Button>
          <Button
            variant="secondary"
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="flex-1 sm:flex-none text-sm px-2 sm:px-4"
          >
            {t("nextMonth")}
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="py-1 sm:py-2 text-center text-xs sm:text-sm text-text-secondary"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 sm:h-16" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const record = getRecordForDate(day);
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = selectedDate === dateStr;
            const isFuture = isFutureDate(day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                disabled={isFuture}
                className={`relative h-10 sm:h-16 rounded-lg border p-0.5 sm:p-1 transition-all ${
                  isFuture
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50"
                    : record
                      ? "border-indigo-300 bg-indigo-50 hover:border-indigo-400 dark:border-indigo-700 dark:bg-indigo-900/20 dark:hover:border-indigo-600"
                      : "border-gray-200 bg-white hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-700"
                } ${isSelected && !isFuture ? "ring-2 ring-indigo-400 dark:ring-indigo-600" : ""}`}
              >
                <span
                  className={`text-xs sm:text-sm ${isFuture ? "text-text-muted dark:text-text-muted" : "text-text-label"}`}
                >
                  {day}
                </span>
                {record && !isFuture && (
                  <div
                    className={`absolute bottom-1 left-1 right-1 h-1.5 rounded-full ${getMoodBarColor(record.metrics.mood)}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {selectedDate && (
        <SectionCard
          title={t("recordFor", { date: formatDateShort(selectedDate, locale) })}
          action={
            !isFutureDate(parseInt(selectedDate.split("-")[2])) && (
              <Button onClick={handleOpenModal}>
                {selectedRecord ? tc("editRecord") : tc("addRecord")}
              </Button>
            )
          }
        >
          {selectedRecord ? (
            <MetricsGrid metrics={selectedRecord.metrics} />
          ) : (
            <p className="text-center text-text-muted">
              {isFutureDate(parseInt(selectedDate.split("-")[2])) ? t("futureDate") : t("noRecord")}
            </p>
          )}
        </SectionCard>
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
