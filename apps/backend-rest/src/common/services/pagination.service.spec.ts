import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PaginationQueryDto } from "../dto/pagination-query.dto";
import { PaginationService } from "./pagination.service";

describe("PaginationService", () => {
  let service: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationService],
    }).compile();

    service = module.get<PaginationService>(PaginationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("parsePaginationQuery", () => {
    it("should return default values when no query provided", () => {
      const query: PaginationQueryDto = {};
      const result = service.parsePaginationQuery(query);

      expect(result.limit).toBe(25);
      expect(result.offset).toBe(0);
      expect(result.sort).toBeUndefined();
      expect(result.fields).toBeUndefined();
    });

    it("should parse limit and offset", () => {
      const query: PaginationQueryDto = { limit: 10, offset: 20 };
      const result = service.parsePaginationQuery(query);

      expect(result.limit).toBe(10);
      expect(result.offset).toBe(20);
    });

    it("should parse sort string", () => {
      const query: PaginationQueryDto = { sort: "name,-createdAt" };
      const result = service.parsePaginationQuery(query);

      expect(result.sort).toEqual([
        { field: "name", order: "asc" },
        { field: "createdAt", order: "desc" },
      ]);
    });

    it("should parse fields string", () => {
      const query: PaginationQueryDto = { fields: "id,name,email" };
      const result = service.parsePaginationQuery(query);

      expect(result.fields).toEqual(["id", "name", "email"]);
    });

    it("should throw error when limit exceeds maximum", () => {
      const query: PaginationQueryDto = { limit: 150 };

      expect(() => service.parsePaginationQuery(query)).toThrow(
        BadRequestException,
      );
      expect(() => service.parsePaginationQuery(query)).toThrow(
        "Limit cannot exceed 100",
      );
    });

    it("should throw error when limit is less than 1", () => {
      const query: PaginationQueryDto = { limit: 0 };

      expect(() => service.parsePaginationQuery(query)).toThrow(
        BadRequestException,
      );
      expect(() => service.parsePaginationQuery(query)).toThrow(
        "Limit must be at least 1",
      );
    });
  });

  describe("validateFields", () => {
    const allowedFields = ["id", "name", "email"];

    it("should return fields when all are valid", () => {
      const result = service.validateFields(["id", "name"], allowedFields);
      expect(result).toEqual(["id", "name"]);
    });

    it("should throw error when invalid fields requested", () => {
      expect(() =>
        service.validateFields(["id", "password"], allowedFields),
      ).toThrow(BadRequestException);
      expect(() =>
        service.validateFields(["id", "password"], allowedFields),
      ).toThrow("Invalid fields requested: password");
    });

    it("should return undefined when no fields provided", () => {
      const result = service.validateFields(undefined, allowedFields);
      expect(result).toBeUndefined();
    });

    it("should return undefined when empty array provided", () => {
      const result = service.validateFields([], allowedFields);
      expect(result).toBeUndefined();
    });
  });

  describe("validateSortFields", () => {
    const allowedSortFields = ["name", "createdAt", "level"];

    it("should return sort options when all fields are valid", () => {
      const sortOptions = [
        { field: "name", order: "asc" as const },
        { field: "level", order: "desc" as const },
      ];
      const result = service.validateSortFields(sortOptions, allowedSortFields);
      expect(result).toEqual(sortOptions);
    });

    it("should throw error when invalid sort fields requested", () => {
      const sortOptions = [{ field: "password", order: "asc" as const }];

      expect(() =>
        service.validateSortFields(sortOptions, allowedSortFields),
      ).toThrow(BadRequestException);
      expect(() =>
        service.validateSortFields(sortOptions, allowedSortFields),
      ).toThrow("Invalid sort fields: password");
    });

    it("should return undefined when no sort options provided", () => {
      const result = service.validateSortFields(undefined, allowedSortFields);
      expect(result).toBeUndefined();
    });
  });

  describe("buildPrismaOptions", () => {
    it("should build basic Prisma options", () => {
      const options = {
        limit: 10,
        offset: 20,
      };

      const result = service.buildPrismaOptions(options);

      expect(result).toEqual({
        take: 10,
        skip: 20,
      });
    });

    it("should build Prisma options with field selection", () => {
      const options = {
        limit: 10,
        offset: 0,
        fields: ["id", "name"],
      };

      const result = service.buildPrismaOptions(options, {
        allowedFields: ["id", "name", "email"],
      });

      expect(result.select).toEqual({
        id: true,
        name: true,
      });
    });

    it("should build Prisma options with sorting", () => {
      const options = {
        limit: 10,
        offset: 0,
        sort: [
          { field: "name", order: "asc" as const },
          { field: "createdAt", order: "desc" as const },
        ],
      };

      const result = service.buildPrismaOptions(options, {
        allowedSortFields: ["name", "createdAt"],
      });

      expect(result.orderBy).toEqual([{ name: "asc" }, { createdAt: "desc" }]);
    });

    it("should use default sort when no sort provided", () => {
      const options = {
        limit: 10,
        offset: 0,
      };

      const result = service.buildPrismaOptions(options, {
        defaultSort: [{ field: "createdAt", order: "desc" }],
      });

      expect(result.orderBy).toEqual([{ createdAt: "desc" }]);
    });

    it("should validate fields against allowlist", () => {
      const options = {
        limit: 10,
        offset: 0,
        fields: ["id", "password"],
      };

      expect(() =>
        service.buildPrismaOptions(options, {
          allowedFields: ["id", "name"],
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe("buildSearchFilter", () => {
    const searchableFields = ["name", "email", "description"];

    it("should build OR filter for searchable fields", () => {
      const result = service.buildSearchFilter("test", searchableFields);

      expect(result).toEqual({
        OR: [
          { name: { contains: "test", mode: "insensitive" } },
          { email: { contains: "test", mode: "insensitive" } },
          { description: { contains: "test", mode: "insensitive" } },
        ],
      });
    });

    it("should return undefined when no search term provided", () => {
      const result = service.buildSearchFilter(undefined, searchableFields);
      expect(result).toBeUndefined();
    });

    it("should return undefined when no searchable fields", () => {
      const result = service.buildSearchFilter("test", []);
      expect(result).toBeUndefined();
    });
  });

  describe("mergeWhereConditions", () => {
    it("should merge search filter with additional conditions", () => {
      const searchFilter = {
        OR: [{ name: { contains: "test" } }],
      };
      const additionalWhere = { isActive: true };

      const result = service.mergeWhereConditions(
        searchFilter,
        additionalWhere,
      );

      expect(result).toEqual({
        AND: [searchFilter, additionalWhere],
      });
    });

    it("should return search filter when no additional conditions", () => {
      const searchFilter = {
        OR: [{ name: { contains: "test" } }],
      };

      const result = service.mergeWhereConditions(searchFilter);
      expect(result).toEqual(searchFilter);
    });

    it("should return additional conditions when no search filter", () => {
      const additionalWhere = { isActive: true };

      const result = service.mergeWhereConditions(undefined, additionalWhere);
      expect(result).toEqual(additionalWhere);
    });

    it("should return undefined when both are undefined", () => {
      const result = service.mergeWhereConditions(undefined, undefined);
      expect(result).toBeUndefined();
    });
  });
});
