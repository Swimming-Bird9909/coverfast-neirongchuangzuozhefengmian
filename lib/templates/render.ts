import { getPlatform } from "@/lib/templates/platforms";
import { COVER_STYLES } from "@/lib/templates/styles";
import type { CoverAsset } from "@/lib/types";

export interface CoverRenderOptions {
  watermark?: boolean;
  brandColor?: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = Number.parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const chars = Array.from(text);
  const lines: string[] = [];
  let current = "";
  for (const ch of chars) {
    const next = current + ch;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = ch;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 5);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("参考图加载失败"));
    img.src = src;
  });
}

function drawCoverFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

function drawPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pattern: (typeof COVER_STYLES)[keyof typeof COVER_STYLES]["pattern"],
  accent: string
) {
  ctx.save();
  if (pattern === "grid") {
    ctx.strokeStyle = withAlpha(accent, 0.18);
    ctx.lineWidth = Math.max(1, w * 0.0015);
    const step = Math.max(28, w * 0.06);
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  } else if (pattern === "dots") {
    ctx.fillStyle = withAlpha(accent, 0.28);
    const step = Math.max(18, w * 0.045);
    for (let x = step; x < w; x += step) {
      for (let y = step; y < h; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1.4, w * 0.003), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (pattern === "orbs") {
    const orbs = [
      [0.18, 0.22, 0.28],
      [0.82, 0.18, 0.2],
      [0.7, 0.78, 0.34],
    ];
    for (const [px, py, pr] of orbs) {
      const g = ctx.createRadialGradient(
        w * px,
        h * py,
        0,
        w * px,
        h * py,
        w * pr
      );
      g.addColorStop(0, withAlpha(accent, 0.45));
      g.addColorStop(1, withAlpha(accent, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  } else if (pattern === "slash") {
    ctx.strokeStyle = withAlpha(accent, 0.22);
    ctx.lineWidth = Math.max(10, w * 0.018);
    for (let i = -h; i < w + h; i += w * 0.12) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h * 0.55, h);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export async function drawCover(
  ctx: CanvasRenderingContext2D,
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
  >,
  options: CoverRenderOptions = {}
) {
  const platform = getPlatform(asset.platformId);
  const style = COVER_STYLES[asset.styleId];
  const w = platform.width;
  const h = platform.height;
  const accent = options.brandColor || style.accent;
  const landscape = w / h > 1.4;
  const isPoster = asset.styleId === "poster";

  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, style.gradient[0]);
  gradient.addColorStop(1, style.gradient[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  if (asset.mode === "image" && asset.imageDataUrl) {
    try {
      const img = await loadImage(asset.imageDataUrl);
      drawCoverFit(ctx, img, w, h);
      ctx.fillStyle = `rgba(6, 8, 14, ${style.overlay})`;
      ctx.fillRect(0, 0, w, h);
    } catch {
      /* keep gradient */
    }
  }

  drawPattern(ctx, w, h, style.pattern, accent);

  const padX = landscape ? w * 0.045 : w * 0.08;
  const padY = landscape ? h * 0.12 : h * 0.07;
  const safeW = w - padX * 2;

  ctx.save();
  ctx.fillStyle = accent;
  ctx.font = `700 ${Math.max(16, w * 0.028)}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
  const platformLabel = platform.shortName;
  ctx.fillText(platformLabel, w - padX - ctx.measureText(platformLabel).width, padY + h * 0.02);
  ctx.restore();

  const badgeH = landscape ? h * 0.22 : h * 0.048;
  const badgeFont = Math.max(14, landscape ? h * 0.12 : w * 0.032);
  ctx.font = `700 ${badgeFont}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
  const badgePadX = badgeFont * 0.7;
  const badgeW = ctx.measureText(asset.badge).width + badgePadX * 2;
  const badgeY = padY;
  ctx.fillStyle = options.brandColor || style.badgeBg;
  drawRoundRect(ctx, padX, badgeY, badgeW, badgeH, badgeH / 2);
  ctx.fill();
  ctx.fillStyle = style.badgeColor;
  ctx.fillText(asset.badge, padX + badgePadX, badgeY + badgeH * 0.72);

  const titleSize = isPoster
    ? landscape
      ? h * 0.38
      : w * 0.14
    : landscape
      ? h * 0.28
      : w * 0.11;
  ctx.font = `${style.titleWeight} ${titleSize}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = style.titleColor;
  const titleLines = wrapText(ctx, asset.title, safeW);
  const lineHeight = titleSize * 1.18;
  const titleBlockH = titleLines.length * lineHeight;
  const titleY = landscape
    ? h * 0.42
    : isPoster
      ? h * 0.38
      : h * 0.52;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, padX, titleY + i * lineHeight);
  });

  ctx.font = `500 ${Math.max(14, landscape ? h * 0.11 : w * 0.038)}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = style.subtitleColor;
  const subLines = wrapText(ctx, asset.subtitle, safeW);
  const subY = titleY + titleBlockH + (landscape ? h * 0.08 : h * 0.03);
  subLines.forEach((line, i) => {
    ctx.fillText(line, padX, subY + i * (landscape ? h * 0.14 : w * 0.05));
  });

  ctx.fillStyle = withAlpha(accent, 0.9);
  const barW = Math.min(safeW * 0.28, w * 0.22);
  const barH = Math.max(4, h * 0.008);
  const barY = landscape ? h - padY : subY + (landscape ? 0 : h * 0.08);
  ctx.fillRect(padX, Math.min(barY, h - padY - barH), barW, barH);

  if (options.watermark) {
    ctx.save();
    ctx.translate(w * 0.55, h * 0.55);
    ctx.rotate(-Math.PI / 7);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.font = `700 ${Math.max(28, w * 0.08)}px "Noto Sans SC", "PingFang SC", sans-serif`;
    ctx.fillText("闪封面 CoverFast", 0, 0);
    ctx.restore();
  }

  if (asset.quality === "hd") {
    ctx.fillStyle = withAlpha(accent, 0.85);
    ctx.font = `600 ${Math.max(12, w * 0.022)}px "Noto Sans SC", sans-serif`;
    ctx.fillText("HD", padX, h - padY * 0.45);
  }
}

export async function renderCoverPng(
  asset: CoverAsset,
  options: CoverRenderOptions = {}
): Promise<string> {
  const platform = getPlatform(asset.platformId);
  const canvas = document.createElement("canvas");
  canvas.width = platform.width;
  canvas.height = platform.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("当前浏览器不支持画布导出");
  await drawCover(ctx, asset, options);
  return canvas.toDataURL("image/png");
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function assetFileName(asset: CoverAsset, platformId = asset.platformId) {
  const platform = getPlatform(platformId);
  return `闪封面-${platform.shortName}-${asset.topic.slice(0, 12)}.png`;
}
