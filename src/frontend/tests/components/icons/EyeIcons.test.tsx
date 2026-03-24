import { render } from "@testing-library/react";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EyeCrossedIcon } from "@/components/icons/EyeCrossedIcon";

describe("EyeIcon", () => {
  it("renders SVG with correct attributes", () => {
    const { container } = render(<EyeIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "20");
  });

  it("passes additional props to SVG", () => {
    const { container } = render(<EyeIcon className="custom-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("custom-class");
  });
});

describe("EyeCrossedIcon", () => {
  it("renders SVG with correct attributes", () => {
    const { container } = render(<EyeCrossedIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "20");
  });

  it("passes additional props to SVG", () => {
    const { container } = render(<EyeCrossedIcon className="test-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("test-class");
  });
});
