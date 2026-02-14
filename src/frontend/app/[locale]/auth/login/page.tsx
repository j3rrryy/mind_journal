"use client";

import { useState, FormEvent, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AlertMessage } from "@/components/common/AlertMessage";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/form/Input";
import { loginAction } from "@/app/actions/auth";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  USERNAME_PATTERN,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "@/lib/constants/validation";
import PasswordInput from "@/components/form/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");

      if (!USERNAME_PATTERN.test(username)) {
        setError(tc("usernameInvalid"));
        return;
      }

      if (password.length < PASSWORD_MIN_LENGTH) {
        setError(tc("passwordTooShort"));
        return;
      }

      if (password.length > PASSWORD_MAX_LENGTH) {
        setError(tc("passwordTooLong"));
        return;
      }

      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const result = await loginAction(formData);

        if (result.ok) {
          await refreshUser();
          router.replace(`/${locale}/dashboard`);
        } else {
          setError(result.error || t("loginError"));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("loginError"));
      } finally {
        setIsLoading(false);
      }
    },
    [username, password, locale, router, t, tc, refreshUser]
  );

  return (
    <AuthLayout>
      <h2 className="mb-6 text-2xl font-semibold text-text-primary">{t("title")}</h2>

      {error && <AlertMessage message={error} variant="danger" />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="username" className="mb-2 block text-sm text-text-label">
            {tc("username")}
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            pattern="^[a-zA-Z0-9_-]{3,30}$"
            maxLength={30}
            placeholder={tc("usernamePlaceholder")}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm text-text-label">
              {tc("password")}
            </label>
            <Link href={`/${locale}/auth/forgot-password`} className="text-link">
              {tc("forgotPassword")}
            </Link>
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={PASSWORD_MAX_LENGTH}
            placeholder={tc("passwordPlaceholder")}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? t("submitting") : t("submit")}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-secondary">
          {tc("noAccount")}{" "}
          <Link href={`/${locale}/auth/register`} className="text-link">
            {tc("register")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
