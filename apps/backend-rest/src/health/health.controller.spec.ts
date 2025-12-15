import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

describe("HealthController", () => {
  let controller: HealthController;
  let service: HealthService;

  const mockHealthService = {
    ping: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("ping", () => {
    it("should return status ok", () => {
      const expectedResponse = { status: "ok" };
      mockHealthService.ping.mockReturnValue(expectedResponse);

      const result = controller.ping();

      expect(result).toEqual(expectedResponse);
      expect(service.ping).toHaveBeenCalledTimes(1);
    });

    it("should call health service ping method", () => {
      mockHealthService.ping.mockReturnValue({ status: "ok" });

      controller.ping();

      expect(service.ping).toHaveBeenCalled();
    });
  });
});
