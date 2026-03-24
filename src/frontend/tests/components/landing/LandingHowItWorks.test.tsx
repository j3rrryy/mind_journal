import { render, screen } from "@testing-library/react";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      title: "How It Works",
      step: "Step",
      "step1.title": "Sign Up",
      "step1.description": "Create your account",
      "step2.title": "Track Daily",
      "step2.description": "Log your metrics",
      "step3.title": "Improve",
      "step3.description": "Get insights and improve",
    };
    return translations[key] || key;
  }),
}));

describe("LandingHowItWorks", () => {
  it("renders title", () => {
    render(<LandingHowItWorks />);
    expect(screen.getByText("How It Works")).toBeInTheDocument();
  });

  it("renders all steps", () => {
    render(<LandingHowItWorks />);
    expect(screen.getByText(/step 1/i)).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Track Daily")).toBeInTheDocument();
    expect(screen.getByText("Improve")).toBeInTheDocument();
  });
});
