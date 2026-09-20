"use client";

import { BrandColorPicker } from "@/components/generator/brand-colors";
import { CoverCanvas } from "@/components/generator/cover-canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatAppError } from "@/lib/app-error";
import { CREDIT_COSTS } from "@/lib/billing/credits";
import { PLANS } from "@/lib/billing/plans";
import {
  beginDownload,
  canUseStyle,
  needsWatermark,
  refundDownload,
  updateAsset,
  useAppStore,
} from "@/lib/store";
import {
  assetFileName,
  downloadDataUrl,
  renderCoverPng,
} from "@/lib/templates/render";
import { PLATFORM_LIST } from "@/lib/templates/platforms";
import { STYLE_LIST } from "@/lib/templates/styles";
import type { CoverAsset, PlatformId, StyleId } from "@/lib/types";
import { DownloadIcon, Loader2Icon, LockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function Workbench({ asset }: { asset: CoverAsset }) {
  const { user } = useAppStore();
  const plan = PLANS[user.plan];
  const [exporting, setExporting] = useState(false);
  const watermark = needsWatermark();
  const brandColor = plan.brandColors ? user.brandColor : asset.brandColor;
  const t = useTranslations();
  const te = useTranslations("errors");
  const platform = PLATFORM_LIST.find((p) => p.id === asset.platformId);

  function patch(next: Partial<CoverAsset>) {
    updateAsset(asset.id, next);
  }

  async function exportOne(target: CoverAsset, platformId?: PlatformId) {
    const gate = beginDownload();
    if (!gate.ok) {
      toast.error(formatAppError(new Error(gate.reason), te as never));
      return;
    }
    try {
      const payload = platformId ? { ...target, platformId } : target;
      const png = await renderCoverPng(payload, {
        watermark,
        brandColor,
        watermarkLabel: t("brand.watermark"),
        platformLabel: t(`platforms.${payload.platformId}.shortName`),
      });
      downloadDataUrl(png, assetFileName(payload, payload.platformId, t("brand.name")));
      toast.success(
        watermark ? t("workbench.downloadedWm") : t("workbench.downloaded")
      );
    } catch (error) {
      refundDownload();
      toast.error(formatAppError(error, te as never, "generic"));
    }
  }

  async function exportBatch() {
    if (!plan.batchExport && !plan.fullSizePack) {
      toast.error(t("workbench.batchLocked"));
      return;
    }
    setExporting(true);
    try {
      for (const item of PLATFORM_LIST) {
        await exportOne(asset, item.id);
      }
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <CoverCanvas
          asset={asset}
          watermark={watermark}
          brandColor={brandColor}
          className="mx-auto w-full max-w-lg"
          editable
          onChange={patch}
        />
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {t("workbench.canvasHint", {
            size: platform ? `${platform.width}×${platform.height}` : "",
          })}
          {watermark ? t("workbench.watermarkOn") : t("workbench.watermarkOff")}
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label>{t("workbench.title")}</Label>
          <Input
            value={asset.title}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t("workbench.subtitle")}</Label>
          <Input
            value={asset.subtitle}
            onChange={(e) => patch({ subtitle: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t("workbench.badge")}</Label>
          <Input
            value={asset.badge}
            onChange={(e) => patch({ badge: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label>{t("generate.brandLabel")}</Label>
          <BrandColorPicker onPick={(color) => patch({ brandColor: color })} />
        </div>

        <div className="space-y-1.5">
          <Label>{t("workbench.titleScale", { percent: Math.round((asset.titleScale ?? 1) * 100) })}</Label>
          <input
            type="range"
            min={0.75}
            max={1.35}
            step={0.05}
            value={asset.titleScale ?? 1}
            onChange={(e) => patch({ titleScale: Number(e.target.value) })}
            className="w-full accent-amber-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>{t("workbench.platform")}</Label>
            <Select
              value={asset.platformId}
              onValueChange={(v) => {
                if (v) patch({ platformId: v as PlatformId });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string | null) =>
                    value ? t(`platforms.${value}.shortName`) : null
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PLATFORM_LIST.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {t(`platforms.${p.id}.shortName`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t("workbench.style")}</Label>
            <Select
              value={asset.styleId}
              onValueChange={(v) => {
                if (!v) return;
                if (!canUseStyle(v as StyleId)) {
                  toast.error(t("workbench.styleUpgrade"));
                  return;
                }
                patch({ styleId: v as StyleId });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string | null) =>
                    value ? t(`styles.${value}.name`) : null
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {STYLE_LIST.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {t(`styles.${s.id}.name`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="mb-2">{t("workbench.companion")}</Label>
          <div className="mt-2 space-y-2">
            {asset.titles.map((title, index) => (
              <button
                key={title}
                type="button"
                onClick={() =>
                  patch({ title, selectedTitleIndex: index })
                }
                className="block w-full rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-left text-sm hover:border-amber-300/40 data-active:border-amber-300/60"
                data-active={asset.selectedTitleIndex === index ? "" : undefined}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="h-10 bg-amber-300 text-zinc-950 hover:bg-amber-200"
            onClick={() => exportOne(asset)}
          >
            <DownloadIcon />
            {t("workbench.exportOne")}
          </Button>
          <Button
            variant="outline"
            disabled={exporting || (!plan.batchExport && !plan.fullSizePack)}
            onClick={exportBatch}
          >
            {exporting ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
            {plan.batchExport || plan.fullSizePack
              ? t("workbench.exportBatch", { cost: CREDIT_COSTS.batch })
              : (
                  <>
                    <LockIcon />
                    {t("workbench.exportLocked")}
                  </>
                )}
          </Button>
          {watermark ? (
            <p className="text-xs text-muted-foreground">
              {t("workbench.removeWatermark")}
              <Link href="/pricing" className="mx-1 underline">
                {t("workbench.pricingLink")}
              </Link>
              {t("workbench.openCreator")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
