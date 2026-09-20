"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ZapIcon } from "lucide-react";

export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-[#05060a]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 font-black">
            <ZapIcon className="size-4 text-amber-300" />
            {t("brand.full")}
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">{t("footer.product")}</span>
            <Link className="text-muted-foreground hover:text-foreground" href="/generate">
              {t("nav.generate")}
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/explore">
              {t("nav.explore")}
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/assets">
              {t("nav.assets")}
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">{t("footer.business")}</span>
            <Link className="text-muted-foreground hover:text-foreground" href="/pricing">
              {t("nav.pricing")}
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/about">
              {t("nav.about")}
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/changelog">
              {t("nav.changelog")}
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">{t("footer.support")}</span>
            <Link className="text-muted-foreground hover:text-foreground" href="/login">
              {t("nav.login")}
            </Link>
            <a
              className="text-muted-foreground hover:text-foreground"
              href="mailto:support@coverfast.app"
            >
              support@coverfast.app
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 py-4 text-center text-xs text-muted-foreground">
        {t("footer.copyright", { year })}
      </div>
    </footer>
  );
}
