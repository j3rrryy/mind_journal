import { render, screen } from "@testing-library/react";
import { ChangeIndicator } from "@/components/metrics/ChangeIndicator";

describe("ChangeIndicator", () => {
  it("renders positive change with up arrow", () => {
    render(<ChangeIndicator change={5.5} />);
    expect(screen.getByText("▲")).toBeInTheDocument();
    expect(screen.getByText("5.5")).toBeInTheDocument();
  });

  it("renders negative change with down arrow", () => {
    render(<ChangeIndicator change={-3.2} />);
    expect(screen.getByText("▼")).toBeInTheDocument();
    expect(screen.getByText("-3.2")).toBeInTheDocument();
  });

  it("renders zero with down arrow", () => {
    render(<ChangeIndicator change={0} />);
    expect(screen.getByText("▼")).toBeInTheDocument();
    expect(screen.getByText("0.0")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<ChangeIndicator change={2} className="text-green-500" />);
    expect(screen.getByText("▲").parentElement).toHaveClass("text-green-500");
  });
});
