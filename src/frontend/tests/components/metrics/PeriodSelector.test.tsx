import { render, screen, fireEvent } from "@testing-library/react";
import { PeriodSelector } from "@/components/metrics/PeriodSelector";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      "periods.week": "Week",
      "periods.month": "Month",
      "periods.quarter": "Quarter",
      "periods.half_year": "Half Year",
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
        availablePeriods={["week", "month", "quarter", "half_year", "year"]}
      />
    );
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Quarter")).toBeInTheDocument();
    expect(screen.getByText("Half Year")).toBeInTheDocument();
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

  it("disables buttons without data", () => {
    render(
      <PeriodSelector
        selectedPeriod="week"
        onPeriodChange={jest.fn()}
        availablePeriods={["week"]}
      />
    );
    const weekButton = screen.getByText("Week");
    const monthButton = screen.getByText("Month");
    const yearButton = screen.getByText("Year");
    expect(weekButton).not.toBeDisabled();
    expect(monthButton).toBeDisabled();
    expect(yearButton).toBeDisabled();
  });

  it("does not call onChange when clicking disabled button", () => {
    const onChange = jest.fn();
    render(
      <PeriodSelector selectedPeriod="week" onPeriodChange={onChange} availablePeriods={["week"]} />
    );
    fireEvent.click(screen.getByText("Month"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
