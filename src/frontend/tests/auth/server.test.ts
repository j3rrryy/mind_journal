jest.mock("@/i18n", () => ({
  defaultLocale: "ru",
}));

import {
  getServerLocale,
  redirectToLogin,
  getServerAccessToken,
  getServerRefreshToken,
  setServerTokens,
  clearServerTokens,
} from "@/lib/auth/server";
import { defaultLocale } from "@/i18n";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
  headers: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

describe("getServerLocale", () => {
  it("should return locale from cookie", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "en" }),
    });

    const result = await getServerLocale();
    expect(result).toBe("en");
  });

  it("should return default locale when cookie not set", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const result = await getServerLocale();
    expect(result).toBe(defaultLocale);
  });

  it("should return default locale when cookie store is empty", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(null),
    });

    const result = await getServerLocale();
    expect(result).toBe(defaultLocale);
  });
});

describe("redirectToLogin", () => {
  it("should redirect to login page with locale", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "en" }),
    });

    await redirectToLogin();
    expect(redirect).toHaveBeenCalledWith("/en/auth/login");
  });

  it("should use default locale when cookie not set", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    await redirectToLogin();
    expect(redirect).toHaveBeenCalledWith(`/${defaultLocale}/auth/login`);
  });
});

describe("getServerAccessToken", () => {
  it("should return access token from cookie", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "access_token_value" }),
    });

    const result = await getServerAccessToken();
    expect(result).toBe("access_token_value");
  });

  it("should return null when access token not set", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const result = await getServerAccessToken();
    expect(result).toBeNull();
  });
});

describe("getServerRefreshToken", () => {
  it("should return refresh token from cookie", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "refresh_token_value" }),
    });

    const result = await getServerRefreshToken();
    expect(result).toBe("refresh_token_value");
  });

  it("should return null when refresh token not set", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const result = await getServerRefreshToken();
    expect(result).toBeNull();
  });
});

describe("setServerTokens", () => {
  it("should set access and refresh tokens with secure flag for https", async () => {
    const mockCookieStore = {
      set: jest.fn(),
      get: jest.fn(),
    };
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
    (headers as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue("https"),
    });

    await setServerTokens({
      access_token: "access_token_value",
      refresh_token: "refresh_token_value",
    });

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "access_token",
      "access_token_value",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 15,
        path: "/",
      })
    );
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "refresh_token",
      "refresh_token_value",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      })
    );
  });

  it("should set secure false for http", async () => {
    const mockCookieStore = {
      set: jest.fn(),
      get: jest.fn(),
    };
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
    (headers as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue("http"),
    });

    await setServerTokens({
      access_token: "access_token_value",
      refresh_token: "refresh_token_value",
    });

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "access_token",
      "access_token_value",
      expect.objectContaining({
        secure: false,
      })
    );
  });

  it("should default to http when x-forwarded-proto not set", async () => {
    const mockCookieStore = {
      set: jest.fn(),
      get: jest.fn(),
    };
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
    (headers as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(null),
    });

    await setServerTokens({
      access_token: "access_token_value",
      refresh_token: "refresh_token_value",
    });

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "access_token",
      "access_token_value",
      expect.objectContaining({
        secure: false,
      })
    );
  });
});

describe("clearServerTokens", () => {
  it("should delete access and refresh tokens", async () => {
    const mockCookieStore = {
      delete: jest.fn(),
    };
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

    await clearServerTokens();

    expect(mockCookieStore.delete).toHaveBeenCalledWith("access_token");
    expect(mockCookieStore.delete).toHaveBeenCalledWith("refresh_token");
  });
});
