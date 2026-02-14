import { decodeMsgpack } from "@/lib/utils/msgpack";
import { getClientInfo } from "@/lib/utils/client";

export class ServerApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public extra?: unknown
  ) {
    super(message);
    this.name = "ServerApiError";
  }
}

export async function createApiHeaders(withClientInfo = false): Promise<Headers> {
  const headers = new Headers();
  headers.set("Content-Type", "application/x-msgpack");

  if (withClientInfo) {
    const { forwarded, userAgent } = await getClientInfo();
    if (forwarded) {
      headers.set("X-Forwarded-For", forwarded);
    }
    if (userAgent) {
      headers.set("User-Agent", userAgent);
    }
  }

  return headers;
}

export async function parseErrorResponse(response: Response): Promise<ServerApiError> {
  try {
    const buffer = await response.arrayBuffer();
    const error = await decodeMsgpack(buffer);
    return new ServerApiError(
      response.status,
      (error as { detail?: string }).detail || response.statusText
    );
  } catch {
    return new ServerApiError(response.status, response.statusText);
  }
}
