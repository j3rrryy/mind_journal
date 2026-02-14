"use server";

import { fetchServer } from "@/lib/server/fetch";
import { setServerTokens, clearServerTokens } from "@/lib/auth/server";
import type { Profile, SessionList, Tokens } from "@/types";
import { getCountryCode } from "@/lib/geo/country";
import { withActionResult, withActionResultFinally, withResult } from "./error-handler";

export async function registerAction(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  return withActionResult(async () => {
    await fetchServer<void>("/v1/auth/register", "POST", { username, email, password }, false);
    const tokens = await fetchServer<Tokens>(
      "/v1/auth/log-in",
      "POST",
      { username, password },
      false,
      true
    );
    await setServerTokens(tokens);
  }, "Registration failed");
}

export async function confirmEmailAction(token: string) {
  return withActionResult(async () => {
    await fetchServer<void>(`/v1/auth/confirm-email?token=${token}`, "GET", undefined, false);
  }, "Failed to confirm email");
}

export async function requestResetCodeAction(email: string) {
  return withResult(async () => {
    const result = await fetchServer<{ user_id: string }>(
      "/v1/auth/reset-code/request",
      "POST",
      { email },
      false
    );
    return { userId: result.user_id };
  }, "Failed to request reset code");
}

export async function validateResetCodeAction(userId: string, code: string) {
  return withResult(async () => {
    const result = await fetchServer<{ is_valid: boolean }>(
      "/v1/auth/reset-code/validate",
      "POST",
      { user_id: userId, code },
      false
    );

    if (!result.is_valid) {
      throw new Error();
    }

    return { isValid: result.is_valid };
  }, "Failed to validate code");
}

export async function resetPasswordAction(userId: string, newPassword: string) {
  return withActionResult(async () => {
    await fetchServer<void>(
      "/v1/auth/reset-password",
      "POST",
      { user_id: userId, new_password: newPassword },
      false
    );
  }, "Failed to reset password");
}

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  return withActionResult(async () => {
    const tokens = await fetchServer<Tokens>(
      "/v1/auth/log-in",
      "POST",
      { username, password },
      false,
      true
    );
    await setServerTokens(tokens);
  }, "Login failed");
}

export async function logoutAction() {
  return withActionResultFinally(
    async () => {
      await fetchServer<void>("/v1/auth/log-out", "POST");
    },
    async () => {
      await clearServerTokens();
    },
    "Logout failed"
  );
}

export async function resendEmailConfirmationAction() {
  return withActionResult(async () => {
    await fetchServer<void>("/v1/auth/resend-email-confirmation-mail", "POST");
  }, "Failed to resend confirmation");
}

export async function getSessionsAction() {
  return withResult(async () => {
    const sessions = await fetchServer<SessionList>("/v1/auth/sessions");
    const sessionsWithCountry = await Promise.all(
      (sessions?.sessions || []).map(async (session) => ({
        ...session,
        countryCode: await getCountryCode(session.user_ip),
      }))
    );
    return { sessions: sessionsWithCountry };
  }, "Failed to load sessions");
}

export async function revokeSessionAction(sessionId: string) {
  return withActionResult(async () => {
    await fetchServer<void>(`/v1/auth/sessions/${sessionId}`, "DELETE");
  }, "Failed to revoke session");
}

export async function getProfileAction(allowLoginRedirect: boolean = true) {
  return withResult(
    () =>
      fetchServer<Profile>("/v1/auth/profile", "GET", undefined, true, false, allowLoginRedirect),
    "Failed to load profile"
  );
}

export async function updateEmailAction(newEmail: string) {
  return withActionResult(async () => {
    await fetchServer<void>("/v1/auth/profile/email", "PATCH", { new_email: newEmail });
  }, "Failed to update email");
}

export async function updatePasswordAction(oldPassword: string, newPassword: string) {
  return withActionResult(async () => {
    await fetchServer<void>("/v1/auth/profile/password", "PATCH", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }, "Failed to update password");
}

export async function deleteProfileAction() {
  return withActionResult(async () => {
    await fetchServer<void>("/v1/auth/profile", "DELETE");
  }, "Failed to delete profile");
}
