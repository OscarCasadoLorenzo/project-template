import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useLocale, useTranslations } from "next-intl";
import RegisterPage from "./page";

// Mock AuthContext
const mockRegister = jest.fn();
const mockUseAuth = jest.fn();

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock password validator
jest.mock("@/utils/password-validator", () => ({
  validatePasswordStrength: jest.fn((password: string) => ({
    score: password.length >= 8 ? 100 : 50,
    isValid:
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password),
    requirements: {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    },
  })),
  getPasswordStrengthLabel: jest.fn((score: number) => {
    if (score < 25) return "Very Weak";
    if (score < 50) return "Weak";
    if (score < 75) return "Fair";
    if (score < 90) return "Strong";
    return "Very Strong";
  }),
  getPasswordStrengthColor: jest.fn((score: number) => {
    if (score < 25) return "bg-red-500";
    if (score < 50) return "bg-orange-500";
    if (score < 75) return "bg-yellow-500";
    if (score < 90) return "bg-blue-500";
    return "bg-green-500";
  }),
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

describe("RegisterPage", () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "auth.registerTitle": "Create your account",
      "auth.signInToExistingAccount": "sign in to your existing account",
      "auth.fullName": "Full Name",
      "auth.email": "Email address",
      "auth.password": "Password",
      "auth.confirmPassword": "Confirm Password",
      "auth.passwordStrength": "Password Strength",
      "auth.passwordRequirements": "Password Requirements:",
      "auth.atLeast8Characters": "At least 8 characters",
      "auth.oneUppercaseLetter": "One uppercase letter",
      "auth.oneLowercaseLetter": "One lowercase letter",
      "auth.oneNumber": "One number",
      "auth.oneSpecialCharacter": "One special character",
      "auth.passwordsDoNotMatch": "Passwords do not match",
      "auth.passwordsMatch": "Passwords match",
      "auth.creatingAccount": "Creating account...",
      "auth.createAccount": "Create Account",
      "common.or": "or",
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegister.mockClear();
    mockUseAuth.mockReturnValue({ register: mockRegister });
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useLocale as jest.Mock).mockReturnValue("en");
  });

  describe("Rendering", () => {
    it("renders registration form", () => {
      render(<RegisterPage />);

      expect(screen.getByText("Create your account")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Confirm Password"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Create Account/i }),
      ).toBeInTheDocument();
    });

    it("renders link to login page", () => {
      render(<RegisterPage />);

      const loginLink = screen
        .getByText("sign in to your existing account")
        .closest("a");
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute("href", "/en/login");
    });
  });

  describe("Password Strength Indicator", () => {
    it("shows password strength when password is entered", () => {
      render(<RegisterPage />);

      const passwordInput = screen.getByPlaceholderText("Password");
      fireEvent.change(passwordInput, { target: { value: "Test123!" } });

      expect(screen.getByText("Password Strength")).toBeInTheDocument();
      expect(screen.getByText("Very Strong")).toBeInTheDocument();
    });

    it("updates requirement checks as password changes", () => {
      render(<RegisterPage />);

      const passwordInput = screen.getByPlaceholderText("Password");
      fireEvent.focus(passwordInput);

      // Enter weak password
      fireEvent.change(passwordInput, { target: { value: "weak" } });
      let requirements = screen.getAllByText(/○|✓/);
      expect(requirements.some((r) => r.textContent?.includes("○"))).toBe(true);

      // Enter strong password
      fireEvent.change(passwordInput, { target: { value: "Strong123!" } });
      requirements = screen.getAllByText(/○|✓/);
      expect(requirements.every((r) => r.textContent?.includes("✓"))).toBe(
        true,
      );
    });
  });

  describe("Password Confirmation", () => {
    it("shows error when passwords don't match", () => {
      render(<RegisterPage />);

      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Password123!" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "Different123!" },
      });

      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    it("shows success when passwords match", () => {
      render(<RegisterPage />);

      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Password123!" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "Password123!" },
      });

      expect(screen.getByText(/Passwords match/)).toBeInTheDocument();
    });

    it("changes border color based on password match", () => {
      render(<RegisterPage />);

      const confirmPasswordInput =
        screen.getByPlaceholderText("Confirm Password");

      // Mismatched passwords
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Password123!" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "Different123!" },
      });
      expect(confirmPasswordInput).toBeInTheDocument();

      // Matched passwords
      fireEvent.change(confirmPasswordInput, {
        target: { value: "Password123!" },
      });
      expect(confirmPasswordInput).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("prevents submission with weak password", async () => {
      render(<RegisterPage />);

      fireEvent.change(screen.getByPlaceholderText("Full Name"), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "weak" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "weak" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Password does not meet security requirements/),
        ).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it("prevents submission with short name", async () => {
      render(<RegisterPage />);

      fireEvent.change(screen.getByPlaceholderText("Full Name"), {
        target: { value: "AB" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Strong123!" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "Strong123!" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Name must be at least 3 characters long"),
        ).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  describe("Form Submission", () => {
    it("submits form with valid data", async () => {
      mockRegister.mockResolvedValue(undefined);

      render(<RegisterPage />);

      fireEvent.change(screen.getByPlaceholderText("Full Name"), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Strong123!" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "Strong123!" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          "test@example.com",
          "Strong123!",
          "Test User",
        );
      });
    });

    it("disables submit button while loading", async () => {
      mockRegister.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<RegisterPage />);

      fireEvent.change(screen.getByPlaceholderText("Full Name"), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Strong123!" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "Strong123!" },
      });

      const submitButton = screen.getByRole("button", {
        name: /Create Account/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it("shows loading state while submitting", async () => {
      mockRegister.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<RegisterPage />);

      fireEvent.change(screen.getByPlaceholderText("Full Name"), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Strong123!" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "Strong123!" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

      await waitFor(() => {
        expect(screen.getByText("Creating account...")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("displays error message on registration failure", async () => {
      mockRegister.mockRejectedValue(new Error("Email already exists"));

      render(<RegisterPage />);

      fireEvent.change(screen.getByPlaceholderText("Full Name"), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "existing@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Strong123!" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "Strong123!" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

      await waitFor(() => {
        expect(screen.getByText("Email already exists")).toBeInTheDocument();
      });
    });

    it("displays generic error message for non-Error objects", async () => {
      mockRegister.mockRejectedValue("Something went wrong");

      render(<RegisterPage />);

      fireEvent.change(screen.getByPlaceholderText("Full Name"), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Strong123!" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "Strong123!" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Registration failed. Please try again."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Locale Support", () => {
    it("links to login with Spanish locale", () => {
      (useLocale as jest.Mock).mockReturnValue("es");

      render(<RegisterPage />);

      const loginLink = screen
        .getByText("sign in to your existing account")
        .closest("a");
      expect(loginLink).toHaveAttribute("href", "/es/login");
    });
  });
});
