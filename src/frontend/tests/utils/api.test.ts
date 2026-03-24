import { ServerApiError, createApiHeaders, parseErrorResponse } from "@/lib/utils/api";

jest.mock("@/lib/utils/msgpack", () => ({
  decodeMsgpack: jest.fn(),
}));

jest.mock("@/lib/utils/client", () => ({
  getClientInfo: jest.fn().mockResolvedValue({
    forwarded: "192.168.1.1",
    userAgent: "Mozilla/5.0",
  }),
}));

describe("ServerApiError", () => {
  it("should create error with status code and message", () => {
    const error = new ServerApiError(400, "Bad request");
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Bad request");
    expect(error.name).toBe("ServerApiError");
  });

  it("should create error with extra data", () => {
    const extra = { details: "Some details" };
    const error = new ServerApiError(400, "Bad request", extra);
    expect(error.extra).toEqual(extra);
  });

  it("should be instanceof Error", () => {
    const error = new ServerApiError(400, "Bad request");
    expect(error instanceof Error).toBe(true);
  });
});

describe("createApiHeaders", () => {
  it("should create headers with Content-Type", async () => {
    const headers = await createApiHeaders();
    expect(headers.get("Content-Type")).toBe("application/x-msgpack");
  });

  it("should set Accept-Language when locale is provided", async () => {
    const headers = await createApiHeaders("ru");
    expect(headers.get("Accept-Language")).toBe("ru");
  });

  it("should not set Accept-Language when locale is null", async () => {
    const headers = await createApiHeaders(null);
    expect(headers.get("Accept-Language")).toBeNull();
  });

  it("should not set Accept-Language when locale is undefined", async () => {
    const headers = await createApiHeaders();
    expect(headers.get("Accept-Language")).toBeNull();
  });

  it("should set client info when withClientInfo is true", async () => {
    const headers = await createApiHeaders("en", true);
    expect(headers.get("X-Forwarded-For")).toBe("192.168.1.1");
    expect(headers.get("User-Agent")).toBe("Mozilla/5.0");
  });

  it("should not set client info when withClientInfo is false", async () => {
    const headers = await createApiHeaders("en", false);
    expect(headers.get("X-Forwarded-For")).toBeNull();
    expect(headers.get("User-Agent")).toBeNull();
  });
});

describe("parseErrorResponse", () => {
  it("should parse msgpack error response", async () => {
    const { decodeMsgpack } = await import("@/lib/utils/msgpack");
    (decodeMsgpack as jest.Mock).mockResolvedValue({ detail: "Error message" });

    const response = {
      status: 400,
      statusText: "Bad Request",
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    } as unknown as Response;

    const error = await parseErrorResponse(response);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Error message");
  });

  it("should use statusText when no detail in response", async () => {
    const { decodeMsgpack } = await import("@/lib/utils/msgpack");
    (decodeMsgpack as jest.Mock).mockResolvedValue({});

    const response = {
      status: 404,
      statusText: "Not Found",
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    } as unknown as Response;

    const error = await parseErrorResponse(response);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Not Found");
  });

  it("should fallback to statusText when decode fails", async () => {
    const { decodeMsgpack } = await import("@/lib/utils/msgpack");
    (decodeMsgpack as jest.Mock).mockRejectedValue(new Error("Decode error"));

    const response = {
      status: 500,
      statusText: "Internal Server Error",
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    } as unknown as Response;

    const error = await parseErrorResponse(response);
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe("Internal Server Error");
  });

  it("should handle response without content", async () => {
    const response = {
      status: 401,
      statusText: "Unauthorized",
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    } as unknown as Response;

    const error = await parseErrorResponse(response);
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Unauthorized");
  });

  it("should handle various status codes", async () => {
    const { decodeMsgpack } = await import("@/lib/utils/msgpack");
    (decodeMsgpack as jest.Mock).mockResolvedValue({});

    const statusCodes = [400, 401, 403, 404, 500, 502, 503];
    for (const status of statusCodes) {
      const response = {
        status,
        statusText: "Error",
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      } as unknown as Response;

      const error = await parseErrorResponse(response);
      expect(error.statusCode).toBe(status);
    }
  });

  it("should handle empty detail string", async () => {
    const { decodeMsgpack } = await import("@/lib/utils/msgpack");
    (decodeMsgpack as jest.Mock).mockResolvedValue({ detail: "" });

    const response = {
      status: 400,
      statusText: "Bad Request",
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    } as unknown as Response;

    const error = await parseErrorResponse(response);
    expect(error.message).toBe("Bad Request");
  });
});
