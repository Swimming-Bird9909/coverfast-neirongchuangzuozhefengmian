"use client";

import {
  LOCALE_COOKIE,
  LOCALE_MANUAL_COOKIE,
  LOCALE_MANUAL_STORAGE,
  LOCALE_STORAGE,
  type AppLocale,
} from "@/i18n/config";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function persistLocale(locale: AppLocale) {
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax${secure}`;
  document.cookie = `${LOCALE_MANUAL_COOKIE}=1; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax${secure}`;
  window.localStorage.setItem(LOCALE_STORAGE, locale);
  window.localStorage.setItem(LOCALE_MANUAL_STORAGE, "1");
  await fetch("/api/locale", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ locale }),
  });
  window.location.reload();
}
