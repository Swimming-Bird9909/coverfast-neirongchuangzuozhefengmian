import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  isAppLocale,
  LOCALE_COOKIE,
} from "@/i18n/config";
import { detectLocaleFromIp } from "@/i18n/geo";

const COOKIE_OPTS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
};

function withLocale(request: NextRequest, locale: string) {
  const headers = new Headers(request.headers);
  headers.set("x-coverfast-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export async function middleware(request: NextRequest) {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isAppLocale(existing)) {
    return withLocale(request, existing);
  }

  const locale = await detectLocaleFromIp(request.headers);
  const resolved = isAppLocale(locale) ? locale : DEFAULT_LOCALE;
  const response = withLocale(request, resolved);
  response.cookies.set(LOCALE_COOKIE, resolved, COOKIE_OPTS);
  return response;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
