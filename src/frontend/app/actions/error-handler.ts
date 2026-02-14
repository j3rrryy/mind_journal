import { ServerApiError } from "@/lib/utils/api";

export type Result<T, E = string> = { ok: true; data: T } | { ok: false; error: E };

type Failure = { ok: false; error: string };
type Success = { ok: true };

function isRedirectError(error: unknown): error is { digest: string } {
  if (error && typeof error === "object" && "digest" in error) {
    const maybeError = error as { digest?: unknown };
    return typeof maybeError.digest === "string" && maybeError.digest.startsWith("NEXT_REDIRECT");
  }
  return false;
}

function handleError(error: unknown, errorContext: string): Failure {
  if (isRedirectError(error)) throw error;
  return {
    ok: false,
    error: error instanceof ServerApiError ? error.message : errorContext,
  };
}

export async function withActionResult(
  fn: () => Promise<void>,
  errorContext: string
): Promise<Failure | Success> {
  try {
    await fn();
    return { ok: true };
  } catch (error) {
    return handleError(error, errorContext);
  }
}

export async function withResult<T>(
  fn: () => Promise<T>,
  errorContext: string
): Promise<Result<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    return handleError(error, errorContext);
  }
}

export async function withActionResultFinally(
  fn: () => Promise<void>,
  finallyFn: () => Promise<void> | void,
  errorContext: string
): Promise<Failure | Success> {
  let result: Failure | Success = { ok: true };
  try {
    await fn();
  } catch (error) {
    result = handleError(error, errorContext);
  } finally {
    await finallyFn();
  }
  return result;
}
