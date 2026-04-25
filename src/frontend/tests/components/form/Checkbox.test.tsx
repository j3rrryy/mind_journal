import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "@/components/form/Checkbox";

describe("Checkbox", () => {
  it("renders with default classes", () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onCheckedChange={onChange} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onCheckedChange={onChange} className="custom" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("custom");
    expect(checkbox).toHaveClass("h-5 w-5");
  });

  it("passes through additional props", () => {
    const onChange = jest.fn();
    render(
      <Checkbox
        checked={false}
        onCheckedChange={onChange}
        disabled
        data-testid="test"
        aria-label="label"
      />
    );
    const checkbox = screen.getByTestId("test");
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute("aria-label", "label");
  });

  it("toggles state on click", () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onCheckedChange={onChange} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls with false when checked and clicked", () => {
    const onChange = jest.fn();
    render(<Checkbox checked={true} onCheckedChange={onChange} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("does not call onChange when disabled", () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} disabled onCheckedChange={onChange} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("uses given id", () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onCheckedChange={onChange} id="my-id" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("id", "my-id");
  });

  it("generates id if not provided", () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onCheckedChange={onChange} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("id");
  });
});
