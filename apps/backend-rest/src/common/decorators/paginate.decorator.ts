import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { PaginationQueryDto } from "../dto/pagination-query.dto";

/**
 * Custom decorator to extract and validate pagination query parameters
 * Usage: @Paginate() pagination: PaginationQueryDto
 */
export const Paginate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationQueryDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const paginationQuery = new PaginationQueryDto();

    if (query.limit !== undefined) {
      paginationQuery.limit = parseInt(query.limit as string, 10);
    }

    if (query.offset !== undefined) {
      paginationQuery.offset = parseInt(query.offset as string, 10);
    }

    if (query.sort) {
      paginationQuery.sort = query.sort as string;
    }

    if (query.fields) {
      paginationQuery.fields = query.fields as string;
    }

    if (query.search) {
      paginationQuery.search = query.search as string;
    }

    return paginationQuery;
  },
);
