import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeInput } from "@/components/form/CodeInput";

jest.mock("@/lib/constants/validation", () => ({
  RESET_CODE_LENGTH: 6,
}));

describe("CodeInput", () => {
  it("renders 6 input fields", () => {
    render(<CodeInput value="" onChange={jest.fn()} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
  });

  it("displays value in inputs", () => {
    render(<CodeInput value="123456" onChange={jest.fn()} />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(inputs[0]).toHaveValue("1");
    expect(inputs[5]).toHaveValue("6");
  });

  it("calls onChange when typing", async () => {
    const onChange = jest.fn();
    render(<CodeInput value="" onChange={onChange} />);
    const inputs = screen.getAllByRole("textbox");
    await userEvent.type(inputs[0], "5");
    expect(onChange).toHaveBeenCalledWith("5");
  });

  it("ignores non-digit input", async () => {
    const onChange = jest.fn();
    render(<CodeInput value="" onChange={onChange} />);
    const inputs = screen.getAllByRole("textbox");
    await userEvent.type(inputs[0], "a");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("handles paste event", async () => {
    const onChange = jest.fn();
    render(<CodeInput value="" onChange={onChange} />);
    const input = screen.getAllByRole("textbox")[0];
    fireEvent.paste(input, { clipboardData: { getData: () => "123456" } });
    expect(onChange).toHaveBeenCalledWith("123456");
  });

  it("handles backspace on empty input", async () => {
    const onChange = jest.fn();
    render(<CodeInput value="1" onChange={onChange} />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.keyDown(inputs[1], { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("applies error styles", () => {
    render(<CodeInput value="" onChange={jest.fn()} error />);
    const input = screen.getAllByRole("textbox")[0];
    expect(input).toHaveClass("border-red-500");
  });

  it("disables inputs when disabled", () => {
    render(<CodeInput value="" onChange={jest.fn()} disabled />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
