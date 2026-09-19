import type { BillingCycle, PlanId, StyleId } from "@/lib/types";
import { BASIC_STYLE_IDS, STYLE_LIST } from "@/lib/templates/styles";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  yearlyMonthlyPrice: number | null;
  credits: number;
  downloadsPerDay: number | null;
  watermark: boolean;
  styles: StyleId[];
  batchExport: boolean;
  concurrent: number | "unlimited";
  priorityQueue: boolean;
  brandColors: boolean;
  fullSizePack: boolean;
  features: string[];
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "免费",
    tagline: "先做起来，无需登录",
    monthlyPrice: null,
    yearlyMonthlyPrice: null,
    credits: 80,
    downloadsPerDay: 3,
    watermark: true,
    styles: BASIC_STYLE_IDS,
    batchExport: false,
    concurrent: 1,
    priorityQueue: false,
    brandColors: false,
    fullSizePack: false,
    features: [
      "每月 80 积分",
      "每日 3 次下载",
      "导出带「闪封面」水印",
      "基础风格（知识 / 生活 / 种草）",
      "1 个并发任务",
    ],
  },
  creator: {
    id: "creator",
    name: "创作者",
    tagline: "去水印，认真发内容的人",
    monthlyPrice: 29,
    yearlyMonthlyPrice: 20,
    credits: 800,
    downloadsPerDay: null,
    watermark: false,
    styles: STYLE_LIST.map((s) => s.id),
    batchExport: true,
    concurrent: "unlimited",
    priorityQueue: false,
    brandColors: false,
    fullSizePack: false,
    features: [
      "每月 800 积分",
      "导出无水印",
      "解锁全部风格",
      "四平台批量导出",
      "无限次下载",
    ],
  },
  pro: {
    id: "pro",
    name: "专业",
    tagline: "团队与高频更新的首选",
    monthlyPrice: 79,
    yearlyMonthlyPrice: 55,
    credits: 3000,
    downloadsPerDay: null,
    watermark: false,
    styles: STYLE_LIST.map((s) => s.id),
    batchExport: true,
    concurrent: "unlimited",
    priorityQueue: true,
    brandColors: true,
    fullSizePack: true,
    features: [
      "每月 3000 积分",
      "优先队列展示",
      "品牌色套装",
      "全尺寸包一键导出",
      "创作者全部权益",
    ],
  },
};

export const PLAN_LIST = [PLANS.free, PLANS.creator, PLANS.pro];

export function planPrice(
  planId: Exclude<PlanId, "free">,
  cycle: BillingCycle
): { monthly: number; billed: number; label: string } {
  const plan = PLANS[planId];
  if (cycle === "year") {
    const monthly = plan.yearlyMonthlyPrice ?? 0;
    return {
      monthly,
      billed: monthly * 12,
      label: `年付 ¥${monthly}/月`,
    };
  }
  const monthly = plan.monthlyPrice ?? 0;
  return {
    monthly,
    billed: monthly,
    label: `¥${monthly}/月`,
  };
}

export function amountFen(
  planId: Exclude<PlanId, "free">,
  cycle: BillingCycle
): number {
  return planPrice(planId, cycle).billed * 100;
}
