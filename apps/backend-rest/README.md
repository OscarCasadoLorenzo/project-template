# Backend REST API

## Overview

NestJS application that provides the REST API for the Project Template system.

## Best Practices

### Module Architecture

1. **Module Organization**
   - One module per feature
   - Keep modules focused and independent
   - Follow NestJS module structure

2. **Controller Design**
   - Use proper HTTP methods
   - Implement DTOs for all requests
   - Document with OpenAPI/Swagger
   - Handle errors consistently

3. **Service Layer**
   - Implement business logic in services
   - Use dependency injection
   - Keep services focused on single responsibility
   - Handle database operations

### Database Practices

1. **Prisma Usage**
   - Define clear schema models
   - Use migrations for schema changes
   - Implement proper relations
   - Handle transactions properly

2. **Query Optimization**
   - Use proper indexes
   - Implement pagination
   - Optimize complex queries
   - Use proper join strategies

### Security

1. **Authentication & Authorization**
   - Implement proper JWT handling
   - Use guards consistently
   - Validate user permissions
   - Secure sensitive routes

### Testing

1. **Test Coverage**
   - Unit test all services
   - Test controllers with e2e tests
   - Mock external dependencies
   - Test error scenarios

## File Structure

```
src/
├── modules/              # Feature modules
│   ├── auth/           # Authentication
│   ├── users/         # User management
│   └── [feature]/    # Feature-specific
├── shared/            # Shared code
│   ├── guards/      # Auth guards
│   ├── pipes/      # Custom pipes
│   └── filters/   # Exception filters
└── main.ts          # Application entry
```

## Development Workflow

1. **Database Setup**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Starting Development**

   ```bash
   npm run start:dev
   ```

3. **Building**

   ```bash
   npm run build
   ```

4. **Testing**
   ```bash
   npm run test        # Unit tests
   npm run test:e2e   # E2E tests
   ```

## Common Issues

1. **Prisma Issues**
   - Run `prisma generate` after schema changes
   - Check database connection
   - Verify migrations

2. **API Errors**
   - Verify request/response DTOs
   - Check validation pipes
   - Verify guards configuration

## Dependencies

Check `package.json` for the complete list of dependencies and their versions.
