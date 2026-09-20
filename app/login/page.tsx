"use client";

import { AuthForm } from "@/components/site/auth-form";
import { useAppStore } from "@/lib/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") || "/generate";
  const { user } = useAppStore();
  const t = useTranslations("login");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-sm font-medium text-amber-200">{t("kicker")}</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {t("body")}
      </p>
      {user.signedIn ? (
        <p className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm">
          {t("already", {
            name: user.nickname,
            email: user.email ? `（${user.email}）` : "",
            credits: user.credits,
          })}
          <Link href="/generate" className="mx-1 underline">
            {t("continue")}
          </Link>
        </p>
      ) : null}
      <div className="mt-8 rounded-2xl border border-white/10 bg-[#101218] p-5">
        <AuthForm next={next} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  const t = useTranslations("login");
  return (
    <Suspense
      fallback={
        <div className="px-4 py-20 text-center text-muted-foreground">{t("opening")}</div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
