import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  SendNotificationEmailDto,
  SendPasswordRecoveryEmailDto,
  SendWelcomeEmailDto,
} from "./dto/email-options.dto";
import { EmailService } from "./email.service";

@ApiTags("email")
@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("password-recovery")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Send password recovery email" })
  @ApiResponse({
    status: 200,
    description: "Password recovery email sent successfully.",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid email data.",
  })
  @ApiResponse({
    status: 500,
    description: "Failed to send email.",
  })
  async sendPasswordRecoveryEmail(
    @Body() dto: SendPasswordRecoveryEmailDto
  ): Promise<{ message: string }> {
    await this.emailService.sendPasswordRecoveryEmail(dto);
    return { message: "Password recovery email sent successfully" };
  }

  @Post("welcome")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Send welcome email to new user" })
  @ApiResponse({
    status: 200,
    description: "Welcome email sent successfully.",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid email data.",
  })
  @ApiResponse({
    status: 500,
    description: "Failed to send email.",
  })
  async sendWelcomeEmail(
    @Body() dto: SendWelcomeEmailDto
  ): Promise<{ message: string }> {
    await this.emailService.sendWelcomeEmail(dto);
    return { message: "Welcome email sent successfully" };
  }

  @Post("notification")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Send notification email" })
  @ApiResponse({
    status: 200,
    description: "Notification email sent successfully.",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid email data.",
  })
  @ApiResponse({
    status: 500,
    description: "Failed to send email.",
  })
  async sendNotificationEmail(
    @Body() dto: SendNotificationEmailDto
  ): Promise<{ message: string }> {
    await this.emailService.sendNotificationEmail(dto);
    return { message: "Notification email sent successfully" };
  }
}
