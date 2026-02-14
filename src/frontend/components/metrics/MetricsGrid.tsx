import { MetricCard } from "@/components/metrics/MetricCard";
import { METRIC_LIST, type MetricKey } from "@/lib/constants/metrics";

interface MetricsGridProps {
  metrics: Record<MetricKey, number>;
  forceDecimals?: boolean;
}

export function MetricsGrid({ metrics, forceDecimals }: MetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {METRIC_LIST.map((key) => (
        <MetricCard
          key={key}
          metricKey={key}
          value={metrics[key]}
          max={key === "sleep_hours" ? 24 : 10}
          forceDecimals={forceDecimals}
        />
      ))}
    </div>
  );
}
