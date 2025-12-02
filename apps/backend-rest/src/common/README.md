# Common Module

This module provides shared utilities, DTOs, and services used across the Project Template backend application.

## Features

### Pagination System

A comprehensive pagination utility for implementing data pagination, filtering, sorting, and field selection.

**Key Components:**

- **PaginationService**: Core service for parsing queries and building Prisma options
- **PaginationQueryDto**: Request DTO with validation for query parameters
- **PaginatedResponseDto**: Standardized response format with metadata
- **@Paginate()**: Custom decorator for easy parameter extraction

**Quick Example:**

```typescript
@Get()
async findAll(@Query() query: PaginationQueryDto) {
  const options = this.paginationService.parsePaginationQuery(query);
  const [data, total] = await Promise.all([
    this.prisma.model.findMany(options),
    this.prisma.model.count(),
  ]);
  return createPaginatedResponse(data, total, options.limit, options.offset);
}
```

**Documentation:** See [PAGINATION_GUIDE.md](../../PAGINATION_GUIDE.md) for complete usage guide.

## Structure

```
common/
├── decorators/
│   └── paginate.decorator.ts       # Custom @Paginate() decorator
├── dto/
│   ├── pagination-query.dto.ts     # Request DTO for pagination params
│   └── paginated-response.dto.ts   # Response DTO with metadata
├── interfaces/
│   └── pagination-options.interface.ts  # TypeScript interfaces
├── services/
│   ├── pagination.service.ts       # Core pagination logic
│   └── pagination.service.spec.ts  # Unit tests
├── common.module.ts                # Module definition (Global)
└── index.ts                        # Public exports
```

## Installation

The `CommonModule` is registered as a global module in `app.module.ts`, so all services are automatically available throughout the application.

## Usage

### Import in Your Module

```typescript
import { Module } from "@nestjs/common";
import { CommonModule } from "../common";

@Module({
  imports: [CommonModule], // Not needed if using @Global()
})
export class YourModule {}
```

### Import in Your Service

```typescript
import { Injectable } from "@nestjs/common";
import {
  PaginationService,
  PaginationQueryDto,
  createPaginatedResponse,
} from "../common";

@Injectable()
export class YourService {
  constructor(private paginationService: PaginationService) {}
}
```

## API Reference

### PaginationService

#### parsePaginationQuery(query: PaginationQueryDto)

Parses and validates pagination query parameters.

**Returns:** `PaginationOptions`

#### buildPrismaOptions(options, config?)

Builds Prisma query options from pagination options.

**Parameters:**

- `options`: PaginationOptions
- `config?`: { allowedFields?, allowedSortFields?, defaultSort? }

**Returns:** `PrismaFindOptions`

#### validateFields(requestedFields, allowedFields)

Validates requested fields against allowlist.

**Throws:** `BadRequestException` if invalid fields requested

#### buildSearchFilter(searchTerm, searchableFields)

Builds case-insensitive search filter for multiple fields.

**Returns:** Prisma where clause or undefined

### DTOs

#### PaginationQueryDto

- `limit?: number` - Items per page (1-100, default: 25)
- `offset?: number` - Items to skip (default: 0)
- `sort?: string` - Sort fields (e.g., "-createdAt,name")
- `fields?: string` - Comma-separated field list
- `search?: string` - Search term

#### PaginatedResponseDto<T>

- `data: T[]` - Array of items
- `meta: PaginationMetadata` - Pagination metadata

## Testing

Run tests for the pagination service:

```bash
npm test -- pagination.service.spec.ts
```

## Best Practices

1. ✅ Always define field allowlists for security
2. ✅ Provide default sort order for consistent results
3. ✅ Use parallel queries for data + count
4. ✅ Validate all user input
5. ✅ Document API endpoints with Swagger decorators

## Contributing

When adding new common utilities:

1. Create the utility in the appropriate subfolder
2. Add comprehensive unit tests
3. Export from `index.ts`
4. Update this README
5. Follow the coding standards in `.ai/rules/`

## Related Documentation

- [Pagination Guide](../../PAGINATION_GUIDE.md) - Complete pagination usage guide
- [Backend Rules](../../../../.ai/rules/backend.md) - Backend development guidelines
- [Style Guide](../../../../.ai/rules/style.md) - Code style conventions
