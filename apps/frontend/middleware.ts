import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "./i18n/config";

// Create the i18n middleware
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use locale prefix in the URL (even for default locale)
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip maintenance check for:
  // - Static assets (/_next/*, /favicon.ico, etc.)
  // - API routes
  // - Health check endpoints
  // - Maintenance page itself (with or without locale)
  const skipPaths = [
    "/_next",
    "/favicon.ico",
    "/api",
    "/health",
    "/maintenance",
  ];

  const shouldSkipMaintenanceCheck =
    skipPaths.some((path) => pathname.startsWith(path)) ||
    pathname.includes("/maintenance");

  // Check if maintenance mode is enabled
  if (!shouldSkipMaintenanceCheck) {
    const isMaintenanceEnabled = process.env.MAINTENANCE_ENABLED === "true";

    if (isMaintenanceEnabled) {
      // Extract locale from pathname (e.g., /en/dashboard -> en)
      const locale = pathname.split("/")[1];
      const validLocale = locales.includes(locale as any)
        ? locale
        : defaultLocale;

      // Redirect to maintenance page
      const maintenanceUrl = new URL(
        `/${validLocale}/maintenance`,
        request.url,
      );
      return NextResponse.redirect(maintenanceUrl);
    }
  }

  // Continue with i18n middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
