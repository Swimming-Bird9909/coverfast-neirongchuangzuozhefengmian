import type { PlatformId } from "@/lib/types";

export interface PlatformPreset {
  id: PlatformId;
  name: string;
  shortName: string;
  ratio: string;
  width: number;
  height: number;
  description: string;
  titleHint: string;
}

export const PLATFORMS: Record<PlatformId, PlatformPreset> = {
  xiaohongshu: {
    id: "xiaohongshu",
    name: "小红书封面",
    shortName: "小红书",
    ratio: "3:4",
    width: 1242,
    height: 1660,
    description: "信息流首图，竖版笔记封面",
    titleHint: "情绪词 + 共鸣，适合收藏与互动",
  },
  shortvideo: {
    id: "shortvideo",
    name: "短视频封面",
    shortName: "短视频",
    ratio: "9:16",
    width: 1080,
    height: 1920,
    description: "抖音 / 视频号全屏封面",
    titleHint: "3 秒钩子，停得住才有播放",
  },
  wechat: {
    id: "wechat",
    name: "公众号头图",
    shortName: "公众号",
    ratio: "2.35:1",
    width: 900,
    height: 383,
    description: "订阅号文章顶图",
    titleHint: "利益点清晰，适合认真阅读",
  },
  thumbnail: {
    id: "thumbnail",
    name: "视频缩略图",
    shortName: "缩略图",
    ratio: "16:9",
    width: 1280,
    height: 720,
    description: "B 站 / YouTube 列表缩略图",
    titleHint: "数字、反差、对比，提升点击",
  },
};

export const PLATFORM_LIST = Object.values(PLATFORMS);

export function getPlatform(id: PlatformId): PlatformPreset {
  return PLATFORMS[id];
}

export function aspectRatioCss(platform: PlatformPreset): string {
  return `${platform.width} / ${platform.height}`;
}
