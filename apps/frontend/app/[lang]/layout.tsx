import LanguageSwitcher from "@/components/LanguageSwitcher";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { Sidebar } from "@/components/sidebar";
import { Locale, locales } from "@/i18n/config";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import React from "react";
import "../globals.css";
import { Providers } from "../providers";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
  title: "Project Template",
  description: "A character and campaign management tool",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;

  // Get messages for the current locale - explicitly pass the locale
  const messages = await getMessages({ locale: lang });

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <Providers>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <div className="border-b bg-white px-4 py-2 flex justify-end">
                  <LanguageSwitcher currentLocale={lang} />
                </div>
                <main className="flex-1 overflow-y-auto bg-gray-50">
                  {children}
                </main>
              </div>
              <PaginationWrapper />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
