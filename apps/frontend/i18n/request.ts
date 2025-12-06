import { getRequestConfig } from "next-intl/server";
import type { Locale } from "./config";
import { defaultLocale, locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./dictionaries/${validLocale}.json`)).default,
  };
});
