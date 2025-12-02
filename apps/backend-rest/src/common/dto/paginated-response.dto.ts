import { ApiProperty } from "@nestjs/swagger";

export class PaginationMetadata {
  @ApiProperty({ description: "Total number of items" })
  total: number;

  @ApiProperty({ description: "Number of items returned" })
  count: number;

  @ApiProperty({ description: "Number of items per page" })
  limit: number;

  @ApiProperty({ description: "Number of items skipped" })
  offset: number;

  @ApiProperty({ description: "Whether there are more items available" })
  hasMore: boolean;

  @ApiProperty({ description: "Current page number (1-based)" })
  currentPage: number;

  @ApiProperty({ description: "Total number of pages" })
  totalPages: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: "Array of items" })
  data: T[];

  @ApiProperty({ description: "Pagination metadata", type: PaginationMetadata })
  meta: PaginationMetadata;
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number,
): PaginatedResponseDto<T> {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const hasMore = offset + data.length < total;

  return {
    data,
    meta: {
      total,
      count: data.length,
      limit,
      offset,
      hasMore,
      currentPage,
      totalPages,
    },
  };
}
