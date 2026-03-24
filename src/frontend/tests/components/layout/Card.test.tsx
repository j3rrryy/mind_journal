import { render, screen } from "@testing-library/react";
import { Card } from "@/components/layout/Card";

describe("Card", () => {
  it("renders children with default variant", () => {
    const { container } = render(
      <Card>
        <span>Test content</span>
      </Card>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
    const card = container.querySelector("div");
    expect(card?.className).toContain("border-gray-200");
  });

  it("applies danger variant classes", () => {
    const { container } = render(<Card variant="danger">Danger</Card>);
    const card = container.querySelector("div");
    expect(card?.className).toContain("border-red-200");
  });

  it("applies warning variant classes", () => {
    const { container } = render(<Card variant="warning">Warning</Card>);
    const card = container.querySelector("div");
    expect(card?.className).toContain("border-yellow-200");
  });

  it("applies success variant classes", () => {
    const { container } = render(<Card variant="success">Success</Card>);
    const card = container.querySelector("div");
    expect(card?.className).toContain("border-green-200");
  });

  it("merges custom className", () => {
    const { container } = render(<Card className="custom-class">Custom</Card>);
    const card = container.querySelector("div");
    expect(card?.className).toContain("custom-class");
  });
});
