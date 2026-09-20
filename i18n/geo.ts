import { DEFAULT_LOCALE, localeFromCountry, type AppLocale } from "@/i18n/config";

function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = headers.get("x-real-ip")?.trim();
  const cf = headers.get("cf-connecting-ip")?.trim();
  const ip = cf || forwarded || real;
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("::ffff:127.")) {
    return null;
  }
  return ip;
}

async function fetchCountry(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1200);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      countryCode?: string;
      country_code?: string;
      country?: string;
    };
    return data.countryCode || data.country_code || (typeof data.country === "string" && data.country.length === 2 ? data.country : null);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function firstCountry(urls: string[]): Promise<string | null> {
  const probes = urls.map((url) =>
    fetchCountry(url).then((country) => {
      if (!country) throw new Error("empty");
      return country;
    })
  );
  try {
    return await Promise.any(probes);
  } catch {
    return null;
  }
}

export async function detectLocaleFromIp(headers: Headers): Promise<AppLocale> {
  const ip = clientIp(headers);
  const ipPath = ip ? `/${encodeURIComponent(ip)}` : "";
  const country = await firstCountry([
    `http://ip-api.com/json${ip ? `/${encodeURIComponent(ip)}` : ""}?fields=status,countryCode`,
    `https://ipapi.co${ipPath}/json/`,
  ]);
  return localeFromCountry(country) ?? DEFAULT_LOCALE;
}

export async function detectLocaleFromBrowser(): Promise<AppLocale> {
  const country =
    (await fetchCountry("https://ipapi.co/json/")) ||
    (await fetchCountry("http://ip-api.com/json/?fields=status,countryCode"));
  return localeFromCountry(country);
}
