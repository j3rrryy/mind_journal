import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

jest.mock("@/components/common/Button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    variant: string;
  }) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant}>
      {children}
    </button>
  ),
}));

describe("ConfirmationModal", () => {
  it("renders when isOpen is true", () => {
    render(
      <ConfirmationModal
        isOpen={true}
        title="Confirm Delete"
        message="Are you sure?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <ConfirmationModal
        isOpen={false}
        title="Title"
        message="Message"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.queryByText("Title")).not.toBeInTheDocument();
  });

  it("calls onConfirm when confirm button clicked", async () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmationModal
        isOpen={true}
        title="Title"
        message="Message"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />
    );
    await userEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button clicked", async () => {
    const onCancel = jest.fn();
    render(
      <ConfirmationModal
        isOpen={true}
        title="Title"
        message="Message"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />
    );
    await userEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("shows loading state", () => {
    render(
      <ConfirmationModal
        isOpen={true}
        title="Title"
        message="Message"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        isLoading={true}
      />
    );
    expect(screen.getByText("...")).toBeInTheDocument();
  });
});
