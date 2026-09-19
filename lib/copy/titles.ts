import { PLATFORMS } from "@/lib/templates/platforms";
import type { PlatformId } from "@/lib/types";

function clip(topic: string, max = 16): string {
  const t = topic.replace(/\s+/g, "").trim();
  if (t.length <= max) return t || "这件事";
  return `${t.slice(0, max)}…`;
}

function keyword(topic: string): string {
  const t = topic.trim();
  if (!t) return "内容增长";
  return t.length > 18 ? `${t.slice(0, 18)}…` : t;
}

export function generateTitles(topic: string, platformId: PlatformId): string[] {
  const k = keyword(topic);
  const short = clip(topic, 10);

  const byPlatform: Record<PlatformId, string[]> = {
    xiaohongshu: [
      `姐妹们，这个${short}我真的会反复看`,
      `终于把「${k}」讲明白了，收藏了不怕忘`,
      `普通人也能立刻用上的${short}方法`,
      `我的${short}避雷指南，看完少走三年弯路`,
      `做完这件事，才懂${short}为什么一直被转发`,
    ],
    shortvideo: [
      `90%的人不知道：${short}其实可以这样`,
      `停！这个${short}你还在用旧方法吗`,
      `3秒看懂${k}，看完立刻能上手`,
      `别再被骗了，${short}真正有效的只有这步`,
      `我用7天验证了${short}，结果完全相反`,
    ],
    wechat: [
      `${k}：一份可直接落地的实操清单`,
      `如何用${short}把结果提升一倍（附模板）`,
      `${k}完整路径：从入门到第一次出成果`,
      `写给认真做内容的人：${short}避坑与提效`,
      `${k}全流程拆解，看完就能开工`,
    ],
    thumbnail: [
      `${short}｜3个对比让你秒懂`,
      `0基础 → 出片：${short}全过程`,
      `${short}翻车 vs 正确示范`,
      `投入1小时，${short}效果差10倍`,
      `TOP 5：${short}最容易被忽略的点`,
    ],
  };

  return byPlatform[platformId];
}

export function generateSubtitle(topic: string, platformId: PlatformId): string {
  const name = PLATFORMS[platformId].shortName;
  const k = keyword(topic);
  const map: Record<PlatformId, string> = {
    xiaohongshu: `收藏这一篇，${k}不再靠感觉`,
    shortvideo: `看完这支就够了 · ${name}封面`,
    wechat: `读完即可执行 · 附可复用结构`,
    thumbnail: `高对比点击公式 · ${name}`,
  };
  return map[platformId];
}

export function generateBadge(topic: string, platformId: PlatformId): string {
  const map: Record<PlatformId, string[]> = {
    xiaohongshu: ["今日必看", "干货收藏", "亲测有效"],
    shortvideo: ["3秒钩子", "停下来看", "别划走"],
    wechat: ["深度拆解", "可落地", "实操清单"],
    thumbnail: ["高点击", "对比局", "数据说话"],
  };
  const list = map[platformId];
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
