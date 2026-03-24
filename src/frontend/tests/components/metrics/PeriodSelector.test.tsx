import { render, screen, fireEvent } from "@testing-library/react";
import { PeriodSelector } from "@/components/metrics/PeriodSelector";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      "periods.week": "Week",
      "periods.month": "Month",
      "periods.year": "Year",
    };
    return translations[key] || key;
  }),
}));

describe("PeriodSelector", () => {
  it("renders all period buttons", () => {
    render(
      <PeriodSelector
        selectedPeriod="week"
        onPeriodChange={jest.fn()}
        availablePeriods={["week", "month", "year"]}
      />
    );
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
  });

  it("calls onPeriodChange when button clicked", () => {
    const onChange = jest.fn();
    render(
      <PeriodSelector
        selectedPeriod="week"
        onPeriodChange={onChange}
        availablePeriods={["week", "month"]}
      />
    );
    fireEvent.click(screen.getByText("Month"));
    expect(onChange).toHaveBeenCalledWith("month");
  });

  it("shows data indicator for periods with data", () => {
    render(
      <PeriodSelector
        selectedPeriod="week"
        onPeriodChange={jest.fn()}
        availablePeriods={["week", "month"]}
      />
    );
    expect(screen.getByText("Month").querySelector(".animate-ping")).toBeInTheDocument();
  });

  it("does not show data indicator for selected period", () => {
    render(
      <PeriodSelector
        selectedPeriod="week"
        onPeriodChange={jest.fn()}
        availablePeriods={["week"]}
      />
    );
    const button = screen.getByText("Week");
    expect(button.querySelector(".animate-ping")).not.toBeInTheDocument();
  });
});
