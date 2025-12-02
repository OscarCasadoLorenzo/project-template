import { IsEmail, IsString, MinLength } from "class-validator";
import { IsStrongPassword } from "../../users/validators/strong-password.validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  @MinLength(3)
  name: string;
}
