"use client";

import { CoverCanvas } from "@/components/generator/cover-canvas";
import { Button } from "@/components/ui/button";
import { formatAppError } from "@/lib/app-error";
import {
  beginDownload,
  deleteAsset,
  needsWatermark,
  refundDownload,
  useAppStore,
} from "@/lib/store";
import {
  assetFileName,
  downloadDataUrl,
  renderCoverPng,
} from "@/lib/templates/render";
import { DownloadIcon, Trash2Icon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";

export default function AssetsPage() {
  const { assets, user, generating } = useAppStore();
  const watermark = needsWatermark();
  const t = useTranslations();
  const te = useTranslations("errors");
  const locale = useLocale();

  async function onDownload(id: string) {
    const asset = assets.find((a) => a.id === id);
    if (!asset) return;
    const gate = beginDownload();
    if (!gate.ok) {
      toast.error(formatAppError(new Error(gate.reason), te as never));
      return;
    }
    try {
      const png = await renderCoverPng(asset, {
        watermark,
        brandColor: user.brandColor,
        watermarkLabel: t("brand.watermark"),
        platformLabel: t(`platforms.${asset.platformId}.shortName`),
      });
      downloadDataUrl(png, assetFileName(asset, asset.platformId, t("brand.name")));
      toast.success(t("assets.downloaded"));
    } catch (error) {
      refundDownload();
      toast.error(formatAppError(error, te as never, "generic"));
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">{t("assets.title")}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("assets.body")}
          </p>
        </div>
        <Button nativeButton={false} className="bg-amber-300 text-zinc-950 hover:bg-amber-200" render={<Link href="/generate" />}>
          {t("assets.newCover")}
        </Button>
      </div>

      {generating > 0 ? (
        <div className="mb-6 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm">
          {t("assets.generating", { count: generating })}
        </div>
      ) : null}

      {assets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/12 px-6 py-16 text-center">
          <p className="text-lg font-medium">{t("assets.emptyTitle")}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("assets.emptyBody")}
          </p>
          <Button className="mt-6" nativeButton={false} render={<Link href="/generate" />}>
            {t("assets.goGenerate")}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <article
              key={asset.id}
              className="overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-2"
            >
              <Link href={`/generate?id=${asset.id}`}>
                <CoverCanvas asset={asset} watermark={watermark} />
              </Link>
              <div className="px-2 py-3">
                <p className="truncate font-medium">{asset.topic}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(asset.createdAt).toLocaleString(locale)} · {asset.status === "ready" ? t("assets.ready") : t("assets.exporting")}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => onDownload(asset.id)}>
                    <DownloadIcon />
                    {t("assets.download")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={<Link href={`/generate?id=${asset.id}`} />}
                  >
                    {t("assets.edit")}
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => deleteAsset(asset.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
