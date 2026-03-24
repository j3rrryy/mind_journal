import { render, screen } from "@testing-library/react";
import { PriorityBadge } from "@/components/metrics/PriorityBadge";
import { useLocale } from "next-intl";
import { getPriorityColorClasses, getPriorityLabel } from "@/lib/utils/priority";

jest.mock("next-intl", () => ({
  useLocale: jest.fn(),
}));

jest.mock("@/lib/utils/priority", () => ({
  getPriorityColorClasses: jest.fn(),
  getPriorityLabel: jest.fn(),
}));

const mockUseLocale = useLocale as jest.Mock;
const mockGetPriorityColorClasses = getPriorityColorClasses as jest.Mock;
const mockGetPriorityLabel = getPriorityLabel as jest.Mock;

describe("PriorityBadge", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocale.mockReturnValue("ru");
    mockGetPriorityColorClasses.mockReturnValue("bg-red-100 text-red-800");
    mockGetPriorityLabel.mockReturnValue("Высокий");
  });

  it("renders with default size", () => {
    render(<PriorityBadge priority="high" />);
    const badge = screen.getByText("Высокий");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("px-3 py-1");
  });

  it("renders with small size", () => {
    render(<PriorityBadge priority="high" size="sm" />);
    expect(screen.getByText("Высокий")).toHaveClass("px-2 py-0.5");
  });

  it("calls utils with correct arguments", () => {
    render(<PriorityBadge priority="medium" />);
    expect(mockGetPriorityColorClasses).toHaveBeenCalledWith("medium");
    expect(mockGetPriorityLabel).toHaveBeenCalledWith("medium", "ru");
  });
});
