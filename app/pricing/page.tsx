import { PlanGrid } from "@/components/pricing/plan-grid";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pricing");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function PricingPage() {
  const t = await getTranslations("pricing");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-amber-200">{t("kicker")}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t("body")}
        </p>
      </div>
      <div className="mt-12">
        <PlanGrid />
      </div>
    </div>
  );
}
