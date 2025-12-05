"use client";

import { useAuth, UserRole } from "@/contexts/AuthContext";
import { defaultLocale, locales } from "@/i18n/config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname
  const getCurrentLocale = () => {
    const pathSegments = pathname?.split("/").filter(Boolean) || [];
    return locales.includes(pathSegments[0] as any)
      ? pathSegments[0]
      : defaultLocale;
  };

  useEffect(() => {
    if (!isLoading) {
      const locale = getCurrentLocale();
      const defaultRedirect = redirectTo || `/${locale}/login`;

      if (!user) {
        router.push(defaultRedirect);
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push(`/${locale}/unauthorized`);
      }
    }
  }, [user, isLoading, allowedRoles, redirectTo, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
