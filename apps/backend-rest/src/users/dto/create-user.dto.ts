import { IsEmail, IsString, MinLength } from "class-validator";
import { IsStrongPassword } from "../validators/strong-password.validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
