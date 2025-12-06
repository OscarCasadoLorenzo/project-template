import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useTranslations } from "next-intl";
import Home from "./page";

// Mock ProtectedRoute
jest.mock("@/components/ProtectedRoute", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}));

// Mock AuthContext
const mockUseAuth = jest.fn();
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: jest.fn(),
}));

describe("Home Page", () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "common.welcome": "Welcome",
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  describe("Protection", () => {
    it("wraps content in ProtectedRoute", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          role: "PLAYER",
        },
      });

      render(<Home />);

      expect(screen.getByTestId("protected-route")).toBeInTheDocument();
    });
  });

  describe("Content Display", () => {
    it("displays welcome message with user name", () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "John Doe",
        role: "PLAYER" as const,
      };

      mockUseAuth.mockReturnValue({ user: mockUser });

      render(<Home />);

      expect(screen.getByText("Welcome, John Doe!")).toBeInTheDocument();
    });

    it("displays welcome message for different user", () => {
      const mockUser = {
        id: "2",
        email: "jane@example.com",
        name: "Jane Smith",
        role: "MASTER" as const,
      };

      mockUseAuth.mockReturnValue({ user: mockUser });

      render(<Home />);

      expect(screen.getByText("Welcome, Jane Smith!")).toBeInTheDocument();
    });

    it("displays descriptive text", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          role: "PLAYER",
        },
      });

      render(<Home />);

      expect(
        screen.getByText(
          "Welcome to the Project Template. Use the navigation to get started.",
        ),
      ).toBeInTheDocument();
    });

    it("uses translation for welcome text", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          role: "PLAYER",
        },
      });

      render(<Home />);

      expect(mockT).toHaveBeenCalledWith("common.welcome");
    });

    it("handles null user gracefully", () => {
      mockUseAuth.mockReturnValue({ user: null });

      render(<Home />);

      // Should still render but with undefined name
      expect(screen.getByText(/Welcome,/)).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          role: "PLAYER",
        },
      });
    });

    it("has container with correct classes", () => {
      const { container } = render(<Home />);

      const mainContainer = container.querySelector(".container");
      expect(mainContainer).toBeInTheDocument();
    });

    it("has welcome heading with correct styling", () => {
      render(<Home />);

      const heading = screen.getByText(/Welcome,/);
      expect(heading).toBeInTheDocument();
    });

    it("has description text with correct styling", () => {
      render(<Home />);

      const description = screen.getByText(
        "Welcome to the Project Template. Use the navigation to get started.",
      );
      expect(description).toBeInTheDocument();
    });

    it("has content wrapper with correct spacing", () => {
      const { container } = render(<Home />);

      const contentWrapper = container.querySelector(".mb-8");
      expect(contentWrapper).toBeInTheDocument();
    });
  });

  describe("Different User Roles", () => {
    it("renders correctly for PLAYER role", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "1",
          email: "player@example.com",
          name: "Player User",
          role: "PLAYER" as const,
        },
      });

      render(<Home />);

      expect(screen.getByText("Welcome, Player User!")).toBeInTheDocument();
    });

    it("renders correctly for MASTER role", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "2",
          email: "master@example.com",
          name: "Master User",
          role: "MASTER" as const,
        },
      });

      render(<Home />);

      expect(screen.getByText("Welcome, Master User!")).toBeInTheDocument();
    });

    it("renders correctly for ADMIN role", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "3",
          email: "admin@example.com",
          name: "Admin User",
          role: "ADMIN" as const,
        },
      });

      render(<Home />);

      expect(screen.getByText("Welcome, Admin User!")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty user name", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "1",
          email: "test@example.com",
          name: "",
          role: "PLAYER" as const,
        },
      });

      render(<Home />);

      expect(screen.getByText("Welcome, !")).toBeInTheDocument();
    });

    it("handles long user name", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "1",
          email: "test@example.com",
          name: "Very Long User Name That Should Still Display Correctly",
          role: "PLAYER" as const,
        },
      });

      render(<Home />);

      expect(
        screen.getByText(
          "Welcome, Very Long User Name That Should Still Display Correctly!",
        ),
      ).toBeInTheDocument();
    });

    it("handles special characters in user name", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "1",
          email: "test@example.com",
          name: "O'Brien & Sons",
          role: "PLAYER" as const,
        },
      });

      render(<Home />);

      expect(screen.getByText("Welcome, O'Brien & Sons!")).toBeInTheDocument();
    });
  });
});
