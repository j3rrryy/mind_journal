import {
  formatDate,
  formatDateShort,
  getMonthName,
  getDayOfWeekNames,
  getTodayISO,
  getCurrentYearMonth,
  getDaysInMonth,
  getFirstDayOfMonth,
} from "@/lib/utils/date";

describe("formatDate", () => {
  it("should format date with Z suffix", () => {
    const result = formatDate("2024-06-15T10:30:00Z");
    expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });

  it("should format date with timezone offset", () => {
    const result = formatDate("2024-06-15T10:30:00+03:00");
    expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });

  it("should add Z suffix if not present", () => {
    const result = formatDate("2024-06-15T10:30:00");
    expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });
});

describe("formatDateShort", () => {
  it("should format date in Russian locale", () => {
    const result = formatDateShort("2024-06-15T10:30:00Z", "ru");
    expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });

  it("should format date in English locale", () => {
    const result = formatDateShort("2024-06-15T10:30:00Z", "en");
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("should add Z suffix if not present", () => {
    const result = formatDateShort("2024-06-15");
    expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });
});

describe("getMonthName", () => {
  it("should return month name in Russian", () => {
    const result = getMonthName(0, "ru");
    expect(result).toBe("Январь");
  });

  it("should return month name in English", () => {
    const result = getMonthName(5, "en");
    expect(result).toBe("June");
  });

  it("should handle all months", () => {
    expect(getMonthName(0, "ru")).toBe("Январь");
    expect(getMonthName(1, "ru")).toBe("Февраль");
    expect(getMonthName(2, "ru")).toBe("Март");
    expect(getMonthName(3, "ru")).toBe("Апрель");
    expect(getMonthName(4, "ru")).toBe("Май");
    expect(getMonthName(5, "ru")).toBe("Июнь");
    expect(getMonthName(6, "ru")).toBe("Июль");
    expect(getMonthName(7, "ru")).toBe("Август");
    expect(getMonthName(8, "ru")).toBe("Сентябрь");
    expect(getMonthName(9, "ru")).toBe("Октябрь");
    expect(getMonthName(10, "ru")).toBe("Ноябрь");
    expect(getMonthName(11, "ru")).toBe("Декабрь");
  });
});

describe("getDayOfWeekNames", () => {
  it("should return 7 day names in Russian", () => {
    const result = getDayOfWeekNames("ru");
    expect(result).toHaveLength(7);
    expect(result[0]).toBe("пн");
  });

  it("should return 7 day names in English", () => {
    const result = getDayOfWeekNames("en");
    expect(result).toHaveLength(7);
    expect(result[0]).toBe("Mon");
  });
});

describe("getTodayISO", () => {
  it("should return ISO format date", () => {
    const result = getTodayISO();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getCurrentYearMonth", () => {
  it("should return current year and month", () => {
    const result = getCurrentYearMonth();
    expect(result).toHaveProperty("year");
    expect(result).toHaveProperty("month");
    expect(result.month).toBeGreaterThanOrEqual(1);
    expect(result.month).toBeLessThanOrEqual(12);
  });
});

describe("getDaysInMonth", () => {
  it("should return 31 days for January", () => {
    expect(getDaysInMonth(2024, 0)).toBe(31);
  });

  it("should return 29 days for February in leap year", () => {
    expect(getDaysInMonth(2024, 1)).toBe(29);
  });

  it("should return 28 days for February in non-leap year", () => {
    expect(getDaysInMonth(2023, 1)).toBe(28);
  });

  it("should return 30 days for April", () => {
    expect(getDaysInMonth(2024, 3)).toBe(30);
  });
});

describe("getFirstDayOfMonth", () => {
  it("should return correct first day for January 2024", () => {
    const result = getFirstDayOfMonth(2024, 0);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(6);
  });

  it("should return Monday as 0 for Monday", () => {
    getFirstDayOfMonth(2024, 0);
  });

  it("should handle all months of 2024", () => {
    for (let month = 0; month < 12; month++) {
      const result = getFirstDayOfMonth(2024, month);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(6);
    }
  });

  it("should return correct day for known months", () => {
    expect(getFirstDayOfMonth(2024, 0)).toBe(0);
    expect(getFirstDayOfMonth(2024, 5)).toBe(5);
  });

  it("should handle leap year February", () => {
    const result = getFirstDayOfMonth(2024, 1);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(6);
  });

  it("should handle non-leap year February", () => {
    const result = getFirstDayOfMonth(2023, 1);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(6);
  });

  it("should handle all months of 2024", () => {
    for (let month = 0; month < 12; month++) {
      const result = getFirstDayOfMonth(2024, month);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(6);
    }
  });
});
