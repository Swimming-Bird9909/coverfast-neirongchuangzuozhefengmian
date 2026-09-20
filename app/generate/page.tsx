"use client";

import { GenerateCard } from "@/components/generator/generate-card";
import { Workbench } from "@/components/generator/workbench";
import { useAppStore } from "@/lib/store";
import type { GenerateMode, PlatformId, StyleId } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GenerateInner() {
  const params = useSearchParams();
  const { assets, user } = useAppStore();
  const id = params.get("id");
  const asset = assets.find((a) => a.id === id);
  const t = useTranslations();

  const initialTopic = params.get("topic") ?? "";
  const initialPlatform = (params.get("platform") as PlatformId | null) ?? undefined;
  const initialStyle = (params.get("style") as StyleId | null) ?? undefined;
  const initialMode = (params.get("mode") as GenerateMode | null) ?? undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-amber-200">{t("generate.pageKicker")}</p>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            {asset ? t("generate.pageTitleEdit") : t("generate.pageTitleNew")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t("generate.pageBody")}
            {user.plan === "pro" ? t("generate.priorityNote") : t("generate.freeNote")}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("generate.balance", {
            credits: user.credits,
            plan: t(`plans.${user.plan}.name`),
          })}
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
  const t = useTranslations("generate");
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-20 text-muted-foreground">
          {t("opening")}
        </div>
      }
    >
      <GenerateInner />
    </Suspense>
  );
}
