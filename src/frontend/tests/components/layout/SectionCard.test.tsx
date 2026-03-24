import { render, screen } from "@testing-library/react";
import { SectionCard } from "@/components/layout/SectionCard";

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

describe("SectionCard", () => {
  it("renders title and children", () => {
    render(
      <SectionCard title="Section Title">
        <p>Section content</p>
      </SectionCard>
    );
    expect(screen.getByText("Section Title")).toBeInTheDocument();
    expect(screen.getByText("Section content")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    render(<SectionCard title="Title">Content</SectionCard>);
    const title = screen.getByText("Title");
    expect(title).toHaveClass("text-text-primary");
  });

  it("applies danger variant classes", () => {
    render(
      <SectionCard title="Warning" variant="danger">
        Content
      </SectionCard>
    );
    const title = screen.getByText("Warning");
    expect(title).toHaveClass("text-red-900");
  });

  it("renders action when provided", () => {
    render(
      <SectionCard title="Title" action={<button>Action</button>}>
        Content
      </SectionCard>
    );
    expect(screen.getByRole("button", { name: /action/i })).toBeInTheDocument();
  });

  it("passes className to Card", () => {
    const { container } = render(
      <SectionCard title="Title" className="custom-class">
        Content
      </SectionCard>
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});
