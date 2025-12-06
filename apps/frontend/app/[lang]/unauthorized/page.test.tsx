import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useLocale, useTranslations } from "next-intl";
import UnauthorizedPage from "./page";

// Mock AuthContext
const mockUseAuth = jest.fn();
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useLocale: jest.fn(),
  useTranslations: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "Link";
  return MockLink;
});

describe("UnauthorizedPage", () => {
  const mockT = jest.fn((key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      "errors.accessDenied": "Access Denied",
      "errors.unauthorizedWithRole": `You do not have permission (Role: ${params?.role})`,
      "errors.unauthorized": "You are not authorized to access this page",
      "common.goToHome": "Go to Home",
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useLocale as jest.Mock).mockReturnValue("en");
  });

  describe("Layout and Structure", () => {
    it("renders the 403 error code", () => {
      mockUseAuth.mockReturnValue({ user: null });

      render(<UnauthorizedPage />);

      expect(screen.getByText("403")).toBeInTheDocument();
    });

    it("renders access denied heading", () => {
      mockUseAuth.mockReturnValue({ user: null });

      render(<UnauthorizedPage />);

      expect(screen.getByText("Access Denied")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Access Denied" }),
      ).toBeInTheDocument();
    });
  });

  describe("User Context Messages", () => {
    it("displays unauthorized message when user is null", () => {
      mockUseAuth.mockReturnValue({ user: null });

      render(<UnauthorizedPage />);

      expect(
        screen.getByText("You are not authorized to access this page"),
      ).toBeInTheDocument();
      expect(mockT).toHaveBeenCalledWith("errors.unauthorized");
    });

    it("displays role-specific message when user is authenticated", () => {
      const mockUser = {
        id: "1",
        email: "player@example.com",
        name: "Player User",
        role: "PLAYER" as const,
      };

      mockUseAuth.mockReturnValue({ user: mockUser });

      render(<UnauthorizedPage />);

      expect(
        screen.getByText("You do not have permission (Role: PLAYER)"),
      ).toBeInTheDocument();
      expect(mockT).toHaveBeenCalledWith("errors.unauthorizedWithRole", {
        role: "PLAYER",
      });
    });

    it("displays ADMIN role correctly", () => {
      const mockUser = {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        role: "ADMIN" as const,
      };

      mockUseAuth.mockReturnValue({ user: mockUser });

      render(<UnauthorizedPage />);

      expect(mockT).toHaveBeenCalledWith("errors.unauthorizedWithRole", {
        role: "ADMIN",
      });
    });

    it("displays MASTER role correctly", () => {
      const mockUser = {
        id: "1",
        email: "master@example.com",
        name: "Master User",
        role: "MASTER" as const,
      };

      mockUseAuth.mockReturnValue({ user: mockUser });

      render(<UnauthorizedPage />);

      expect(mockT).toHaveBeenCalledWith("errors.unauthorizedWithRole", {
        role: "MASTER",
      });
    });
  });

  describe("Navigation Link", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: null });
    });

    it("renders go to home link with correct text", () => {
      render(<UnauthorizedPage />);

      const homeLink = screen.getByText("Go to Home");
      expect(homeLink).toBeInTheDocument();
      expect(mockT).toHaveBeenCalledWith("common.goToHome");
    });

    it("links to home page with English locale", () => {
      (useLocale as jest.Mock).mockReturnValue("en");

      render(<UnauthorizedPage />);

      const homeLink = screen.getByText("Go to Home").closest("a");
      expect(homeLink).toHaveAttribute("href", "/en");
    });

    it("links to home page with Spanish locale", () => {
      (useLocale as jest.Mock).mockReturnValue("es");

      render(<UnauthorizedPage />);

      const homeLink = screen.getByText("Go to Home").closest("a");
      expect(homeLink).toHaveAttribute("href", "/es");
    });
  });

  describe("Content Order", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: null });
    });

    it("renders all sections in correct order", () => {
      const { container } = render(<UnauthorizedPage />);

      const contentDiv = container.querySelector(".space-y-8");
      const children = contentDiv?.children;

      expect(children).toHaveLength(2);
      // First child contains error code and messages
      expect(children?.[0].querySelector("h1")).toHaveTextContent("403");
      // Second child contains the link
      expect(children?.[1].querySelector("a")).toBeInTheDocument();
    });
  });
});
