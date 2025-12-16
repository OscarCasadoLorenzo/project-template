import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { BYPASS_MAINTENANCE_KEY } from "../decorators/bypass-maintenance.decorator";

/**
 * Global guard to enforce maintenance mode
 *
 * When MAINTENANCE_ENABLED=true, all requests are blocked with 503 except:
 * - Routes decorated with @BypassMaintenance()
 * - Health check endpoints (/health, /api/health)
 *
 * @example
 * Enable maintenance mode:
 * ```bash
 * MAINTENANCE_ENABLED=true
 * ```
 */
@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if maintenance mode is enabled
    const isMaintenanceEnabled = process.env.MAINTENANCE_ENABLED === "true";

    // If maintenance is not enabled, allow all requests
    if (!isMaintenanceEnabled) {
      return true;
    }

    // Check if route has @BypassMaintenance() decorator
    const bypassMaintenance = this.reflector.getAllAndOverride<boolean>(
      BYPASS_MAINTENANCE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (bypassMaintenance) {
      return true;
    }

    // Allow health check endpoints
    const request = context.switchToHttp().getRequest();
    const path = request.url?.split("?")[0]; // Remove query params

    if (this.isHealthCheckEndpoint(path)) {
      return true;
    }

    // Block the request with 503 Service Unavailable
    throw new HttpException(
      {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        error: "Service Unavailable",
        message:
          "System is currently under maintenance. Please try again later.",
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  /**
   * Check if the path is a health check endpoint
   */
  private isHealthCheckEndpoint(path: string): boolean {
    if (!path) {
      return false;
    }
    const healthPaths = ["/health", "/api/health", "/healthz", "/ping"];
    return healthPaths.some(
      (healthPath) => path === healthPath || path.startsWith(healthPath + "/"),
    );
  }
}
