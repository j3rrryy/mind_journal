import { render, screen } from "@testing-library/react";
import CountryIndicator from "@/components/profile/CountryIndicator";

describe("CountryIndicator", () => {
  it("renders country code when provided", () => {
    render(<CountryIndicator countryCode="RU" />);
    expect(screen.getByText("RU")).toBeInTheDocument();
    expect(screen.getByText("●")).toBeInTheDocument();
  });

  it("renders nothing when countryCode is null", () => {
    const { container } = render(<CountryIndicator countryCode={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when countryCode is undefined", () => {
    const { container } = render(<CountryIndicator countryCode={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when countryCode is empty string", () => {
    const { container } = render(<CountryIndicator countryCode="" />);
    expect(container.firstChild).toBeNull();
  });
});
