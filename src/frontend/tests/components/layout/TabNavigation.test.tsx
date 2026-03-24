import { render, screen, fireEvent } from "@testing-library/react";
import { TabNavigation } from "@/components/layout/TabNavigation";

describe("TabNavigation", () => {
  const tabs = [
    { id: "tab1", label: "Tab One" },
    { id: "tab2", label: "Tab Two" },
    { id: "tab3", label: "Tab Three" },
  ];

  it("renders all tabs", () => {
    render(<TabNavigation tabs={tabs} activeTab="tab1" onTabChange={jest.fn()} />);
    expect(screen.getByText("Tab One")).toBeInTheDocument();
    expect(screen.getByText("Tab Two")).toBeInTheDocument();
    expect(screen.getByText("Tab Three")).toBeInTheDocument();
  });

  it("calls onTabChange when tab clicked", () => {
    const onChange = jest.fn();
    render(<TabNavigation tabs={tabs} activeTab="tab1" onTabChange={onChange} />);
    fireEvent.click(screen.getByText("Tab Two"));
    expect(onChange).toHaveBeenCalledWith("tab2");
  });

  it("applies underline variant classes", () => {
    const { container } = render(
      <TabNavigation tabs={tabs} activeTab="tab1" onTabChange={jest.fn()} variant="underline" />
    );
    expect(container.querySelector(".border-b")).toBeInTheDocument();
  });

  it("applies pills variant classes", () => {
    const { container } = render(
      <TabNavigation tabs={tabs} activeTab="tab1" onTabChange={jest.fn()} variant="pills" />
    );
    expect(container.querySelector(".gap-1")).toBeInTheDocument();
  });

  it("applies size classes", () => {
    const { rerender } = render(
      <TabNavigation tabs={tabs} activeTab="tab1" onTabChange={jest.fn()} size="sm" />
    );
    expect(screen.getByText("Tab One")).toHaveClass("text-xs");

    rerender(<TabNavigation tabs={tabs} activeTab="tab1" onTabChange={jest.fn()} size="lg" />);
    expect(screen.getByText("Tab One")).toHaveClass("text-base");
  });

  it("merges custom className", () => {
    const { container } = render(
      <TabNavigation
        tabs={tabs}
        activeTab="tab1"
        onTabChange={jest.fn()}
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
