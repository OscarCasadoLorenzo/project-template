"use client";

import { localeNames, locales, type Locale } from "@/i18n/config";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: Locale) => {
    if (!pathname) return;

    // Extract the path without the locale prefix
    // pathname is like "/en/admin" or "/es/login"
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

    // Build new path with the selected locale
    const newPath = `/${newLocale}${pathWithoutLocale || ""}`;

    startTransition(() => {
      router.push(newPath);
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          disabled={isPending}
          className={`px-3 py-1 rounded ${
            currentLocale === locale
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={`Switch to ${localeNames[locale]}`}
        >
          {localeNames[locale]}
        </button>
      ))}
    </div>
  );
}
