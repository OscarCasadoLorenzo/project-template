import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "./ProtectedRoute";

// Mock AuthContext
const mockUseAuth = jest.fn();
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: jest.fn(),
}));

describe("ProtectedRoute", () => {
  const TestChild = () => <div data-testid="protected-content">Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue("/en/admin");
  });

  describe("Loading State", () => {
    it("shows loading spinner when isLoading is true", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: true,
      });

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>,
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(
        screen
          .getByText("Loading...")
          .closest("div")
          ?.querySelector(".animate-spin"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });
  });

  describe("Unauthenticated User", () => {
    it("redirects to login when user is null", async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
      });

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>,
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/en/login");
      });

      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("redirects to custom path when redirectTo is provided", async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
      });

      render(
        <ProtectedRoute redirectTo="/en/custom-login">
          <TestChild />
        </ProtectedRoute>,
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/en/custom-login");
      });
    });

    it("uses correct locale from pathname in redirect", async () => {
      (usePathname as jest.Mock).mockReturnValue("/es/admin");

      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
      });

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>,
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/es/login");
      });
    });
  });

  describe("Authenticated User", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      role: "PLAYER" as const,
    };

    it("renders children when user is authenticated and no role restrictions", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
      });

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>,
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("renders children when user has allowed role", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
      });

      render(
        <ProtectedRoute allowedRoles={["PLAYER", "MASTER"]}>
          <TestChild />
        </ProtectedRoute>,
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Role-Based Access", () => {
    it("redirects to unauthorized when user lacks required role", async () => {
      const mockUser = {
        id: "1",
        email: "player@example.com",
        name: "Player User",
        role: "PLAYER" as const,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
      });

      render(
        <ProtectedRoute allowedRoles={["ADMIN", "MASTER"]}>
          <TestChild />
        </ProtectedRoute>,
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/en/unauthorized");
      });

      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("uses correct locale in unauthorized redirect", async () => {
      (usePathname as jest.Mock).mockReturnValue("/es/admin");

      const mockUser = {
        id: "1",
        email: "player@example.com",
        name: "Player User",
        role: "PLAYER" as const,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
      });

      render(
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <TestChild />
        </ProtectedRoute>,
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/es/unauthorized");
      });
    });

    it("allows ADMIN role when specified", () => {
      const adminUser = {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        role: "ADMIN" as const,
      };

      mockUseAuth.mockReturnValue({
        user: adminUser,
        isLoading: false,
      });

      render(
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <TestChild />
        </ProtectedRoute>,
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("allows MASTER role when specified", () => {
      const masterUser = {
        id: "1",
        email: "master@example.com",
        name: "Master User",
        role: "MASTER" as const,
      };

      mockUseAuth.mockReturnValue({
        user: masterUser,
        isLoading: false,
      });

      render(
        <ProtectedRoute allowedRoles={["MASTER", "ADMIN"]}>
          <TestChild />
        </ProtectedRoute>,
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Locale Handling", () => {
    it("defaults to 'en' when pathname is null", async () => {
      (usePathname as jest.Mock).mockReturnValue(null);

      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
      });

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>,
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/en/login");
      });
    });

    it("extracts locale from nested paths", async () => {
      (usePathname as jest.Mock).mockReturnValue("/es/admin/users/123");

      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
      });

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>,
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/es/login");
      });
    });

    it("handles root paths correctly", async () => {
      (usePathname as jest.Mock).mockReturnValue("/en");

      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
      });

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>,
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/en/login");
      });
    });
  });

  describe("Re-renders", () => {
    it("only redirects after loading completes", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: true,
      });

      const { rerender } = render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>,
      );

      expect(mockPush).not.toHaveBeenCalled();

      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
      });

      rerender(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>,
      );

      expect(mockPush).toHaveBeenCalled();
    });
  });
});
