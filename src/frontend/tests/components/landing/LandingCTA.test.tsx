import { render, screen } from "@testing-library/react";
import LandingCTA from "@/components/landing/LandingCTA";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((ns: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      "landing.cta": { title: "Start Your Journey", button: "Get Started" },
      common: { login: "Log In" },
    };
    return translations[ns]?.[key] || key;
  }),
  useLocale: jest.fn(() => "en"),
}));

jest.mock("@/components/common/Button", () => ({
  Button: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("LandingCTA", () => {
  it("renders title", () => {
    render(<LandingCTA />);
    expect(screen.getByText("Start Your Journey")).toBeInTheDocument();
  });

  it("renders buttons", () => {
    render(<LandingCTA />);
    expect(screen.getByText("Get Started")).toBeInTheDocument();
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });
});
