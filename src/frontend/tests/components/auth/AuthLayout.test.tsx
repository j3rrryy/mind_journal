import { render, screen } from "@testing-library/react";
import { AuthLayout } from "@/components/auth/AuthLayout";

jest.mock("next-intl", () => ({
  useLocale: jest.fn(() => "ru"),
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
  Logo: ({ size }: { size?: number }) => <svg data-testid="logo" width={size} height={size} />,
}));

describe("AuthLayout", () => {
  it("renders children", () => {
    render(<AuthLayout>Form content</AuthLayout>);
    expect(screen.getByText("Form content")).toBeInTheDocument();
  });

  it("renders logo and title", () => {
    render(<AuthLayout>Content</AuthLayout>);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByText("MindJournal")).toBeInTheDocument();
  });
});
