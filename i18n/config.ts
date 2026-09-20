export const LOCALES = [
  "en",
  "zh-CN",
  "zh-TW",
  "ja",
  "ko",
  "de",
  "fr",
  "it",
  "es",
  "pt",
  "id",
  "ar",
  "bn",
  "ms",
  "th",
  "he",
  "ru",
  "ur",
  "tr",
  "vi",
  "fa",
  "mr",
  "ta",
  "pl",
  "te",
  "ne",
  "da",
  "fi",
  "nl",
  "no",
  "sv",
] as const;

export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "zh-CN";

export const RTL_LOCALES = new Set<AppLocale>(["ar", "he", "ur", "fa"]);

/** Menu labels match the globe dropdown screenshot copy. */
export const LOCALE_MENU: { id: AppLocale; label: string }[] = [
  { id: "en", label: "英语" },
  { id: "zh-CN", label: "简体中文" },
  { id: "zh-TW", label: "繁体中文" },
  { id: "ja", label: "日本語" },
  { id: "ko", label: "한국어" },
  { id: "de", label: "德语" },
  { id: "fr", label: "法语" },
  { id: "it", label: "意大利语" },
  { id: "es", label: "西班牙语" },
  { id: "pt", label: "葡萄牙语" },
  { id: "id", label: "印尼语" },
  { id: "ar", label: "阿拉伯语" },
  { id: "bn", label: "বাংলা" },
  { id: "ms", label: "马来语" },
  { id: "th", label: "ภาษาไทย" },
  { id: "he", label: "עברית" },
  { id: "ru", label: "俄语" },
  { id: "ur", label: "乌尔都语" },
  { id: "tr", label: "土耳其语" },
  { id: "vi", label: "越南语" },
  { id: "fa", label: "فارسی" },
  { id: "mr", label: "मराठी" },
  { id: "ta", label: "தமிழ்" },
  { id: "pl", label: "波兰语" },
  { id: "te", label: "తెలుగు" },
  { id: "ne", label: "नेपाली" },
  { id: "da", label: "丹麦语" },
  { id: "fi", label: "芬兰" },
  { id: "nl", label: "荷兰语" },
  { id: "no", label: "挪威语" },
  { id: "sv", label: "瑞典语" },
];

export const LOCALE_COOKIE = "COVERFAST_LOCALE";
export const LOCALE_MANUAL_COOKIE = "COVERFAST_LOCALE_MANUAL";
export const LOCALE_STORAGE = "coverfast-locale";
export const LOCALE_MANUAL_STORAGE = "coverfast-locale-manual";

const COUNTRY_LOCALE: Record<string, AppLocale> = {
  CN: "zh-CN",
  TW: "zh-TW",
  HK: "zh-TW",
  MO: "zh-TW",
  JP: "ja",
  KR: "ko",
  DE: "de",
  FR: "fr",
  IT: "it",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  EC: "es",
  GT: "es",
  CU: "es",
  BO: "es",
  DO: "es",
  HN: "es",
  PY: "es",
  SV: "es",
  NI: "es",
  CR: "es",
  PA: "es",
  UY: "es",
  PR: "es",
  PT: "pt",
  BR: "pt",
  ID: "id",
  SA: "ar",
  AE: "ar",
  EG: "ar",
  IQ: "ar",
  MA: "ar",
  DZ: "ar",
  TN: "ar",
  JO: "ar",
  LB: "ar",
  KW: "ar",
  QA: "ar",
  OM: "ar",
  BH: "ar",
  YE: "ar",
  LY: "ar",
  SD: "ar",
  SY: "ar",
  PS: "ar",
  BD: "bn",
  MY: "ms",
  BN: "ms",
  TH: "th",
  IL: "he",
  RU: "ru",
  PK: "ur",
  TR: "tr",
  VN: "vi",
  IR: "fa",
  IN: "en",
  NP: "ne",
  PL: "pl",
  DK: "da",
  FI: "fi",
  NL: "nl",
  BE: "nl",
  NO: "no",
  SE: "sv",
  US: "en",
  GB: "en",
  AU: "en",
  CA: "en",
  NZ: "en",
};

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function localeFromCountry(countryCode: string | undefined | null): AppLocale {
  if (!countryCode) return DEFAULT_LOCALE;
  return COUNTRY_LOCALE[countryCode.toUpperCase()] ?? DEFAULT_LOCALE;
}

export function isRtl(locale: string): boolean {
  return RTL_LOCALES.has(locale as AppLocale);
}
