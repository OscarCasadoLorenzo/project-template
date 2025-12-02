# Pagination Quick Reference

## 🚀 Quick Start

### 1. Controller Setup

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../common';

@Get()
@ApiQuery({ type: PaginationQueryDto, required: false })
findAll(@Query() query?: PaginationQueryDto) {
  return this.service.findAll(query);
}
```

### 2. Service Setup

```typescript
import {
  PaginationService,
  PaginationQueryDto,
  createPaginatedResponse,
} from '../common';

constructor(
  private prisma: PrismaService,
  private paginationService: PaginationService,
) {}

async findAll(query?: PaginationQueryDto) {
  const options = this.paginationService.parsePaginationQuery(query);

  const prismaOptions = this.paginationService.buildPrismaOptions(options, {
    allowedFields: ['id', 'name'],
    allowedSortFields: ['name', 'createdAt'],
    defaultSort: [{ field: 'createdAt', order: 'desc' }],
  });

  const [data, total] = await Promise.all([
    this.prisma.model.findMany(prismaOptions),
    this.prisma.model.count(),
  ]);

  return createPaginatedResponse(data, total, options.limit, options.offset);
}
```

## 📝 API Usage

```bash
# Pagination
GET /api?limit=25&offset=0

# Sorting (- for descending)
GET /api?sort=-createdAt,name

# Field selection
GET /api?fields=id,name,email

# Search
GET /api?search=warrior

# Combined
GET /api?search=elf&sort=-level&limit=10&fields=id,name
```

## 🎯 Key Methods

| Method                      | Purpose                         |
| --------------------------- | ------------------------------- |
| `parsePaginationQuery()`    | Parse and validate query params |
| `buildPrismaOptions()`      | Build Prisma query options      |
| `validateFields()`          | Validate requested fields       |
| `buildSearchFilter()`       | Build search WHERE clause       |
| `mergeWhereConditions()`    | Combine multiple WHERE clauses  |
| `createPaginatedResponse()` | Format paginated response       |

## 🔒 Security Checklist

- ✅ Define `allowedFields` array
- ✅ Define `allowedSortFields` array
- ✅ Never expose password/secret fields
- ✅ Maximum limit enforced automatically (100)
- ✅ Input validated with class-validator

## 📊 Response Format

```json
{
  "data": [...],
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

## 💡 Common Patterns

### With Search

```typescript
const searchFilter = this.paginationService.buildSearchFilter(options.search, [
  "name",
  "email",
]);
```

### With Additional Filters

```typescript
const where = this.paginationService.mergeWhereConditions(searchFilter, {
  isActive: true,
  level: { gte: 10 },
});
```

### With Relations

```typescript
this.prisma.model.findMany({
  ...prismaOptions,
  include: prismaOptions.select ? undefined : { relation: true },
});
```

## 📚 Full Documentation

See [PAGINATION_GUIDE.md](./PAGINATION_GUIDE.md) for complete documentation.
