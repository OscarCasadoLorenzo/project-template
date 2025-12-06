// Use type safe message keys with `next-intl`
type Messages = typeof import("./i18n/dictionaries/en.json");

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
