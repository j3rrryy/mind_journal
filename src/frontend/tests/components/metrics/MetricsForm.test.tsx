import { render, screen, fireEvent } from "@testing-library/react";
import { MetricsForm } from "@/components/metrics/MetricsForm";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      "common.cancel": "Cancel",
      "common.save": "Save",
      "common.saving": "Saving...",
    };
    return translations[key] || key;
  }),
  useLocale: jest.fn(() => "en"),
}));

jest.mock("@/components/common/Button", () => ({
  Button: ({
    children,
    type,
    variant,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    variant: string;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type={type} data-variant={variant} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock("@/lib/constants/metrics", () => ({
  METRIC_LIST: ["mood", "sleep_hours", "activity", "stress", "energy", "focus"],
  METRIC_LABELS: {
    mood: { en: "Mood", ru: "Настроение" },
    sleep_hours: { en: "Sleep", ru: "Сон" },
    activity: { en: "Activity", ru: "Активность" },
    stress: { en: "Stress", ru: "Стресс" },
    energy: { en: "Energy", ru: "Энергия" },
    focus: { en: "Focus", ru: "Фокус" },
  },
  getMetricColorLevel: jest.fn(() => "medium"),
}));

jest.mock("@/lib/utils/metrics", () => ({
  getMetricBackgroundClass: jest.fn(() => "bg-gray-100"),
  getMetricTextColorClass: jest.fn(() => "text-gray-700"),
  formatMetricValue: jest.fn((value) => String(value)),
}));

describe("MetricsForm", () => {
  it("renders all metric inputs", () => {
    render(<MetricsForm onSubmit={jest.fn()} />);
    expect(screen.getByText("Mood")).toBeInTheDocument();
    expect(screen.getByText("Sleep")).toBeInTheDocument();
    expect(screen.getByText("Activity")).toBeInTheDocument();
  });

  it("renders save button", () => {
    render(<MetricsForm onSubmit={jest.fn()} />);
    expect(screen.getByText("save")).toBeInTheDocument();
  });

  it("renders cancel button when onCancel provided", () => {
    render(<MetricsForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText("cancel")).toBeInTheDocument();
  });

  it("calls onSubmit when form submitted", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<MetricsForm onSubmit={onSubmit} />);
    const buttons = screen.getAllByRole("button");
    const saveButton = buttons.find((b) => b.textContent === "save");
    fireEvent.submit(saveButton!.closest("form")!);
    expect(onSubmit).toHaveBeenCalled();
  });

  it("shows loading state when isSubmitting", () => {
    render(<MetricsForm onSubmit={jest.fn()} isSubmitting={true} />);
    expect(screen.getByText(/saving/i)).toBeInTheDocument();
  });
});
