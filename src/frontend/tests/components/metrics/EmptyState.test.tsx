import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/metrics/EmptyState";

describe("EmptyState", () => {
  it("renders with required props", () => {
    render(<EmptyState title="No data" />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders with chart icon", () => {
    render(<EmptyState title="Empty" icon="chart" />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("renders with search icon", () => {
    render(<EmptyState title="Empty" icon="search" />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<EmptyState title="No data" description="Add some items" />);
    expect(screen.getByText("Add some items")).toBeInTheDocument();
  });

  it("renders action when provided", () => {
    render(<EmptyState title="Empty" action={<button>Add item</button>} />);
    expect(screen.getByRole("button", { name: /add item/i })).toBeInTheDocument();
  });

  it("does not render icon when empty string", () => {
    render(<EmptyState title="No icon" icon="" />);
    expect(screen.getByText("No icon")).toBeInTheDocument();
  });
});
