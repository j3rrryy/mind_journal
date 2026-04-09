export function formatDate(dateString: string): string {
  let isoString = dateString;
  if (!dateString.includes("T")) {
    isoString = dateString + "T00:00:00Z";
  } else if (!dateString.includes("Z") && !dateString.includes("+")) {
    isoString = dateString + "Z";
  }
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDateShort(dateString: string, locale: string = "ru"): string {
  let isoString = dateString;
  if (!dateString.includes("T")) {
    isoString = dateString + "T00:00:00Z";
  } else if (!dateString.includes("Z") && !dateString.includes("+")) {
    isoString = dateString + "Z";
  }
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getMonthName(monthIndex: number, locale: string = "ru"): string {
  const date = new Date(2000, monthIndex, 1);
  const monthName = date.toLocaleString(locale, { month: "long" });
  return (
    monthName.charAt(0).toLocaleUpperCase(locale) + monthName.slice(1).toLocaleLowerCase(locale)
  );
}

export function getDayOfWeekNames(locale: string = "ru"): string[] {
  const days = [];
  const baseDate = new Date(2000, 0, 3);

  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    days.push(date.toLocaleString(locale, { weekday: "short" }));
  }
  return days;
}

export function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getCurrentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}
