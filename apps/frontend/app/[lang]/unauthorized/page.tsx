"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold text-gray-900">403</h1>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {t("errors.accessDenied")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {user
              ? t("errors.unauthorizedWithRole", { role: user.role })
              : t("errors.unauthorized")}
          </p>
        </div>

        <div className="mt-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {t("common.goToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
