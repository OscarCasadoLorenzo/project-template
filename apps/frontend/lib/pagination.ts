import { PaginatedResponse } from "@/types";

/**
 * Type guard to check if a response is paginated
 */
export function isPaginatedResponse<T>(
  response: T[] | PaginatedResponse<T>,
): response is PaginatedResponse<T> {
  return (
    response !== null &&
    typeof response === "object" &&
    "data" in response &&
    "meta" in response
  );
}

/**
 * Extract data array from a response that might be paginated
 */
export function extractData<T>(response: T[] | PaginatedResponse<T>): T[] {
  if (isPaginatedResponse(response)) {
    return response.data;
  }
  return response;
}

/**
 * Get pagination metadata from a response, or null if not paginated
 */
export function getPaginationMeta<T>(
  response: T[] | PaginatedResponse<T>,
): PaginatedResponse<T>["meta"] | null {
  if (isPaginatedResponse(response)) {
    return response.meta;
  }
  return null;
}
