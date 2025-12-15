import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  /**
   * Returns a simple health status
   * @returns Object with status "ok"
   */
  ping() {
    return { status: "ok" };
  }
}
