"use client";

import { useTranslations } from "next-intl";

export default function MaintenancePage() {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
          <svg
            className="h-12 w-12 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {t("maintenance.title")}
          </h1>
          <p className="text-lg text-gray-600">{t("maintenance.message")}</p>
          <p className="text-sm text-gray-500">
            {t("maintenance.description")}
          </p>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <p className="text-xs text-gray-500">{t("maintenance.support")}</p>
        </div>
      </div>
    </div>
  );
}
