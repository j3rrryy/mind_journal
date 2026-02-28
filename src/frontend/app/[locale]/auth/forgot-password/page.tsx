"use client";

import { useState, FormEvent, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { CodeInput } from "@/components/form/CodeInput";
import { AlertMessage } from "@/components/common/AlertMessage";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/form/Input";
import { requestResetCodeAction, validateResetCodeAction } from "@/app/actions/auth";
import { EMAIL_PATTERN, EMAIL_MAX_LENGTH, RESET_CODE_LENGTH } from "@/lib/constants/validation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth.forgotPassword");
  const tc = useTranslations("common");

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestCode = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      if (!EMAIL_PATTERN.test(email)) {
        setError(tc("emailInvalid"));
        return;
      }
      if (email.length > EMAIL_MAX_LENGTH) {
        setError(tc("emailInvalid"));
        return;
      }

      setIsLoading(true);
      const result = await requestResetCodeAction(email, locale);
      setIsLoading(false);

      if (result.ok) {
        setUserId(result.data.userId);
        setStep("code");
        setSuccess(t("success"));
      } else {
        setError(result.error || tc("error"));
      }
    },
    [email, t, tc, locale]
  );

  const handleVerifyCode = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");

      if (code.length !== RESET_CODE_LENGTH) {
        return;
      }

      setIsLoading(true);
      const result = await validateResetCodeAction(userId, code);
      setIsLoading(false);

      if (result.ok) {
        router.push(`/${locale}/auth/reset-password?userId=${encodeURIComponent(userId)}`);
      } else {
        setError(result.error || tc("error"));
      }
    },
    [userId, code, locale, router, tc]
  );

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      if (error) setError("");
    },
    [error]
  );

  return (
    <AuthLayout>
      <h2 className="mb-6 text-2xl font-semibold text-text-primary">{t("title")}</h2>

      {success && <AlertMessage message={success} variant="success" />}

      {error && error !== "Failed to validate code" && (
        <AlertMessage message={error} variant="danger" />
      )}

      {step === "email" ? (
        <form onSubmit={handleRequestCode} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-text-label">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
              maxLength={EMAIL_MAX_LENGTH}
              placeholder={tc("emailPlaceholder")}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? t("submitting") : t("submit")}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div className="py-2">
            <CodeInput
              value={code}
              onChange={handleCodeChange}
              disabled={isLoading}
              error={!!error}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || code.length !== RESET_CODE_LENGTH}
            className="w-full"
            size="lg"
          >
            {isLoading ? t("submitting") : tc("continue")}
          </Button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link href={`/${locale}/auth/login`} className="text-link">
          {tc("backToLogin")}
        </Link>
      </div>
    </AuthLayout>
  );
}
