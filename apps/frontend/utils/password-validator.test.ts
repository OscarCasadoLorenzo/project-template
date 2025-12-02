import {
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
  validatePasswordStrength,
} from "./password-validator";

describe("validatePasswordStrength", () => {
  describe("empty password", () => {
    it("should return invalid state with score 0 for empty password", () => {
      const result = validatePasswordStrength("");

      expect(result.isValid).toBe(false);
      expect(result.score).toBe(0);
      expect(result.feedback).toEqual(["Password is required"]);
      expect(result.requirements).toEqual({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
    });
  });

  describe("edge cases", () => {
    it("should handle null-like strings", () => {
      expect(validatePasswordStrength("").isValid).toBe(false);
    });

    it("should handle whitespace-only passwords", () => {
      const result = validatePasswordStrength("        ");

      expect(result.requirements.minLength).toBe(true); // 8 spaces
      expect(result.requirements.hasUppercase).toBe(false);
      expect(result.requirements.hasLowercase).toBe(false);
      expect(result.requirements.hasNumber).toBe(false);
      expect(result.requirements.hasSpecialChar).toBe(false);
      expect(result.isValid).toBe(false);
    });

    it("should handle passwords with unicode characters", () => {
      const result = validatePasswordStrength("Pássw0rd!");

      expect(result.requirements.minLength).toBe(true);
      expect(result.requirements.hasUppercase).toBe(true);
      expect(result.requirements.hasLowercase).toBe(true);
      expect(result.requirements.hasNumber).toBe(true);
      expect(result.requirements.hasSpecialChar).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it("should handle passwords with emojis", () => {
      const result = validatePasswordStrength("Pass123!😀");

      expect(result.requirements.minLength).toBe(true);
      expect(result.requirements.hasUppercase).toBe(true);
      expect(result.requirements.hasLowercase).toBe(true);
      expect(result.requirements.hasNumber).toBe(true);
      expect(result.requirements.hasSpecialChar).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it("should handle very long passwords", () => {
      const longPassword = "A1!" + "a".repeat(100);
      const result = validatePasswordStrength(longPassword);

      expect(result.requirements.minLength).toBe(true);
      expect(result.isValid).toBe(true);
      expect(result.score).toBe(100); // capped at 100
    });

    it("should handle passwords with only numbers", () => {
      const result = validatePasswordStrength("12345678");

      expect(result.requirements.minLength).toBe(true);
      expect(result.requirements.hasNumber).toBe(true);
      expect(result.requirements.hasUppercase).toBe(false);
      expect(result.requirements.hasLowercase).toBe(false);
      expect(result.requirements.hasSpecialChar).toBe(false);
      expect(result.isValid).toBe(false);
    });

    it("should handle passwords with leading/trailing spaces", () => {
      const result = validatePasswordStrength(" Abc123! ");

      // Spaces count toward length
      expect(result.requirements.minLength).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it("should handle passwords with tabs and newlines", () => {
      const result = validatePasswordStrength("Abc123!\t\n");

      expect(result.requirements.minLength).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it("should handle numbers at different positions", () => {
      expect(validatePasswordStrength("1Abcdefg!").requirements.hasNumber).toBe(
        true,
      );
      expect(validatePasswordStrength("A1bcdefg!").requirements.hasNumber).toBe(
        true,
      );
      expect(validatePasswordStrength("Abcdefg1!").requirements.hasNumber).toBe(
        true,
      );
    });

    it("should handle multiple consecutive numbers", () => {
      const result = validatePasswordStrength("Abc12345!");

      expect(result.requirements.hasNumber).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it("should handle zero as a valid number", () => {
      const result = validatePasswordStrength("Abcdefg0!");

      expect(result.requirements.hasNumber).toBe(true);
    });

    it("should handle multiple uppercase letters", () => {
      const result = validatePasswordStrength("ABCdef12!");

      expect(result.requirements.hasUppercase).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it("should handle multiple special characters", () => {
      const result = validatePasswordStrength("Abc123!@#$");

      expect(result.requirements.hasSpecialChar).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it("should handle mixed case throughout password", () => {
      const result = validatePasswordStrength("AbCdEf12!");

      expect(result.requirements.hasUppercase).toBe(true);
      expect(result.requirements.hasLowercase).toBe(true);
      expect(result.isValid).toBe(true);
    });
  });

  describe("minimum length requirement", () => {
    it("should fail when password is less than 8 characters", () => {
      const result = validatePasswordStrength("Abc1!");

      expect(result.requirements.minLength).toBe(false);
      expect(result.feedback).toContain("Must be at least 8 characters long");
    });

    it("should pass when password is exactly 8 characters", () => {
      const result = validatePasswordStrength("Abcd123!");

      expect(result.requirements.minLength).toBe(true);
    });

    it("should pass when password is more than 8 characters", () => {
      const result = validatePasswordStrength("Abcd1234!");

      expect(result.requirements.minLength).toBe(true);
    });
  });

  describe("uppercase letter requirement", () => {
    it("should fail when password has no uppercase letters", () => {
      const result = validatePasswordStrength("abcd1234!");

      expect(result.requirements.hasUppercase).toBe(false);
      expect(result.feedback).toContain(
        "Add at least one uppercase letter (A-Z)",
      );
    });

    it("should pass when password has at least one uppercase letter", () => {
      const result = validatePasswordStrength("Abcd1234!");

      expect(result.requirements.hasUppercase).toBe(true);
    });
  });

  describe("lowercase letter requirement", () => {
    it("should fail when password has no lowercase letters", () => {
      const result = validatePasswordStrength("ABCD1234!");

      expect(result.requirements.hasLowercase).toBe(false);
      expect(result.feedback).toContain(
        "Add at least one lowercase letter (a-z)",
      );
    });

    it("should pass when password has at least one lowercase letter", () => {
      const result = validatePasswordStrength("ABCd1234!");

      expect(result.requirements.hasLowercase).toBe(true);
    });
  });

  describe("number requirement", () => {
    it("should fail when password has no numbers", () => {
      const result = validatePasswordStrength("Abcdefgh!");

      expect(result.requirements.hasNumber).toBe(false);
      expect(result.feedback).toContain("Add at least one number (0-9)");
    });

    it("should pass when password has at least one number", () => {
      const result = validatePasswordStrength("Abcdefg1!");

      expect(result.requirements.hasNumber).toBe(true);
    });
  });

  describe("special character requirement", () => {
    it("should fail when password has no special characters", () => {
      const result = validatePasswordStrength("Abcd1234");

      expect(result.requirements.hasSpecialChar).toBe(false);
      expect(result.feedback).toContain(
        "Add at least one special character (@$!%*?&#, etc.)",
      );
    });

    it("should pass with @ symbol", () => {
      const result = validatePasswordStrength("Abcd1234@");

      expect(result.requirements.hasSpecialChar).toBe(true);
    });

    it("should pass with $ symbol", () => {
      const result = validatePasswordStrength("Abcd1234$");

      expect(result.requirements.hasSpecialChar).toBe(true);
    });

    it("should pass with ! symbol", () => {
      const result = validatePasswordStrength("Abcd1234!");

      expect(result.requirements.hasSpecialChar).toBe(true);
    });

    it("should pass with various special characters", () => {
      const specialChars = "@$!%*?&#^()_+=-[]{}|;:'\",.<>/\\`~";
      for (const char of specialChars) {
        const result = validatePasswordStrength(`Abcd1234${char}`);
        expect(result.requirements.hasSpecialChar).toBe(true);
      }
    });
  });

  describe("score calculation", () => {
    it("should give 20 points per requirement (5 requirements total)", () => {
      // 0 requirements met - only special chars
      expect(validatePasswordStrength("!!!").score).toBe(20); // only hasSpecialChar

      // 1 requirement met (minLength + hasLowercase)
      expect(validatePasswordStrength("abcdefgh").score).toBe(40);

      // 3 requirements met (minLength + hasLowercase + hasUppercase)
      expect(validatePasswordStrength("Abcdefgh").score).toBe(60);

      // 4 requirements met (minLength + hasLowercase + hasUppercase + hasNumber)
      expect(validatePasswordStrength("Abcdefg1").score).toBe(80);

      // All 5 requirements met
      expect(validatePasswordStrength("Abcdefg1!").score).toBe(100);
    });

    it("should add bonus points for extra length", () => {
      // 8 chars - no bonus
      const result8 = validatePasswordStrength("Abcd123!");
      expect(result8.score).toBe(100);

      // 9 chars - 2 bonus points
      const result9 = validatePasswordStrength("Abcd1234!");
      expect(result9.score).toBe(100); // capped at 100

      // 10 chars - 4 bonus points
      const result10 = validatePasswordStrength("Abcd12345!");
      expect(result10.score).toBe(100); // capped at 100
    });

    it("should cap total score at 100", () => {
      const result = validatePasswordStrength("Abcd1234567890!@#$%");
      expect(result.score).toBe(100);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it("should calculate bonus for passwords that don't meet all requirements", () => {
      // 12 chars, missing special char (4/5 requirements = 80 points + 8 bonus)
      const result = validatePasswordStrength("Abcdefgh1234");
      expect(result.score).toBe(88);
    });
  });

  describe("isValid property", () => {
    it("should be false when any requirement is not met", () => {
      expect(validatePasswordStrength("abc").isValid).toBe(false);
      expect(validatePasswordStrength("abcdefgh").isValid).toBe(false);
      expect(validatePasswordStrength("Abcdefgh").isValid).toBe(false);
      expect(validatePasswordStrength("Abcdefg1").isValid).toBe(false);
      expect(validatePasswordStrength("ABCD1234!").isValid).toBe(false);
    });

    it("should be true when all requirements are met", () => {
      expect(validatePasswordStrength("Abcd1234!").isValid).toBe(true);
      expect(validatePasswordStrength("MyP@ssw0rd").isValid).toBe(true);
      expect(validatePasswordStrength("Str0ng#Pass").isValid).toBe(true);
    });
  });

  describe("feedback messages", () => {
    it("should provide feedback for all unmet requirements", () => {
      const result = validatePasswordStrength("abc");

      expect(result.feedback).toHaveLength(4); // abc has lowercase, so 4 unmet requirements
      expect(result.feedback).toContain("Must be at least 8 characters long");
      expect(result.feedback).toContain(
        "Add at least one uppercase letter (A-Z)",
      );
      expect(result.feedback).toContain("Add at least one number (0-9)");
      expect(result.feedback).toContain(
        "Add at least one special character (@$!%*?&#, etc.)",
      );
      // Should NOT contain lowercase feedback since 'abc' has lowercase
      expect(result.feedback).not.toContain(
        "Add at least one lowercase letter (a-z)",
      );
    });

    it("should have no feedback when all requirements are met", () => {
      const result = validatePasswordStrength("Abcd1234!");

      expect(result.feedback).toHaveLength(0);
    });

    it("should only show feedback for unmet requirements", () => {
      const result = validatePasswordStrength("abcdefgh");

      expect(result.feedback).toContain(
        "Add at least one uppercase letter (A-Z)",
      );
      expect(result.feedback).toContain("Add at least one number (0-9)");
      expect(result.feedback).toContain(
        "Add at least one special character (@$!%*?&#, etc.)",
      );
      expect(result.feedback).not.toContain(
        "Must be at least 8 characters long",
      );
      expect(result.feedback).not.toContain(
        "Add at least one lowercase letter (a-z)",
      );
    });
  });
});

describe("getPasswordStrengthLabel", () => {
  it("should return 'Very Weak' for scores < 25", () => {
    expect(getPasswordStrengthLabel(0)).toBe("Very Weak");
    expect(getPasswordStrengthLabel(10)).toBe("Very Weak");
    expect(getPasswordStrengthLabel(24)).toBe("Very Weak");
  });

  it("should return 'Weak' for scores 25-49", () => {
    expect(getPasswordStrengthLabel(25)).toBe("Weak");
    expect(getPasswordStrengthLabel(35)).toBe("Weak");
    expect(getPasswordStrengthLabel(49)).toBe("Weak");
  });

  it("should return 'Fair' for scores 50-74", () => {
    expect(getPasswordStrengthLabel(50)).toBe("Fair");
    expect(getPasswordStrengthLabel(60)).toBe("Fair");
    expect(getPasswordStrengthLabel(74)).toBe("Fair");
  });

  it("should return 'Strong' for scores 75-89", () => {
    expect(getPasswordStrengthLabel(75)).toBe("Strong");
    expect(getPasswordStrengthLabel(80)).toBe("Strong");
    expect(getPasswordStrengthLabel(89)).toBe("Strong");
  });

  it("should return 'Very Strong' for scores >= 90", () => {
    expect(getPasswordStrengthLabel(90)).toBe("Very Strong");
    expect(getPasswordStrengthLabel(95)).toBe("Very Strong");
    expect(getPasswordStrengthLabel(100)).toBe("Very Strong");
  });
});

describe("getPasswordStrengthColor", () => {
  it("should return 'bg-red-500' for scores < 25", () => {
    expect(getPasswordStrengthColor(0)).toBe("bg-red-500");
    expect(getPasswordStrengthColor(10)).toBe("bg-red-500");
    expect(getPasswordStrengthColor(24)).toBe("bg-red-500");
  });

  it("should return 'bg-orange-500' for scores 25-49", () => {
    expect(getPasswordStrengthColor(25)).toBe("bg-orange-500");
    expect(getPasswordStrengthColor(35)).toBe("bg-orange-500");
    expect(getPasswordStrengthColor(49)).toBe("bg-orange-500");
  });

  it("should return 'bg-yellow-500' for scores 50-74", () => {
    expect(getPasswordStrengthColor(50)).toBe("bg-yellow-500");
    expect(getPasswordStrengthColor(60)).toBe("bg-yellow-500");
    expect(getPasswordStrengthColor(74)).toBe("bg-yellow-500");
  });

  it("should return 'bg-blue-500' for scores 75-89", () => {
    expect(getPasswordStrengthColor(75)).toBe("bg-blue-500");
    expect(getPasswordStrengthColor(80)).toBe("bg-blue-500");
    expect(getPasswordStrengthColor(89)).toBe("bg-blue-500");
  });

  it("should return 'bg-green-500' for scores >= 90", () => {
    expect(getPasswordStrengthColor(90)).toBe("bg-green-500");
    expect(getPasswordStrengthColor(95)).toBe("bg-green-500");
    expect(getPasswordStrengthColor(100)).toBe("bg-green-500");
  });
});
