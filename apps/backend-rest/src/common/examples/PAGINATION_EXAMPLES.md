# Pagination Examples - Reference Code

This file contains example code patterns for implementing pagination in your NestJS services. These are **reference examples** - copy and adapt the patterns that match your use case.

> **Note:** Replace `any` types with your actual entity types when implementing.

---

## Table of Contents

1. [Basic Pagination](#example-1-basic-pagination)
2. [Pagination with Field Validation](#example-2-pagination-with-field-validation)
3. [Pagination with Search](#example-3-pagination-with-search)
4. [Pagination with Additional Filters](#example-4-pagination-with-additional-filters)
5. [Pagination with Relations](#example-5-pagination-with-relations)
6. [Pagination with Default Sort](#example-6-pagination-with-default-sort)
7. [Pagination with Complex Filters](#example-7-pagination-with-complex-filters)

---

## EXAMPLE 1: Basic Pagination

The simplest pagination implementation - just limit and offset.

````typescript
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PaginationService,
  PaginationQueryDto,
  PaginatedResponseDto,
  createPaginatedResponse,
} from '../index';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async findAll(
    query?: PaginationQueryDto,
  ): Promise<any[] | PaginatedResponseDto<any>> {
    // Return all if no pagination query
    if (!query) {
      return this.prisma.user.findMany();
    }

    // Parse pagination options
    const options = this.paginationService.parsePaginationQuery(query);

    // Build Prisma options
    const prismaOptions = this.paginationService.buildPrismaOptions(options);

    // Execute queries
    const [data, total] = await Promise.all([
      this.prisma.user.findMany(prismaOptions),
      this.prisma.user.count(),
    ]);

    // Return paginated response
    return createPaginatedResponse(data, total, options.limit, options.offset);
  }
}

// ============================================================================
// EXAMPLE 2: Pagination with Field Validation
// ============================================================================

@Injectable()
export class FieldValidationExample {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async findAll(
    query?: PaginationQueryDto,
  ): Promise<any[] | PaginatedResponseDto<any>> {
    if (!query) {
      return this.prisma.user.findMany();
    }

    const options = this.paginationService.parsePaginationQuery(query);

    // Define allowed fields for security
    const allowedFields = ['id', 'email', 'name', 'createdAt'];
    const allowedSortFields = ['name', 'email', 'createdAt'];

    // Build Prisma options with validation
    const prismaOptions = this.paginationService.buildPrismaOptions(options, {
      allowedFields,
      allowedSortFields,
    });

    const [data, total] = await Promise.all([
      this.prisma.user.findMany(prismaOptions),
      this.prisma.user.count(),
    ]);

    return createPaginatedResponse(data, total, options.limit, options.offset);
  }
}

// ============================================================================
// EXAMPLE 3: Pagination with Search
// ============================================================================

@Injectable()
export class SearchPaginationExample {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async findAll(
    query?: PaginationQueryDto,
  ): Promise<any[] | PaginatedResponseDto<any>> {
    if (!query) {
      return this.prisma.user.findMany();
    }

    const options = this.paginationService.parsePaginationQuery(query);

    // Define searchable fields
    const searchableFields = ['name', 'email', 'bio'];

    // Build search filter
    const searchFilter = this.paginationService.buildSearchFilter(
      options.search,
      searchableFields,
    );

    // Build Prisma options
    const prismaOptions = this.paginationService.buildPrismaOptions(options, {
      allowedFields: ['id', 'name', 'email', 'bio', 'createdAt'],
      allowedSortFields: ['name', 'email', 'createdAt'],
      defaultSort: [{ field: 'createdAt', order: 'desc' }],
    });

    // Execute queries with search filter
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        ...prismaOptions,
        where: searchFilter,
      }),
      this.prisma.user.count({ where: searchFilter }),
    ]);

    return createPaginatedResponse(data, total, options.limit, options.offset);
  }
}

// ============================================================================
// EXAMPLE 4: Pagination with Additional Filters
// ============================================================================

@Injectable()
export class FilteredPaginationExample {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async findActive(
    query?: PaginationQueryDto,
  ): Promise<any[] | PaginatedResponseDto<any>> {
    if (!query) {
      return this.prisma.user.findMany({ where: { isActive: true } });
    }

    const options = this.paginationService.parsePaginationQuery(query);

    const searchableFields = ['name', 'email'];
    const searchFilter = this.paginationService.buildSearchFilter(
      options.search,
      searchableFields,
    );

    // Add custom filters
    const additionalWhere = {
      isActive: true,
      role: { in: ['USER', 'ADMIN'] },
    };

    // Merge search and custom filters
    const where = this.paginationService.mergeWhereConditions(
      searchFilter,
      additionalWhere,
    );

    const prismaOptions = this.paginationService.buildPrismaOptions(options, {
      allowedFields: ['id', 'name', 'email', 'role', 'createdAt'],
      allowedSortFields: ['name', 'email', 'role', 'createdAt'],
      defaultSort: [{ field: 'createdAt', order: 'desc' }],
    });

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        ...prismaOptions,
        where,
      }),
      this.prisma.user.count({ where }),
    ]);

    return createPaginatedResponse(data, total, options.limit, options.offset);
  }
}

// ============================================================================
// EXAMPLE 5: Pagination with Relations
// ============================================================================

@Injectable()
export class RelationsPaginationExample {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async findAll(
    query?: PaginationQueryDto,
  ): Promise<any[] | PaginatedResponseDto<any>> {
    if (!query) {
      return this.prisma.user.findMany({
        include: { profile: true, posts: true },
      });
    }

    const options = this.paginationService.parsePaginationQuery(query);

    const prismaOptions = this.paginationService.buildPrismaOptions(options, {
      allowedFields: ['id', 'name', 'email', 'createdAt'],
      allowedSortFields: ['name', 'email', 'createdAt'],
    });

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        ...prismaOptions,
        // Don't include relations when using field selection
        include: prismaOptions.select
          ? undefined
          : {
              profile: true,
              posts: { take: 5 }, // Limit nested relations
            },
      }),
      this.prisma.user.count(),
    ]);

    return createPaginatedResponse(data, total, options.limit, options.offset);
  }
}

// ============================================================================
// EXAMPLE 6: Pagination with Default Sort
// ============================================================================

@Injectable()
export class DefaultSortExample {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async findAll(
    query?: PaginationQueryDto,
  ): Promise<any[] | PaginatedResponseDto<any>> {
    if (!query) {
      return this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    const options = this.paginationService.parsePaginationQuery(query);

    const prismaOptions = this.paginationService.buildPrismaOptions(options, {
      allowedFields: ['id', 'name', 'email', 'createdAt'],
      allowedSortFields: ['name', 'email', 'createdAt'],
      // Provide default sort if none specified
      defaultSort: [
        { field: 'createdAt', order: 'desc' },
        { field: 'name', order: 'asc' },
      ],
    });

    const [data, total] = await Promise.all([
      this.prisma.user.findMany(prismaOptions),
      this.prisma.user.count(),
    ]);

    return createPaginatedResponse(data, total, options.limit, options.offset);
  }
}

// ============================================================================
// EXAMPLE 7: Pagination with Complex Filters
// ============================================================================

@Injectable()
export class ComplexFilterExample {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async findByDateRange(
    query: PaginationQueryDto,
    startDate: Date,
    endDate: Date,
  ): Promise<PaginatedResponseDto<any>> {
    const options = this.paginationService.parsePaginationQuery(query);

    const searchableFields = ['name', 'description'];
    const searchFilter = this.paginationService.buildSearchFilter(
      options.search,
      searchableFields,
    );

    const dateFilter = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'ACTIVE',
      level: { gte: 10 },
    };

    const where = this.paginationService.mergeWhereConditions(
      searchFilter,
      dateFilter,
    );

    const prismaOptions = this.paginationService.buildPrismaOptions(options, {
      allowedFields: ['id', 'name', 'description', 'level', 'createdAt'],
      allowedSortFields: ['name', 'level', 'createdAt'],
      defaultSort: [{ field: 'level', order: 'desc' }],
    });

    const [data, total] = await Promise.all([
      this.prisma.character.findMany({
        ...prismaOptions,
        where,
      }),
      this.prisma.character.count({ where }),
    ]);

    return createPaginatedResponse(data, total, options.limit, options.offset);
  }
}

// ============================================================================
// USAGE IN CONTROLLER
// ============================================================================

/*
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common';

@ApiTags('examples')
@Controller('examples')
export class ExampleController {
  constructor(private readonly service: BasicPaginationExample) {}

  @Get()
  @ApiQuery({ type: PaginationQueryDto, required: false })
  findAll(@Query() query?: PaginationQueryDto) {
    return this.service.findAll(query);
  }
}

// Example API calls:

// 1. Get all items (no pagination)
GET /examples

// 2. Get first page (25 items)
GET /examples?limit=25&offset=0

// 3. Get second page (25 items)
GET /examples?limit=25&offset=25

// 4. Search for "john" and sort by name
GET /examples?search=john&sort=name

// 5. Get specific fields only
GET /examples?fields=id,name,email

// 6. Combined query
GET /examples?search=active&sort=-createdAt&limit=10&fields=id,name
*/
````
