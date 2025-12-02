import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class StrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    if (!password) {
      return false;
    }

    // Check minimum length (8 characters)
    if (password.length < 8) {
      return false;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return false;
    }

    // Check for at least one special character
    if (!/[@$!%*?&#^()_+=\-[\]{}|;:'",.<>/\\`~]/.test(password)) {
      return false;
    }

    return true;
  }

  defaultMessage(): string {
    return "Password must be at least 8 characters long and contain: uppercase letter, lowercase letter, number, special character.";
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: StrongPasswordConstraint,
    });
  };
}
