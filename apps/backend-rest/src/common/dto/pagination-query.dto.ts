import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from "class-validator";

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Number of items to return",
    minimum: 1,
    maximum: 100,
    default: 25,
    example: 25,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 25;

  @ApiPropertyOptional({
    description: "Number of items to skip",
    minimum: 0,
    default: 0,
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Sort by field(s). Use "-" prefix for descending order',
    example: "-createdAt,name",
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: "Comma-separated list of fields to return",
    example: "id,name,email",
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9,_]+$/, {
    message: "Fields must be comma-separated alphanumeric values",
  })
  fields?: string;

  @ApiPropertyOptional({
    description: "Search term for filtering results",
    example: "search term",
  })
  @IsOptional()
  @IsString()
  search?: string;
}
