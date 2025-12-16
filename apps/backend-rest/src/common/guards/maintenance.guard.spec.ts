import { ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { BYPASS_MAINTENANCE_KEY } from "../decorators/bypass-maintenance.decorator";
import { MaintenanceGuard } from "./maintenance.guard";

describe("MaintenanceGuard", () => {
  let guard: MaintenanceGuard;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new MaintenanceGuard(reflector);

    // Mock ExecutionContext
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          url: "/api/users",
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    // Reset environment variable
    delete process.env.MAINTENANCE_ENABLED;
  });

  afterEach(() => {
    delete process.env.MAINTENANCE_ENABLED;
  });

  describe("when maintenance mode is disabled", () => {
    it("should allow all requests when MAINTENANCE_ENABLED is not set", () => {
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it("should allow all requests when MAINTENANCE_ENABLED is false", () => {
      process.env.MAINTENANCE_ENABLED = "false";
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe("when maintenance mode is enabled", () => {
    beforeEach(() => {
      process.env.MAINTENANCE_ENABLED = "true";
    });

    it("should block regular requests with 503", () => {
      jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
            error: "Service Unavailable",
            message:
              "System is currently under maintenance. Please try again later.",
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });

    it("should allow requests with @BypassMaintenance decorator", () => {
      jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(true);

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it("should check for decorator with correct key", () => {
      const spy = jest
        .spyOn(reflector, "getAllAndOverride")
        .mockReturnValue(false);

      try {
        guard.canActivate(mockExecutionContext);
      } catch (error) {
        // Expected to throw
      }

      expect(spy).toHaveBeenCalledWith(BYPASS_MAINTENANCE_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });
  });

  describe("health check endpoints", () => {
    beforeEach(() => {
      process.env.MAINTENANCE_ENABLED = "true";
      jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
    });

    const healthEndpoints = [
      "/health",
      "/api/health",
      "/healthz",
      "/ping",
      "/health/liveness",
      "/api/health/readiness",
    ];

    healthEndpoints.forEach((endpoint) => {
      it(`should allow ${endpoint} endpoint`, () => {
        mockExecutionContext.switchToHttp().getRequest = jest
          .fn()
          .mockReturnValue({
            url: endpoint,
          });

        const result = guard.canActivate(mockExecutionContext);
        expect(result).toBe(true);
      });
    });

    it("should allow health endpoints with query parameters", () => {
      mockExecutionContext.switchToHttp().getRequest = jest
        .fn()
        .mockReturnValue({
          url: "/health?detailed=true",
        });

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it("should block non-health endpoints", () => {
      mockExecutionContext.switchToHttp().getRequest = jest
        .fn()
        .mockReturnValue({
          url: "/api/users",
        });

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        HttpException,
      );
    });

    it('should block endpoints that contain "health" but are not health endpoints', () => {
      mockExecutionContext.switchToHttp().getRequest = jest
        .fn()
        .mockReturnValue({
          url: "/api/healthcare/patients",
        });

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        HttpException,
      );
    });
  });

  describe("error response structure", () => {
    beforeEach(() => {
      process.env.MAINTENANCE_ENABLED = "true";
      jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
    });

    it("should return proper error structure", () => {
      try {
        guard.canActivate(mockExecutionContext);
        fail("Should have thrown an exception");
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(
          HttpStatus.SERVICE_UNAVAILABLE,
        );
        expect((error as HttpException).getResponse()).toEqual({
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          error: "Service Unavailable",
          message:
            "System is currently under maintenance. Please try again later.",
        });
      }
    });
  });

  describe("edge cases", () => {
    beforeEach(() => {
      process.env.MAINTENANCE_ENABLED = "true";
      jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
    });

    it("should handle undefined URL gracefully", () => {
      mockExecutionContext.switchToHttp().getRequest = jest
        .fn()
        .mockReturnValue({
          url: undefined,
        });

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        HttpException,
      );
    });

    it("should handle empty URL gracefully", () => {
      mockExecutionContext.switchToHttp().getRequest = jest
        .fn()
        .mockReturnValue({
          url: "",
        });

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        HttpException,
      );
    });

    it("should be case-sensitive for environment variable", () => {
      delete process.env.MAINTENANCE_ENABLED;
      process.env.MAINTENANCE_ENABLED = "TRUE"; // uppercase

      // Since 'TRUE' !== 'true', maintenance should NOT be enabled
      // Therefore the request should be ALLOWED
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true); // Should be allowed when not 'true'
    });
  });
});
