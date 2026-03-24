import { render, screen } from "@testing-library/react";
import { MetricCard } from "@/components/metrics/MetricCard";

jest.mock("next-intl", () => ({
  useLocale: jest.fn(() => "en"),
}));

jest.mock("@/lib/utils/metrics", () => ({
  getMetricBackgroundClass: jest.fn(() => "bg-green-100"),
  getMetricTextColorClass: jest.fn(() => "text-green-700"),
  formatMetricValue: jest.fn((value) => (value !== null ? String(value) : "--")),
  getMetricLabel: jest.fn((key) => key),
  getMetricUnit: jest.fn(() => "h"),
}));

jest.mock("@/components/metrics/ChangeIndicator", () => ({
  ChangeIndicator: ({ change }: { change: number }) => (
    <span data-testid="change">
      {change > 0 ? "+" : ""}
      {change}
    </span>
  ),
}));

describe("MetricCard", () => {
  it("renders with value", () => {
    render(<MetricCard metricKey="mood" value={8} />);
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("renders null value as dash", () => {
    render(<MetricCard metricKey="mood" value={null} />);
    expect(screen.getByText("--")).toBeInTheDocument();
  });

  it("renders change indicator when provided", () => {
    render(<MetricCard metricKey="mood" value={8} change={2} />);
    expect(screen.getByTestId("change")).toBeInTheDocument();
  });

  it("passes max prop", () => {
    render(<MetricCard metricKey="sleep_hours" value={7} max={24} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});
