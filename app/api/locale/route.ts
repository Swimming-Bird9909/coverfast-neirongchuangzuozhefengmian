import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  isAppLocale,
  LOCALE_COOKIE,
  LOCALE_MANUAL_COOKIE,
} from "@/i18n/config";

const COOKIE_OPTS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { locale?: string } | null;
  const locale = body?.locale;
  if (!isAppLocale(locale)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const jar = await cookies();
  jar.set(LOCALE_COOKIE, locale, COOKIE_OPTS);
  jar.set(LOCALE_MANUAL_COOKIE, "1", COOKIE_OPTS);
  return NextResponse.json({ ok: true, locale });
}
