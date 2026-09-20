export const APP_ERROR = {
  authEmail: "CF_authEmail",
  authPassword: "CF_authPassword",
  authExists: "CF_authExists",
  authInvalid: "CF_authInvalid",
  styleLocked: "CF_styleLocked",
  batchLocked: "CF_batchLocked",
  concurrent: "CF_concurrent",
  credits: "CF_credits",
  downloadLimit: "CF_downloadLimit",
  imageType: "CF_imageType",
  imageSize: "CF_imageSize",
  imageProcess: "CF_imageProcess",
  imageLoad: "CF_imageLoad",
  canvas: "CF_canvas",
  payment: "CF_payment",
} as const;

export type AppErrorKey = keyof typeof APP_ERROR;

export function appError(key: AppErrorKey, count?: number): Error {
  const code = APP_ERROR[key];
  return new Error(count == null ? code : `${code}:${count}`);
}

export function parseAppError(error: unknown): { key: string; count?: number } | null {
  if (!(error instanceof Error)) return null;
  if (!error.message.startsWith("CF_")) return null;
  const [code, arg] = error.message.split(":");
  const key = code.slice(3);
  return { key, count: arg ? Number(arg) : undefined };
}

export function formatAppError(
  error: unknown,
  t: (key: string, values?: Record<string, string | number>) => string,
  fallbackKey = "generic"
): string {
  const parsed = parseAppError(error);
  if (parsed) {
    return t(parsed.key, parsed.count == null ? undefined : { count: parsed.count });
  }
  if (error instanceof Error && error.message) return error.message;
  return t(fallbackKey);
}

export function msg(
  t: (key: string, values?: Record<string, string | number>) => string,
  key: string,
  values?: Record<string, string | number>
): string {
  return t(key, values);
}
