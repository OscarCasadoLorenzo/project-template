/**
 * Password validation utility matching backend strong password requirements
 */

export interface PasswordStrength {
  isValid: boolean;
  score: number; // 0-100
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Handle empty password
  if (!password) {
    return {
      isValid: false,
      score: 0,
      feedback: ["Password is required"],
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      },
    };
  }

  // Define validation rules with their error messages
  const validationRules: Array<{
    key: keyof PasswordStrength["requirements"];
    test: boolean;
    message: string;
  }> = [
    {
      key: "minLength",
      test: password.length >= 8,
      message: "Must be at least 8 characters long",
    },
    {
      key: "hasUppercase",
      test: /[A-Z]/.test(password),
      message: "Add at least one uppercase letter (A-Z)",
    },
    {
      key: "hasLowercase",
      test: /[a-z]/.test(password),
      message: "Add at least one lowercase letter (a-z)",
    },
    {
      key: "hasNumber",
      test: /\d/.test(password),
      message: "Add at least one number (0-9)",
    },
    {
      key: "hasSpecialChar",
      test: /[@$!%*?&#^()_+=\-[\]{}|;:'",.<>/\\`~]/.test(password),
      message: "Add at least one special character (@$!%*?&#, etc.)",
    },
  ];

  // Calculate points per requirement dynamically
  const basePointsPerRequirement = 100 / validationRules.length;

  // Build requirements object and calculate score
  const requirements = {} as PasswordStrength["requirements"];
  validationRules.forEach((rule) => {
    requirements[rule.key] = rule.test;
    if (rule.test) {
      score += basePointsPerRequirement;
    } else {
      feedback.push(rule.message);
    }
  });

  // Bonus points for length beyond minimum (up to 20% of total score)
  if (password.length > 8) {
    const bonusPoints = Math.min((password.length - 8) * 2, 20);
    score = Math.min(score + bonusPoints, 100);
  }

  const isValid = validationRules.every((rule) => rule.test);

  return {
    isValid,
    score: Math.round(score),
    feedback,
    requirements,
  };
}

export function getPasswordStrengthLabel(score: number): string {
  if (score < 25) return "Very Weak";
  if (score < 50) return "Weak";
  if (score < 75) return "Fair";
  if (score < 90) return "Strong";
  return "Very Strong";
}

export function getPasswordStrengthColor(score: number): string {
  if (score < 25) return "bg-red-500";
  if (score < 50) return "bg-orange-500";
  if (score < 75) return "bg-yellow-500";
  if (score < 90) return "bg-blue-500";
  return "bg-green-500";
}
