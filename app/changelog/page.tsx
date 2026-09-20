import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("changelog");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ChangelogPage() {
  const t = await getTranslations("changelog");

  const releases = [
    {
      version: "1.1.0",
      date: "2026/09/19",
      title: t("v110Title"),
      intro: t("v110Intro"),
      items: [t("v110i1"), t("v110i2"), t("v110i3"), t("v110i4"), t("v110i5"), t("v110i6")],
    },
    {
      version: "1.0.0",
      date: "2026/09/19",
      title: t("v100Title"),
      intro: t("v100Intro"),
      items: [t("v100i1"), t("v100i2"), t("v100i3"), t("v100i4"), t("v100i5"), t("v100i6")],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-medium text-amber-200">{t("kicker")}</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">{t("title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("intro")}</p>

      <div className="mt-12 space-y-12">
        {releases.map((release) => (
          <article key={release.version} className="border-t border-white/10 pt-8">
            <p className="text-xs text-amber-200">
              v{release.version} · {release.date}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">{release.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{release.intro}</p>
            <ul className="mt-4 list-disc space-y-2 ps-5 text-sm leading-6 text-muted-foreground">
              {release.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="mt-16 text-sm text-muted-foreground">
        {t("cta")}
        <Link href="/generate" className="mx-1 text-amber-200 underline">
          {t("ctaGenerate")}
        </Link>
        {t("ctaOr")}
        <Link href="/pricing" className="mx-1 text-amber-200 underline">
          {t("ctaPricing")}
        </Link>
      </p>
    </div>
  );
}
