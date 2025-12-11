import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import {
  SendNotificationEmailDto,
  SendPasswordRecoveryEmailDto,
  SendWelcomeEmailDto,
} from "./dto/email-options.dto";
import { EmailService } from "./email.service";

// Mock the Resend module
jest.mock("resend", () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn(),
      },
    })),
  };
});

describe("EmailService", () => {
  let service: EmailService;
  let mockResendInstance: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config: Record<string, any> = {
                EMAIL_FROM: "test@example.com",
                EMAIL_FROM_NAME: "Test App",
                EMAIL_PREVIEW_MODE: false,
                RESEND_API_KEY: "test-api-key",
                EMAIL_TEMPLATE_PASSWORD_RECOVERY: "password-recovery",
                EMAIL_TEMPLATE_WELCOME: "welcome",
                EMAIL_TEMPLATE_NOTIFICATION: "notification",
              };
              return config[key] ?? defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);

    // Get the mocked Resend instance
    const { Resend } = require("resend");
    mockResendInstance =
      Resend.mock.results[Resend.mock.results.length - 1].value;

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("initialization", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
    });

    it("should initialize and log configuration", async () => {
      await service.onModuleInit();
      expect(service).toBeDefined();
    });
  });

  describe("sendPasswordRecoveryEmail", () => {
    it("should send password recovery email", async () => {
      const dto: SendPasswordRecoveryEmailDto = {
        to: "user@example.com",
        username: "testuser",
        resetLink: "https://example.com/reset?token=abc123",
        expiresIn: "2 hours",
      };

      mockResendInstance.emails.send.mockResolvedValue({
        data: { id: "email-123" },
        error: null,
      });

      await service.sendPasswordRecoveryEmail(dto);

      expect(mockResendInstance.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: dto.to,
          subject: "Password Recovery Request",
          template: {
            id: "password-recovery",
            variables: {
              username: dto.username,
              resetLink: dto.resetLink,
              expiresIn: dto.expiresIn,
            },
          },
        })
      );
    });

    it("should use default expiration time", async () => {
      const dto: SendPasswordRecoveryEmailDto = {
        to: "user@example.com",
        username: "testuser",
        resetLink: "https://example.com/reset?token=abc123",
      };

      mockResendInstance.emails.send.mockResolvedValue({
        data: { id: "email-123" },
        error: null,
      });

      await service.sendPasswordRecoveryEmail(dto);

      expect(mockResendInstance.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          template: expect.objectContaining({
            variables: expect.objectContaining({
              expiresIn: "1 hour",
            }),
          }),
        })
      );
    });

    it("should throw error when email sending fails", async () => {
      const dto: SendPasswordRecoveryEmailDto = {
        to: "user@example.com",
        username: "testuser",
        resetLink: "https://example.com/reset?token=abc123",
      };

      mockResendInstance.emails.send.mockResolvedValue({
        data: null,
        error: { message: "API Error" },
      });

      await expect(service.sendPasswordRecoveryEmail(dto)).rejects.toThrow();
    });
  });

  describe("sendWelcomeEmail", () => {
    it("should send welcome email with activation link", async () => {
      const dto: SendWelcomeEmailDto = {
        to: "newuser@example.com",
        username: "newuser",
        activationLink: "https://example.com/activate?token=xyz789",
      };

      mockResendInstance.emails.send.mockResolvedValue({
        data: { id: "email-123" },
        error: null,
      });

      await service.sendWelcomeEmail(dto);

      expect(mockResendInstance.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: dto.to,
          subject: "Welcome to Our Platform!",
          template: {
            id: "welcome",
            variables: {
              username: dto.username,
              email: dto.to,
              activationLink: dto.activationLink,
            },
          },
        })
      );
    });

    it("should send welcome email without activation link", async () => {
      const dto: SendWelcomeEmailDto = {
        to: "newuser@example.com",
        username: "newuser",
      };

      mockResendInstance.emails.send.mockResolvedValue({
        data: { id: "email-123" },
        error: null,
      });

      await service.sendWelcomeEmail(dto);

      expect(mockResendInstance.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: dto.to,
          template: expect.objectContaining({
            id: "welcome",
            variables: expect.objectContaining({
              username: dto.username,
            }),
          }),
        })
      );
    });
  });

  describe("sendNotificationEmail", () => {
    it("should send notification email with action", async () => {
      const dto: SendNotificationEmailDto = {
        to: "user@example.com",
        username: "testuser",
        message: "You have a new message",
        actionUrl: "https://example.com/messages",
        actionText: "View Message",
      };

      mockResendInstance.emails.send.mockResolvedValue({
        data: { id: "email-123" },
        error: null,
      });

      await service.sendNotificationEmail(dto);

      expect(mockResendInstance.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: dto.to,
          subject: "New Notification",
          template: {
            id: "notification",
            variables: {
              username: dto.username,
              message: dto.message,
              actionUrl: dto.actionUrl,
              actionText: dto.actionText,
            },
          },
        })
      );
    });

    it("should send notification email without action", async () => {
      const dto: SendNotificationEmailDto = {
        to: "user@example.com",
        username: "testuser",
        message: "System notification",
      };

      mockResendInstance.emails.send.mockResolvedValue({
        data: { id: "email-123" },
        error: null,
      });

      await service.sendNotificationEmail(dto);

      expect(mockResendInstance.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          template: expect.objectContaining({
            id: "notification",
            variables: expect.objectContaining({
              message: dto.message,
            }),
          }),
        })
      );
    });
  });

  describe("preview mode", () => {
    it("should not send emails in preview mode", async () => {
      // Create service with preview mode
      const previewModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string, defaultValue?: any) => {
                const config: Record<string, any> = {
                  EMAIL_FROM: "test@example.com",
                  EMAIL_FROM_NAME: "Test App",
                  EMAIL_PREVIEW_MODE: true,
                  RESEND_API_KEY: "test-api-key",
                  EMAIL_TEMPLATE_PASSWORD_RECOVERY: "password-recovery",
                  EMAIL_TEMPLATE_WELCOME: "welcome",
                  EMAIL_TEMPLATE_NOTIFICATION: "notification",
                };
                return config[key] ?? defaultValue;
              }),
            },
          },
        ],
      }).compile();

      const previewService = previewModule.get<EmailService>(EmailService);
      const { Resend } = require("resend");
      const previewMock =
        Resend.mock.results[Resend.mock.results.length - 1].value;

      const dto: SendPasswordRecoveryEmailDto = {
        to: "user@example.com",
        username: "testuser",
        resetLink: "https://example.com/reset",
      };

      await previewService.sendPasswordRecoveryEmail(dto);

      expect(previewMock.emails.send).not.toHaveBeenCalled();
    });
  });
});
