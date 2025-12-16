import { SetMetadata } from "@nestjs/common";

/**
 * Decorator to bypass maintenance mode for specific routes
 * Use this for health checks, webhooks, or critical endpoints
 *
 * @example
 * ```typescript
 * @Get('health')
 * @BypassMaintenance()
 * getHealth() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export const BYPASS_MAINTENANCE_KEY = "bypassMaintenance";
export const BypassMaintenance = () =>
  SetMetadata(BYPASS_MAINTENANCE_KEY, true);
