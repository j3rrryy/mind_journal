import {
  getMetricBackgroundClass,
  getMetricTextColorClass,
  getMetricLabel,
  getMetricUnit,
  formatMetricValue,
  getMoodBarColor,
} from "@/lib/utils/metrics";

describe("getMetricBackgroundClass", () => {
  it("should return high level background for positive metrics with high value", () => {
    const result = getMetricBackgroundClass("mood", 8, 10);
    expect(result).toContain("bg-green-50");
  });

  it("should return medium level background for positive metrics with medium value", () => {
    const result = getMetricBackgroundClass("mood", 5, 10);
    expect(result).toContain("bg-yellow-50");
  });

  it("should return low level background for positive metrics with low value", () => {
    const result = getMetricBackgroundClass("mood", 2, 10);
    expect(result).toContain("bg-red-50");
  });

  it("should return high level background for stress with low value", () => {
    const result = getMetricBackgroundClass("stress", 2, 10);
    expect(result).toContain("bg-green-50");
  });

  it("should return low level background for stress with high value", () => {
    const result = getMetricBackgroundClass("stress", 8, 10);
    expect(result).toContain("bg-red-50");
  });

  it("should return high level for sleep hours in optimal range", () => {
    const result = getMetricBackgroundClass("sleep_hours", 7.5, 10);
    expect(result).toContain("bg-green-50");
  });

  it("should return medium level for sleep hours in acceptable range", () => {
    const result = getMetricBackgroundClass("sleep_hours", 6, 10);
    expect(result).toContain("bg-yellow-50");
  });

  it("should return low level for sleep hours outside range", () => {
    const result = getMetricBackgroundClass("sleep_hours", 3, 10);
    expect(result).toContain("bg-red-50");
  });

  it("should include dark background class", () => {
    const result = getMetricBackgroundClass("mood", 8, 10);
    expect(result).toContain("dark:bg-green-900/30");
  });

  it("should handle activity metric", () => {
    const result = getMetricBackgroundClass("activity", 9, 10);
    expect(result).toContain("bg-green-50");
  });

  it("should handle energy metric", () => {
    const result = getMetricBackgroundClass("energy", 3, 10);
    expect(result).toContain("bg-red-50");
  });

  it("should handle focus metric", () => {
    const result = getMetricBackgroundClass("focus", 6, 10);
    expect(result).toContain("bg-yellow-50");
  });
});

describe("getMetricTextColorClass", () => {
  it("should return text color for high value", () => {
    const result = getMetricTextColorClass("mood", 8, 10);
    expect(result).toContain("text-green-600");
  });

  it("should return text color for medium value", () => {
    const result = getMetricTextColorClass("mood", 5, 10);
    expect(result).toContain("text-yellow-600");
  });

  it("should return text color for low value", () => {
    const result = getMetricTextColorClass("mood", 2, 10);
    expect(result).toContain("text-red-600");
  });

  it("should include dark mode text class", () => {
    const result = getMetricTextColorClass("mood", 8, 10);
    expect(result).toContain("dark:text-green-400");
  });

  it("should handle stress metric", () => {
    const result = getMetricTextColorClass("stress", 2, 10);
    expect(result).toContain("text-green-600");
  });

  it("should handle sleep_hours metric", () => {
    const result = getMetricTextColorClass("sleep_hours", 8, 10);
    expect(result).toContain("text-green-600");
  });
});

describe("getMetricLabel", () => {
  it("should return Russian label for mood", () => {
    const result = getMetricLabel("mood", "ru");
    expect(result).toBe("Настроение");
  });

  it("should return English label for mood", () => {
    const result = getMetricLabel("mood", "en");
    expect(result).toBe("Mood");
  });

  it("should return Russian labels for all metrics", () => {
    expect(getMetricLabel("mood", "ru")).toBe("Настроение");
    expect(getMetricLabel("sleep_hours", "ru")).toBe("Сон");
    expect(getMetricLabel("activity", "ru")).toBe("Активность");
    expect(getMetricLabel("stress", "ru")).toBe("Стресс");
    expect(getMetricLabel("energy", "ru")).toBe("Энергия");
    expect(getMetricLabel("focus", "ru")).toBe("Внимание");
  });

  it("should return key for unknown locale", () => {
    const result = getMetricLabel("mood", "de");
    expect(result).toBe("mood");
  });
});

describe("getMetricUnit", () => {
  it("should return hour unit for sleep_hours in Russian", () => {
    const result = getMetricUnit("sleep_hours", "ru");
    expect(result).toBe("ч");
  });

  it("should return hour unit for sleep_hours in English", () => {
    const result = getMetricUnit("sleep_hours", "en");
    expect(result).toBe("h");
  });

  it("should return unit for mood", () => {
    const result = getMetricUnit("mood", "ru");
    expect(result).toBe("/10");
  });

  it("should return unit even for unknown locale", () => {
    const result = getMetricUnit("mood", "de");
    expect(result).toBe("/10");
  });
});

describe("formatMetricValue", () => {
  it("should return dash for null value", () => {
    const result = formatMetricValue(null, "mood");
    expect(result).toBe("—");
  });

  it("should format sleep_hours with one decimal", () => {
    const result = formatMetricValue(7.5, "sleep_hours");
    expect(result).toBe("7.5");
  });

  it("should round positive metric values", () => {
    const result = formatMetricValue(7.6, "mood");
    expect(result).toBe("8");
  });

  it("should force decimals when forceDecimals is true", () => {
    const result = formatMetricValue(7, "mood", true);
    expect(result).toBe("7.0");
  });

  it("should handle zero value", () => {
    const result = formatMetricValue(0, "mood");
    expect(result).toBe("0");
  });

  it("should handle negative values", () => {
    const result = formatMetricValue(-1, "mood");
    expect(result).toBe("-1");
  });
});

describe("getMoodBarColor", () => {
  it("should return green for high mood", () => {
    const result = getMoodBarColor(8);
    expect(result).toBe("bg-green-500");
  });

  it("should return yellow for medium mood", () => {
    const result = getMoodBarColor(5);
    expect(result).toBe("bg-yellow-500");
  });

  it("should return red for low mood", () => {
    const result = getMoodBarColor(2);
    expect(result).toBe("bg-red-500");
  });

  it("should return green for boundary high value", () => {
    const result = getMoodBarColor(7);
    expect(result).toBe("bg-green-500");
  });

  it("should return yellow for boundary medium value", () => {
    const result = getMoodBarColor(4);
    expect(result).toBe("bg-yellow-500");
  });
});
