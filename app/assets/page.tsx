"use client";

import { CoverCanvas } from "@/components/generator/cover-canvas";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { toast } from "sonner";

export default function AssetsPage() {
  const { assets, user, generating } = useAppStore();
  const watermark = needsWatermark();

  async function onDownload(id: string) {
    const asset = assets.find((a) => a.id === id);
    if (!asset) return;
    const gate = beginDownload();
    if (!gate.ok) {
      toast.error(gate.reason);
      return;
    }
    try {
      const png = await renderCoverPng(asset, {
        watermark,
        brandColor: user.brandColor,
      });
      downloadDataUrl(png, assetFileName(asset));
      toast.success("已开始下载");
    } catch (error) {
      refundDownload();
      toast.error(error instanceof Error ? error.message : "下载失败");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">我的作品</h1>
          <p className="mt-2 text-muted-foreground">
            作品保存在这台浏览器。生成后可随时回来改字、换风格、继续下载。
          </p>
        </div>
        <Button nativeButton={false} className="bg-amber-300 text-zinc-950 hover:bg-amber-200" render={<Link href="/generate" />}>
          新建封面
        </Button>
      </div>

      {generating > 0 ? (
        <div className="mb-6 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm">
          有 {generating} 个任务正在生成，完成后会自动出现在下方。
        </div>
      ) : null}

      {assets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/12 px-6 py-16 text-center">
          <p className="text-lg font-medium">还没有作品</p>
          <p className="mt-2 text-sm text-muted-foreground">
            去首页或生成器输入一个选题，第一张封面会保存在这里。
          </p>
          <Button className="mt-6" nativeButton={false} render={<Link href="/generate" />}>
            去生成
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
                  {new Date(asset.createdAt).toLocaleString("zh-CN")} · {asset.status === "ready" ? "已完成" : "导出中"}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => onDownload(asset.id)}>
                    <DownloadIcon />
                    下载
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={<Link href={`/generate?id=${asset.id}`} />}
                  >
                    继续编辑
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
