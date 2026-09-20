"use client";

import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import {
  isAppLocale,
  LOCALE_MANUAL_STORAGE,
  LOCALE_STORAGE,
  type AppLocale,
} from "@/i18n/config";
import { persistLocale } from "@/i18n/persist";
import { setRuntimeI18n } from "@/i18n/runtime";
import { useEffect } from "react";

function LocaleHydrator({
  locale,
  messages,
}: {
  locale: AppLocale;
  messages: AbstractIntlMessages;
}) {
  const active = useLocale();
  setRuntimeI18n((isAppLocale(active) ? active : locale) as AppLocale, messages);

  useEffect(() => {
    setRuntimeI18n(locale, messages);
    const stored = window.localStorage.getItem(LOCALE_STORAGE);
    const manual = window.localStorage.getItem(LOCALE_MANUAL_STORAGE) === "1";
    if (manual && isAppLocale(stored) && stored !== locale) {
      void persistLocale(stored);
      return;
    }
    window.localStorage.setItem(LOCALE_STORAGE, locale);
  }, [locale, messages]);

  return null;
}

export function AppProviders({
  locale,
  messages,
  children,
}: {
  locale: AppLocale;
  messages: AbstractIntlMessages;
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleHydrator locale={locale} messages={messages} />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        enableSystem={false}
      >
        <TooltipProvider>
          {children}
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
