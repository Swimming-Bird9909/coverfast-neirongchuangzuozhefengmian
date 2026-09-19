import type { Quality } from "@/lib/types";

export const CREDIT_COSTS = {
  standard: 10,
  hd: 20,
  batch: 30,
} as const;

export function estimateCredits(input: {
  quality: Quality;
  batch?: boolean;
}): number {
  if (input.batch) return CREDIT_COSTS.batch;
  return input.quality === "hd" ? CREDIT_COSTS.hd : CREDIT_COSTS.standard;
}

export function creditHint(input: {
  quality: Quality;
  batch?: boolean;
}): string {
  const cost = estimateCredits(input);
  if (input.batch) return `四平台批量 · 预计消耗 ${cost} 积分`;
  if (input.quality === "hd") return `高清生成 · 预计消耗 ${cost} 积分`;
  return `标准生成 · 预计消耗 ${cost} 积分`;
}
