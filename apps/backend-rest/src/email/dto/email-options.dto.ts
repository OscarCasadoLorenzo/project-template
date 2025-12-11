import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

/**
 * DTO for password recovery email
 */
export class SendPasswordRecoveryEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsUrl()
  @IsNotEmpty()
  resetLink: string;

  @IsString()
  @IsOptional()
  expiresIn?: string;
}

/**
 * DTO for welcome email
 */
export class SendWelcomeEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsUrl()
  @IsOptional()
  activationLink?: string;
}

/**
 * DTO for notification email
 */
export class SendNotificationEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsUrl()
  @IsOptional()
  actionUrl?: string;

  @IsString()
  @IsOptional()
  actionText?: string;
}
