"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { confirmEmailAction } from "@/app/actions/auth";
import { LoadingDots } from "@/components/common/LoadingDots";
import { Button } from "@/components/common/Button";

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("auth.confirmEmail");
  const tc = useTranslations("common");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");

    const processConfirmation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));

      if (!token) {
        setStatus("error");
        setError(t("noToken"));
        return;
      }

      setStatus("loading");
      const result = await confirmEmailAction(token);
      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(result.error || t("failed"));
      }
    };

    processConfirmation();
  }, [searchParams, t]);

  if (status === "loading") {
    return (
      <AuthLayout>
        <h2 className="mb-6 text-2xl font-semibold text-text-primary">{t("title")}</h2>
        <LoadingDots fullPage={false} />
      </AuthLayout>
    );
  }

  if (status === "success") {
    return (
      <AuthLayout>
        <h2 className="mb-6 text-2xl font-semibold text-text-primary">{t("title")}</h2>
        <div className="space-y-4">
          <p className="text-green-700 dark:text-green-400">{t("success")}</p>
          <Button href={`/${locale}/auth/login`} className="w-full" size="lg">
            {tc("login")}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="mb-6 text-2xl font-semibold text-text-primary">{t("title")}</h2>
      <div className="space-y-4">
        <p className="text-red-700 dark:text-red-400">{error}</p>
        <Button href={`/${locale}/auth/login`} className="w-full" size="lg">
          {tc("login")}
        </Button>
      </div>
    </AuthLayout>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout>
          <LoadingDots fullPage={false} />
        </AuthLayout>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
}
