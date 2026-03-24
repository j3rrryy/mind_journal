import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { renderHook } from "@testing-library/react";
import { useAuth } from "@/lib/contexts/AuthContext";

jest.mock("@/lib/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
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

const mockUseAuth = useAuth as jest.Mock;

describe("useProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return auth state from context", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useProtectedRoute());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return loading state", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { result } = renderHook(() => useProtectedRoute());

    expect(result.current.isLoading).toBe(true);
  });

  it("should return not authenticated state", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    const { result } = renderHook(() => useProtectedRoute());

    expect(result.current.isAuthenticated).toBe(false);
  });
});
