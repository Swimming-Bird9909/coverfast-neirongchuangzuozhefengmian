"use client";

import { PLATFORMS } from "@/lib/templates/platforms";
import { COVER_STYLES } from "@/lib/templates/styles";
import type { CoverAsset } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CoverCanvasProps {
  asset: Pick<
    CoverAsset,
    | "title"
    | "subtitle"
    | "badge"
    | "platformId"
    | "styleId"
    | "mode"
    | "imageDataUrl"
    | "quality"
    | "titleScale"
  >;
  watermark?: boolean;
  brandColor?: string;
  className?: string;
  editable?: boolean;
  onChange?: (patch: Partial<CoverAsset>) => void;
}

export function CoverCanvas({
  asset,
  watermark = false,
  brandColor,
  className,
  editable = false,
  onChange,
}: CoverCanvasProps) {
  const platform = PLATFORMS[asset.platformId];
  const style = COVER_STYLES[asset.styleId];
  const accent = brandColor || style.accent;
  const landscape = platform.width / platform.height > 1.4;
  const isPoster = asset.styleId === "poster";
  const scale = asset.titleScale ?? 1;

  const patternClass =
    style.pattern === "grid"
      ? "bg-[linear-gradient(to_right,rgb(255_255_255/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.08)_1px,transparent_1px)] bg-size-[18%_18%]"
      : style.pattern === "dots"
        ? "bg-[radial-gradient(circle,rgb(255_255_255/0.22)_1px,transparent_1px)] bg-size-[12%_12%]"
        : style.pattern === "slash"
          ? "bg-[repeating-linear-gradient(-28deg,transparent,transparent_18px,rgb(255_255_255/0.08)_18px,rgb(255_255_255/0.08)_22px)]"
          : "";

  const titleSize = landscape
    ? isPoster
      ? `${1.15 * scale}rem`
      : `${1.05 * scale}rem`
    : isPoster
      ? `clamp(${1.4 * scale}rem, ${9 * scale}cqw, ${2.6 * scale}rem)`
      : `clamp(${1.15 * scale}rem, ${7.2 * scale}cqw, ${2.1 * scale}rem)`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl shadow-[0_20px_80px_-28px_rgba(0,0,0,0.85)] ring-1 ring-white/10",
        className
      )}
      style={{ aspectRatio: `${platform.width} / ${platform.height}` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${style.gradient[0]}, ${style.gradient[1]})`,
        }}
      />
      {asset.mode === "image" && asset.imageDataUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset.imageDataUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: `rgba(6,8,14,${style.overlay})` }}
          />
        </>
      ) : null}

      {style.pattern === "orbs" ? (
        <>
          <div
            className="absolute -top-[10%] -left-[8%] size-[55%] rounded-full blur-2xl"
            style={{ background: accent, opacity: 0.28 }}
          />
          <div
            className="absolute top-[8%] right-[-6%] size-[38%] rounded-full blur-2xl"
            style={{ background: accent, opacity: 0.2 }}
          />
        </>
      ) : (
        <div className={cn("absolute inset-0", patternClass)} />
      )}

      <div
        className={cn(
          "absolute inset-0 flex flex-col",
          landscape ? "px-[4.5%] py-[10%]" : "px-[8%] py-[7%]"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          {editable ? (
            <input
              value={asset.badge}
              onChange={(e) => onChange?.({ badge: e.target.value })}
              className="max-w-[70%] rounded-full border border-white/0 bg-white/10 px-[0.7em] py-[0.22em] font-bold tracking-wide outline-none ring-amber-300/0 focus:ring-2"
              style={{
                background: brandColor || style.badgeBg,
                color: style.badgeColor,
                fontSize: landscape ? "0.72rem" : "clamp(0.65rem, 3.2cqw, 0.9rem)",
              }}
            />
          ) : (
            <span
              className="inline-flex max-w-[70%] items-center rounded-full px-[0.7em] py-[0.22em] text-[0.62em] font-bold tracking-wide"
              style={{
                background: brandColor || style.badgeBg,
                color: style.badgeColor,
                fontSize: landscape ? "0.72rem" : "clamp(0.65rem, 3.2cqw, 0.9rem)",
              }}
            >
              {asset.badge}
            </span>
          )}
          <span
            className="text-[0.58em] font-semibold"
            style={{
              color: accent,
              fontSize: landscape ? "0.62rem" : "clamp(0.55rem, 2.8cqw, 0.8rem)",
            }}
          >
            {platform.shortName}
          </span>
        </div>

        <div className={cn("mt-auto", landscape ? "mb-0" : "mb-[8%]")}>
          {editable ? (
            <textarea
              value={asset.title}
              rows={3}
              onChange={(e) => onChange?.({ title: e.target.value })}
              className={cn(
                "w-full resize-none bg-transparent leading-[1.18] break-all outline-none ring-1 ring-white/20 focus:ring-amber-300/70",
                isPoster ? "font-black" : "font-extrabold"
              )}
              style={{
                color: style.titleColor,
                fontSize: titleSize,
              }}
            />
          ) : (
            <h3
              className={cn(
                "leading-[1.18] break-all",
                isPoster ? "font-black" : "font-extrabold"
              )}
              style={{
                color: style.titleColor,
                fontSize: titleSize,
              }}
            >
              {asset.title}
            </h3>
          )}
          {editable ? (
            <input
              value={asset.subtitle}
              onChange={(e) => onChange?.({ subtitle: e.target.value })}
              className="mt-[0.45em] w-full bg-transparent font-medium outline-none ring-1 ring-white/15 focus:ring-amber-300/70"
              style={{
                color: style.subtitleColor,
                fontSize: landscape
                  ? "0.7rem"
                  : "clamp(0.65rem, 3.4cqw, 0.95rem)",
              }}
            />
          ) : (
            <p
              className="mt-[0.45em] line-clamp-2 font-medium"
              style={{
                color: style.subtitleColor,
                fontSize: landscape
                  ? "0.7rem"
                  : "clamp(0.65rem, 3.4cqw, 0.95rem)",
              }}
            >
              {asset.subtitle}
            </p>
          )}
          <div
            className="mt-[0.8em] h-[3px] w-[28%] rounded-full"
            style={{ background: accent }}
          />
        </div>
      </div>

      {watermark ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="-rotate-[18deg] text-[clamp(1.1rem,8cqw,2rem)] font-black tracking-widest text-white/20">
            闪封面 CoverFast
          </span>
        </div>
      ) : null}

      {asset.quality === "hd" ? (
        <span
          className="absolute bottom-[5%] left-[8%] text-[0.6rem] font-semibold"
          style={{ color: accent }}
        >
          HD
        </span>
      ) : null}

      {editable ? (
        <label className="absolute right-[6%] bottom-[4%] flex items-center gap-2 rounded-full bg-black/45 px-3 py-1 text-[11px] text-white backdrop-blur-sm">
          字号
          <input
            type="range"
            min={0.75}
            max={1.35}
            step={0.05}
            value={scale}
            onChange={(e) => onChange?.({ titleScale: Number(e.target.value) })}
            className="w-20 accent-amber-300"
          />
          {Math.round(scale * 100)}%
        </label>
      ) : null}
    </div>
  );
}
