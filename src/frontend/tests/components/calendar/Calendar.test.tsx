import { render } from "@testing-library/react";
import { Calendar } from "@/components/calendar/Calendar";
import { RecordInfo } from "@/types";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => key),
  useLocale: jest.fn(() => "en"),
}));

jest.mock("@/components/layout/Card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
}));

jest.mock("@/components/layout/SectionCard", () => ({
  SectionCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section-card">{children}</div>
  ),
}));

jest.mock("@/components/common/Button", () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock("@/components/metrics/MetricsGrid", () => ({
  MetricsGrid: ({ metrics }: { metrics: RecordInfo[] }) => (
    <div data-testid="metrics-grid">{JSON.stringify(metrics)}</div>
  ),
}));

jest.mock("@/lib/utils/date", () => ({
  getDaysInMonth: jest.fn(() => 31),
  getFirstDayOfMonth: jest.fn(() => 1),
  getMonthName: jest.fn(() => "January"),
  getDayOfWeekNames: jest.fn(() => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]),
  formatDateShort: jest.fn(() => "Jan 1"),
}));

jest.mock("@/lib/utils/metrics", () => ({
  getMoodBarColor: jest.fn(() => "bg-green-500"),
}));

describe("Calendar", () => {
  it("renders without crashing", () => {
    const mockRecords = [
      {
        date: "2024-01-15",
        metrics: { mood: 7, sleep_hours: 7, activity: 5, stress: 3, energy: 6, focus: 5 },
      },
    ] as RecordInfo[];

    const { container } = render(
      <Calendar
        year={2024}
        month={0}
        records={mockRecords}
        selectedDate={null}
        onDateSelect={jest.fn()}
        onPrevMonth={jest.fn()}
        onNextMonth={jest.fn()}
        isCurrentMonth={false}
        onAddRecord={jest.fn()}
        isFutureDate={() => false}
      />
    );
    expect(container.querySelector('[data-testid="card"]')).toBeInTheDocument();
  });

  it("renders with selected date", () => {
    const mockRecords = [
      {
        date: "2024-01-15",
        metrics: { mood: 7, sleep_hours: 7, activity: 5, stress: 3, energy: 6, focus: 5 },
      },
    ] as RecordInfo[];

    const { container } = render(
      <Calendar
        year={2024}
        month={0}
        records={mockRecords}
        selectedDate="2024-01-15"
        onDateSelect={jest.fn()}
        onPrevMonth={jest.fn()}
        onNextMonth={jest.fn()}
        isCurrentMonth={true}
        onAddRecord={jest.fn()}
        selectedRecord={mockRecords[0]}
        isFutureDate={() => false}
      />
    );
    expect(container.querySelector('[data-testid="section-card"]')).toBeInTheDocument();
  });
});
