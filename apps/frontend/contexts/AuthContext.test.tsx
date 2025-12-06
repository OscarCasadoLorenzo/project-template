import "@testing-library/jest-dom";
import { act, renderHook, waitFor } from "@testing-library/react";
import { usePathname } from "next/navigation";
import React from "react";
import { AuthProvider, useAuth } from "./AuthContext";

// Mock next/navigation
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
};

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: jest.fn(() => "/en"),
}));

// Mock fetchApi
const mockFetchApi = jest.fn();
jest.mock("@/lib/api", () => ({
  fetchApi: (...args: unknown[]) => mockFetchApi(...args),
}));

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("AuthContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    (usePathname as jest.Mock).mockReturnValue("/en");
  });

  describe("Initial State", () => {
    it("initializes with null user and token", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it("loads auth state from localStorage", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "PLAYER" as const,
      };
      const mockToken = "mock-token";

      mockLocalStorage.setItem("auth_token", mockToken);
      mockLocalStorage.setItem("auth_user", JSON.stringify(mockUser));

      mockFetchApi.mockResolvedValue({ user: mockUser });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(mockFetchApi).toHaveBeenCalledWith("/auth/me");
    });

    it("clears invalid token from localStorage", async () => {
      mockLocalStorage.setItem("auth_token", "invalid-token");
      mockLocalStorage.setItem(
        "auth_user",
        JSON.stringify({ id: "1", email: "test@example.com" }),
      );

      mockFetchApi.mockRejectedValue(new Error("Unauthorized"));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(mockLocalStorage.getItem("auth_token")).toBeNull();
      expect(mockLocalStorage.getItem("auth_user")).toBeNull();
    });
  });

  describe("Login", () => {
    it("successfully logs in and stores credentials", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "PLAYER" as const,
      };
      const mockToken = "new-token";

      mockFetchApi.mockResolvedValue({
        access_token: mockToken,
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login("test@example.com", "password123");
      });

      expect(mockFetchApi).toHaveBeenCalledWith("/auth/login", {
        method: "POST",
        body: { email: "test@example.com", password: "password123" },
        requiresAuth: false,
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(mockLocalStorage.getItem("auth_token")).toBe(mockToken);
      expect(mockLocalStorage.getItem("auth_user")).toBe(
        JSON.stringify(mockUser),
      );
      expect(mockPush).toHaveBeenCalledWith("/en");
    });

    it("handles login failure", async () => {
      mockFetchApi.mockRejectedValue(new Error("Invalid credentials"));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login("test@example.com", "wrong-password");
        }),
      ).rejects.toThrow("Invalid credentials");

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });
  });

  describe("Register", () => {
    it("successfully registers and stores credentials", async () => {
      const mockUser = {
        id: "1",
        email: "new@example.com",
        name: "New User",
        role: "PLAYER" as const,
      };
      const mockToken = "new-token";

      mockFetchApi.mockResolvedValue({
        access_token: mockToken,
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.register(
          "new@example.com",
          "password123",
          "New User",
        );
      });

      expect(mockFetchApi).toHaveBeenCalledWith("/auth/register", {
        method: "POST",
        body: {
          email: "new@example.com",
          password: "password123",
          name: "New User",
        },
        requiresAuth: false,
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(mockPush).toHaveBeenCalledWith("/en");
    });

    it("handles registration failure", async () => {
      mockFetchApi.mockRejectedValue(new Error("Email already exists"));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.register(
            "existing@example.com",
            "password123",
            "User",
          );
        }),
      ).rejects.toThrow("Email already exists");

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });
  });

  describe("Logout", () => {
    it("clears user data and redirects to login", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "PLAYER" as const,
      };

      mockLocalStorage.setItem("auth_token", "token");
      mockLocalStorage.setItem("auth_user", JSON.stringify(mockUser));
      mockFetchApi.mockResolvedValue({ user: mockUser });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(mockLocalStorage.getItem("auth_token")).toBeNull();
      expect(mockLocalStorage.getItem("auth_user")).toBeNull();
      expect(mockPush).toHaveBeenCalledWith("/en/login");
    });
  });

  describe("hasRole", () => {
    it("returns true if user has one of the allowed roles", async () => {
      const mockUser = {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        role: "ADMIN" as const,
      };

      mockLocalStorage.setItem("auth_token", "token");
      mockLocalStorage.setItem("auth_user", JSON.stringify(mockUser));
      mockFetchApi.mockResolvedValue({ user: mockUser });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasRole(["ADMIN"])).toBe(true);
      expect(result.current.hasRole(["ADMIN", "MASTER"])).toBe(true);
    });

    it("returns false if user does not have any of the allowed roles", async () => {
      const mockUser = {
        id: "1",
        email: "player@example.com",
        name: "Player User",
        role: "PLAYER" as const,
      };

      mockLocalStorage.setItem("auth_token", "token");
      mockLocalStorage.setItem("auth_user", JSON.stringify(mockUser));
      mockFetchApi.mockResolvedValue({ user: mockUser });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasRole(["ADMIN", "MASTER"])).toBe(false);
    });

    it("returns false if user is null", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasRole(["ADMIN"])).toBe(false);
    });
  });

  describe("useAuth hook", () => {
    it("throws error when used outside AuthProvider", () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, "error").mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within an AuthProvider");

      consoleError.mockRestore();
    });
  });

  describe("Locale handling", () => {
    it("redirects to correct locale after login", async () => {
      (usePathname as jest.Mock).mockReturnValue("/es/login");

      mockFetchApi.mockResolvedValue({
        access_token: "token",
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test",
          role: "PLAYER",
        },
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login("test@example.com", "password");
      });

      expect(mockPush).toHaveBeenCalledWith("/es");
    });

    it("redirects to correct locale after logout", async () => {
      (usePathname as jest.Mock).mockReturnValue("/es/admin");

      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test",
        role: "PLAYER" as const,
      };

      mockLocalStorage.setItem("auth_token", "token");
      mockLocalStorage.setItem("auth_user", JSON.stringify(mockUser));
      mockFetchApi.mockResolvedValue({ user: mockUser });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.logout();
      });

      expect(mockPush).toHaveBeenCalledWith("/es/login");
    });
  });
});
