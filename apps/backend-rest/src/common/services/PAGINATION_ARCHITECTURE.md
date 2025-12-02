# Pagination System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Application                          │
└────────────────┬────────────────────────────────────────────────────┘
                 │ HTTP Request
                 │ GET /characters?limit=10&offset=0&sort=-level
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     CharactersController                            │
│                                                                     │
│  @Get()                                                             │
│  @ApiQuery({ type: PaginationQueryDto })                           │
│  findAll(@Query() query: PaginationQueryDto)                       │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CharactersService                              │
│                                                                     │
│  1. Parse Query ────► PaginationService.parsePaginationQuery()     │
│  2. Build Options ──► PaginationService.buildPrismaOptions()       │
│  3. Execute Queries ─► Prisma.findMany() + Prisma.count()         │
│  4. Format Response ─► createPaginatedResponse()                   │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        PaginationService                            │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ parsePaginationQuery()                                      │  │
│  │  • Validates limit (1-100)                                  │  │
│  │  • Parses sort string                                       │  │
│  │  • Parses fields string                                     │  │
│  │  • Returns PaginationOptions                                │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ buildPrismaOptions()                                        │  │
│  │  • Validates fields against allowlist                       │  │
│  │  • Validates sort fields against allowlist                  │  │
│  │  • Builds Prisma select object                              │  │
│  │  • Builds Prisma orderBy array                              │  │
│  │  • Returns PrismaFindOptions                                │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ buildSearchFilter()                                         │  │
│  │  • Creates OR conditions for searchable fields              │  │
│  │  • Case-insensitive contains search                         │  │
│  │  • Returns Prisma where clause                              │  │
│  └─────────────────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Prisma Client                               │
│                                                                     │
│  findMany({                                                         │
│    take: 10,              ← limit                                  │
│    skip: 0,               ← offset                                 │
│    orderBy: [{ level: 'desc' }],  ← sort                           │
│    select: { id: true, name: true }, ← fields                      │
│    where: { ... }         ← search/filters                         │
│  })                                                                 │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          Database                                   │
│                                                                     │
│  SELECT id, name FROM characters                                   │
│  WHERE name ILIKE '%search%'                                       │
│  ORDER BY level DESC                                               │
│  LIMIT 10 OFFSET 0;                                                │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Response Formatter                              │
│                                                                     │
│  createPaginatedResponse(data, total, limit, offset)               │
│  {                                                                  │
│    data: [...],                                                     │
│    meta: {                                                          │
│      total: 150,                                                    │
│      count: 10,                                                     │
│      limit: 10,                                                     │
│      offset: 0,                                                     │
│      hasMore: true,                                                 │
│      currentPage: 1,                                                │
│      totalPages: 15                                                 │
│    }                                                                │
│  }                                                                  │
└────────────────┬────────────────────────────────────────────────────┘
                 │ HTTP Response 200
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Application                          │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Request Phase

```
Client ──► Controller ──► DTO Validation ──► Service
```

### 2. Processing Phase

```
Service ──► PaginationService ──► Options Builder ──► Validators
                    │
                    ├──► Parse Query Parameters
                    ├──► Validate Fields
                    ├──► Build Search Filter
                    └──► Merge Conditions
```

### 3. Database Phase

```
Prisma ──► Build SQL ──► Execute Query ──► Return Results
   │
   ├──► findMany() - Get data
   └──► count()    - Get total
```

### 4. Response Phase

```
Results ──► Response Formatter ──► Add Metadata ──► Send to Client
```

## Component Interactions

```
┌──────────────────┐
│   Controller     │
└────────┬─────────┘
         │ depends on
         ▼
┌──────────────────┐     ┌──────────────────┐
│     Service      │────►│ PaginationService│
└────────┬─────────┘     └──────────────────┘
         │ uses                    │
         ▼                         │
┌──────────────────┐              │
│  PrismaService   │◄─────────────┘
└──────────────────┘
```

## Security Layers

```
1. Input Validation
   ├─► class-validator decorators
   ├─► Limit enforcement (max 100)
   └─► Format validation (regex)

2. Field Validation
   ├─► allowedFields check
   ├─► allowedSortFields check
   └─► BadRequestException on invalid

3. Query Building
   ├─► No raw SQL
   ├─► Prisma query builder
   └─► Parameterized queries

4. Response Filtering
   └─► Only selected fields returned
```

## Performance Optimizations

```
1. Parallel Queries
   ├─► Promise.all([findMany, count])
   └─► Reduces total query time

2. Field Selection
   ├─► SELECT only requested fields
   └─► Reduces payload size up to 80%

3. Indexed Sorting
   ├─► Database indexes on sort fields
   └─► Fast ORDER BY operations

4. Efficient Pagination
   ├─► LIMIT/OFFSET at database level
   └─► Only fetch needed rows
```

## Module Dependencies

```
CommonModule (Global)
    │
    ├─► PaginationService
    │   ├─► Injectable
    │   └─► No external dependencies
    │
    ├─► PaginationQueryDto
    │   ├─► class-validator
    │   └─► class-transformer
    │
    └─► PaginatedResponseDto
        └─► @nestjs/swagger

CharactersModule
    │
    ├─► CharactersService
    │   ├─► PrismaService
    │   └─► PaginationService (injected)
    │
    └─► CharactersController
        └─► CharactersService
```

## File Organization

```
src/
├── common/                     # Global utilities
│   ├── decorators/
│   │   └── paginate.decorator.ts
│   ├── dto/
│   │   ├── pagination-query.dto.ts      # Input
│   │   └── paginated-response.dto.ts    # Output
│   ├── interfaces/
│   │   └── pagination-options.interface.ts
│   ├── services/
│   │   ├── pagination.service.ts
│   │   └── pagination.service.spec.ts
│   ├── common.module.ts        # Module definition
│   └── index.ts                # Public exports
│
└── characters/                 # Feature module example
    ├── characters.controller.ts # Uses pagination
    └── characters.service.ts   # Implements pagination
```
