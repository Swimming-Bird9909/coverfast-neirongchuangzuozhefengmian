"use client";

import { CoverCanvas } from "@/components/generator/cover-canvas";
import { Button } from "@/components/ui/button";
import { INSPIRATIONS } from "@/lib/explore";
import { msg } from "@/lib/app-error";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function InspirationWall({
  limit,
}: {
  limit?: number;
}) {
  const items = limit ? INSPIRATIONS.slice(0, limit) : INSPIRATIONS;
  const t = useTranslations();

  return (
    <section>
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">{t("explore.heading")}</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">{t("explore.sub")}</p>
        </div>
        {limit ? (
          <Button variant="outline" nativeButton={false} render={<Link href="/explore" />}>
            {t("explore.viewAll")}
          </Button>
        ) : null}
      </div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-2"
          >
            <CoverCanvas
              asset={{
                ...item,
                title: msg(t as never, `inspirations.${item.id}.title`),
                subtitle: msg(t as never, `inspirations.${item.id}.subtitle`),
                badge: msg(t as never, `inspirations.${item.id}.badge`),
              }}
            />
            <div className="flex items-center justify-between gap-2 px-2 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{msg(t as never, `inspirations.${item.id}.topic`)}</p>
                <p className="text-xs text-muted-foreground">{msg(t as never, `inspirations.${item.id}.author`)}</p>
              </div>
              <Button
                size="sm"
                className="shrink-0 bg-amber-300 text-zinc-950 hover:bg-amber-200"
                nativeButton={false}
                render={
                  <Link
                    href={`/generate?style=${item.styleId}&platform=${item.platformId}&topic=${encodeURIComponent(msg(t as never, `inspirations.${item.id}.topic`))}`}
                  />
                }
              >
                {t("explore.useSame")}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
