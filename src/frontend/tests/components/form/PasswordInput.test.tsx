import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordInput from "@/components/form/PasswordInput";

jest.mock("@/components/form/Input", () => ({
  Input: ({
    type,
    error,
    className,
    ...props
  }: {
    type: string;
    error: boolean;
    className: string;
  }) => <input type={type} data-error={error} className={className} {...props} />,
}));

jest.mock("@/components/icons/EyeIcon", () => ({
  EyeIcon: ({ className }: { className: string }) => (
    <span data-testid="eye-icon" className={className}>
      Eye
    </span>
  ),
}));

jest.mock("@/components/icons/EyeCrossedIcon", () => ({
  EyeCrossedIcon: ({ className }: { className: string }) => (
    <span data-testid="eye-crossed-icon" className={className}>
      EyeCrossed
    </span>
  ),
}));

describe("PasswordInput", () => {
  it("renders input with password type by default", () => {
    render(<PasswordInput placeholder="Enter password" />);
    const input = screen.getByPlaceholderText("Enter password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles password visibility on button click", async () => {
    render(<PasswordInput placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password");
    const toggleBtn = screen.getByRole("button");

    expect(input).toHaveAttribute("type", "password");
    expect(screen.getByTestId("eye-crossed-icon")).toBeInTheDocument();

    await userEvent.click(toggleBtn);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<PasswordInput label="Password" id="password" />);
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders error message when error prop provided", () => {
    render(<PasswordInput error="Password is required" />);
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("passes error prop to Input", () => {
    render(<PasswordInput error="Invalid" placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("data-error", "true");
  });
});
