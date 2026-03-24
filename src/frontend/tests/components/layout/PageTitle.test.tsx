import { render, screen } from "@testing-library/react";
import { PageTitle } from "@/components/layout/PageTitle";

describe("PageTitle", () => {
  it("renders title", () => {
    render(<PageTitle title="Dashboard" />);
    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<PageTitle title="Title" description="Page description" />);
    expect(screen.getByText("Page description")).toBeInTheDocument();
  });

  it("renders action when provided", () => {
    render(<PageTitle title="Title" action={<button>Add new</button>} />);
    expect(screen.getByRole("button", { name: /add new/i })).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<PageTitle title="Title" />);
    expect(screen.queryByText("Page description")).not.toBeInTheDocument();
  });
});
