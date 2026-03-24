import { PRIORITY_LABELS, PRIORITY_COLORS, PRIORITY_ORDER } from "@/lib/constants/priority";

describe("PRIORITY_LABELS", () => {
  it("should have labels for all priorities", () => {
    expect(PRIORITY_LABELS).toHaveProperty("high");
    expect(PRIORITY_LABELS).toHaveProperty("medium");
    expect(PRIORITY_LABELS).toHaveProperty("low");
  });

  it("should have Russian translations", () => {
    expect(PRIORITY_LABELS.high.ru).toBe("Важно");
    expect(PRIORITY_LABELS.medium.ru).toBe("Полезно знать");
    expect(PRIORITY_LABELS.low.ru).toBe("К сведению");
  });

  it("should have English translations", () => {
    expect(PRIORITY_LABELS.high.en).toBe("Important");
    expect(PRIORITY_LABELS.medium.en).toBe("Good to know");
    expect(PRIORITY_LABELS.low.en).toBe("FYI");
  });
});

describe("PRIORITY_COLORS", () => {
  it("should have colors for all priorities", () => {
    expect(PRIORITY_COLORS).toHaveProperty("high");
    expect(PRIORITY_COLORS).toHaveProperty("medium");
    expect(PRIORITY_COLORS).toHaveProperty("low");
  });

  it("should have bg, text, darkBg, darkText for each priority", () => {
    expect(PRIORITY_COLORS.high).toHaveProperty("bg");
    expect(PRIORITY_COLORS.high).toHaveProperty("text");
    expect(PRIORITY_COLORS.high).toHaveProperty("darkBg");
    expect(PRIORITY_COLORS.high).toHaveProperty("darkText");
  });

  it("should have correct colors for high priority", () => {
    expect(PRIORITY_COLORS.high.bg).toBe("bg-red-100");
    expect(PRIORITY_COLORS.high.text).toBe("text-red-800");
    expect(PRIORITY_COLORS.high.darkBg).toBe("dark:bg-red-900/30");
    expect(PRIORITY_COLORS.high.darkText).toBe("dark:text-red-300");
  });

  it("should have correct colors for medium priority", () => {
    expect(PRIORITY_COLORS.medium.bg).toBe("bg-yellow-100");
    expect(PRIORITY_COLORS.medium.text).toBe("text-yellow-800");
  });

  it("should have correct colors for low priority", () => {
    expect(PRIORITY_COLORS.low.bg).toBe("bg-green-100");
    expect(PRIORITY_COLORS.low.text).toBe("text-green-800");
  });
});

describe("PRIORITY_ORDER", () => {
  it("should contain all priorities", () => {
    expect(PRIORITY_ORDER).toContain("high");
    expect(PRIORITY_ORDER).toContain("medium");
    expect(PRIORITY_ORDER).toContain("low");
  });

  it("should have exactly 3 priorities", () => {
    expect(PRIORITY_ORDER).toHaveLength(3);
  });

  it("should be in correct order (high first, low last)", () => {
    expect(PRIORITY_ORDER[0]).toBe("high");
    expect(PRIORITY_ORDER[1]).toBe("medium");
    expect(PRIORITY_ORDER[2]).toBe("low");
  });
});
