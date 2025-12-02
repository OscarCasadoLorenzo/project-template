# Pagination Utility - Usage Guide

## Overview

The pagination utility provides a robust, reusable solution for implementing data pagination, filtering, sorting, and field selection across all NestJS services in the Project Template application.

## Features

- ✅ **Pagination**: Limit and offset-based pagination
- ✅ **Sorting**: Multi-field sorting with ascending/descending order
- ✅ **Field Selection**: Client-defined projections to reduce payload size
- ✅ **Search/Filtering**: Case-insensitive search across multiple fields
- ✅ **Validation**: Built-in validation with configurable limits
- ✅ **Security**: Field allowlists to prevent unauthorized data access
- ✅ **DoS Protection**: Maximum limit enforcement (default: 100 items)

## Quick Start

### 1. Controller Setup

```typescript
import { Controller, Get, Query } from "@nestjs/common";
import { PaginationQueryDto, PaginatedResponseDto } from "../common";
import { Character } from "@prisma/client";

@Controller("characters")
export class CharactersController {
  @Get()
  @ApiOperation({ summary: "Get all characters with optional pagination" })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  findAll(
    @Query() paginationQuery?: PaginationQueryDto,
  ): Promise<Character[] | PaginatedResponseDto<Character>> {
    return this.charactersService.findAll(paginationQuery);
  }
}
```

### 2. Service Setup

```typescript
import { Injectable } from "@nestjs/common";
import {
  PaginationService,
  PaginationQueryDto,
  PaginatedResponseDto,
  createPaginatedResponse,
} from "../common";

@Injectable()
export class CharactersService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async findAll(
    paginationQuery?: PaginationQueryDto,
  ): Promise<Character[] | PaginatedResponseDto<Character>> {
    // Parse pagination options
    const options =
      this.paginationService.parsePaginationQuery(paginationQuery);

    // Define allowed fields
    const allowedFields = ["id", "characterName", "level", "createdAt"];
    const allowedSortFields = ["characterName", "level", "createdAt"];
    const searchableFields = ["characterName"];

    // Build Prisma options
    const prismaOptions = this.paginationService.buildPrismaOptions(options, {
      allowedFields,
      allowedSortFields,
      defaultSort: [{ field: "createdAt", order: "desc" }],
    });

    // Build search filter
    const searchFilter = this.paginationService.buildSearchFilter(
      options.search,
      searchableFields,
    );

    // Execute queries
    const [data, total] = await Promise.all([
      this.prisma.character.findMany({
        ...prismaOptions,
        where: searchFilter,
      }),
      this.prisma.character.count({ where: searchFilter }),
    ]);

    // Return paginated response
    return createPaginatedResponse(data, total, options.limit, options.offset);
  }
}
```

## API Usage Examples

### Basic Pagination

```bash
# Get first 25 characters (default)
GET /characters

# Get first 10 characters
GET /characters?limit=10

# Get next 10 characters (pagination)
GET /characters?limit=10&offset=10

# Get page 3 with 25 items per page
GET /characters?limit=25&offset=50
```

### Sorting

```bash
# Sort by character name (ascending)
GET /characters?sort=characterName

# Sort by level (descending)
GET /characters?sort=-level

# Multi-field sorting: level desc, then name asc
GET /characters?sort=-level,characterName

# Sort by creation date (newest first)
GET /characters?sort=-createdAt
```

### Field Selection

```bash
# Get only id and name fields
GET /characters?fields=id,characterName

# Get specific fields with pagination
GET /characters?fields=id,characterName,level&limit=10

# Reduce payload size for list views
GET /characters?fields=id,characterName&sort=characterName
```

### Search/Filtering

```bash
# Search for characters with "warrior" in name
GET /characters?search=warrior

# Combine search with pagination
GET /characters?search=elf&limit=10

# Search with sorting
GET /characters?search=mage&sort=-level
```

### Combined Queries

```bash
# Full example: search, sort, paginate, and select fields
GET /characters?search=dragon&sort=-level&limit=10&offset=0&fields=id,characterName,level

# Page 2 of search results, sorted by name
GET /characters?search=knight&sort=characterName&limit=25&offset=25
```

## Response Format

### Paginated Response

```json
{
  "data": [
    {
      "id": "uuid-1",
      "characterName": "Aragorn",
      "level": 20
    }
  ],
  "meta": {
    "total": 150,
    "count": 25,
    "limit": 25,
    "offset": 0,
    "hasMore": true,
    "currentPage": 1,
    "totalPages": 6
  }
}
```

### Response Fields

- **data**: Array of items
- **meta.total**: Total number of items matching the query
- **meta.count**: Number of items in current response
- **meta.limit**: Items per page
- **meta.offset**: Number of items skipped
- **meta.hasMore**: Whether more items are available
- **meta.currentPage**: Current page number (1-based)
- **meta.totalPages**: Total number of pages

## Configuration Options

### PaginationService.buildPrismaOptions()

```typescript
const prismaOptions = this.paginationService.buildPrismaOptions(options, {
  allowedFields: ["id", "name", "email"], // Fields that can be selected
  allowedSortFields: ["name", "createdAt"], // Fields that can be sorted
  defaultSort: [{ field: "createdAt", order: "desc" }], // Default sort order
});
```

### Limits

- **Default limit**: 25 items
- **Maximum limit**: 100 items (configurable in PaginationService)
- **Minimum limit**: 1 item

## Security Features

### Field Allowlists

The pagination service validates all requested fields against allowlists:

```typescript
// Only these fields can be selected
const allowedFields = ['id', 'characterName', 'level'];

// Requesting other fields will throw BadRequestException
GET /characters?fields=id,password  // ❌ Error: Invalid fields
GET /characters?fields=id,characterName  // ✅ OK
```

### DoS Protection

Maximum limit prevents excessive data retrieval:

```typescript
GET /characters?limit=1000  // ❌ Error: Limit cannot exceed 100
GET /characters?limit=50    // ✅ OK
```

### SQL Injection Prevention

- All field names are validated against allowlists
- Regex validation for field parameter format
- No raw SQL queries

## Best Practices

### 1. Always Define Allowlists

```typescript
// ✅ Good: Explicit allowlists
const allowedFields = ["id", "name", "email"];
const allowedSortFields = ["name", "createdAt"];

// ❌ Bad: No validation
const prismaOptions = this.paginationService.buildPrismaOptions(options);
```

### 2. Provide Sensible Defaults

```typescript
// ✅ Good: Default sorting for consistent results
const prismaOptions = this.paginationService.buildPrismaOptions(options, {
  defaultSort: [{ field: "createdAt", order: "desc" }],
});
```

### 3. Use Search for Better UX

```typescript
// Enable search on relevant fields
const searchableFields = ["characterName", "race", "faction"];
const searchFilter = this.paginationService.buildSearchFilter(
  options.search,
  searchableFields,
);
```

### 4. Optimize Relations

```typescript
// Don't include relations when using field selection
const [data, total] = await Promise.all([
  this.prisma.character.findMany({
    ...prismaOptions,
    include: prismaOptions.select
      ? undefined
      : {
          attributes: true,
          domains: true,
        },
  }),
  this.prisma.character.count({ where }),
]);
```

### 5. Handle Backward Compatibility

```typescript
// Support both paginated and non-paginated requests
async findAll(paginationQuery?: PaginationQueryDto) {
  if (!paginationQuery) {
    // Return all items for backward compatibility
    return this.prisma.character.findMany();
  }

  // Use pagination
  const options = this.paginationService.parsePaginationQuery(paginationQuery);
  // ...
}
```

## Error Handling

### Validation Errors

```json
{
  "statusCode": 400,
  "message": "Limit cannot exceed 100. Requested: 1000",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Invalid fields requested: password, secret. Allowed fields: id, name, email",
  "error": "Bad Request"
}
```

## Advanced Usage

### Custom Where Conditions

```typescript
// Combine search with additional filters
const searchFilter = this.paginationService.buildSearchFilter(
  options.search,
  searchableFields,
);

const additionalWhere = { isActive: true, level: { gte: 10 } };

const where = this.paginationService.mergeWhereConditions(
  searchFilter,
  additionalWhere,
);
```

### Nested Sorting

```typescript
// Sort by nested fields
const prismaOptions = this.paginationService.buildPrismaOptions(options, {
  allowedSortFields: ["user.name", "createdAt"],
});
```

## Testing

### Example Test Cases

```typescript
describe("CharactersController Pagination", () => {
  it("should return paginated results", async () => {
    const result = await controller.findAll({ limit: 10, offset: 0 });
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("meta");
    expect(result.data.length).toBeLessThanOrEqual(10);
  });

  it("should enforce maximum limit", async () => {
    await expect(controller.findAll({ limit: 1000 })).rejects.toThrow(
      "Limit cannot exceed 100",
    );
  });

  it("should validate field names", async () => {
    await expect(
      controller.findAll({ fields: "id,invalidField" }),
    ).rejects.toThrow("Invalid fields requested");
  });
});
```

## Migration Guide

### Migrating Existing Services

1. **Add PaginationService dependency**
2. **Update service method signature**
3. **Implement pagination logic**
4. **Update controller**
5. **Test thoroughly**

See the `CharactersService` implementation for a complete example.

## Performance Considerations

- **Field selection** reduces payload size by up to 80%
- **Pagination** prevents loading entire tables into memory
- **Indexed sorting** ensures fast query performance
- **Count query** runs in parallel with data query

## Related Files

- `/src/common/dto/pagination-query.dto.ts` - Request DTO
- `/src/common/dto/paginated-response.dto.ts` - Response DTO
- `/src/common/services/pagination.service.ts` - Core service
- `/src/common/decorators/paginate.decorator.ts` - Custom decorator
- `/src/characters/characters.service.ts` - Example implementation
