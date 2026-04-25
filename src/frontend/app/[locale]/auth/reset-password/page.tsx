"use client";

import { useState, FormEvent, useCallback, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AlertMessage } from "@/components/common/AlertMessage";
import { Button } from "@/components/common/Button";
import { resetPasswordAction } from "@/app/actions/auth";
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "@/lib/constants/validation";
import PasswordInput from "@/components/form/PasswordInput";
import { LoadingDots } from "@/components/common/LoadingDots";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth.resetPassword");
  const tc = useTranslations("common");

  const userId = searchParams.get("userId") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      router.replace(`/${locale}/auth/forgot-password`);
    }
  }, [userId, locale, router]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      if (!userId) return;
      if (newPassword.length < PASSWORD_MIN_LENGTH) {
        setError(tc("passwordTooShort"));
        return;
      }
      if (newPassword.length > PASSWORD_MAX_LENGTH) {
        setError(tc("passwordTooLong"));
        return;
      }
      if (newPassword !== confirmPassword) {
        setError(tc("passwordMismatch"));
        return;
      }

      setIsLoading(true);
      const result = await resetPasswordAction(userId, newPassword);
      setIsLoading(false);

      if (result.ok) {
        setSuccess(t("success"));
        setTimeout(() => {
          router.replace(`/${locale}/auth/login`);
        }, 2000);
      } else {
        setError(result.error || tc("error"));
      }
    },
    [userId, newPassword, confirmPassword, locale, router, t, tc]
  );

  if (!userId) {
    return (
      <AuthLayout>
        <LoadingDots fullPage={false} />;
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="mb-6 text-2xl font-semibold text-text-primary">{t("title")}</h2>

      {error && <AlertMessage message={error} variant="danger" />}

      {success && <AlertMessage message={success} variant="success" />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <PasswordInput
            id="newPassword"
            label={tc("newPassword")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder={tc("newPasswordPlaceholder")}
          />
        </div>
        <div>
          <PasswordInput
            id="confirmPassword"
            label={tc("confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder={tc("confirmPasswordPlaceholder")}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? t("submitting") : t("submit")}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href={`/${locale}/auth/forgot-password`} className="text-link">
          {tc("backToForgot")}
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout>
          <LoadingDots fullPage={false} />;
        </AuthLayout>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
