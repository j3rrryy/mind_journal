import { PERIOD_LABELS, PERIOD_LIST } from "@/lib/constants/period";

describe("PERIOD_LABELS", () => {
  it("should have labels for all periods", () => {
    expect(PERIOD_LABELS).toHaveProperty("week");
    expect(PERIOD_LABELS).toHaveProperty("month");
    expect(PERIOD_LABELS).toHaveProperty("quarter");
    expect(PERIOD_LABELS).toHaveProperty("half_year");
    expect(PERIOD_LABELS).toHaveProperty("year");
  });

  it("should have Russian translations", () => {
    expect(PERIOD_LABELS.week.ru).toBe("Неделя");
    expect(PERIOD_LABELS.month.ru).toBe("Месяц");
    expect(PERIOD_LABELS.quarter.ru).toBe("Квартал");
    expect(PERIOD_LABELS.half_year.ru).toBe("Полгода");
    expect(PERIOD_LABELS.year.ru).toBe("Год");
  });

  it("should have English translations", () => {
    expect(PERIOD_LABELS.week.en).toBe("Week");
    expect(PERIOD_LABELS.month.en).toBe("Month");
    expect(PERIOD_LABELS.quarter.en).toBe("Quarter");
    expect(PERIOD_LABELS.half_year.en).toBe("Half Year");
    expect(PERIOD_LABELS.year.en).toBe("Year");
  });
});

describe("PERIOD_LIST", () => {
  it("should contain all period keys", () => {
    expect(PERIOD_LIST).toContain("week");
    expect(PERIOD_LIST).toContain("month");
    expect(PERIOD_LIST).toContain("quarter");
    expect(PERIOD_LIST).toContain("half_year");
    expect(PERIOD_LIST).toContain("year");
  });

  it("should have exactly 5 periods", () => {
    expect(PERIOD_LIST).toHaveLength(5);
  });

  it("should be in correct order", () => {
    expect(PERIOD_LIST[0]).toBe("week");
    expect(PERIOD_LIST[1]).toBe("month");
    expect(PERIOD_LIST[2]).toBe("quarter");
    expect(PERIOD_LIST[3]).toBe("half_year");
    expect(PERIOD_LIST[4]).toBe("year");
  });
});
