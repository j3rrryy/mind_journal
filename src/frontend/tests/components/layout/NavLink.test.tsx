import { render, screen } from "@testing-library/react";
import { NavLink } from "@/components/layout/NavLink";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("next/link", () => {
  return function MockLink({
    href,
    className,
    children,
  }: {
    href: string;
    className: string;
    children: React.ReactNode;
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

const mockUsePathname = usePathname as jest.Mock;

describe("NavLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders link with active class when path matches", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<NavLink href="/dashboard">Dashboard</NavLink>);
    const link = screen.getByRole("link", { name: /dashboard/i });
    expect(link).toHaveClass("text-link-active");
  });

  it("renders link with inactive class when path does not match", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<NavLink href="/profile">Profile</NavLink>);
    const link = screen.getByRole("link", { name: /profile/i });
    expect(link).toHaveClass("text-link-inactive-primary");
  });

  it("merges custom className", () => {
    mockUsePathname.mockReturnValue("/test");
    render(
      <NavLink href="/test" className="custom-class">
        Test
      </NavLink>
    );
    expect(screen.getByRole("link")).toHaveClass("custom-class");
  });
});
