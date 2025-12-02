"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
  validatePasswordStrength,
} from "@/utils/password-validator";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const { register } = useAuth();

  const passwordStrength = validatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!passwordStrength.isValid) {
      setError(
        "Password does not meet security requirements. Please check the requirements below.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (name.length < 3) {
      setError("Name must be at least 3 characters long");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      // Redirect is handled in the register function
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="relative block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Full name"
                minLength={3}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordRequirements(true)}
                className="relative block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
              {password && (
                <div className="mt-2 space-y-2">
                  {/* Password Strength Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Password Strength:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength.score < 25
                            ? "text-red-600"
                            : passwordStrength.score < 50
                              ? "text-orange-600"
                              : passwordStrength.score < 75
                                ? "text-yellow-600"
                                : passwordStrength.score < 90
                                  ? "text-blue-600"
                                  : "text-green-600"
                        }`}
                      >
                        {getPasswordStrengthLabel(passwordStrength.score)}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                          passwordStrength.score,
                        )}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Requirements Checklist */}
                  {showPasswordRequirements && (
                    <div className="rounded-md bg-gray-50 p-3 text-xs">
                      <p className="mb-2 font-medium text-gray-700">
                        Password Requirements:
                      </p>
                      <ul className="space-y-1">
                        <li
                          className={
                            passwordStrength.requirements.minLength
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          {passwordStrength.requirements.minLength ? "✓" : "○"}{" "}
                          At least 8 characters
                        </li>
                        <li
                          className={
                            passwordStrength.requirements.hasUppercase
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          {passwordStrength.requirements.hasUppercase
                            ? "✓"
                            : "○"}{" "}
                          One uppercase letter
                        </li>
                        <li
                          className={
                            passwordStrength.requirements.hasLowercase
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          {passwordStrength.requirements.hasLowercase
                            ? "✓"
                            : "○"}{" "}
                          One lowercase letter
                        </li>
                        <li
                          className={
                            passwordStrength.requirements.hasNumber
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          {passwordStrength.requirements.hasNumber ? "✓" : "○"}{" "}
                          One number
                        </li>
                        <li
                          className={
                            passwordStrength.requirements.hasSpecialChar
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          {passwordStrength.requirements.hasSpecialChar
                            ? "✓"
                            : "○"}{" "}
                          One special character (@$!%*?&#, etc.)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`relative block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ${
                  confirmPassword &&
                  (password === confirmPassword
                    ? "ring-green-500"
                    : "ring-red-500")
                } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                placeholder="Confirm password"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  Passwords do not match
                </p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="mt-1 text-xs text-green-600">✓ Passwords match</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
