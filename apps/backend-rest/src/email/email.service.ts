import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";
import {
  SendNotificationEmailDto,
  SendPasswordRecoveryEmailDto,
  SendWelcomeEmailDto,
} from "./dto/email-options.dto";

/**
 * Main email service for sending transactional emails
 * Provides standardized API for different email types
 */
@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly from: string;
  private readonly fromName: string;
  private readonly previewMode: boolean;
  private readonly passwordRecoveryTemplate: string;
  private readonly welcomeTemplate: string;
  private readonly notificationTemplate: string;

  constructor(private readonly configService: ConfigService) {
    // Load configuration
    this.from = this.configService.get<string>(
      "EMAIL_FROM",
      "noreply@example.com"
    );
    this.fromName = this.configService.get<string>(
      "EMAIL_FROM_NAME",
      "Application"
    );
    this.previewMode = this.configService.get<boolean>(
      "EMAIL_PREVIEW_MODE",
      false
    );
    this.passwordRecoveryTemplate = this.configService.get<string>(
      "EMAIL_TEMPLATE_PASSWORD_RECOVERY",
      "password-recovery"
    );
    this.welcomeTemplate = this.configService.get<string>(
      "EMAIL_TEMPLATE_WELCOME",
      "welcome"
    );
    this.notificationTemplate = this.configService.get<string>(
      "EMAIL_TEMPLATE_NOTIFICATION",
      "notification"
    );
    const apiKey = this.configService.get<string>("RESEND_API_KEY", "");

    // Validate API key
    if (!apiKey) {
      this.logger.warn("RESEND_API_KEY not configured");
    }

    // Initialize Resend
    this.resend = new Resend(apiKey);

    this.logger.log("Email service initialized");
  }

  /**
   * Verify configuration on module initialization
   */
  async onModuleInit() {
    const apiKey = this.configService.get<string>("RESEND_API_KEY", "");
    if (apiKey) {
      this.logger.log("Email service configured");
    } else {
      this.logger.warn("Email service running without API key");
    }
  }

  /**
   * Send password recovery email
   */
  async sendPasswordRecoveryEmail(
    dto: SendPasswordRecoveryEmailDto
  ): Promise<void> {
    try {
      this.logger.log(`Sending password recovery email to ${dto.to}`);

      await this.sendEmail({
        to: dto.to,
        subject: "Password Recovery Request",
        template: this.passwordRecoveryTemplate,
        templateData: {
          username: dto.username,
          resetLink: dto.resetLink,
          expiresIn: dto.expiresIn || "1 hour",
        },
      });

      this.logger.log(`Password recovery email sent to ${dto.to}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to send password recovery email to ${dto.to}: ${err.message}`,
        err.stack
      );
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(dto: SendWelcomeEmailDto): Promise<void> {
    try {
      this.logger.log(`Sending welcome email to ${dto.to}`);

      await this.sendEmail({
        to: dto.to,
        subject: "Welcome to Our Platform!",
        template: this.welcomeTemplate,
        templateData: {
          username: dto.username,
          email: dto.to,
          activationLink: dto.activationLink,
        },
      });

      this.logger.log(`Welcome email sent to ${dto.to}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to send welcome email to ${dto.to}: ${err.message}`,
        err.stack
      );
      throw error;
    }
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(dto: SendNotificationEmailDto): Promise<void> {
    try {
      this.logger.log(`Sending notification email to ${dto.to}`);

      await this.sendEmail({
        to: dto.to,
        subject: "New Notification",
        template: this.notificationTemplate,
        templateData: {
          username: dto.username,
          message: dto.message,
          actionUrl: dto.actionUrl,
          actionText: dto.actionText,
        },
      });

      this.logger.log(`Notification email sent to ${dto.to}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to send notification email to ${dto.to}: ${err.message}`,
        err.stack
      );
      throw error;
    }
  }

  /**
   * Internal method to send email via provider
   * @private
   */
  private async sendEmail(options: {
    to: string;
    subject: string;
    template: string;
    templateData: Record<string, unknown>;
  }): Promise<void> {
    const emailData = {
      from: `${this.fromName} <${this.from}>`,
      to: options.to,
      subject: options.subject,
      template: {
        id: options.template,
        variables: options.templateData,
      },
    };

    // Preview mode for development
    if (this.previewMode) {
      this.logger.debug("Preview mode enabled - email not sent");
      this.logger.debug(`Email preview: ${JSON.stringify(emailData, null, 2)}`);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await this.resend.emails.send(emailData as any);

    if (error) {
      throw new Error(`Email provider error: ${error.message}`);
    }

    this.logger.debug(`Email sent with ID: ${data?.id}`);
  }
}
