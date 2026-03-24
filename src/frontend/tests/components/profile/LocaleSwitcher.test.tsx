import { render, screen } from "@testing-library/react";
import LocaleSwitcher from "@/components/profile/LocaleSwitcher";

jest.mock("next-intl", () => ({
  useLocale: jest.fn(() => "ru"),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/ru/dashboard"),
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe("LocaleSwitcher", () => {
  it("renders both locale buttons", () => {
    render(<LocaleSwitcher />);
    expect(screen.getByAltText("RU")).toBeInTheDocument();
    expect(screen.getByAltText("GB")).toBeInTheDocument();
  });

  it("renders locale labels on larger screens", () => {
    render(<LocaleSwitcher />);
    expect(screen.getByText("RU")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });
});
