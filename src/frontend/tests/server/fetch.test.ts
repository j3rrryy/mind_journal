process.env.API_URL = "http://localhost:8000";

import { fetchServer } from "@/lib/server/fetch";

jest.mock("@/lib/utils/msgpack", () => ({
  encodeMsgpack: jest.fn(),
  decodeMsgpack: jest.fn(),
}));

jest.mock("@/lib/utils/api", () => ({
  createApiHeaders: jest.fn(),
  parseErrorResponse: jest.fn(),
}));

jest.mock("@/lib/auth/server", () => ({
  getServerAccessToken: jest.fn(),
  getServerRefreshToken: jest.fn(),
  setServerTokens: jest.fn(),
  redirectToLogin: jest.fn(),
}));

jest.mock("@/lib/utils/client", () => ({
  getClientInfo: jest.fn(),
}));

import { encodeMsgpack, decodeMsgpack } from "@/lib/utils/msgpack";
import { createApiHeaders, parseErrorResponse } from "@/lib/utils/api";
import {
  getServerAccessToken,
  getServerRefreshToken,
  setServerTokens,
  redirectToLogin,
} from "@/lib/auth/server";
import { getClientInfo } from "@/lib/utils/client";

const mockEncodeMsgpack = encodeMsgpack as jest.Mock;
const mockDecodeMsgpack = decodeMsgpack as jest.Mock;
const mockCreateApiHeaders = createApiHeaders as jest.Mock;
const mockParseErrorResponse = parseErrorResponse as jest.Mock;
const mockGetServerAccessToken = getServerAccessToken as jest.Mock;
const mockGetServerRefreshToken = getServerRefreshToken as jest.Mock;
const mockSetServerTokens = setServerTokens as jest.Mock;
const mockRedirectToLogin = redirectToLogin as jest.Mock;
const mockGetClientInfo = getClientInfo as jest.Mock;

describe("fetchServer", () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    process.env.API_URL = "http://localhost:8000";
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    jest.resetAllMocks();

    mockEncodeMsgpack.mockResolvedValue(new ArrayBuffer(8));
    mockCreateApiHeaders.mockResolvedValue(new Headers());
    mockParseErrorResponse.mockResolvedValue(new Error("Mock error"));
    mockGetClientInfo.mockResolvedValue({
      forwarded: "192.168.1.1",
      userAgent: "Mozilla/5.0",
    });
  });

  describe("without access token required", () => {
    it("should make GET request without token", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: jest.fn().mockResolvedValue({ data: "test" }),
      });

      const result = await fetchServer("/test", "GET", undefined, false);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8000/test",
        expect.objectContaining({
          method: "GET",
          cache: "no-store",
        })
      );
      expect(result).toEqual({ data: "test" });
    });

    it("should make POST request with body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: jest.fn().mockResolvedValue({ result: "ok" }),
      });

      const body = { key: "value" };
      const result = await fetchServer("/test", "POST", body, false);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8000/test",
        expect.objectContaining({
          method: "POST",
        })
      );
      expect(result).toEqual({ result: "ok" });
    });
  });

  describe("with access token required", () => {
    it("should add Authorization header when token exists", async () => {
      mockGetServerAccessToken.mockResolvedValue("access_token_123");

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: jest.fn().mockResolvedValue({ data: "test" }),
      });

      await fetchServer("/test", "GET", undefined, true);

      const call = mockFetch.mock.calls[0];
      expect(call[1].headers.get("Authorization")).toBe("Bearer access_token_123");
    });

    it("should refresh token when not present", async () => {
      mockGetServerAccessToken.mockResolvedValueOnce(null);
      mockGetServerRefreshToken.mockResolvedValue("refresh_token_123");
      mockSetServerTokens.mockResolvedValue(undefined);

      mockDecodeMsgpack.mockResolvedValueOnce({
        access_token: "new_access_token",
        refresh_token: "new_refresh_token",
      });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
          json: jest.fn().mockResolvedValue({ data: "test" }),
        });

      await fetchServer("/test", "GET", undefined, true);

      expect(mockSetServerTokens).toHaveBeenCalledWith({
        access_token: "new_access_token",
        refresh_token: "new_refresh_token",
      });
    });

    it.skip("should retry request after token refresh on 401", async () => {
      mockGetServerAccessToken.mockResolvedValue("expired_token");
      mockGetServerRefreshToken.mockResolvedValue("refresh_token_123");
      mockSetServerTokens.mockResolvedValue(undefined);

      mockDecodeMsgpack.mockResolvedValueOnce({
        access_token: "new_access_token",
        refresh_token: "new_refresh_token",
      });

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: "Unauthorized",
          arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
          json: jest.fn().mockResolvedValue({ data: "test" }),
        });

      const result = await fetchServer("/test", "GET", undefined, true);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockParseErrorResponse).not.toHaveBeenCalled();
      expect(result).toEqual({ data: "test" });
    });

    it.skip("should redirect to login when refresh fails on 401", async () => {
      mockGetServerAccessToken.mockResolvedValue("expired_token");
      mockGetServerRefreshToken.mockResolvedValue("refresh_token_123");
      mockRedirectToLogin.mockResolvedValue(undefined);
      mockParseErrorResponse.mockResolvedValue(new Error("Parsed error"));

      mockDecodeMsgpack.mockRejectedValueOnce(new Error("Refresh failed"));

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      });

      await expect("Parsed error");

      expect(mockRedirectToLogin).toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should throw ServerApiError on non-ok response", async () => {
      mockGetServerAccessToken.mockResolvedValue("token");

      const mockError = new Error("Server error") as Error & { statusCode: number };
      mockError.statusCode = 400;
      mockParseErrorResponse.mockResolvedValue(mockError);

      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      });

      await expect(fetchServer("/test", "GET", undefined, true)).rejects.toThrow();
      expect(mockParseErrorResponse).toHaveBeenCalled();
    });
  });

  describe("204 No Content", () => {
    it("should return undefined for 204 response", async () => {
      mockGetServerAccessToken.mockResolvedValue("token");

      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
        headers: new Headers(),
      });

      const result = await fetchServer("/test", "GET", undefined, true);

      expect(result).toBeUndefined();
    });
  });

  describe("msgpack response", () => {
    it("should decode msgpack response", async () => {
      mockGetServerAccessToken.mockResolvedValue("token");
      mockDecodeMsgpack.mockResolvedValue({ msgpackData: true });

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/x-msgpack" }),
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      });

      const result = await fetchServer("/test", "GET", undefined, true);

      expect(result).toEqual({ msgpackData: true });
    });
  });

  describe("locale and client info", () => {
    it("should pass locale and client info to headers", async () => {
      const mockHeaders = new Headers({
        "Accept-Language": "ru",
        "X-Forwarded-For": "192.168.1.1",
      });
      mockCreateApiHeaders.mockResolvedValue(mockHeaders);

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: jest.fn().mockResolvedValue({ data: "test" }),
      });

      await fetchServer("/test", "GET", undefined, false, "ru", true);

      expect(mockCreateApiHeaders).toHaveBeenCalledWith("ru", true);
    });
  });

  describe("allowLoginRedirect option", () => {
    it("should not redirect when allowLoginRedirect is false and no refresh token", async () => {
      mockGetServerAccessToken.mockResolvedValue(null);
      mockGetServerRefreshToken.mockResolvedValue(null);

      await expect(
        fetchServer("/test", "GET", undefined, true, null, false, false)
      ).rejects.toThrow("No refresh token");

      expect(mockRedirectToLogin).not.toHaveBeenCalled();
    });
  });
});
