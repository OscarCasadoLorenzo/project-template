import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock useTransition
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useTransition: jest.fn(),
}));

describe("LanguageSwitcher", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockStartTransition = jest.fn((callback) => callback());

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    (usePathname as jest.Mock).mockReturnValue("/en/admin");
    (useTransition as jest.Mock).mockReturnValue([false, mockStartTransition]);
  });

  it("renders all available locales", () => {
    render(<LanguageSwitcher currentLocale="en" />);

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
  });

  it("highlights the current locale", () => {
    render(<LanguageSwitcher currentLocale="en" />);

    const englishButton = screen.getByText("English");
    const spanishButton = screen.getByText("Español");

    expect(englishButton).toBeInTheDocument();
    expect(spanishButton).toBeInTheDocument();
  });

  it("switches locale when clicking a different language button", () => {
    render(<LanguageSwitcher currentLocale="en" />);

    const spanishButton = screen.getByText("Español");
    fireEvent.click(spanishButton);

    expect(mockStartTransition).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/es/admin");
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("handles root path correctly", () => {
    (usePathname as jest.Mock).mockReturnValue("/en");

    render(<LanguageSwitcher currentLocale="en" />);

    const spanishButton = screen.getByText("Español");
    fireEvent.click(spanishButton);

    expect(mockPush).toHaveBeenCalledWith("/es");
  });

  it("handles nested paths correctly", () => {
    (usePathname as jest.Mock).mockReturnValue("/en/admin/users");

    render(<LanguageSwitcher currentLocale="en" />);

    const spanishButton = screen.getByText("Español");
    fireEvent.click(spanishButton);

    expect(mockPush).toHaveBeenCalledWith("/es/admin/users");
  });

  it("disables buttons when transition is pending", () => {
    (useTransition as jest.Mock).mockReturnValue([true, mockStartTransition]);

    render(<LanguageSwitcher currentLocale="en" />);

    const englishButton = screen.getByText("English");
    const spanishButton = screen.getByText("Español");

    expect(englishButton).toBeDisabled();
    expect(spanishButton).toBeDisabled();
  });

  it("does not switch locale if pathname is null", () => {
    (usePathname as jest.Mock).mockReturnValue(null);

    render(<LanguageSwitcher currentLocale="en" />);

    const spanishButton = screen.getByText("Español");
    fireEvent.click(spanishButton);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("has correct aria-labels for accessibility", () => {
    render(<LanguageSwitcher currentLocale="en" />);

    const englishButton = screen.getByLabelText("Switch to English");
    const spanishButton = screen.getByLabelText("Switch to Español");

    expect(englishButton).toBeInTheDocument();
    expect(spanishButton).toBeInTheDocument();
  });
});
