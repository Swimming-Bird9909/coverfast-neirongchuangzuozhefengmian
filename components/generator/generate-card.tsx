"use client";

import { BrandColorPicker } from "@/components/generator/brand-colors";
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
import { CREDIT_COSTS, estimateCredits } from "@/lib/billing/credits";
import { PLANS } from "@/lib/billing/plans";
import { formatAppError } from "@/lib/app-error";
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
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2Icon, SparklesIcon, TypeIcon, UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();
  const te = useTranslations("errors");

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

  const hint = batch
    ? t("generate.hintBatch", { cost })
    : quality === "hd"
      ? t("generate.hintHd", { cost })
      : t("generate.hintStandard", { cost });

  async function onUpload(file?: File | null) {
    if (!file) return;
    try {
      const url = await readImageAsDataUrl(file);
      setImageDataUrl(url);
      setMode("image");
      toast.success(t("generate.imageReady"));
    } catch (error) {
      toast.error(formatAppError(error, te as never));
    }
  }

  async function onGenerate() {
    if (!topic.trim() && mode === "text") {
      toast.error(t("generate.needTopic"));
      return;
    }
    if (mode === "image" && !imageDataUrl) {
      toast.error(t("generate.needImage"));
      return;
    }
    if (lockedStyle) {
      toast.error(t("generate.styleLocked"));
      router.push("/pricing");
      return;
    }
    setBusy(true);
    try {
      const asset = await generateCover({
        mode,
        topic: topic.trim() || t("generate.defaultTopic"),
        imageDataUrl,
        platformId,
        styleId,
        quality,
        batch,
        brandColor: plan.brandColors ? user.brandColor : undefined,
      });
      toast.success(t("generate.generated"));
      router.push(`/generate?id=${asset.id}`);
    } catch (error) {
      toast.error(formatAppError(error, te as never, "generic"));
    } finally {
      setBusy(false);
    }
  }

  const waitHint = plan.priorityQueue
    ? t("generate.queuePriority")
    : t("generate.queueStandard");

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101218]/90 p-4 shadow-[0_0_80px_-24px_rgba(251,191,36,0.45)] ring-1 ring-amber-300/15 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{t("generate.cardTitle")}</p>
          <p className="text-xs text-muted-foreground">
            {t("generate.cardSub")}
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
            {t("generate.textMode")}
          </TabsTrigger>
          <TabsTrigger value="image">
            <ImageIcon data-icon="inline-start" />
            {t("generate.imageMode")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t("generate.topicPlaceholder")}
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
                alt={t("generate.imageAlt")}
                className="h-20 rounded-lg object-cover"
              />
            ) : (
              <UploadIcon className="size-5" />
            )}
            {imageDataUrl ? t("generate.replaceImage") : t("generate.upload")}
          </button>
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t("generate.topicOptional")}
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
          <Label>{t("generate.platform")}</Label>
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
                  {t(`platforms.${p.id}.shortName`)} · {p.ratio} · {p.width}×{p.height}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{t("generate.style")}</Label>
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
                  {t(`styles.${s.id}.name`)}
                  {!canUseStyle(s.id) ? t("generate.styleMember") : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label>{t("generate.qualityLabel")}</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setQuality("standard");
              setBatch(false);
            }}
            className={cn(
              "rounded-xl border px-3 py-3 text-left transition",
              quality === "standard" && !batch
                ? "border-amber-300/70 bg-amber-300/10"
                : "border-white/10 hover:border-white/25"
            )}
          >
            <p className="text-sm font-semibold">{t("generate.standard")}</p>
            <p className="mt-1 text-lg font-black text-amber-200">
              {t("common.creditsCount", { count: CREDIT_COSTS.standard })}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("generate.standardHint")}
            </p>
          </button>
          <button
            type="button"
            onClick={() => {
              setQuality("hd");
              setBatch(false);
            }}
            className={cn(
              "rounded-xl border px-3 py-3 text-left transition",
              quality === "hd" && !batch
                ? "border-amber-300/70 bg-amber-300/10"
                : "border-white/10 hover:border-white/25"
            )}
          >
            <p className="text-sm font-semibold">{t("generate.hd")}</p>
            <p className="mt-1 text-lg font-black text-amber-200">
              {t("common.creditsCount", { count: CREDIT_COSTS.hd })}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("generate.hdHint")}
            </p>
          </button>
        </div>
        <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-3 text-sm">
          <span>
            <span className="font-medium">{t("generate.batch")}</span>
            <span className="ms-2 text-amber-200">
              {t("common.creditsCount", { count: CREDIT_COSTS.batch })}
            </span>
            {!plan.batchExport && !plan.fullSizePack ? (
              <span className="ms-2 text-xs text-muted-foreground">{t("common.member")}</span>
            ) : (
              <span className="mt-1 block text-xs text-muted-foreground">
                {t("generate.batchHint")}
              </span>
            )}
          </span>
          <Switch
            checked={batch}
            onCheckedChange={setBatch}
            disabled={!plan.batchExport && !plan.fullSizePack}
          />
        </label>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label>{t("generate.brandLabel")}</Label>
        <BrandColorPicker compact />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-amber-200/90">
          {t("generate.creditLine", { hint, credits: user.credits })}
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
          {busy ? t("generate.busy") : t("generate.cta", { cost })}
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
                  title: topic.trim() || t(`platforms.${p.id}.name`),
                  subtitle: t(`platforms.${p.id}.description`),
                  badge: t("common.preview"),
                  platformId: p.id,
                  styleId,
                  mode: imageDataUrl ? "image" : "text",
                  imageDataUrl,
                  quality,
                }}
                brandColor={plan.brandColors ? user.brandColor : undefined}
                className="pointer-events-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">{t(`platforms.${p.id}.shortName`)}</p>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
