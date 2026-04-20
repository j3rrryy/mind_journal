"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  updateEmailAction,
  updatePasswordAction,
  deleteProfileAction,
  getSessionsAction,
  revokeSessionAction,
  resendEmailConfirmationAction,
} from "@/app/actions/auth";
import { deleteAllRecordsAction } from "@/app/actions/wellness";
import { PageTitle } from "@/components/layout/PageTitle";
import { AlertMessage } from "@/components/common/AlertMessage";
import { SectionCard } from "@/components/layout/SectionCard";
import { Button } from "@/components/common/Button";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { formatDate } from "@/lib/utils/date";
import {
  EMAIL_PATTERN,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "@/lib/constants/validation";
import { LoadingDots } from "@/components/common/LoadingDots";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import type { SessionInfo } from "@/types";
import LocaleSwitcher from "@/components/profile/LocaleSwitcher";
import CountryIndicator from "@/components/profile/CountryIndicator";
import PasswordInput from "@/components/form/PasswordInput";
import { Input } from "@/components/form/Input";

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [resendCooldown, setResendCooldown] = useState(0);

  const profileTabs = useMemo(
    () => [
      { id: "profile", label: t("tabs.profile") },
      { id: "security", label: t("tabs.security") },
    ],
    [t]
  );

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleUpdateEmail = useCallback(async () => {
    if (!newEmail || !user) return;
    setError("");
    if (!EMAIL_PATTERN.test(newEmail)) {
      setError(tc("emailInvalid"));
      return;
    }
    if (newEmail.length > EMAIL_MAX_LENGTH) {
      setError(tc("emailInvalid"));
      return;
    }
    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      setError(t("emailSameAsCurrent"));
      return;
    }
    setLoading(true);
    setSuccess("");

    const result = await updateEmailAction(newEmail, locale);
    if (result.ok) {
      setSuccess(t("emailUpdated"));
      setNewEmail("");
      await refreshUser();
    } else {
      setError(result.error || tc("error"));
    }
    setLoading(false);
  }, [newEmail, refreshUser, t, tc, locale, user]);

  const handleUpdatePassword = useCallback(async () => {
    if (!oldPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setError(tc("passwordMismatch"));
      return;
    }
    if (oldPassword.length < PASSWORD_MIN_LENGTH) {
      setError(tc("passwordTooShort"));
      return;
    }
    if (oldPassword.length > PASSWORD_MAX_LENGTH) {
      setError(tc("passwordTooLong"));
      return;
    }
    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      setError(tc("passwordTooShort"));
      return;
    }
    if (newPassword.length > PASSWORD_MAX_LENGTH) {
      setError(tc("passwordTooLong"));
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await updatePasswordAction(oldPassword, newPassword);
    if (result.ok) {
      await logout();
    } else {
      setError(result.error || tc("error"));
    }
    setLoading(false);
  }, [oldPassword, newPassword, confirmPassword, logout, tc]);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const handleDeleteAccount = useCallback(async () => {
    setLoading(true);
    const result = await deleteProfileAction();
    if (result.ok) {
      await logout();
    } else {
      setError(result.error || tc("error"));
    }
    setLoading(false);
    setShowDeleteModal(false);
  }, [logout, tc]);

  const handleClearData = useCallback(async () => {
    setLoading(true);
    const result = await deleteAllRecordsAction();
    if (result.ok) {
      setSuccess(t("dataCleared"));
    } else {
      setError(result.error || tc("error"));
    }
    setLoading(false);
    setShowClearDataModal(false);
  }, [t, tc]);

  const loadSessions = useCallback(async () => {
    const result = await getSessionsAction();
    if (result.ok) {
      setSessions(result.data.sessions as SessionInfo[]);
    }
  }, []);

  const handleRevokeSession = useCallback(
    async (sessionId: string) => {
      await revokeSessionAction(sessionId);
      await loadSessions();
    },
    [loadSessions]
  );

  const handleResendConfirmation = useCallback(async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError("");
    setSuccess("");
    const result = await resendEmailConfirmationAction(locale);
    if (result.ok) {
      setSuccess(t("resendSuccess"));
      setResendCooldown(60);
    } else {
      setError(result.error || tc("error"));
    }
    setLoading(false);
  }, [resendCooldown, t, tc, locale]);

  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId as "profile" | "security");
      if (tabId === "security") {
        loadSessions();
      }
    },
    [loadSessions]
  );

  if (!user) {
    return <LoadingDots />;
  }

  return (
    <div className="space-y-6">
      <PageTitle title={t("title")} description={t("subtitle")} action={<LocaleSwitcher />} />

      {error && <AlertMessage message={error} variant="danger" />}
      {success && <AlertMessage message={success} variant="success" />}

      {!user.email_confirmed && (
        <AlertMessage
          message={t("emailNotConfirmed")}
          variant="warning"
          action={
            <Button
              variant="warning"
              size="sm"
              onClick={handleResendConfirmation}
              disabled={loading || resendCooldown > 0}
            >
              {resendCooldown > 0
                ? t("resendCooldown", { seconds: resendCooldown })
                : t("resendConfirmation")}
            </Button>
          }
        />
      )}

      <TabNavigation
        tabs={profileTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        variant="underline"
        size="md"
      />

      {activeTab === "profile" && (
        <div className="space-y-6">
          <SectionCard title={t("userInfo")}>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary">ID</p>
                <p className="text-lg text-text-primary">{user.user_id}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">{tc("username")}</p>
                <p className="text-lg text-text-primary">{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">{tc("email")}</p>
                <p className="text-lg text-text-primary">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">{t("registeredAt")}</p>
                <p className="text-lg text-text-primary">{formatDate(user.registered_at)}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title={t("changeEmail")}>
            <div className="flex gap-3">
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value.toLowerCase())}
                placeholder={tc("emailPlaceholder")}
                maxLength={EMAIL_MAX_LENGTH}
                inputSize="sm"
              />
              <Button onClick={handleUpdateEmail} disabled={loading || !newEmail}>
                {tc("update")}
              </Button>
            </div>
          </SectionCard>

          <SectionCard title={tc("logout")}>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleLogout}
              disabled={loading}
            >
              {tc("logout")}
            </Button>
          </SectionCard>

          <SectionCard title={t("irreversibleActions")} variant="danger">
            <div className="space-y-4">
              <Button
                variant="danger-secondary"
                className="w-full"
                onClick={() => setShowClearDataModal(true)}
              >
                {t("clearAllData")}
              </Button>
              <Button variant="danger" className="w-full" onClick={() => setShowDeleteModal(true)}>
                {t("deleteAccount")}
              </Button>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          <SectionCard title={t("changePassword")}>
            <div className="space-y-4">
              <PasswordInput
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={tc("oldPasswordPlaceholder")}
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
              />
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={tc("newPasswordPlaceholder")}
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
              />
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={tc("confirmPasswordPlaceholder")}
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
              />
              <Button
                onClick={handleUpdatePassword}
                disabled={loading || !oldPassword || !newPassword}
              >
                {t("changePassword")}
              </Button>
            </div>
          </SectionCard>

          <SectionCard title={t("activeSessions")}>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.session_id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div>
                    <p className="text-text-primary">{session.browser}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-text-secondary">{session.user_ip}</p>
                      <CountryIndicator countryCode={session.country_code} />
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRevokeSession(session.session_id)}
                  >
                    {tc("revoke")}
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      <ConfirmationModal
        isOpen={showClearDataModal}
        title={t("clearDataTitle")}
        message={t("clearDataMessage")}
        confirmText={tc("clear")}
        cancelText={tc("cancel")}
        onConfirm={handleClearData}
        onCancel={() => setShowClearDataModal(false)}
        isLoading={loading}
        variant="danger-secondary"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        title={t("deleteAccountTitle")}
        message={t("deleteAccountMessage")}
        confirmText={tc("delete")}
        cancelText={tc("cancel")}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={loading}
        variant="danger"
      />
    </div>
  );
}
