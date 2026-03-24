import {
  registerAction,
  confirmEmailAction,
  requestResetCodeAction,
  validateResetCodeAction,
  resetPasswordAction,
  loginAction,
  logoutAction,
  resendEmailConfirmationAction,
  getSessionsAction,
  revokeSessionAction,
  getProfileAction,
  updateEmailAction,
  updatePasswordAction,
  deleteProfileAction,
} from "@/app/actions/auth";

jest.mock("@/lib/server/fetch", () => ({
  fetchServer: jest.fn(),
}));

jest.mock("@/lib/auth/server", () => ({
  setServerTokens: jest.fn().mockResolvedValue(undefined),
  clearServerTokens: jest.fn().mockResolvedValue(undefined),
}));

import { fetchServer } from "@/lib/server/fetch";
import { setServerTokens, clearServerTokens } from "@/lib/auth/server";

describe("auth actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerAction", () => {
    it("should register user and set tokens", async () => {
      (fetchServer as jest.Mock)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ access_token: "access", refresh_token: "refresh" });

      const formData = new FormData();
      formData.append("username", "testuser");
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      const result = await registerAction(formData, "ru");

      expect(fetchServer).toHaveBeenCalledWith(
        "/v1/auth/register",
        "POST",
        { username: "testuser", email: "test@example.com", password: "password123" },
        false,
        "ru"
      );
      expect(setServerTokens).toHaveBeenCalledWith({
        access_token: "access",
        refresh_token: "refresh",
      });
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when registration fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Registration failed"));

      const formData = new FormData();
      formData.append("username", "testuser");
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      const result = await registerAction(formData, "ru");

      expect(result.ok).toBe(false);
    });
  });

  describe("loginAction", () => {
    it("should login and set tokens", async () => {
      (fetchServer as jest.Mock).mockResolvedValue({
        access_token: "access",
        refresh_token: "refresh",
      });

      const formData = new FormData();
      formData.append("username", "testuser");
      formData.append("password", "password123");

      const result = await loginAction(formData, "ru");

      expect(setServerTokens).toHaveBeenCalledWith({
        access_token: "access",
        refresh_token: "refresh",
      });
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when login fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Login failed"));

      const formData = new FormData();
      formData.append("username", "testuser");
      formData.append("password", "password123");

      const result = await loginAction(formData, "ru");

      expect(result.ok).toBe(false);
    });
  });

  describe("logoutAction", () => {
    it("should logout and clear tokens", async () => {
      (fetchServer as jest.Mock).mockResolvedValue(undefined);

      const result = await logoutAction();

      expect(fetchServer).toHaveBeenCalledWith("/v1/auth/log-out", "POST");
      expect(clearServerTokens).toHaveBeenCalled();
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when logout fails but still clear tokens", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Logout failed"));

      const result = await logoutAction();

      expect(clearServerTokens).toHaveBeenCalled();
      expect(result.ok).toBe(false);
    });
  });

  describe("confirmEmailAction", () => {
    it("should confirm email", async () => {
      (fetchServer as jest.Mock).mockResolvedValue(undefined);

      const result = await confirmEmailAction("token123");

      expect(fetchServer).toHaveBeenCalledWith(
        "/v1/auth/confirm-email?token=token123",
        "GET",
        undefined,
        false
      );
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when confirmation fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Confirmation failed"));

      const result = await confirmEmailAction("token123");

      expect(result.ok).toBe(false);
    });
  });

  describe("requestResetCodeAction", () => {
    it("should request reset code", async () => {
      (fetchServer as jest.Mock).mockResolvedValue({ user_id: "user123" });

      const result = await requestResetCodeAction("test@example.com", "ru");

      expect(fetchServer).toHaveBeenCalledWith(
        "/v1/auth/reset-code/request",
        "POST",
        { email: "test@example.com" },
        false,
        "ru"
      );
      expect(result.ok).toBe(true);
      expect(result.data).toEqual({ userId: "user123" });
    });

    it("should return failure when request fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Request failed"));

      const result = await requestResetCodeAction("test@example.com", "ru");

      expect(result.ok).toBe(false);
    });
  });

  describe("validateResetCodeAction", () => {
    it("should validate reset code", async () => {
      (fetchServer as jest.Mock).mockResolvedValue({ is_valid: true });

      const result = await validateResetCodeAction("user123", "123456");

      expect(fetchServer).toHaveBeenCalledWith(
        "/v1/auth/reset-code/validate",
        "POST",
        { user_id: "user123", code: "123456" },
        false
      );
      expect(result.ok).toBe(true);
      expect(result.data).toEqual({ isValid: true });
    });

    it("should return failure when code is invalid", async () => {
      (fetchServer as jest.Mock).mockResolvedValue({ is_valid: false });

      const result = await validateResetCodeAction("user123", "000000");

      expect(result.ok).toBe(false);
    });

    it("should return failure when validation fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Validation failed"));

      const result = await validateResetCodeAction("user123", "123456");

      expect(result.ok).toBe(false);
    });
  });

  describe("resetPasswordAction", () => {
    it("should reset password", async () => {
      (fetchServer as jest.Mock).mockResolvedValue(undefined);

      const result = await resetPasswordAction("user123", "newpassword123");

      expect(fetchServer).toHaveBeenCalledWith(
        "/v1/auth/reset-password",
        "POST",
        { user_id: "user123", new_password: "newpassword123" },
        false
      );
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when reset fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Reset failed"));

      const result = await resetPasswordAction("user123", "newpassword123");

      expect(result.ok).toBe(false);
    });
  });

  describe("resendEmailConfirmationAction", () => {
    it("should resend confirmation email", async () => {
      (fetchServer as jest.Mock).mockResolvedValue(undefined);

      const result = await resendEmailConfirmationAction("ru");

      expect(fetchServer).toHaveBeenCalledWith(
        "/v1/auth/resend-email-confirmation-mail",
        "POST",
        undefined,
        true,
        "ru"
      );
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when resend fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Resend failed"));

      const result = await resendEmailConfirmationAction("ru");

      expect(result.ok).toBe(false);
    });
  });

  describe("getSessionsAction", () => {
    it("should return sessions list", async () => {
      const mockSessions = { sessions: [] };
      (fetchServer as jest.Mock).mockResolvedValue(mockSessions);

      const result = await getSessionsAction();

      expect(fetchServer).toHaveBeenCalledWith("/v1/auth/sessions");
      expect(result.ok).toBe(true);
      expect(result.data).toEqual(mockSessions);
    });

    it("should return failure when get sessions fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Get sessions failed"));

      const result = await getSessionsAction();

      expect(result.ok).toBe(false);
    });
  });

  describe("revokeSessionAction", () => {
    it("should revoke session", async () => {
      (fetchServer as jest.Mock).mockResolvedValue(undefined);

      const result = await revokeSessionAction("session123");

      expect(fetchServer).toHaveBeenCalledWith("/v1/auth/sessions/session123", "DELETE");
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when revoke fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Revoke failed"));

      const result = await revokeSessionAction("session123");

      expect(result.ok).toBe(false);
    });
  });

  describe("getProfileAction", () => {
    it("should return profile data", async () => {
      const mockProfile = {
        user_id: "user123",
        username: "testuser",
        email: "test@example.com",
        email_confirmed: true,
        registered_at: "2024-01-01",
      };
      (fetchServer as jest.Mock).mockResolvedValue(mockProfile);

      const result = await getProfileAction();

      expect(fetchServer).toHaveBeenCalledWith(
        "/v1/auth/profile",
        "GET",
        undefined,
        true,
        null,
        false,
        true
      );
      expect(result.ok).toBe(true);
      expect(result.data).toEqual(mockProfile);
    });

    it("should return failure when get profile fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Get profile failed"));

      const result = await getProfileAction();

      expect(result.ok).toBe(false);
    });

    it("should pass allowLoginRedirect parameter", async () => {
      (fetchServer as jest.Mock).mockResolvedValue({
        user_id: "user123",
        username: "test",
        email: "test@test.com",
        email_confirmed: true,
        registered_at: "2024-01-01",
      });

      await getProfileAction(false);

      expect(fetchServer).toHaveBeenCalledWith(
        "/v1/auth/profile",
        "GET",
        undefined,
        true,
        null,
        false,
        false
      );
    });
  });

  describe("updateEmailAction", () => {
    it("should update email", async () => {
      (fetchServer as jest.Mock).mockResolvedValue(undefined);

      const result = await updateEmailAction("newemail@example.com", "ru");

      expect(fetchServer).toHaveBeenCalledWith(
        "/v1/auth/profile/email",
        "PATCH",
        { new_email: "newemail@example.com" },
        true,
        "ru"
      );
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when update fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Update failed"));

      const result = await updateEmailAction("newemail@example.com", "ru");

      expect(result.ok).toBe(false);
    });
  });

  describe("updatePasswordAction", () => {
    it("should update password", async () => {
      (fetchServer as jest.Mock).mockResolvedValue(undefined);

      const result = await updatePasswordAction("oldpassword", "newpassword123");

      expect(fetchServer).toHaveBeenCalledWith("/v1/auth/profile/password", "PATCH", {
        old_password: "oldpassword",
        new_password: "newpassword123",
      });
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when update fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Update failed"));

      const result = await updatePasswordAction("oldpassword", "newpassword123");

      expect(result.ok).toBe(false);
    });
  });

  describe("deleteProfileAction", () => {
    it("should delete profile", async () => {
      (fetchServer as jest.Mock).mockResolvedValue(undefined);

      const result = await deleteProfileAction();

      expect(fetchServer).toHaveBeenCalledWith("/v1/auth/profile", "DELETE");
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when delete fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Delete failed"));

      const result = await deleteProfileAction();

      expect(result.ok).toBe(false);
    });
  });
});
