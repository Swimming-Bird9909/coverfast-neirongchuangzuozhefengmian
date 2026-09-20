import { generateCopyPack } from "@/lib/copy/titles";
import { tRuntime } from "@/i18n/runtime";
import type { CoverProvider } from "@/lib/providers/cover-provider";
import { PLATFORM_LIST } from "@/lib/templates/platforms";
import type { CoverAsset, CoverGenerateInput } from "@/lib/types";

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const LocalTemplateProvider: CoverProvider = {
  async generate(input: CoverGenerateInput): Promise<{ asset: CoverAsset }> {
    await wait(input.batch ? 1400 : 900);
    const copy = generateCopyPack(input.topic, input.platformId);
    const asset: CoverAsset = {
      id: uid("cv"),
      topic: input.topic.trim() || tRuntime("common.untitled"),
      mode: input.mode,
      imageDataUrl: input.imageDataUrl,
      platformId: input.platformId,
      styleId: input.styleId,
      quality: input.quality,
      title: copy.title,
      subtitle: copy.subtitle,
      badge: copy.badge,
      titles: copy.titles,
      selectedTitleIndex: 0,
      titleScale: 1,
      createdAt: new Date().toISOString(),
      status: "ready",
      brandColor: input.brandColor,
      batch: input.batch,
    };

    if (input.batch) {
      asset.subtitle = tRuntime("copy.batchSubtitle", {
        names: PLATFORM_LIST.map((p) => tRuntime(`platforms.${p.id}.shortName`)).join(" / "),
      });
    }

    return { asset };
  },
};
