import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HealthService } from "./health.service";

@ApiTags("health")
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get("ping")
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({
    status: 200,
    description: "API is healthy and responding",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "ok" },
      },
    },
  })
  ping() {
    return this.healthService.ping();
  }
}
