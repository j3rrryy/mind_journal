import {
  getMetricColorLevel,
  METRIC_LABELS,
  METRIC_COLORS,
  METRIC_LIST,
} from "@/lib/constants/metrics";

describe("getMetricColorLevel", () => {
  describe("positive metrics (mood, activity, energy, focus)", () => {
    it("should return high for values >= 70%", () => {
      expect(getMetricColorLevel("mood", 7, 10)).toBe("high");
      expect(getMetricColorLevel("mood", 8, 10)).toBe("high");
      expect(getMetricColorLevel("mood", 10, 10)).toBe("high");
    });

    it("should return medium for values >= 40% and < 70%", () => {
      expect(getMetricColorLevel("mood", 4, 10)).toBe("medium");
      expect(getMetricColorLevel("mood", 5, 10)).toBe("medium");
      expect(getMetricColorLevel("mood", 6, 10)).toBe("medium");
    });

    it("should return low for values < 40%", () => {
      expect(getMetricColorLevel("mood", 1, 10)).toBe("low");
      expect(getMetricColorLevel("mood", 3, 10)).toBe("low");
      expect(getMetricColorLevel("mood", 0, 10)).toBe("low");
    });

    it("should handle activity", () => {
      expect(getMetricColorLevel("activity", 8, 10)).toBe("high");
      expect(getMetricColorLevel("activity", 5, 10)).toBe("medium");
      expect(getMetricColorLevel("activity", 2, 10)).toBe("low");
    });

    it("should handle energy", () => {
      expect(getMetricColorLevel("energy", 9, 10)).toBe("high");
      expect(getMetricColorLevel("energy", 4, 10)).toBe("medium");
      expect(getMetricColorLevel("energy", 2, 10)).toBe("low");
      expect(getMetricColorLevel("energy", 7, 10)).toBe("high");
    });

    it("should handle focus", () => {
      expect(getMetricColorLevel("focus", 7, 10)).toBe("high");
      expect(getMetricColorLevel("focus", 3, 10)).toBe("low");
    });
  });

  describe("negative metrics (stress)", () => {
    it("should return high for low stress values (<=40%)", () => {
      expect(getMetricColorLevel("stress", 2, 10)).toBe("high");
      expect(getMetricColorLevel("stress", 4, 10)).toBe("high");
    });

    it("should return medium for medium stress values (>40% and <=70%)", () => {
      expect(getMetricColorLevel("stress", 5, 10)).toBe("medium");
      expect(getMetricColorLevel("stress", 7, 10)).toBe("medium");
    });

    it("should return low for high stress values (>70%)", () => {
      expect(getMetricColorLevel("stress", 8, 10)).toBe("low");
      expect(getMetricColorLevel("stress", 10, 10)).toBe("low");
    });
  });

  describe("sleep_hours", () => {
    it("should return high for optimal sleep (7-9 hours)", () => {
      expect(getMetricColorLevel("sleep_hours", 7, 10)).toBe("high");
      expect(getMetricColorLevel("sleep_hours", 8, 10)).toBe("high");
      expect(getMetricColorLevel("sleep_hours", 9, 10)).toBe("high");
    });

    it("should return medium for acceptable sleep (6 or 10-12 hours)", () => {
      expect(getMetricColorLevel("sleep_hours", 6, 10)).toBe("medium");
      expect(getMetricColorLevel("sleep_hours", 10, 10)).toBe("medium");
      expect(getMetricColorLevel("sleep_hours", 11, 10)).toBe("medium");
      expect(getMetricColorLevel("sleep_hours", 12, 10)).toBe("medium");
    });

    it("should return low for outside range", () => {
      expect(getMetricColorLevel("sleep_hours", 5, 10)).toBe("low");
      expect(getMetricColorLevel("sleep_hours", 13, 10)).toBe("low");
      expect(getMetricColorLevel("sleep_hours", 0, 10)).toBe("low");
    });
  });

  it("should handle different max values", () => {
    expect(getMetricColorLevel("mood", 70, 100)).toBe("high");
    expect(getMetricColorLevel("mood", 40, 100)).toBe("medium");
    expect(getMetricColorLevel("mood", 20, 100)).toBe("low");
  });

  it("should handle boundary values", () => {
    expect(getMetricColorLevel("stress", 0, 10)).toBe("high");
    expect(getMetricColorLevel("stress", 10, 10)).toBe("low");
    expect(getMetricColorLevel("mood", 10, 10)).toBe("high");
    expect(getMetricColorLevel("mood", 0, 10)).toBe("low");
  });

  it("should handle stress with different max values", () => {
    expect(getMetricColorLevel("stress", 30, 100)).toBe("high");
    expect(getMetricColorLevel("stress", 50, 100)).toBe("medium");
    expect(getMetricColorLevel("stress", 80, 100)).toBe("low");
  });

  it("should return medium for values >= 40% and < 70%", () => {
    expect(getMetricColorLevel("mood", 4, 10)).toBe("medium");
    expect(getMetricColorLevel("mood", 5, 10)).toBe("medium");
    expect(getMetricColorLevel("mood", 6, 10)).toBe("medium");
  });

  it("should return low for values < 40%", () => {
    expect(getMetricColorLevel("mood", 1, 10)).toBe("low");
    expect(getMetricColorLevel("mood", 3, 10)).toBe("low");
    expect(getMetricColorLevel("mood", 0, 10)).toBe("low");
  });

  it("should handle activity", () => {
    expect(getMetricColorLevel("activity", 8, 10)).toBe("high");
    expect(getMetricColorLevel("activity", 5, 10)).toBe("medium");
    expect(getMetricColorLevel("activity", 2, 10)).toBe("low");
  });

  it("should handle energy", () => {
    expect(getMetricColorLevel("energy", 9, 10)).toBe("high");
    expect(getMetricColorLevel("energy", 4, 10)).toBe("medium");
    expect(getMetricColorLevel("energy", 2, 10)).toBe("low");
  });

  it("should handle focus", () => {
    expect(getMetricColorLevel("focus", 7, 10)).toBe("high");
    expect(getMetricColorLevel("focus", 3, 10)).toBe("low");
  });
});

describe("negative metrics (stress)", () => {
  it("should return high for low stress values (<=40%)", () => {
    expect(getMetricColorLevel("stress", 2, 10)).toBe("high");
    expect(getMetricColorLevel("stress", 4, 10)).toBe("high");
  });

  it("should return medium for medium stress values (>40% and <=70%)", () => {
    expect(getMetricColorLevel("stress", 5, 10)).toBe("medium");
    expect(getMetricColorLevel("stress", 7, 10)).toBe("medium");
  });

  it("should return low for high stress values (>70%)", () => {
    expect(getMetricColorLevel("stress", 8, 10)).toBe("low");
    expect(getMetricColorLevel("stress", 10, 10)).toBe("low");
  });
});

describe("sleep_hours", () => {
  it("should return high for optimal sleep (7-9 hours)", () => {
    expect(getMetricColorLevel("sleep_hours", 7, 10)).toBe("high");
    expect(getMetricColorLevel("sleep_hours", 8, 10)).toBe("high");
    expect(getMetricColorLevel("sleep_hours", 9, 10)).toBe("high");
  });

  it("should return medium for acceptable sleep (6 or 10-12 hours)", () => {
    expect(getMetricColorLevel("sleep_hours", 6, 10)).toBe("medium");
    expect(getMetricColorLevel("sleep_hours", 10, 10)).toBe("medium");
    expect(getMetricColorLevel("sleep_hours", 11, 10)).toBe("medium");
    expect(getMetricColorLevel("sleep_hours", 12, 10)).toBe("medium");
  });

  it("should return low for outside range", () => {
    expect(getMetricColorLevel("sleep_hours", 5, 10)).toBe("low");
    expect(getMetricColorLevel("sleep_hours", 13, 10)).toBe("low");
    expect(getMetricColorLevel("sleep_hours", 0, 10)).toBe("low");
  });

  it("should handle different max values", () => {
    expect(getMetricColorLevel("mood", 70, 100)).toBe("high");
    expect(getMetricColorLevel("mood", 40, 100)).toBe("medium");
    expect(getMetricColorLevel("mood", 20, 100)).toBe("low");
  });

  it("should handle boundary values", () => {
    expect(getMetricColorLevel("stress", 0, 10)).toBe("high");
    expect(getMetricColorLevel("stress", 10, 10)).toBe("low");
    expect(getMetricColorLevel("mood", 10, 10)).toBe("high");
    expect(getMetricColorLevel("mood", 0, 10)).toBe("low");
  });

  it("should handle stress with different max values", () => {
    expect(getMetricColorLevel("stress", 30, 100)).toBe("high");
    expect(getMetricColorLevel("stress", 50, 100)).toBe("medium");
    expect(getMetricColorLevel("stress", 80, 100)).toBe("low");
  });
});

describe("METRIC_LABELS", () => {
  it("should have labels for all metrics", () => {
    expect(METRIC_LABELS).toHaveProperty("mood");
    expect(METRIC_LABELS).toHaveProperty("sleep_hours");
    expect(METRIC_LABELS).toHaveProperty("activity");
    expect(METRIC_LABELS).toHaveProperty("stress");
    expect(METRIC_LABELS).toHaveProperty("energy");
    expect(METRIC_LABELS).toHaveProperty("focus");
  });

  it("should have Russian and English translations", () => {
    expect(METRIC_LABELS.mood).toHaveProperty("ru");
    expect(METRIC_LABELS.mood).toHaveProperty("en");
    expect(METRIC_LABELS.mood.ru).toBe("Настроение");
    expect(METRIC_LABELS.mood.en).toBe("Mood");
  });

  it("should have units where applicable", () => {
    expect(METRIC_LABELS.mood.unit).toBe("/10");
    expect(METRIC_LABELS.sleep_hours.unit).toBe("h");
  });
});

describe("METRIC_COLORS", () => {
  it("should have colors for all levels", () => {
    expect(METRIC_COLORS).toHaveProperty("high");
    expect(METRIC_COLORS).toHaveProperty("medium");
    expect(METRIC_COLORS).toHaveProperty("low");
  });

  it("should have bg, text, darkBg, darkText for each level", () => {
    expect(METRIC_COLORS.high).toHaveProperty("bg");
    expect(METRIC_COLORS.high).toHaveProperty("text");
    expect(METRIC_COLORS.high).toHaveProperty("darkBg");
    expect(METRIC_COLORS.high).toHaveProperty("darkText");
  });
});

describe("METRIC_LIST", () => {
  it("should contain all metric keys", () => {
    expect(METRIC_LIST).toContain("mood");
    expect(METRIC_LIST).toContain("sleep_hours");
    expect(METRIC_LIST).toContain("activity");
    expect(METRIC_LIST).toContain("stress");
    expect(METRIC_LIST).toContain("energy");
    expect(METRIC_LIST).toContain("focus");
  });

  it("should have exactly 6 metrics", () => {
    expect(METRIC_LIST).toHaveLength(6);
  });
});
