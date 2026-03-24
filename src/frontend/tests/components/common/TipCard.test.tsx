import { render, screen } from "@testing-library/react";
import { TipCard } from "@/components/common/TipCard";

describe("TipCard", () => {
  it("renders title and description", () => {
    render(<TipCard title="Tip Title" description="Tip description here" />);
    expect(screen.getByText("💡 Tip Title")).toBeInTheDocument();
    expect(screen.getByText("Tip description here")).toBeInTheDocument();
  });

  it("renders action when provided", () => {
    render(<TipCard title="Tip" description="Description" action={<button>Learn more</button>} />);
    expect(screen.getByRole("button", { name: /learn more/i })).toBeInTheDocument();
  });
});
