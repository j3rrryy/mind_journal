import { render, screen } from "@testing-library/react";
import { AlertMessage } from "@/components/common/AlertMessage";

jest.mock("@/components/layout/Card", () => ({
  Card: ({
    children,
    variant,
    className,
  }: {
    children: React.ReactNode;
    variant: string;
    className: string;
  }) => (
    <div data-variant={variant} className={className}>
      {children}
    </div>
  ),
}));

describe("AlertMessage", () => {
  it("renders message with default danger variant", () => {
    render(<AlertMessage message="Error occurred" />);
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
    expect(screen.getByText("Error occurred")).toHaveClass("text-red-800");
  });

  it("applies success variant classes", () => {
    render(<AlertMessage message="Success!" variant="success" />);
    expect(screen.getByText("Success!")).toHaveClass("text-green-800");
  });

  it("applies warning variant classes", () => {
    render(<AlertMessage message="Warning!" variant="warning" />);
    expect(screen.getByText("Warning!")).toHaveClass("text-yellow-800");
  });

  it("renders action when provided", () => {
    render(<AlertMessage message="Error" action={<button>Retry</button>} />);
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
