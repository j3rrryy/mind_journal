import { render } from "@testing-library/react";
import { LoadingDots } from "@/components/common/LoadingDots";

describe("LoadingDots", () => {
  it("renders with default props", () => {
    const { container } = render(<LoadingDots />);
    expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
  });

  it("renders without fullPage wrapper", () => {
    const { container } = render(<LoadingDots fullPage={false} />);
    expect(container.querySelector(".flex")).toBeInTheDocument();
    expect(container.querySelector(".min-h-screen")).not.toBeInTheDocument();
  });

  it("renders small size dots", () => {
    render(<LoadingDots size="sm" fullPage={false} />);
    const spans = document.querySelectorAll("span");
    expect(spans).toHaveLength(3);
  });

  it("renders medium size dots", () => {
    render(<LoadingDots size="md" fullPage={false} />);
    const spans = document.querySelectorAll("span");
    expect(spans).toHaveLength(3);
  });

  it("renders large size dots", () => {
    render(<LoadingDots size="lg" fullPage={false} />);
    const spans = document.querySelectorAll("span");
    expect(spans).toHaveLength(3);
  });
});
