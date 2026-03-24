import {
  getPriorityColorClasses,
  getPriorityLabel,
  sortByPriority,
  isHigherPriority,
} from "@/lib/utils/priority";
import { PRIORITY_ORDER } from "@/lib/constants/priority";
import type { Priority } from "@/lib/constants/priority";

describe("getPriorityColorClasses", () => {
  it("should return color classes for high priority", () => {
    const result = getPriorityColorClasses("high");
    expect(result).toContain("bg-red-100");
    expect(result).toContain("text-red-800");
    expect(result).toContain("dark:bg-red-900/30");
    expect(result).toContain("dark:text-red-300");
  });

  it("should return color classes for medium priority", () => {
    const result = getPriorityColorClasses("medium");
    expect(result).toContain("bg-yellow-100");
    expect(result).toContain("text-yellow-800");
  });

  it("should return color classes for low priority", () => {
    const result = getPriorityColorClasses("low");
    expect(result).toContain("bg-green-100");
    expect(result).toContain("text-green-800");
  });
});

describe("getPriorityLabel", () => {
  it("should return Russian label for high priority", () => {
    const result = getPriorityLabel("high", "ru");
    expect(result).toBe("Важно");
  });

  it("should return English label for high priority", () => {
    const result = getPriorityLabel("high", "en");
    expect(result).toBe("Important");
  });

  it("should return Russian label for medium priority", () => {
    const result = getPriorityLabel("medium", "ru");
    expect(result).toBe("Полезно знать");
  });

  it("should return Russian label for low priority", () => {
    const result = getPriorityLabel("low", "ru");
    expect(result).toBe("К сведению");
  });

  it("should return priority key for unknown locale", () => {
    const result = getPriorityLabel("high", "de");
    expect(result).toBe("high");
  });
});

describe("sortByPriority", () => {
  it("should sort items by priority order", () => {
    const items = [
      { priority: "low" as Priority, id: 1 },
      { priority: "high" as Priority, id: 2 },
      { priority: "medium" as Priority, id: 3 },
    ];
    const result = sortByPriority(items);
    expect(result[0].priority).toBe("high");
    expect(result[1].priority).toBe("medium");
    expect(result[2].priority).toBe("low");
  });

  it("should not mutate original array", () => {
    const items = [
      { priority: "low" as Priority, id: 1 },
      { priority: "high" as Priority, id: 2 },
    ];
    const original = [...items];
    sortByPriority(items);
    expect(items).toEqual(original);
  });

  it("should handle empty array", () => {
    const result = sortByPriority<{ priority: Priority }>([]);
    expect(result).toEqual([]);
  });

  it("should handle single item", () => {
    const items = [{ priority: "medium" as Priority, id: 1 }];
    const result = sortByPriority(items);
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe("medium");
  });
});

describe("isHigherPriority", () => {
  it("should return true when first priority is higher", () => {
    expect(isHigherPriority("high", "medium")).toBe(true);
    expect(isHigherPriority("medium", "low")).toBe(true);
    expect(isHigherPriority("high", "low")).toBe(true);
  });

  it("should return false when first priority is lower", () => {
    expect(isHigherPriority("low", "high")).toBe(false);
    expect(isHigherPriority("medium", "high")).toBe(false);
    expect(isHigherPriority("low", "medium")).toBe(false);
  });

  it("should return false when priorities are equal", () => {
    expect(isHigherPriority("high", "high")).toBe(false);
    expect(isHigherPriority("medium", "medium")).toBe(false);
    expect(isHigherPriority("low", "low")).toBe(false);
  });

  it("should compare priorities correctly using PRIORITY_ORDER index", () => {
    expect(PRIORITY_ORDER.indexOf("high")).toBe(0);
    expect(PRIORITY_ORDER.indexOf("medium")).toBe(1);
    expect(PRIORITY_ORDER.indexOf("low")).toBe(2);
  });
});
