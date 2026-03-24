import { getClientInfo } from "@/lib/utils/client";

jest.mock("next/headers", () => {
  const mockHeaders = {
    get: jest.fn((key: string) => {
      const headersMap: Record<string, string | null> = {
        "x-forwarded-for": "192.168.1.100, 10.0.0.1",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      };
      return headersMap[key] || null;
    }),
  };
  return {
    headers: jest.fn().mockResolvedValue(mockHeaders),
  };
});

describe("getClientInfo", () => {
  it("should return forwarded IP and user agent", async () => {
    const result = await getClientInfo();

    expect(result).toHaveProperty("forwarded");
    expect(result).toHaveProperty("userAgent");
  });
});
