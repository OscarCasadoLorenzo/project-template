import { Test, TestingModule } from "@nestjs/testing";
import { HealthService } from "./health.service";

describe("HealthService", () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("ping", () => {
    it("should return status ok", () => {
      const result = service.ping();

      expect(result).toEqual({ status: "ok" });
    });

    it("should return consistent response", () => {
      const result1 = service.ping();
      const result2 = service.ping();

      expect(result1).toEqual(result2);
      expect(result1).toEqual({ status: "ok" });
    });
  });
});
