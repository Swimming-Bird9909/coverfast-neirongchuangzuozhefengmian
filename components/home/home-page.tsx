"use client";

import { InspirationWall } from "@/components/explore/inspiration-wall";
import { GenerateCard } from "@/components/generator/generate-card";
import { PlanGrid } from "@/components/pricing/plan-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PLATFORM_LIST } from "@/lib/templates/platforms";
import { msg } from "@/lib/app-error";
import {
  ClapperboardIcon,
  ImageIcon,
  LayersIcon,
  SparklesIcon,
  TypeIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const FEATURE_ICONS = [SparklesIcon, TypeIcon, ImageIcon, LayersIcon, ClapperboardIcon] as const;

export function HomePage() {
  const t = useTranslations();

  const features = FEATURE_ICONS.map((icon, i) => ({
    icon,
    title: msg(t as never, `features.f${i + 1}Title`),
    body: msg(t as never, `features.f${i + 1}Body`),
  }));

  const faqs = Array.from({ length: 9 }, (_, i) => ({
    q: msg(t as never, `faq.q${i + 1}`),
    a: msg(t as never, `faq.a${i + 1}`),
  }));

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 bg-size-[56px_56px] bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-10 md:pt-24">
          <p className="mb-4 text-center text-sm font-medium tracking-wide text-amber-200">
            {t("home.kicker")}
          </p>
          <h1 className="text-center text-4xl leading-[1.08] font-black tracking-tight text-balance sm:text-6xl md:text-7xl">
            {t("home.heroLead")}
            <span className="bg-linear-to-r from-amber-200 via-orange-300 to-cyan-300 bg-clip-text text-transparent">
              {t("home.heroAccent")}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-7 text-muted-foreground md:text-lg">
            {t("home.heroBody")}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              nativeButton={false}
              className="h-11 bg-amber-300 px-5 text-zinc-950 hover:bg-amber-200"
              render={<Link href="#generate" />}
            >
              {t("home.startFree")}
            </Button>
            <Button variant="outline" className="h-11" nativeButton={false} render={<Link href="/explore" />}>
              {t("home.browseExplore")}
            </Button>
          </div>

          <div id="generate" className="mx-auto mt-12 max-w-3xl">
            <GenerateCard compact />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-sm font-medium text-amber-200">{t("home.engineKicker")}</p>
        <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
          {t("home.engineTitle")}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {t("home.engineBody")}
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_LIST.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-white/8 bg-white/3 p-5"
            >
              <p className="text-xs text-amber-200">{p.ratio}</p>
              <h3 className="mt-2 text-lg font-bold">{t(`platforms.${p.id}.name`)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(`platforms.${p.id}.description`)}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {p.width}×{p.height} · {t(`platforms.${p.id}.titleHint`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-3xl font-black tracking-tight md:text-4xl">{t("home.featuresTitle")}</h2>
        <p className="mt-2 text-muted-foreground">
          {t("home.featuresBody")}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/8 bg-[#101218] p-5"
            >
              <f.icon className="mb-3 size-5 text-amber-300" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <InspirationWall limit={8} />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">
          {t("home.faqTitle")}
        </h2>
        <Accordion className="mt-8">
          {faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">
          {t("home.plansTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          {t("home.plansBody")}
        </p>
        <div className="mt-10">
          <PlanGrid teaser />
        </div>
      </section>

      <section className="border-t border-white/8 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.12),transparent_55%)]">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            {t("home.ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t("home.ctaBody")}
          </p>
          <Button
            nativeButton={false}
            className="mt-8 h-12 bg-amber-300 px-8 text-base text-zinc-950 hover:bg-amber-200"
            render={<Link href="/generate" />}
          >
            {t("home.ctaButton")}
          </Button>
        </div>
      </section>
    </>
  );
}
