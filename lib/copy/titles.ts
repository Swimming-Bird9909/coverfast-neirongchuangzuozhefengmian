import { PLATFORMS } from "@/lib/templates/platforms";
import type { PlatformId } from "@/lib/types";
import { tRuntime } from "@/i18n/runtime";

function clip(topic: string, max = 16): string {
  const t = topic.replace(/\s+/g, "").trim();
  if (t.length <= max) return t || tRuntime("copy.untitledTopic");
  return `${t.slice(0, max)}…`;
}

function keyword(topic: string): string {
  const t = topic.trim();
  if (!t) return tRuntime("copy.defaultKeyword");
  return t.length > 18 ? `${t.slice(0, 18)}…` : t;
}

export function generateTitles(topic: string, platformId: PlatformId): string[] {
  const k = keyword(topic);
  const short = clip(topic, 10);
  return [1, 2, 3, 4, 5].map((n) =>
    tRuntime(`copy.${platformId}.t${n}`, { short, k })
  );
}

export function generateSubtitle(topic: string, platformId: PlatformId): string {
  const name = tRuntime(`platforms.${platformId}.shortName`) || PLATFORMS[platformId].shortName;
  const k = keyword(topic);
  return tRuntime(`copy.${platformId}.sub`, { k, name });
}

export function generateBadge(topic: string, platformId: PlatformId): string {
  const list = [1, 2, 3].map((n) => tRuntime(`copy.${platformId}.b${n}`));
  const index = topic.trim().length % list.length;
  return list[index];
}

export function generateCopyPack(topic: string, platformId: PlatformId) {
  const titles = generateTitles(topic, platformId);
  return {
    titles,
    title: titles[0],
    subtitle: generateSubtitle(topic, platformId),
    badge: generateBadge(topic, platformId),
  };
}
