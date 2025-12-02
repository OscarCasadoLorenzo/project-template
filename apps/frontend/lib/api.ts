export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type RequestConfig = {
  method?: string;
  headers?: HeadersInit;
  body?: unknown;
  requiresAuth?: boolean;
} & Omit<RequestInit, "body">;

export async function fetchApi<TData>(
  endpoint: string,
  { body, requiresAuth = true, ...config }: RequestConfig = {},
): Promise<TData> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(config.headers as Record<string, string>),
  };

  // Add auth token if required
  if (requiresAuth && typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...config,
    method: config.method ?? "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  // Handle empty responses (like DELETE operations)
  const contentType = response.headers.get("content-type");
  const contentLength = response.headers.get("content-length");

  // If no content or content-length is 0, return undefined
  if (contentLength === "0" || response.status === 204) {
    return undefined as TData;
  }

  // If content-type is JSON, parse it
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  // For other content types or empty responses, try to parse as JSON
  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as TData);
}

// Variant for raw response (e.g., file downloads)
export async function fetchApiRaw(
  endpoint: string,
  { body, requiresAuth = true, ...config }: RequestConfig = {},
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    ...(config.headers as Record<string, string>),
  };

  // Only set Content-Type if body is not FormData (browser sets it automatically for FormData)
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Add auth token if required
  if (requiresAuth && typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...config,
    method: config.method ?? "GET",
    headers,
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }
    // Handle 403 Forbidden
    if (response.status === 403 && typeof window !== "undefined") {
      window.location.href = "/unauthorized";
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  return response;
}
