import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useLocale, useTranslations } from "next-intl";
import LoginPage from "./page";

// Mock AuthContext
const mockLogin = jest.fn();
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

describe("LoginPage", () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "auth.loginTitle": "Sign in to your account",
      "auth.registerTitle": "Create account",
      "auth.email": "Email address",
      "auth.password": "Password",
      "auth.signingIn": "Signing in...",
      "common.or": "or",
      "common.login": "Login",
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogin.mockClear();
    mockUseAuth.mockReturnValue({ login: mockLogin });
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useLocale as jest.Mock).mockReturnValue("en");
  });

  describe("Rendering", () => {
    it("renders login form", () => {
      render(<LoginPage />);

      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Login/i }),
      ).toBeInTheDocument();
    });

    it("renders link to register page", () => {
      render(<LoginPage />);

      const registerLink = screen.getByText("create account").closest("a");
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute("href", "/en/register");
    });
  });

  describe("Form Validation", () => {
    it("requires email and password fields", () => {
      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText("Email address");
      const passwordInput = screen.getByPlaceholderText("Password");

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    it("has email type on email input", () => {
      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText("Email address");
      expect(emailInput).toHaveAttribute("type", "email");
    });
  });

  describe("Form Submission", () => {
    it("submits form with email and password", async () => {
      mockLogin.mockResolvedValue(undefined);

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText("Email address");
      const passwordInput = screen.getByPlaceholderText("Password");
      const submitButton = screen.getByRole("button", { name: /Login/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          "test@example.com",
          "password123",
        );
      });
    });

    it("prevents default form submission", async () => {
      mockLogin.mockResolvedValue(undefined);

      render(<LoginPage />);

      const form = screen
        .getByRole("button", { name: /Login/i })
        .closest("form");
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault");

      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });

      form?.dispatchEvent(submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("disables submit button while loading", async () => {
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText("Email address");
      const passwordInput = screen.getByPlaceholderText("Password");
      const submitButton = screen.getByRole("button", { name: /Login/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it("shows loading state while submitting", async () => {
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<LoginPage />);

      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Login/i }));

      await waitFor(() => {
        expect(screen.getByText("Signing in...")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("displays error message on login failure", async () => {
      mockLogin.mockRejectedValue(new Error("Invalid credentials"));

      render(<LoginPage />);

      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "wrongpassword" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Login/i }));

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    it("displays generic error message for non-Error objects", async () => {
      mockLogin.mockRejectedValue("Something went wrong");

      render(<LoginPage />);

      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Login/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Login failed. Please try again."),
        ).toBeInTheDocument();
      });
    });

    it("clears error message on new submission", async () => {
      mockLogin.mockRejectedValueOnce(new Error("First error"));

      render(<LoginPage />);

      // First submission with error
      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "wrongpassword" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Login/i }));

      await waitFor(() => {
        expect(screen.getByText("First error")).toBeInTheDocument();
      });

      // Second submission should clear error
      mockLogin.mockResolvedValue(undefined);
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "correctpassword" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Login/i }));

      await waitFor(() => {
        expect(screen.queryByText("First error")).not.toBeInTheDocument();
      });
    });

    it("re-enables button after error", async () => {
      mockLogin.mockRejectedValue(new Error("Invalid credentials"));

      render(<LoginPage />);

      const submitButton = screen.getByRole("button", { name: /Login/i });

      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "wrongpassword" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Locale Support", () => {
    it("links to register with Spanish locale", () => {
      (useLocale as jest.Mock).mockReturnValue("es");

      render(<LoginPage />);

      const registerLink = screen.getByText("create account").closest("a");
      expect(registerLink).toHaveAttribute("href", "/es/register");
    });

    it("uses translations for all text", () => {
      render(<LoginPage />);

      expect(mockT).toHaveBeenCalledWith("auth.loginTitle");
      expect(mockT).toHaveBeenCalledWith("auth.registerTitle");
      expect(mockT).toHaveBeenCalledWith("auth.email");
      expect(mockT).toHaveBeenCalledWith("auth.password");
      expect(mockT).toHaveBeenCalledWith("common.or");
      expect(mockT).toHaveBeenCalledWith("common.login");
    });
  });

  describe("Styling and Layout", () => {
    it("has centered layout", () => {
      const { container } = render(<LoginPage />);

      const mainContainer = container.querySelector(
        ".flex.min-h-screen.items-center.justify-center",
      );
      expect(mainContainer).toBeInTheDocument();
    });

    it("has correct form styling", () => {
      render(<LoginPage />);

      const submitButton = screen.getByRole("button", { name: /Login/i });
      expect(submitButton).toBeInTheDocument();
    });

    it("has error box styling when error is displayed", async () => {
      mockLogin.mockRejectedValue(new Error("Test error"));

      render(<LoginPage />);

      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Login/i }));

      await waitFor(() => {
        const errorBox = screen
          .getByText("Test error")
          .closest("div.rounded-md");
        expect(errorBox).toBeInTheDocument();
      });
    });
  });
});
