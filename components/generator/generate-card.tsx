"use client";

import { CoverCanvas } from "@/components/generator/cover-canvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { creditHint, estimateCredits } from "@/lib/billing/credits";
import { PLANS } from "@/lib/billing/plans";
import { readImageAsDataUrl } from "@/lib/image";
import { canUseStyle, generateCover, useAppStore } from "@/lib/store";
import { PLATFORM_LIST } from "@/lib/templates/platforms";
import { STYLE_LIST } from "@/lib/templates/styles";
import type {
  GenerateMode,
  PlatformId,
  Quality,
  StyleId,
} from "@/lib/types";
import { ImageIcon, Loader2Icon, SparklesIcon, TypeIcon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface GenerateCardProps {
  compact?: boolean;
  initialTopic?: string;
  initialPlatform?: PlatformId;
  initialStyle?: StyleId;
  initialMode?: GenerateMode;
}

export function GenerateCard({
  compact = false,
  initialTopic = "",
  initialPlatform = "xiaohongshu",
  initialStyle = "knowledge",
  initialMode = "text",
}: GenerateCardProps) {
  const router = useRouter();
  const { user, generating } = useAppStore();
  const plan = PLANS[user.plan];
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<GenerateMode>(initialMode);
  const [topic, setTopic] = useState(initialTopic);
  const [platformId, setPlatformId] = useState<PlatformId>(initialPlatform);
  const [styleId, setStyleId] = useState<StyleId>(initialStyle);
  const [quality, setQuality] = useState<Quality>("standard");
  const [batch, setBatch] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const cost = estimateCredits({ quality, batch });
  const lockedStyle = !canUseStyle(styleId);

  async function onUpload(file?: File | null) {
    if (!file) return;
    try {
      const url = await readImageAsDataUrl(file);
      setImageDataUrl(url);
      setMode("image");
      toast.success("参考图已就绪，将作为封面背景");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "图片读取失败");
    }
  }

  async function onGenerate() {
    if (!topic.trim() && mode === "text") {
      toast.error("先写一句选题或卖点");
      return;
    }
    if (mode === "image" && !imageDataUrl) {
      toast.error("请先上传参考图");
      return;
    }
    if (lockedStyle) {
      toast.error("该风格需要创作者或专业会员");
      router.push("/pricing");
      return;
    }
    setBusy(true);
    try {
      const asset = await generateCover({
        mode,
        topic: topic.trim() || "用这张图做封面",
        imageDataUrl,
        platformId,
        styleId,
        quality,
        batch,
        brandColor: plan.brandColors ? user.brandColor : undefined,
      });
      toast.success("封面已生成，去工作台微调标题和导出");
      router.push(`/generate?id=${asset.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "生成失败");
    } finally {
      setBusy(false);
    }
  }

  const waitHint = plan.priorityQueue
    ? "优先队列 · 约 2 秒"
    : "标准队列 · 约 8 秒（本地模板实际更快）";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101218]/90 p-4 shadow-[0_0_80px_-24px_rgba(251,191,36,0.45)] ring-1 ring-amber-300/15 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">封面生成器</p>
          <p className="text-xs text-muted-foreground">
            文字选题或上传参考图，本地模板秒出四平台尺寸
          </p>
        </div>
        <Badge variant="secondary">{waitHint}</Badge>
      </div>

      <Tabs
        value={mode}
        onValueChange={(v) => {
          if (v === "text" || v === "image") setMode(v);
        }}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="text">
            <TypeIcon data-icon="inline-start" />
            文生封面
          </TabsTrigger>
          <TabsTrigger value="image">
            <ImageIcon data-icon="inline-start" />
            图生封面
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：小红书封面怎么做出点击欲 / 三款无线麦真实对比"
            className="min-h-24 text-base"
          />
        </TabsContent>
        <TabsContent value="image" className="space-y-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex min-h-24 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/3 px-4 py-6 text-sm text-muted-foreground hover:border-amber-300/40 hover:text-foreground"
          >
            {imageDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageDataUrl}
                alt="参考图预览"
                className="h-20 rounded-lg object-cover"
              />
            ) : (
              <UploadIcon className="size-5" />
            )}
            {imageDataUrl ? "更换参考图" : "上传参考图作为背景"}
          </button>
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="补充选题（可选，用于生成标题）"
            className="min-h-16"
          />
        </TabsContent>
      </Tabs>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onUpload(e.target.files?.[0])}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>平台尺寸</Label>
          <Select
            value={platformId}
            onValueChange={(v) => {
              if (v) setPlatformId(v as PlatformId);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_LIST.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.shortName} · {p.ratio} · {p.width}×{p.height}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>风格</Label>
          <Select
            value={styleId}
            onValueChange={(v) => {
              if (v) setStyleId(v as StyleId);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STYLE_LIST.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                  {!canUseStyle(s.id) ? " · 会员" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={quality === "hd"}
            onCheckedChange={(checked) => setQuality(checked ? "hd" : "standard")}
          />
          高清
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={batch}
            onCheckedChange={setBatch}
            disabled={!plan.batchExport && !plan.fullSizePack}
          />
          四平台批量
          {!plan.batchExport && !plan.fullSizePack ? (
            <span className="text-xs text-muted-foreground">会员</span>
          ) : null}
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-amber-200/90">
          {creditHint({ quality, batch })} · 余额 {user.credits}
        </p>
        <Button
          className="h-11 bg-amber-300 px-6 text-base text-zinc-950 hover:bg-amber-200"
          disabled={busy || generating > 0}
          onClick={onGenerate}
        >
          {busy ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <SparklesIcon />
          )}
          {busy ? "生成中…" : `免费生成 · ${cost} 积分`}
        </Button>
      </div>

      {!compact ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {PLATFORM_LIST.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatformId(p.id)}
              className="text-left"
            >
              <CoverCanvas
                asset={{
                  title: topic.trim() || p.name,
                  subtitle: p.description,
                  badge: "预览",
                  platformId: p.id,
                  styleId,
                  mode: imageDataUrl ? "image" : "text",
                  imageDataUrl,
                  quality,
                }}
                className="pointer-events-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">{p.shortName}</p>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
