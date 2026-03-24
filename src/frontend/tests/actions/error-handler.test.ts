import { ServerApiError } from "@/lib/utils/api";
import { withActionResult, withResult, withActionResultFinally } from "@/app/actions/error-handler";

describe("error-handler", () => {
  describe("withActionResult", () => {
    it("should return success when function succeeds", async () => {
      const fn = jest.fn().mockResolvedValue(undefined);
      const result = await withActionResult(fn, "Test error");

      expect(result).toEqual({ ok: true });
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should return failure when function throws error", async () => {
      const fn = jest.fn().mockRejectedValue(new Error("Test error"));
      const result = await withActionResult(fn, "Custom error message");

      expect(result).toEqual({ ok: false, error: "Custom error message" });
    });

    it("should return ServerApiError message when error is ServerApiError", async () => {
      const fn = jest.fn().mockRejectedValue(new ServerApiError(400, "Server error message"));
      const result = await withActionResult(fn, "Fallback error");

      expect(result).toEqual({ ok: false, error: "Server error message" });
    });

    it("should throw redirect errors", async () => {
      const redirectError = { digest: "NEXT_REDIRECT:/login" };
      const fn = jest.fn().mockRejectedValue(redirectError);

      await expect(withActionResult(fn, "Test")).rejects.toEqual(redirectError);
    });

    it("should handle string errors", async () => {
      const fn = jest.fn().mockRejectedValue("String error");
      const result = await withActionResult(fn, "Fallback");

      expect(result).toEqual({ ok: false, error: "Fallback" });
    });
  });

  describe("withResult", () => {
    it("should return success with data when function succeeds", async () => {
      const fn = jest.fn().mockResolvedValue({ id: 1, name: "Test" });
      const result = await withResult(fn, "Test error");

      expect(result).toEqual({ ok: true, data: { id: 1, name: "Test" } });
    });

    it("should return failure when function throws error", async () => {
      const fn = jest.fn().mockRejectedValue(new Error("Test error"));
      const result = await withResult(fn, "Custom error message");

      expect(result).toEqual({ ok: false, error: "Custom error message" });
    });

    it("should return ServerApiError message when error is ServerApiError", async () => {
      const fn = jest.fn().mockRejectedValue(new ServerApiError(500, "Internal server error"));
      const result = await withResult(fn, "Fallback");

      expect(result).toEqual({ ok: false, error: "Internal server error" });
    });

    it("should throw redirect errors", async () => {
      const redirectError = { digest: "NEXT_REDIRECT:/login" };
      const fn = jest.fn().mockRejectedValue(redirectError);

      await expect(withResult(fn, "Test")).rejects.toEqual(redirectError);
    });

    it("should handle null return value", async () => {
      const fn = jest.fn().mockResolvedValue(null);
      const result = await withResult(fn, "Test");

      expect(result).toEqual({ ok: true, data: null });
    });

    it("should handle undefined return value", async () => {
      const fn = jest.fn().mockResolvedValue(undefined);
      const result = await withResult(fn, "Test");

      expect(result).toEqual({ ok: true, data: undefined });
    });
  });

  describe("withActionResultFinally", () => {
    it("should execute finally function on success", async () => {
      const fn = jest.fn().mockResolvedValue(undefined);
      const finallyFn = jest.fn().mockResolvedValue(undefined);
      const result = await withActionResultFinally(fn, finallyFn, "Test error");

      expect(result).toEqual({ ok: true });
      expect(fn).toHaveBeenCalledTimes(1);
      expect(finallyFn).toHaveBeenCalledTimes(1);
    });

    it("should execute finally function on failure", async () => {
      const fn = jest.fn().mockRejectedValue(new Error("Test error"));
      const finallyFn = jest.fn().mockResolvedValue(undefined);
      const result = await withActionResultFinally(fn, finallyFn, "Error");

      expect(result).toEqual({ ok: false, error: "Error" });
      expect(finallyFn).toHaveBeenCalledTimes(1);
    });

    it("should handle async finally function", async () => {
      const fn = jest.fn().mockResolvedValue(undefined);
      const finallyFn = jest.fn().mockResolvedValue(undefined);
      const result = await withActionResultFinally(fn, finallyFn, "Test");

      expect(result).toEqual({ ok: true });
    });
  });
});
