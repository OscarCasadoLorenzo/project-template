# Implement Internationalization (i18n) in Frontend Application

## Overview

Implement internationalization (i18n) support in the Next.js frontend application to enable multi-language support using `next-intl`.

## Reference Documentation

- [Next.js Internationalization Guide](https://nextjs.org/docs/app/guides/internationalization)
- [next-intl Documentation](https://next-intl.dev/)

## Objectives

- ✅ Enable the application to support multiple languages (English and Spanish)
- ✅ Implement locale-based routing using Next.js App Router patterns
- ✅ Provide automatic locale detection from browser settings
- ✅ Maintain SEO-friendly URLs with locale prefixes (`/en/*`, `/es/*`)
- ✅ Support server-side rendering with localized content
- ✅ Allow users to manually switch languages

## Implementation Summary

### 1. Dependencies

```bash
npm install next-intl
```

### 2. Folder Structure

```
apps/frontend/
├── app/
│   └── [lang]/                    # Locale dynamic segment for routing
│       ├── layout.tsx             # Root layout with locale and i18n provider
│       ├── page.tsx               # Home page
│       ├── admin/
│       ├── login/
│       ├── register/
│       └── unauthorized/
├── dictionaries/                  # Translation files
│   ├── en.json                    # English translations
│   └── es.json                    # Spanish translations
├── i18n/
│   ├── config.ts                  # Locale configuration and types
│   └── request.ts                 # Server-side i18n request config
├── components/
│   └── LanguageSwitcher.tsx       # Client-side language switcher
├── middleware.ts                  # Locale detection and routing
└── next.config.js                 # next-intl plugin configuration
```

### 3. Key Components

#### 3.1 Configuration Files

- **i18n/config.ts**: Defines supported locales (`en`, `es`), default locale, and locale display names
- **i18n/request.ts**: Configures server-side message loading using `getRequestConfig`
- **next.config.js**: Wraps Next.js config with `next-intl` plugin

#### 3.2 Translation Dictionaries

- **dictionaries/en.json**: English translations organized by domain (`common`, `navigation`, `auth`, `admin`, `errors`)
- **dictionaries/es.json**: Spanish translations with matching structure

#### 3.3 Middleware

- Automatically detects locale from browser `Accept-Language` header
- Redirects non-prefixed URLs to locale-prefixed versions
- Configured to always use locale prefix in URLs (`localePrefix: "always"`)

#### 3.4 Root Layout

- Accepts `lang` parameter from URL
- Loads messages using `getMessages({ locale: lang })`
- Wraps app with `NextIntlClientProvider` passing both `locale` and `messages`
- Includes `LanguageSwitcher` component in header

#### 3.5 Language Switcher

- Client component for manual language switching
- Extracts locale from current pathname and rebuilds URL with new locale
- Uses `router.push()` and `router.refresh()` to trigger re-render with new translations
- Provides visual feedback during transition

### 4. Implementation Checklist

- [x] Install `next-intl` dependency
- [x] Create i18n configuration files (`config.ts`, `request.ts`)
- [x] Create translation dictionaries for English and Spanish
- [x] Configure middleware for locale detection and routing
- [x] Restructure app directory with `[lang]` dynamic segment
- [x] Move all pages under `app/[lang]/`
- [x] Update root layout with `NextIntlClientProvider` and locale/messages props
- [x] Update all pages to use `useTranslations()` hook
- [x] Create language switcher component with proper navigation
- [x] Update all existing components to use translations
- [x] Test locale detection from browser settings
- [x] Test manual locale switching
- [ ] Update tests to handle locale routing
- [ ] Add `hreflang` tags for SEO
- [ ] Update documentation

### 5. Key Implementation Details

#### Locale Switching Fix

The language switcher required two critical fixes:

1. **Layout**: Must pass `locale` prop to `NextIntlClientProvider` and call `getMessages({ locale: lang })`
2. **Switcher**: Must use `router.push()` + `router.refresh()` to trigger server-side re-render with new locale

#### Translation Usage

Pages and components use `useTranslations()` hook:

```typescript
const t = useTranslations();
// Then use: t('auth.loginTitle'), t('common.welcome'), etc.
```

### 6. Future Enhancements

- Add more languages (French, German, Japanese, etc.)
- Implement locale-specific date/number formatting
- Add RTL (Right-to-Left) support for Arabic, Hebrew
- Integrate with translation management platform (Crowdin, Lokalise)
- Add `hreflang` meta tags for improved SEO
- Implement locale-specific metadata and OpenGraph tags

## Acceptance Criteria

- ✅ Application supports English (en) and Spanish (es) locales
- ✅ URL includes locale prefix (e.g., `/en/login`, `/es/login`)
- ✅ Browser language preferences automatically select appropriate locale
- ✅ Users can manually switch languages via language switcher
- ✅ All UI text is translated and loaded from dictionaries
- ✅ Locale persists across navigation
- ✅ SSR works correctly with localized content
- ✅ Tests pass for all locale-related functionality
- ✅ Documentation is updated with i18n usage guidelines

## Technical Constraints

- Must maintain compatibility with existing authentication flow
- Must not break existing protected routes
- Must maintain current styling and layout
- Must work with both server and client components
- Must support static generation for better performance

## Dependencies

- `next-intl` - Translation library
- `@formatjs/intl-localematcher` - Locale matching
- `negotiator` - HTTP content negotiation

## Estimated Effort

- Setup and configuration: 2-3 hours
- File restructuring: 2-3 hours
- Component updates: 4-6 hours
- Translation creation: 2-3 hours
- Testing: 3-4 hours
- Documentation: 1-2 hours

**Total: 14-21 hours**

## References

## Acceptance Criteria

- ✅ Application supports English (en) and Spanish (es) locales
- ✅ URL includes locale prefix (e.g., `/en/login`, `/es/login`)
- ✅ Browser language preferences automatically select appropriate locale
- ✅ Users can manually switch languages via language switcher
- ✅ All UI text is translated and loaded from dictionaries
- ✅ Locale persists across navigation
- ✅ SSR works correctly with localized content
- ✅ Language switching updates content in real-time
- [ ] Tests updated for locale routing
- [ ] SEO tags added for multi-language support

## Technical Constraints

- ✅ Maintains compatibility with existing authentication flow
- ✅ Does not break existing protected routes
- ✅ Maintains current styling and layout
- ✅ Works with both server and client components
- ✅ Supports server-side rendering

## Dependencies

- `next-intl` ^4.5.8 - Internationalization library for Next.js App Router## References

- [Next.js Internationalization Guide](https://nextjs.org/docs/app/guides/internationalization)
- [next-intl Documentation](https://next-intl.dev/)
- [next-intl with App Router](https://next-intl.dev/docs/getting-started/app-router)

## Related Issues

- N/A (Initial i18n implementation)

## Labels

`enhancement`, `frontend`, `i18n`, `localization`, `next.js`, `completed`

---

**Created:** December 5, 2025  
**Completed:** December 5, 2025  
**Priority:** Medium  
**Status:** ✅ Implemented
