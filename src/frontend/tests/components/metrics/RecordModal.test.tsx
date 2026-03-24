import { render, screen, fireEvent } from "@testing-library/react";
import { RecordModal } from "@/components/metrics/RecordModal";

jest.mock("@/components/metrics/MetricsForm", () => ({
  MetricsForm: ({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) => (
    <div data-testid="metrics-form">
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onSubmit}>Submit</button>
    </div>
  ),
}));

jest.mock("@/components/common/LoadingDots", () => ({
  LoadingDots: () => <div data-testid="loading">Loading...</div>,
}));

describe("RecordModal", () => {
  it("renders when isOpen is true", () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={jest.fn()}
        date="2024-01-01"
        onSubmit={jest.fn()}
        title="Add Record"
      />
    );
    expect(screen.getByText("Add Record")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <RecordModal
        isOpen={false}
        onClose={jest.fn()}
        date="2024-01-01"
        onSubmit={jest.fn()}
        title="Title"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders loading state", () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={jest.fn()}
        date="2024-01-01"
        onSubmit={jest.fn()}
        title="Title"
        isSubmitting={true}
      />
    );
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("calls onClose when Escape pressed", () => {
    const onClose = jest.fn();
    render(
      <RecordModal
        isOpen={true}
        onClose={onClose}
        date="2024-01-01"
        onSubmit={jest.fn()}
        title="Title"
      />
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
