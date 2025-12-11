# Email Sender Module Documentation

## Overview

The Email Sender Module is a simple, configurable email-delivery service for the NestJS backend. It uses Resend's template system to send transactional emails with dynamic data.

## Features

- ✅ **Resend Templates**: Uses Resend's template feature for consistent email design
- ✅ **Type Safety**: Full TypeScript support with DTOs
- ✅ **Logging**: Structured logging for success and error cases
- ✅ **Preview Mode**: Development mode to preview emails without sending
- ✅ **Testing**: Comprehensive unit tests with >90% coverage
- ✅ **Transactional Emails**: Pre-configured email types for common workflows

## Architecture

The module provides a simple email service that generates HTML emails inline and sends them via Resend.

### Module Structure

```
src/email/
├── dto/
│   └── email-options.dto.ts          # Email configuration DTOs
├── email.controller.ts               # REST API endpoints
├── email.service.ts                  # Main email service
├── email.service.spec.ts             # Unit tests
├── email.module.ts                   # Module definition
└── index.ts                          # Public exports
```

## Installation

### 1. Dependencies

The required dependencies are already added to `package.json`:

```json
{
  "dependencies": {
    "resend": "^3.5.0"
  }
}
```

Install dependencies:

```bash
cd apps/backend-rest
npm install
```

### 2. Environment Configuration

Add email configuration to your `.env` file:

```env
# Email Configuration
EMAIL_FROM="noreply@yourdomain.com"
EMAIL_FROM_NAME="Your Application"
EMAIL_PREVIEW_MODE="false"

# Resend API Key
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# Email Template Names (must match templates created in Resend dashboard)
EMAIL_TEMPLATE_PASSWORD_RECOVERY="password-recovery"
EMAIL_TEMPLATE_WELCOME="welcome"
EMAIL_TEMPLATE_NOTIFICATION="notification"
```

### 3. Create Templates in Resend

You need to create the email templates in your Resend dashboard:

1. Go to [Resend Dashboard](https://resend.com/emails/templates)
2. Create templates with the following names:
   - `password-recovery`
   - `welcome`
   - `notification`

**Template Variables:**

- **password-recovery**: `username`, `resetLink`, `expiresIn`
- **welcome**: `username`, `email`, `activationLink`
- **notification**: `username`, `message`, `actionUrl`, `actionText`

For other providers, see [Environment Variables](#environment-variables) section.

### 3. Module Registration

The `EmailModule` is already imported in `app.module.ts`:

```typescript
import { EmailModule } from "./email/email.module";

@Module({
  imports: [
    // ... other imports
    EmailModule,
  ],
})
export class AppModule {}
```

## Usage

### Using the Controller Endpoints

The email module exposes REST API endpoints:

```bash
# Send password recovery email
POST /email/password-recovery
{
  "to": "user@example.com",
  "username": "john_doe",
  "resetLink": "https://app.example.com/reset?token=abc123",
  "expiresIn": "1 hour"
}

# Send welcome email
POST /email/welcome
{
  "to": "newuser@example.com",
  "username": "jane_doe",
  "activationLink": "https://app.example.com/activate?token=xyz789"
}

# Send notification email
POST /email/notification
{
  "to": "user@example.com",
  "username": "john_doe",
  "message": "You have a new message from Jane",
  "actionUrl": "https://app.example.com/messages/123",
  "actionText": "View Message"
}
```

### Using the Service in Your Code

```typescript
import { EmailService } from "./email";

@Injectable()
export class MyService {
  constructor(private readonly emailService: EmailService) {}

  async notifyUser() {
    await this.emailService.sendWelcomeEmail({
      to: "newuser@example.com",
      username: "jane_doe",
      activationLink: "https://app.example.com/activate?token=xyz789",
    });
  }
}
```

## Email Types

The service supports three types of transactional emails, which use Resend templates:

1. **Password Recovery** - Sends password reset links
   - Template: `password-recovery`
   - Variables: `username`, `resetLink`, `expiresIn`

2. **Welcome Email** - Onboarding emails for new users
   - Template: `welcome`
   - Variables: `username`, `email`, `activationLink`

3. **Notification** - Generic notification emails with optional action buttons
   - Template: `notification`
   - Variables: `username`, `message`, `actionUrl`, `actionText`

All templates must be created in the Resend dashboard before use.

## Configuration

### Environment Variables

| Variable                           | Required | Default             | Description                             |
| ---------------------------------- | -------- | ------------------- | --------------------------------------- |
| `EMAIL_FROM`                       | Yes      | -                   | Default sender email address            |
| `EMAIL_FROM_NAME`                  | No       | `Application`       | Default sender name                     |
| `EMAIL_PREVIEW_MODE`               | No       | `false`             | Enable preview mode (no sending)        |
| `RESEND_API_KEY`                   | Yes      | -                   | Resend API key from resend.com          |
| `EMAIL_TEMPLATE_PASSWORD_RECOVERY` | No       | `password-recovery` | Resend template name for password reset |
| `EMAIL_TEMPLATE_WELCOME`           | No       | `welcome`           | Resend template name for welcome emails |
| `EMAIL_TEMPLATE_NOTIFICATION`      | No       | `notification`      | Resend template name for notifications  |

| Variable           | Required | Description      |
| ------------------ | -------- | ---------------- |
| `SENDGRID_API_KEY` | Yes      | SendGrid API key |

#### AWS SES Configuration (Not Yet Implemented)

| Variable                | Required | Default     | Description    |
| ----------------------- | -------- | ----------- | -------------- |
| `AWS_SES_REGION`        | No       | `us-east-1` | AWS region     |
| `AWS_ACCESS_KEY_ID`     | Yes      | -           | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes      | -           | AWS secret key |

## Testing

### Running Tests

```bash
# Run all email module tests
npm test -- email

# Run with coverage
npm run test:cov -- email

# Watch mode
npm run test:watch -- email
```

### Test Structure

```
src/email/
├── services/
│   ├── email.service.spec.ts
│   └── template-renderer.service.spec.ts
└── providers/
    ├── resend.provider.spec.ts
    ├── nodemailer.provider.spec.ts
    └── email-provider.factory.spec.ts
```

### Writing Tests for Email Features

```typescript
import { Test } from "@nestjs/testing";
import { EmailService } from "./email";

describe("My Feature", () => {
  let emailService: EmailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn().mockResolvedValue(undefined),
            sendPasswordRecoveryEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    emailService = module.get(EmailService);
  });

  it("should send email", async () => {
    await emailService.sendEmail({
      to: "test@example.com",
      subject: "Test",
      text: "Test",
    });

    expect(emailService.sendEmail).toHaveBeenCalled();
  });
});
```

## Email Providers

### Resend (Default & Recommended)

**Pros:**

- Modern API with excellent DX
- Built-in email verification
- Reliable delivery
- Great for transactional emails
- Free tier: 3,000 emails/month

**Setup:**

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get API key from dashboard
4. Add to `.env`: `RESEND_API_KEY=re_xxxxx`

### Nodemailer (SMTP)

**Pros:**

- Works with any SMTP provider
- Self-hosted options
- Good for development (e.g., Mailtrap)

**Cons:**

- Requires SMTP configuration
- More complex setup

**Setup:**

```env
EMAIL_PROVIDER="nodemailer"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### SendGrid (Coming Soon)

SendGrid provider implementation is planned for future releases.

### AWS SES (Coming Soon)

AWS SES provider implementation is planned for future releases.

## Preview Mode

Enable preview mode for local development to log emails without sending:

```env
EMAIL_PREVIEW_MODE="true"
```

Emails will be logged to console with full details instead of being sent.

## Error Handling

The module provides structured error logging:

```typescript
try {
  await emailService.sendEmail(options);
} catch (error) {
  // Error is logged automatically with context
  // Handle application-specific error response
  throw new InternalServerErrorException("Failed to send email");
}
```

Logs include:

- Recipient email
- Error message
- Stack trace
- Provider information

## Performance Considerations

### Template Caching

Templates are compiled and cached on first use. To clear cache:

```typescript
const templateRenderer = moduleRef.get(TemplateRendererService);
templateRenderer.clearCache();
```

### Rate Limiting

For high-volume email sending, consider implementing:

1. **Queue System** (e.g., BullMQ)

   ```typescript
   @Injectable()
   export class EmailQueue {
     async addToQueue(emailData: EmailOptions) {
       await this.queue.add("send-email", emailData);
     }
   }
   ```

2. **Rate Limiting** (Provider-specific limits)
   - Resend: 10 req/sec
   - Check your provider's limits

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Validate recipient emails** - Use `class-validator` decorators
3. **Sanitize template context** - Avoid XSS in email content
4. **Use preview mode** in development - Prevent accidental sends
5. **Monitor bounce rates** - Implement bounce handling

## Troubleshooting

### Emails Not Sending

1. Check environment variables are set correctly
2. Verify API key is valid
3. Check provider connection: `await emailService.onModuleInit()`
4. Review logs for error messages
5. Ensure `EMAIL_PREVIEW_MODE` is `false` in production

### Template Not Found

1. Verify template file exists in `src/email/templates/`
2. Check file extension is `.hbs`
3. Template name matches (case-sensitive)

### Provider Connection Failed

**Resend:**

- Verify API key format: `re_xxxxx`
- Check domain verification status

**Nodemailer:**

- Test SMTP credentials
- Check firewall/port access
- Verify SSL/TLS settings

## Integration Examples

### Password Recovery Flow

```typescript
@Injectable()
export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  async requestPasswordReset(email: string) {
    const user = await this.findUserByEmail(email);
    const token = this.generateResetToken();
    const resetLink = `https://app.example.com/reset?token=${token}`;

    await this.emailService.sendPasswordRecoveryEmail(
      email,
      user.username,
      resetLink,
      "1 hour"
    );
  }
}
```

### User Registration

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly emailService: EmailService) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.create(createUserDto);

    await this.emailService.sendWelcomeEmail(user.email, user.username);

    return user;
  }
}
```

## Roadmap

- [ ] SendGrid provider implementation
- [ ] AWS SES provider implementation
- [ ] Email queue with BullMQ
- [ ] Bounce and complaint handling
- [ ] Email analytics and tracking
- [ ] MJML template support
- [ ] Attachment support
- [ ] Inline image support
- [ ] Email scheduling

## Contributing

When adding new features to the email module:

1. Follow NestJS best practices
2. Add comprehensive unit tests (target: >90% coverage)
3. Update this documentation
4. Add new templates to `src/email/templates/`
5. Export new interfaces/DTOs in `index.ts`

## Support

For issues or questions:

1. Check this documentation
2. Review test files for examples
3. Check provider documentation:
   - [Resend Docs](https://resend.com/docs)
   - [Nodemailer Docs](https://nodemailer.com/)

---

**Last Updated:** December 11, 2025  
**Version:** 1.0.0
