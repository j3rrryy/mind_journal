"use client";

import { useState, FormEvent, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AlertMessage } from "@/components/common/AlertMessage";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/form/Input";
import { registerAction } from "@/app/actions/auth";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  USERNAME_PATTERN,
  EMAIL_PATTERN,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
} from "@/lib/constants/validation";
import PasswordInput from "@/components/form/PasswordInput";
import { Checkbox } from "@/components/form/Checkbox";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth.register");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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

      if (!EMAIL_PATTERN.test(email)) {
        setError(tc("emailInvalid"));
        return;
      }
      if (email.length > EMAIL_MAX_LENGTH) {
        setError(tc("emailInvalid"));
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

      if (password !== confirmPassword) {
        setError(tc("passwordMismatch"));
        return;
      }

      if (!acceptedTerms) {
        setError(tc("acceptTermsRequired"));
        return;
      }

      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);

        const result = await registerAction(formData, locale);

        if (result.ok) {
          await refreshUser();
          router.replace(`/${locale}/dashboard`);
        } else {
          setError(result.error || t("registerError"));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("registerError"));
      } finally {
        setIsLoading(false);
      }
    },
    [username, email, password, confirmPassword, acceptedTerms, locale, router, t, tc, refreshUser]
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
            placeholder={tc("usernamePlaceholder")}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-text-label">
            {tc("email")}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
            placeholder={tc("emailPlaceholder")}
          />
        </div>

        <div>
          <PasswordInput
            id="password"
            label={tc("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={tc("passwordPlaceholder")}
          />
        </div>

        <div>
          <PasswordInput
            id="confirmPassword"
            label={tc("confirmPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder={tc("confirmPasswordPlaceholder")}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            required
          />
          <label htmlFor="terms" className="text-sm text-text-label">
            {tc("acceptTerms")}
          </label>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? t("submitting") : t("submit")}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-secondary">
          {tc("hasAccount")}{" "}
          <Link href={`/${locale}/auth/login`} className="text-link">
            {tc("login")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
