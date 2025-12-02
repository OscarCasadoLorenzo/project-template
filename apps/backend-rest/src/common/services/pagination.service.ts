import { BadRequestException, Injectable } from "@nestjs/common";
import { PaginationQueryDto } from "../dto/pagination-query.dto";
import {
  PaginationOptions,
  PrismaFindOptions,
  SortOption,
} from "../interfaces/pagination-options.interface";

@Injectable()
export class PaginationService {
  /**
   * Maximum number of items that can be requested at once
   * Helps prevent DoS attacks
   */
  private readonly MAX_LIMIT = 100;

  /**
   * Default number of items to return if not specified
   */
  private readonly DEFAULT_LIMIT = 25;

  /**
   * Parses pagination query parameters and returns validated options
   */
  parsePaginationQuery(query: PaginationQueryDto): PaginationOptions {
    const limit = this.validateLimit(query.limit ?? this.DEFAULT_LIMIT);
    const offset = query.offset ?? 0;
    const sort = query.sort ? this.parseSortString(query.sort) : undefined;
    const fields = query.fields
      ? this.parseFieldsString(query.fields)
      : undefined;
    const search = query.search;

    return {
      limit,
      offset,
      sort,
      fields,
      search,
    };
  }

  /**
   * Validates the limit parameter
   */
  private validateLimit(limit: number): number {
    if (limit > this.MAX_LIMIT) {
      throw new BadRequestException(
        `Limit cannot exceed ${this.MAX_LIMIT}. Requested: ${limit}`,
      );
    }
    if (limit < 1) {
      throw new BadRequestException("Limit must be at least 1");
    }
    return limit;
  }

  /**
   * Parses sort string into array of sort options
   * Format: "field1,-field2,field3" where "-" indicates descending order
   */
  private parseSortString(sortString: string): SortOption[] {
    return sortString
      .split(",")
      .map((field) => field.trim())
      .filter((field) => field.length > 0)
      .map((field) => {
        if (field.startsWith("-")) {
          return {
            field: field.substring(1),
            order: "desc" as const,
          };
        }
        return {
          field,
          order: "asc" as const,
        };
      });
  }

  /**
   * Parses fields string into array of field names
   * Format: "field1,field2,field3"
   */
  private parseFieldsString(fieldsString: string): string[] {
    return fieldsString
      .split(",")
      .map((field) => field.trim())
      .filter((field) => field.length > 0);
  }

  /**
   * Validates that requested fields are in the allowlist
   */
  validateFields(
    requestedFields: string[] | undefined,
    allowedFields: string[],
  ): string[] | undefined {
    if (!requestedFields || requestedFields.length === 0) {
      return undefined;
    }

    const invalidFields = requestedFields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      throw new BadRequestException(
        `Invalid fields requested: ${invalidFields.join(", ")}. Allowed fields: ${allowedFields.join(", ")}`,
      );
    }

    return requestedFields;
  }

  /**
   * Validates that sort fields are in the allowlist
   */
  validateSortFields(
    sortOptions: SortOption[] | undefined,
    allowedFields: string[],
  ): SortOption[] | undefined {
    if (!sortOptions || sortOptions.length === 0) {
      return undefined;
    }

    const invalidFields = sortOptions
      .map((sort) => sort.field)
      .filter((field) => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
      throw new BadRequestException(
        `Invalid sort fields: ${invalidFields.join(", ")}. Allowed fields: ${allowedFields.join(", ")}`,
      );
    }

    return sortOptions;
  }

  /**
   * Builds Prisma query options from pagination options
   */
  buildPrismaOptions(
    options: PaginationOptions,
    config?: {
      allowedFields?: string[];
      allowedSortFields?: string[];
      defaultSort?: SortOption[];
    },
  ): PrismaFindOptions {
    const prismaOptions: PrismaFindOptions = {
      take: options.limit,
      skip: options.offset,
    };

    // Handle field selection
    if (options.fields) {
      const validatedFields = config?.allowedFields
        ? this.validateFields(options.fields, config.allowedFields)
        : options.fields;

      if (validatedFields) {
        prismaOptions.select = this.buildSelectObject(validatedFields);
      }
    }

    // Handle sorting
    const sortOptions = options.sort || config?.defaultSort;
    if (sortOptions) {
      const validatedSort = config?.allowedSortFields
        ? this.validateSortFields(sortOptions, config.allowedSortFields)
        : sortOptions;

      if (validatedSort) {
        prismaOptions.orderBy = validatedSort.map((sort) => ({
          [sort.field]: sort.order,
        }));
      }
    }

    return prismaOptions;
  }

  /**
   * Converts array of field names to Prisma select object
   */
  private buildSelectObject(fields: string[]): Record<string, boolean> {
    return fields.reduce(
      (acc, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  }

  /**
   * Builds a search filter for multiple fields
   * Uses case-insensitive contains search
   */
  buildSearchFilter(
    searchTerm: string | undefined,
    searchableFields: string[],
  ): Record<string, unknown> | undefined {
    if (!searchTerm || searchableFields.length === 0) {
      return undefined;
    }

    return {
      OR: searchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    };
  }

  /**
   * Merges search filter with additional where conditions
   */
  mergeWhereConditions(
    searchFilter?: Record<string, unknown>,
    additionalWhere?: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    if (!searchFilter && !additionalWhere) {
      return undefined;
    }

    if (!searchFilter) {
      return additionalWhere;
    }

    if (!additionalWhere) {
      return searchFilter;
    }

    return {
      AND: [searchFilter, additionalWhere],
    };
  }
}
