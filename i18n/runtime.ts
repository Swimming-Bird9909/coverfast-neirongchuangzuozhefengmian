import type { AbstractIntlMessages } from "next-intl";
import {
  DEFAULT_LOCALE,
  isAppLocale,
  LOCALE_COOKIE,
  type AppLocale,
} from "@/i18n/config";

let runtimeMessages: AbstractIntlMessages | null = null;
let runtimeLocale: AppLocale = DEFAULT_LOCALE;

export function setRuntimeI18n(locale: AppLocale, messages: AbstractIntlMessages) {
  runtimeLocale = locale;
  runtimeMessages = messages;
}

export function getRuntimeLocale(): AppLocale {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
    const cookieLocale = match ? decodeURIComponent(match[1]) : null;
    if (isAppLocale(cookieLocale)) return cookieLocale;
  }
  return runtimeLocale;
}

export function getRuntimeMessages(): AbstractIntlMessages | null {
  return runtimeMessages;
}

function lookup(messages: AbstractIntlMessages, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);
}

export function interpolate(template: string, values?: Record<string, string | number>): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

export function tRuntime(
  path: string,
  values?: Record<string, string | number>
): string {
  if (!runtimeMessages) return path;
  const raw = lookup(runtimeMessages, path);
  if (typeof raw !== "string") return path;
  return interpolate(raw, values);
}
