"use client";

import { PLANS } from "@/lib/billing/plans";
import { setBrandColor, useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const BRAND_PRESETS = [
  "#22d3ee",
  "#fbbf24",
  "#f472b6",
  "#93c5fd",
  "#fb923c",
  "#f8fafc",
];

export function BrandColorPicker({
  compact = false,
  onPick,
}: {
  compact?: boolean;
  onPick?: (color: string) => void;
}) {
  const { user } = useAppStore();
  const unlocked = PLANS[user.plan].brandColors;
  const t = useTranslations("brandColors");

  function pick(color: string) {
    if (!unlocked) return;
    setBrandColor(color);
    onPick?.(color);
  }

  return (
    <div className={cn(!unlocked && "opacity-80")}>
      <div className="flex flex-wrap items-center gap-2">
        {BRAND_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={t("aria", { color })}
            disabled={!unlocked}
            onClick={() => pick(color)}
            className={cn(
              "size-8 rounded-full ring-2 ring-offset-2 ring-offset-[#101218] transition",
              user.brandColor === color && unlocked
                ? "ring-amber-300"
                : "ring-transparent hover:ring-white/30"
            )}
            style={{ background: color }}
          />
        ))}
        <label
          className={cn(
            "relative size-8 overflow-hidden rounded-full ring-1 ring-white/20",
            !unlocked && "pointer-events-none"
          )}
        >
          <input
            type="color"
            value={user.brandColor}
            disabled={!unlocked}
            onChange={(e) => pick(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <span
            className="block size-full"
            style={{ background: user.brandColor }}
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {unlocked
          ? compact
            ? t("unlockedCompact")
            : t("unlocked")
          : (
              <>
                {t("locked")}
                <Link href="/pricing" className="ms-1 underline">
                  {t("goUpgrade")}
                </Link>
              </>
            )}
      </p>
    </div>
  );
}
