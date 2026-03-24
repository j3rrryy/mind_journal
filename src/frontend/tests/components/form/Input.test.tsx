import { render, screen } from "@testing-library/react";
import { Input } from "@/components/form/Input";

describe("Input", () => {
  it("renders input with default props", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("px-4 py-3");
    expect(input).not.toHaveClass("border-red-500");
  });

  it("applies size classes", () => {
    const { unmount } = render(<Input inputSize="sm" />);
    expect(screen.getByRole("textbox")).toHaveClass("px-4 py-2");
    unmount();

    render(<Input inputSize="md" />);
    expect(screen.getByRole("textbox")).toHaveClass("px-4 py-2.5");
  });

  it("applies error styles when error is true", () => {
    render(<Input error />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-red-500");
    expect(input).toHaveClass("bg-red-50");
  });

  it("passes additional props", () => {
    render(<Input placeholder="Enter text" disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Enter text");
    expect(input).toBeDisabled();
  });

  it("merges custom className", () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });
});
