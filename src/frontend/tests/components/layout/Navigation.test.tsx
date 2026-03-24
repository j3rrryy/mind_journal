import { render, screen } from "@testing-library/react";
import Navigation from "@/components/layout/Navigation";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      "nav.dashboard": "Dashboard",
      "nav.calendar": "Calendar",
      "nav.analytics": "Analytics",
      "nav.recommendations": "Recommendations",
      "nav.profile": "Profile",
    };
    return translations[key] || key;
  }),
  useLocale: jest.fn(() => "ru"),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/ru/dashboard"),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

jest.mock("@/components/icons/Logo", () => ({
  Logo: () => <svg data-testid="logo" />,
}));

jest.mock("@/components/layout/NavLink", () => ({
  NavLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Navigation", () => {
  it("renders logo and brand name", () => {
    render(<Navigation />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByText("MindJournal")).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    render(<Navigation />);
    const dashboards = screen.getAllByText("dashboard");
    expect(dashboards).toHaveLength(2);
    expect(screen.getAllByText("calendar")).toHaveLength(2);
    expect(screen.getAllByText("analytics")).toHaveLength(2);
  });
});
