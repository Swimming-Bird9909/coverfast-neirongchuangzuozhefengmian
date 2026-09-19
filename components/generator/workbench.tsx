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
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function Workbench({ asset }: { asset: CoverAsset }) {
  const { user } = useAppStore();
  const plan = PLANS[user.plan];
  const [exporting, setExporting] = useState(false);
  const watermark = needsWatermark();
  const brandColor = plan.brandColors ? user.brandColor : asset.brandColor;

  function patch(next: Partial<CoverAsset>) {
    updateAsset(asset.id, next);
  }

  async function exportOne(target: CoverAsset, platformId?: PlatformId) {
    const gate = beginDownload();
    if (!gate.ok) {
      toast.error(gate.reason);
      return;
    }
    try {
      const payload = platformId ? { ...target, platformId } : target;
      const png = await renderCoverPng(payload, {
        watermark,
        brandColor,
      });
      downloadDataUrl(png, assetFileName(payload));
      toast.success(
        watermark ? "已下载（含闪封面水印）" : "已下载无水印 PNG"
      );
    } catch (error) {
      refundDownload();
      toast.error(error instanceof Error ? error.message : "导出失败");
    }
  }

  async function exportBatch() {
    if (!plan.batchExport && !plan.fullSizePack) {
      toast.error("批量导出需要创作者或专业会员");
      return;
    }
    setExporting(true);
    try {
      for (const platform of PLATFORM_LIST) {
        await exportOne(asset, platform.id);
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
          点封面即可改标题、副标题和角标 · 右下角调字号 · 当前{" "}
          {PLATFORM_LIST.find((p) => p.id === asset.platformId)?.width}×
          {PLATFORM_LIST.find((p) => p.id === asset.platformId)?.height}
          {watermark ? " · 免费导出带水印" : " · 会员无水印"}
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label>主标题</Label>
          <Input
            value={asset.title}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>副标题</Label>
          <Input
            value={asset.subtitle}
            onChange={(e) => patch({ subtitle: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>角标</Label>
          <Input
            value={asset.badge}
            onChange={(e) => patch({ badge: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label>专业版品牌色</Label>
          <BrandColorPicker onPick={(color) => patch({ brandColor: color })} />
        </div>

        <div className="space-y-1.5">
          <Label>标题字号 {Math.round((asset.titleScale ?? 1) * 100)}%</Label>
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
            <Label>平台</Label>
            <Select
              value={asset.platformId}
              onValueChange={(v) => {
                if (v) patch({ platformId: v as PlatformId });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORM_LIST.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>风格</Label>
            <Select
              value={asset.styleId}
              onValueChange={(v) => {
                if (!v) return;
                if (!canUseStyle(v as StyleId)) {
                  toast.error("该风格需要升级会员");
                  return;
                }
                patch({ styleId: v as StyleId });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STYLE_LIST.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="mb-2">配套标题 · 点选即可替换主标题</Label>
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
            导出当前尺寸 PNG
          </Button>
          <Button
            variant="outline"
            disabled={exporting || (!plan.batchExport && !plan.fullSizePack)}
            onClick={exportBatch}
          >
            {exporting ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
            {plan.batchExport || plan.fullSizePack
              ? `批量导出四平台（${CREDIT_COSTS.batch} 积分已在生成时结算）`
              : (
                  <>
                    <LockIcon />
                    批量导出需会员
                  </>
                )}
          </Button>
          {watermark ? (
            <p className="text-xs text-muted-foreground">
              去掉水印、放开每日下载次数，去
              <Link href="/pricing" className="mx-1 underline">
                定价页
              </Link>
              开通创作者。
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
