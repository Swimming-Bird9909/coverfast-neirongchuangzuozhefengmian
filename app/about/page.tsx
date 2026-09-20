import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-medium text-amber-200">{t("kicker")}</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">
        {t("title")}
      </h1>
      <div className="mt-8 space-y-5 text-base leading-8 text-muted-foreground">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
        <p>{t("who")}</p>
        <ul className="list-disc space-y-2 ps-5">
          <li>{t("who1")}</li>
          <li>{t("who2")}</li>
          <li>{t("who3")}</li>
        </ul>
        <p>{t("p4")}</p>
        <p>
          {t("support")}
          <a className="text-amber-200 underline" href="mailto:support@coverfast.app">
            support@coverfast.app
          </a>
        </p>
      </div>
    </div>
  );
}
