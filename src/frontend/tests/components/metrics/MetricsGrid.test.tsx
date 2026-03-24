import { render, screen } from "@testing-library/react";
import { MetricsGrid } from "@/components/metrics/MetricsGrid";
import { METRIC_LIST } from "@/lib/constants/metrics";

jest.mock("@/components/metrics/MetricCard", () => ({
  MetricCard: ({ metricKey }: { metricKey: string }) => (
    <div data-testid="metric-card">{metricKey}</div>
  ),
}));

describe("MetricsGrid", () => {
  const mockMetrics: Record<string, number> = {
    mood: 8,
    sleep_hours: 7.5,
    activity: 6,
    stress: 3,
    energy: 7,
    focus: 5,
  };

  it("renders all metrics from METRIC_LIST", () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    METRIC_LIST.forEach((key) => {
      expect(screen.getByText(key)).toBeInTheDocument();
    });
  });

  it("passes changes to MetricCard", () => {
    const changes: Record<string, number> = { mood: 2, sleep_hours: -1 };
    render(<MetricsGrid metrics={mockMetrics} changes={changes} />);
    const cards = screen.getAllByTestId("metric-card");
    expect(cards).toHaveLength(METRIC_LIST.length);
  });

  it("passes forceDecimals prop", () => {
    render(<MetricsGrid metrics={mockMetrics} forceDecimals />);
    const cards = screen.getAllByTestId("metric-card");
    expect(cards).toHaveLength(METRIC_LIST.length);
  });
});
