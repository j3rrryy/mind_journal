import { decodeMsgpack, encodeMsgpack } from "@/lib/utils/msgpack";
import { parseErrorResponse, createApiHeaders } from "@/lib/utils/api";
import {
  getServerAccessToken,
  getServerRefreshToken,
  setServerTokens,
  redirectToLogin,
} from "@/lib/auth/server";
import type { Tokens } from "@/types";

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error("API_URL environment variable is not defined");
}

let refreshPromise: Promise<string> | null = null;

async function refreshServerToken(allowLoginRedirect: boolean = true): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = await getServerRefreshToken();
    if (!refreshToken) {
      if (!allowLoginRedirect) {
        throw new Error("No refresh token");
      }
      await redirectToLogin();
    }

    try {
      const headers = await createApiHeaders(true);
      const body = await encodeMsgpack({ refresh_token: refreshToken });
      const response = await fetch(`${API_URL}/v1/auth/refresh-tokens`, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        throw await parseErrorResponse(response);
      }

      const responseBuffer = await response.arrayBuffer();
      const tokens = (await decodeMsgpack(responseBuffer)) as Tokens;
      await setServerTokens(tokens);
      return tokens.access_token;
    } catch (error) {
      if (allowLoginRedirect) await redirectToLogin();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function fetchServer<T>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body?: unknown,
  accessTokenRequired: boolean = true,
  withClientInfo: boolean = false,
  allowLoginRedirect: boolean = true
): Promise<T> {
  const headers = await createApiHeaders(withClientInfo);

  if (accessTokenRequired) {
    let accessToken = await getServerAccessToken();
    if (!accessToken) {
      accessToken = await refreshServerToken(allowLoginRedirect);
    }
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    cache: "no-store",
  };

  if (body) {
    fetchOptions.body = await encodeMsgpack(body);
  }
  let response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

  if (accessTokenRequired && response.status === 401) {
    try {
      const newToken = await refreshServerToken(allowLoginRedirect);
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
    } catch {
      if (allowLoginRedirect) await redirectToLogin();
    }
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/x-msgpack")) {
    const buffer = await response.arrayBuffer();
    return (await decodeMsgpack(buffer)) as T;
  }

  return response.json() as Promise<T>;
}
