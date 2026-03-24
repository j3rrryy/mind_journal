import { render } from "@testing-library/react";
import { Charts } from "@/components/calendar/Charts";
import { RecordInfo } from "@/types";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => key),
  useLocale: jest.fn(() => "en"),
}));

jest.mock("recharts", () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Legend: () => null,
}));

jest.mock("@/components/layout/Card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
}));

jest.mock("@/components/layout/SectionCard", () => ({
  SectionCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section-card">{children}</div>
  ),
}));

jest.mock("@/lib/utils/metrics", () => ({
  getMetricLabel: jest.fn((key: string) => key),
  getMetricUnit: jest.fn(() => "h"),
}));

describe("Charts", () => {
  it("renders without crashing with data", () => {
    const mockRecords = [
      {
        date: "2024-01-01",
        metrics: { mood: 7, sleep_hours: 7, activity: 5, stress: 3, energy: 6, focus: 5 },
      },
    ] as RecordInfo[];

    const { container } = render(
      <Charts
        records={mockRecords}
        year={2024}
        month={0}
        selectedMetrics={["mood"]}
        onToggleMetric={jest.fn()}
      />
    );
    expect(container.querySelector('[data-testid="section-card"]')).toBeInTheDocument();
  });

  it("renders without crashing with empty records", () => {
    const { container } = render(
      <Charts
        records={[]}
        year={2024}
        month={0}
        selectedMetrics={["mood"]}
        onToggleMetric={jest.fn()}
      />
    );
    expect(container.querySelector('[data-testid="card"]')).toBeInTheDocument();
  });
});
