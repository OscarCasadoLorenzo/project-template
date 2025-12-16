import { Controller, Get } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import {
  BYPASS_MAINTENANCE_KEY,
  BypassMaintenance,
} from "./bypass-maintenance.decorator";

// Test controller to verify decorator behavior
@Controller("test")
class TestController {
  @Get("with-bypass")
  @BypassMaintenance()
  withBypass() {
    return { success: true };
  }

  @Get("without-bypass")
  withoutBypass() {
    return { success: true };
  }
}

describe("BypassMaintenance Decorator", () => {
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    reflector = module.get<Reflector>(Reflector);
  });

  it("should be defined", () => {
    expect(BypassMaintenance).toBeDefined();
  });

  it("should apply metadata to decorated methods", () => {
    const controller = TestController.prototype;
    const metadata = Reflect.getMetadata(
      BYPASS_MAINTENANCE_KEY,
      controller.withBypass,
    );
    expect(metadata).toBe(true);
  });

  it("should not apply metadata to non-decorated methods", () => {
    const controller = TestController.prototype;
    const metadata = Reflect.getMetadata(
      BYPASS_MAINTENANCE_KEY,
      controller.withoutBypass,
    );
    expect(metadata).toBeUndefined();
  });

  it("should work with Reflector.getAllAndOverride", () => {
    const controller = TestController.prototype;
    const metadata = reflector.getAllAndOverride(BYPASS_MAINTENANCE_KEY, [
      controller.withBypass,
      TestController,
    ]);
    expect(metadata).toBe(true);
  });
});
