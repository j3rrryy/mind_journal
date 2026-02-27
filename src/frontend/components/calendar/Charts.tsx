"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/layout/Card";
import { SectionCard } from "@/components/layout/SectionCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { METRIC_LIST, type MetricKey } from "@/lib/constants/metrics";
import { formatDateShort } from "@/lib/utils/date";
import type { RecordInfo } from "@/types";
import { getMetricLabel, getMetricUnit } from "@/lib/utils/metrics";

interface ChartsViewProps {
  records: RecordInfo[];
  year: number;
  month: number;
  selectedMetrics: MetricKey[];
  onToggleMetric: (metric: MetricKey) => void;
}

interface ChartDataPoint {
  date: string;
  fullDate: string;
  mood: number;
  sleep_hours: number;
  sleep_hours_normalized: number;
  activity: number;
  stress: number;
  energy: number;
  focus: number;
  [key: string]: string | number;
}

const COLORS: Record<MetricKey, string> = {
  mood: "#8884d8",
  sleep_hours: "#00c49f",
  activity: "#ff7300",
  stress: "#ff2e63",
  energy: "#e6b800",
  focus: "#a259ff",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    name?: string;
    value?: number;
    color?: string;
    payload?: ChartDataPoint;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const locale = useLocale();

  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-text-primary font-medium mb-2">{label}</p>
      {payload.map((entry) => {
        const dataKey = entry.dataKey as string;
        const metric = dataKey.replace("_normalized", "") as MetricKey;
        const payloadData = entry.payload as ChartDataPoint;
        const originalValue = payloadData[metric];
        const unit = getMetricUnit(metric, locale);

        return (
          <div key={metric} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-text-secondary">{entry.name}:</span>
            <span className="text-text-primary font-medium">
              {Math.round(originalValue)} {unit}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export function Charts({ records, year, month, selectedMetrics, onToggleMetric }: ChartsViewProps) {
  const t = useTranslations("calendar");
  const locale = useLocale();

  const chartData = useMemo(() => {
    const monthRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate.getFullYear() === year && recordDate.getMonth() === month;
    });

    const sortedRecords = [...monthRecords].sort((a, b) => a.date.localeCompare(b.date));

    return sortedRecords.map((record) => {
      const dataPoint: ChartDataPoint = {
        date: formatDateShort(record.date, locale),
        fullDate: record.date,
        mood: 0,
        sleep_hours: 0,
        sleep_hours_normalized: 0,
        activity: 0,
        stress: 0,
        energy: 0,
        focus: 0,
      };

      METRIC_LIST.forEach((metric) => {
        const value = record.metrics[metric] ?? 0;
        dataPoint[metric] = value;

        if (metric === "sleep_hours") {
          dataPoint[`${metric}_normalized`] = (value / 24) * 10;
        }
      });

      return dataPoint;
    });
  }, [records, year, month, locale]);

  return (
    <>
      <SectionCard title={t("selectMetrics")}>
        <div className="flex flex-wrap gap-2">
          {METRIC_LIST.map((metric) => {
            const isSelected = selectedMetrics.includes(metric);
            const label = getMetricLabel(metric, locale);

            return (
              <button
                key={metric}
                onClick={() => onToggleMetric(metric)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-indigo-500 text-white dark:bg-indigo-600"
                    : "bg-gray-100 text-text-secondary hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                }`}
                style={isSelected ? { backgroundColor: COLORS[metric] } : undefined}
              >
                {label}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {chartData.length > 0 ? (
        <Card>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  className="fill-text-secondary dark:fill-text-muted"
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, 10]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => Math.round(value).toString()}
                  className="fill-text-secondary dark:fill-text-muted"
                  label={{
                    value: t("yAxisLabel"),
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    dx: -10,
                    dy: 30,
                    className: "fill-text-secondary text-xs",
                  }}
                />
                {selectedMetrics.includes("sleep_hours") && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 10]}
                    tickFormatter={(value) => {
                      const hours = Math.round((value / 10) * 24);
                      return `${hours}`;
                    }}
                    tick={{ fontSize: 12 }}
                    className="fill-text-secondary dark:fill-text-muted"
                    label={{
                      value: t("sleepHoursLabel"),
                      angle: 90,
                      position: "insideRight",
                      offset: 10,
                      dx: 10,
                      dy: 30,
                      className: "fill-text-secondary text-xs",
                    }}
                  />
                )}
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {selectedMetrics.map((metric) => {
                  const isSleepHours = metric === "sleep_hours";
                  return (
                    <Line
                      key={metric}
                      yAxisId={isSleepHours ? "right" : "left"}
                      type="monotone"
                      dataKey={isSleepHours ? `${metric}_normalized` : metric}
                      name={getMetricLabel(metric, locale)}
                      stroke={COLORS[metric]}
                      strokeWidth={2}
                      dot={{ r: 3, fill: COLORS[metric] }}
                      activeDot={{ r: 6, fill: COLORS[metric] }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : (
        <Card>
          <p className="text-center text-text-muted py-8">{t("noDataForChart")}</p>
        </Card>
      )}
    </>
  );
}
