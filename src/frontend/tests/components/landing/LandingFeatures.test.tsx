import { render, screen } from "@testing-library/react";
import LandingFeatures from "@/components/landing/LandingFeatures";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      title: "Features",
      "daily.title": "Daily Tracking",
      "daily.description": "Track your daily wellness",
      "dashboard.title": "Dashboard",
      "dashboard.description": "View your progress",
      "analytics.title": "Analytics",
      "analytics.description": "Analyze trends",
      "recommendations.title": "Recommendations",
      "recommendations.description": "Get suggestions",
      "calendar.title": "Calendar",
      "calendar.description": "See your history",
      "insights.title": "Insights",
      "insights.description": "Discover patterns",
    };
    return translations[key] || key;
  }),
}));

describe("LandingFeatures", () => {
  it("renders title", () => {
    render(<LandingFeatures />);
    expect(screen.getByText("Features")).toBeInTheDocument();
  });

  it("renders all feature cards", () => {
    render(<LandingFeatures />);
    expect(screen.getByText("Daily Tracking")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Recommendations")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Insights")).toBeInTheDocument();
  });
});
