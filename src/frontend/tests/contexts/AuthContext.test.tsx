import { AuthProvider, useAuth } from "@/lib/contexts/AuthContext";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";

jest.mock("@/app/actions/auth", () => ({
  getProfileAction: jest.fn(),
  logoutAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  usePathname: () => "/ru/dashboard",
}));

jest.mock("next-intl", () => ({
  useLocale: () => "ru",
}));

import { getProfileAction, logoutAction } from "@/app/actions/auth";

const mockGetProfileAction = getProfileAction as jest.Mock;
const mockLogoutAction = logoutAction as jest.Mock;

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("AuthProvider", () => {
    it("should provide initial loading state", async () => {
      mockGetProfileAction.mockResolvedValue({ ok: false, error: "Not authenticated" });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should set user when profile is loaded successfully", async () => {
      const mockProfile = {
        user_id: "user123",
        username: "testuser",
        email: "test@example.com",
        email_confirmed: true,
        registered_at: "2024-01-01",
      };
      mockGetProfileAction.mockResolvedValue({ ok: true, data: mockProfile });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockProfile);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it("should set user to null when profile fails", async () => {
      mockGetProfileAction.mockResolvedValue({ ok: false, error: "Not authenticated" });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe("useAuth", () => {
    it("should throw error when used outside AuthProvider", () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within an AuthProvider");

      consoleError.mockRestore();
    });
  });

  describe("refreshUser", () => {
    it("should refresh user profile", async () => {
      const mockProfile = {
        user_id: "user123",
        username: "testuser",
        email: "test@example.com",
        email_confirmed: true,
        registered_at: "2024-01-01",
      };
      mockGetProfileAction.mockResolvedValue({ ok: true, data: mockProfile });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockProfile);
      });

      const newProfile = { ...mockProfile, username: "newusername" };
      mockGetProfileAction.mockResolvedValue({ ok: true, data: newProfile });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.user).toEqual(newProfile);
    });
  });

  describe("logout", () => {
    it("should logout and clear user", async () => {
      const mockProfile = {
        user_id: "user123",
        username: "testuser",
        email: "test@example.com",
        email_confirmed: true,
        registered_at: "2024-01-01",
      };
      mockGetProfileAction.mockResolvedValue({ ok: true, data: mockProfile });
      mockLogoutAction.mockResolvedValue({ ok: true });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(mockLogoutAction).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });
  });
});
