# Authentication & Authorization System

## Overview

This implementation provides a complete JWT-based authentication and Role-Based Access Control (RBAC) system for the Project Template backend.

## Features

- ✅ User registration with automatic PLAYER role assignment
- ✅ Login with email/password validation
- ✅ JWT Bearer token authentication
- ✅ Role-Based Access Control (ADMIN, MASTER, PLAYER)
- ✅ Custom decorators and guards
- ✅ Password hashing with bcrypt

## API Endpoints

### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxxx",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PLAYER"
  }
}
```

### POST /auth/login

Authenticate and receive a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxxx",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PLAYER"
  }
}
```

## Usage in Controllers

### Protect Routes with JWT Authentication

Use `@UseGuards(JwtAuthGuard)` to require authentication:

```typescript
import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("protected")
export class ProtectedController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProtectedData() {
    return { message: "This route requires authentication" };
  }
}
```

### Role-Based Access Control (RBAC)

Use `@Roles()` decorator with `RolesGuard` to restrict access by role:

```typescript
import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard) // Apply both guards
export class AdminController {
  // Only ADMIN users can access this
  @Get("dashboard")
  @Roles(UserRole.ADMIN)
  getAdminDashboard() {
    return { message: "Admin dashboard data" };
  }

  // Both ADMIN and MASTER can access this
  @Post("manage")
  @Roles(UserRole.ADMIN, UserRole.MASTER)
  manageContent() {
    return { message: "Content management" };
  }

  // All authenticated users can access (no @Roles decorator)
  @Get("public-stats")
  getPublicStats() {
    return { message: "Public statistics" };
  }
}
```

### Access Current User in Controllers

The authenticated user is attached to the request object:

```typescript
import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("profile")
export class ProfileController {
  @Get("me")
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return {
      user: req.user, // { id, email, name, role }
    };
  }
}
```

### Custom User Decorator (Optional)

Create a custom decorator for cleaner code:

```typescript
// src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Usage in controller
@Get('me')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user) {
  return { user };
}
```

## User Roles

The system supports three roles defined in the Prisma schema:

- **PLAYER** (default) - Regular users
- **MASTER** - Game masters with elevated permissions
- **ADMIN** - Full system access

## Security Best Practices

1. **Environment Variables**: Ensure `JWT_SECRET` is set in your `.env` file

   ```
   JWT_SECRET=your-super-secret-key-change-this-in-production
   ```

2. **Token Expiration**: Tokens expire after 1 day (configurable in `auth.module.ts`)

3. **Password Hashing**: Passwords are hashed using bcrypt with salt rounds of 10

4. **Guards Order**: Always apply `JwtAuthGuard` before `RolesGuard`

## Testing with curl

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Access Protected Route

```bash
curl -X GET http://localhost:3000/protected \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Error Responses

- **401 Unauthorized**: Invalid credentials or missing/invalid token
- **403 Forbidden**: Valid token but insufficient role permissions
- **409 Conflict**: User with email already exists (registration)

## Migration

Don't forget to run the database migration to apply the User model changes:

```bash
cd apps/backend-rest
npx prisma migrate dev --name add_user_roles
```

## Files Created/Modified

### New Files:

- `src/auth/auth.controller.ts` - Authentication endpoints
- `src/auth/dto/register.dto.ts` - Registration validation
- `src/auth/dto/login.dto.ts` - Login validation
- `src/auth/dto/index.ts` - DTO exports
- `src/auth/guards/roles.guard.ts` - RBAC guard
- `src/auth/decorators/roles.decorator.ts` - Roles decorator
- `src/auth/decorators/index.ts` - Decorator exports
- `src/auth/index.ts` - Module exports

### Modified Files:

- `src/auth/auth.module.ts` - Added controller and exports
- `src/auth/auth.service.ts` - Enhanced with role support
- `src/auth/strategies/jwt.strategy.ts` - Added role to JWT payload
- `src/users/users.service.ts` - Added role field to queries
- `prisma/schema.prisma` - User model with roles
