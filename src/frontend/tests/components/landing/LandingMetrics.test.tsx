import { render, screen } from "@testing-library/react";
import LandingMetrics from "@/components/landing/LandingMetrics";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      title: "What You Track",
      "mood.name": "Mood",
      "mood.description": "How you feel",
      "sleep_hours.name": "Sleep",
      "sleep_hours.description": "Hours slept",
      "activity.name": "Activity",
      "activity.description": "Physical activity",
      "stress.name": "Stress",
      "stress.description": "Stress level",
      "energy.name": "Energy",
      "energy.description": "Energy level",
      "focus.name": "Focus",
      "focus.description": "Focus ability",
    };
    return translations[key] || key;
  }),
}));

jest.mock("@/lib/constants/metrics", () => ({
  METRIC_LIST: ["mood", "sleep_hours", "activity", "stress", "energy", "focus"],
}));

describe("LandingMetrics", () => {
  it("renders title", () => {
    render(<LandingMetrics />);
    expect(screen.getByText("What You Track")).toBeInTheDocument();
  });

  it("renders all metric items", () => {
    render(<LandingMetrics />);
    expect(screen.getByText("Mood")).toBeInTheDocument();
    expect(screen.getByText("Sleep")).toBeInTheDocument();
    expect(screen.getByText("Activity")).toBeInTheDocument();
  });
});
