import { render, screen } from "@testing-library/react";
import LandingFooter from "@/components/landing/LandingFooter";

describe("LandingFooter", () => {
  it("renders copyright text", () => {
    render(<LandingFooter />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${year} MindJournal`))).toBeInTheDocument();
  });
});
