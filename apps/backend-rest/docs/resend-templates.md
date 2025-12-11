# Resend Email Templates

Copy and paste these templates into your Resend dashboard at [https://resend.com/emails/templates](https://resend.com/emails/templates)

---

## 1. Password Recovery Template

**Template Name:** `password-recovery`

**Variables:** `username`, `resetLink`, `expiresIn`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Recovery</title>
  </head>
  <body
    style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;"
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background-color: #f4f4f4; padding: 20px 0;"
    >
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
          >
            <!-- Header -->
            <tr>
              <td style="padding: 40px 40px 20px; text-align: center;">
                <h1
                  style="margin: 0; color: #2563eb; font-size: 28px; font-weight: 600;"
                >
                  Password Recovery
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 20px 40px;">
                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  Hello {{username}},
                </p>
                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  We received a request to reset your password. Click the button
                  below to create a new password:
                </p>

                <!-- Button -->
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="margin: 30px 0;"
                >
                  <tr>
                    <td align="center">
                      <a
                        href="{{resetLink}}"
                        style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;"
                        >Reset Password</a
                      >
                    </td>
                  </tr>
                </table>

                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  This link will expire in {{expiresIn}}.
                </p>
                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  If you didn't request a password reset, you can safely ignore
                  this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="padding: 20px 40px 40px; border-top: 1px solid #e5e5e5;"
              >
                <p
                  style="margin: 0; color: #666; font-size: 12px; line-height: 1.5;"
                >
                  This is an automated message, please do not reply.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 2. Welcome Email Template

**Template Name:** `welcome`

**Variables:** `username`, `email`, `activationLink` (optional)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome</title>
  </head>
  <body
    style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;"
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background-color: #f4f4f4; padding: 20px 0;"
    >
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
          >
            <!-- Header -->
            <tr>
              <td style="padding: 40px 40px 20px; text-align: center;">
                <h1
                  style="margin: 0; color: #2563eb; font-size: 28px; font-weight: 600;"
                >
                  Welcome to Our Platform!
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 20px 40px;">
                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  Hello {{username}},
                </p>
                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  Thank you for joining us! We're excited to have you on board.
                </p>
                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  Your account has been successfully created with the email:
                  <strong>{{email}}</strong>
                </p>

                {{#if activationLink}}
                <!-- Button (if activation link exists) -->
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="margin: 30px 0;"
                >
                  <tr>
                    <td align="center">
                      <a
                        href="{{activationLink}}"
                        style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;"
                        >Activate Account</a
                      >
                    </td>
                  </tr>
                </table>
                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  Please activate your account by clicking the button above to
                  get started.
                </p>
                {{else}}
                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  You can now log in and start using our platform.
                </p>
                {{/if}}

                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  If you have any questions, feel free to reach out to our
                  support team.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="padding: 20px 40px 40px; border-top: 1px solid #e5e5e5;"
              >
                <p
                  style="margin: 0; color: #666; font-size: 12px; line-height: 1.5;"
                >
                  This is an automated message, please do not reply.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 3. Notification Email Template

**Template Name:** `notification`

**Variables:** `username`, `message`, `actionUrl` (optional), `actionText` (optional)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Notification</title>
  </head>
  <body
    style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;"
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background-color: #f4f4f4; padding: 20px 0;"
    >
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
          >
            <!-- Header -->
            <tr>
              <td style="padding: 40px 40px 20px; text-align: center;">
                <h1
                  style="margin: 0; color: #2563eb; font-size: 28px; font-weight: 600;"
                >
                  New Notification
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 20px 40px;">
                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  Hello {{username}},
                </p>
                <p
                  style="margin: 0 0 15px; color: #333; font-size: 16px; line-height: 1.6;"
                >
                  {{message}}
                </p>

                {{#if actionUrl}}
                <!-- Button (if action URL exists) -->
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="margin: 30px 0;"
                >
                  <tr>
                    <td align="center">
                      <a
                        href="{{actionUrl}}"
                        style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;"
                        >{{actionText}}</a
                      >
                    </td>
                  </tr>
                </table>
                {{/if}}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="padding: 20px 40px 40px; border-top: 1px solid #e5e5e5;"
              >
                <p
                  style="margin: 0; color: #666; font-size: 12px; line-height: 1.5;"
                >
                  This is an automated message, please do not reply.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## Setup Instructions

1. Go to [Resend Dashboard](https://resend.com/emails/templates)
2. Click "Create Template"
3. Enter the template name (e.g., `password-recovery`)
4. Paste the corresponding HTML code above
5. Save the template
6. Repeat for all three templates

## Testing Variables

When testing in Resend, use these sample values:

### Password Recovery:

```json
{
  "username": "John Doe",
  "resetLink": "https://example.com/reset?token=abc123",
  "expiresIn": "1 hour"
}
```

### Welcome:

```json
{
  "username": "Jane Smith",
  "email": "jane@example.com",
  "activationLink": "https://example.com/activate?token=xyz789"
}
```

### Notification:

```json
{
  "username": "John Doe",
  "message": "You have a new message from Jane Smith",
  "actionUrl": "https://example.com/messages/123",
  "actionText": "View Message"
}
```
