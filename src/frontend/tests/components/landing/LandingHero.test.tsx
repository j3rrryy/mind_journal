import { render, screen } from "@testing-library/react";
import LandingHero from "@/components/landing/LandingHero";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((ns: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      "landing.hero": {
        title: "Track Your Mind",
        subtitle: "Your personal wellness companion",
        cta: "Get Started",
      },
      common: { login: "Log In" },
    };
    return translations[ns]?.[key] || key;
  }),
  useLocale: jest.fn(() => "en"),
}));

jest.mock("@/components/profile/LocaleSwitcher", () => ({
  __esModule: true,
  default: () => <div data-testid="locale-switcher" />,
}));

jest.mock("@/components/common/Button", () => ({
  Button: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("LandingHero", () => {
  it("renders title and subtitle", () => {
    render(<LandingHero />);
    expect(screen.getByText("Track Your Mind")).toBeInTheDocument();
    expect(screen.getByText("Your personal wellness companion")).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    render(<LandingHero />);
    expect(screen.getByText("Get Started")).toBeInTheDocument();
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });

  it("renders locale switcher", () => {
    render(<LandingHero />);
    expect(screen.getByTestId("locale-switcher")).toBeInTheDocument();
  });
});
