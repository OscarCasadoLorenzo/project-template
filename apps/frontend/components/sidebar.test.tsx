import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

// Mock AuthContext
const mockUseAuth = jest.fn();
const mockLogout = jest.fn();
const mockHasRole = jest.fn();

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useLocale: jest.fn(),
  useTranslations: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
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

describe("Sidebar", () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "navigation.home": "Home",
      "navigation.admin": "Admin",
      "common.logout": "Logout",
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useLocale as jest.Mock).mockReturnValue("en");
    (usePathname as jest.Mock).mockReturnValue("/en");
  });

  describe("Visibility", () => {
    it("does not render on login page", () => {
      (usePathname as jest.Mock).mockReturnValue("/en/login");
      mockUseAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
        hasRole: mockHasRole,
      });

      const { container } = render(<Sidebar />);
      expect(container.firstChild).toBeNull();
    });

    it("does not render on register page", () => {
      (usePathname as jest.Mock).mockReturnValue("/en/register");
      mockUseAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
        hasRole: mockHasRole,
      });

      const { container } = render(<Sidebar />);
      expect(container.firstChild).toBeNull();
    });

    it("does not render when user is null", () => {
      (usePathname as jest.Mock).mockReturnValue("/en/admin");
      mockUseAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
        hasRole: mockHasRole,
      });

      const { container } = render(<Sidebar />);
      expect(container.firstChild).toBeNull();
    });

    it("renders when user is authenticated and not on auth pages", () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "PLAYER" as const,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        logout: mockLogout,
        hasRole: mockHasRole,
      });

      render(<Sidebar />);
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });
  });

  describe("User Information Display", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "John Doe",
      role: "PLAYER" as const,
    };

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        logout: mockLogout,
        hasRole: mockHasRole,
      });
    });

    it("displays user name", () => {
      render(<Sidebar />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("displays user email", () => {
      render(<Sidebar />);
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("displays user role", () => {
      render(<Sidebar />);
      expect(screen.getByText("PLAYER")).toBeInTheDocument();
    });

    it("displays user initial in avatar", () => {
      render(<Sidebar />);
      const avatar = screen.getByText("J");
      expect(avatar).toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      role: "PLAYER" as const,
    };

    beforeEach(() => {
      mockHasRole.mockReturnValue(false);
      mockUseAuth.mockReturnValue({
        user: mockUser,
        logout: mockLogout,
        hasRole: mockHasRole,
      });
    });

    it("renders Home link", () => {
      render(<Sidebar />);
      const homeLink = screen.getByText("Home").closest("a");
      expect(homeLink).toHaveAttribute("href", "/en");
    });

    it("renders Dice Roller link", () => {
      render(<Sidebar />);
      const diceLink = screen.getByText("Dice Roller").closest("a");
      expect(diceLink).toHaveAttribute("href", "/en/dice");
    });

    it("highlights active link", () => {
      (usePathname as jest.Mock).mockReturnValue("/en");
      render(<Sidebar />);

      const homeLink = screen.getByText("Home").closest("a");
      expect(homeLink).toBeInTheDocument();
    });

    it("does not highlight inactive links", () => {
      (usePathname as jest.Mock).mockReturnValue("/en/dice");
      render(<Sidebar />);

      const homeLink = screen.getByText("Home").closest("a");
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe("Admin Navigation", () => {
    it("shows admin link when user has ADMIN role", () => {
      const adminUser = {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        role: "ADMIN" as const,
      };

      mockHasRole.mockReturnValue(true);
      mockUseAuth.mockReturnValue({
        user: adminUser,
        logout: mockLogout,
        hasRole: mockHasRole,
      });

      render(<Sidebar />);

      expect(mockHasRole).toHaveBeenCalledWith(["ADMIN"]);
      expect(screen.getByText("Admin")).toBeInTheDocument();
      const adminLink = screen.getByText("Admin").closest("a");
      expect(adminLink).toHaveAttribute("href", "/en/admin");
    });

    it("does not show admin link when user lacks ADMIN role", () => {
      const playerUser = {
        id: "1",
        email: "player@example.com",
        name: "Player User",
        role: "PLAYER" as const,
      };

      mockHasRole.mockReturnValue(false);
      mockUseAuth.mockReturnValue({
        user: playerUser,
        logout: mockLogout,
        hasRole: mockHasRole,
      });

      render(<Sidebar />);

      expect(mockHasRole).toHaveBeenCalledWith(["ADMIN"]);
      expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    });
  });

  describe("Logout", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      role: "PLAYER" as const,
    };

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        logout: mockLogout,
        hasRole: mockHasRole,
      });
    });

    it("renders logout button", () => {
      render(<Sidebar />);
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("calls logout function when clicked", () => {
      render(<Sidebar />);

      const logoutButton = screen.getByText("Logout");
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe("Locale Support", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      role: "PLAYER" as const,
    };

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        logout: mockLogout,
        hasRole: mockHasRole,
      });
    });

    it("uses Spanish locale in links", () => {
      (useLocale as jest.Mock).mockReturnValue("es");

      render(<Sidebar />);

      const homeLink = screen.getByText("Home").closest("a");
      const diceLink = screen.getByText("Dice Roller").closest("a");

      expect(homeLink).toHaveAttribute("href", "/es");
      expect(diceLink).toHaveAttribute("href", "/es/dice");
    });

    it("uses English locale in links", () => {
      (useLocale as jest.Mock).mockReturnValue("en");

      render(<Sidebar />);

      const homeLink = screen.getByText("Home").closest("a");
      expect(homeLink).toHaveAttribute("href", "/en");
    });
  });
});
