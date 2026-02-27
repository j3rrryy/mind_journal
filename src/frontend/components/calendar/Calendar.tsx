"use client";

import { useMemo, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/layout/Card";
import { SectionCard } from "@/components/layout/SectionCard";
import { Button } from "@/components/common/Button";
import { MetricsGrid } from "@/components/metrics/MetricsGrid";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  getDayOfWeekNames,
  formatDateShort,
} from "@/lib/utils/date";
import { getMoodBarColor } from "@/lib/utils/metrics";
import type { RecordInfo } from "@/types";

interface CalendarViewProps {
  year: number;
  month: number;
  records: RecordInfo[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isCurrentMonth: boolean;
  onAddRecord: () => void;
  selectedRecord?: RecordInfo | null;
  isFutureDate: (day: number) => boolean;
}

export function Calendar({
  year,
  month,
  records,
  selectedDate,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
  isCurrentMonth,
  onAddRecord,
  selectedRecord,
  isFutureDate,
}: CalendarViewProps) {
  const t = useTranslations("calendar");
  const tc = useTranslations("common");
  const locale = useLocale();

  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const firstDay = useMemo(() => getFirstDayOfMonth(year, month), [year, month]);
  const monthName = useMemo(() => getMonthName(month, locale), [month, locale]);
  const dayNames = useMemo(() => getDayOfWeekNames(locale), [locale]);

  const getRecordForDate = useCallback(
    (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return records.find((r) => r.date === dateStr);
    },
    [year, month, records]
  );

  const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
  const selectedDay = selectedDateObj?.getDate();

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary order-first sm:order-none text-center min-w-[120px]">
          {monthName} {year}
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={onPrevMonth}
            className="flex-1 sm:flex-none text-sm px-2 sm:px-4"
          >
            {t("prevMonth")}
          </Button>
          <Button
            variant="secondary"
            onClick={onNextMonth}
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
                onClick={() => onDateSelect(dateStr)}
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
            selectedDay &&
            !isFutureDate(selectedDay) && (
              <Button onClick={onAddRecord}>
                {selectedRecord ? tc("editRecord") : tc("addRecord")}
              </Button>
            )
          }
        >
          {selectedRecord ? (
            <MetricsGrid metrics={selectedRecord.metrics} />
          ) : (
            <p className="text-center text-text-muted">
              {selectedDay && isFutureDate(selectedDay) ? t("futureDate") : t("noRecord")}
            </p>
          )}
        </SectionCard>
      )}
    </>
  );
}
