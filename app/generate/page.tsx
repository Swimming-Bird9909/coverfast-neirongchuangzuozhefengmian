"use client";

import { GenerateCard } from "@/components/generator/generate-card";
import { Workbench } from "@/components/generator/workbench";
import { PLANS } from "@/lib/billing/plans";
import { useAppStore } from "@/lib/store";
import type { GenerateMode, PlatformId, StyleId } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GenerateInner() {
  const params = useSearchParams();
  const { assets, user } = useAppStore();
  const id = params.get("id");
  const asset = assets.find((a) => a.id === id);
  const plan = PLANS[user.plan];

  const initialTopic = params.get("topic") ?? "";
  const initialPlatform = (params.get("platform") as PlatformId | null) ?? undefined;
  const initialStyle = (params.get("style") as StyleId | null) ?? undefined;
  const initialMode = (params.get("mode") as GenerateMode | null) ?? undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-amber-200">生成工作台</p>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            {asset ? "微调封面并导出" : "从选题或参考图开始"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            选平台与风格，生成 3–5 条配套标题，在画布里改字、换风格，再导出当前尺寸。
            {plan.priorityQueue ? " 你正在优先队列。" : " 免费用户为 1 个并发。"}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          余额 {user.credits} 积分 · {plan.name}
        </p>
      </div>

      {asset ? <Workbench asset={asset} /> : (
        <GenerateCard
          initialTopic={initialTopic}
          initialPlatform={initialPlatform}
          initialStyle={initialStyle}
          initialMode={initialMode}
        />
      )}
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-20 text-muted-foreground">
          正在打开工作台…
        </div>
      }
    >
      <GenerateInner />
    </Suspense>
  );
}
