"use client";

import { formatAppError } from "@/lib/app-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MockPaymentPort } from "@/lib/billing/mock-payment";
import { PLANS, planPrice } from "@/lib/billing/plans";
import { signIn, useAppStore } from "@/lib/store";
import type { BillingCycle, PlanId } from "@/lib/types";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";

function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAppStore();
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState(user.nickname);
  const t = useTranslations();
  const te = useTranslations("errors");

  const planId = (params.get("plan") === "pro" ? "pro" : "creator") as Exclude<
    PlanId,
    "free"
  >;
  const cycle = (params.get("cycle") === "month" ? "month" : "year") as BillingCycle;
  const plan = PLANS[planId];
  const price = useMemo(() => planPrice(planId, cycle), [planId, cycle]);
  const planName = t(`plans.${planId}.name`);

  async function confirm() {
    setBusy(true);
    try {
      const session = await MockPaymentPort.createCheckout({
        userId: user.id,
        planId,
        cycle,
      });
      await MockPaymentPort.confirm(session.id);
      signIn(name);
      toast.success(t("checkout.ok", { plan: planName }));
      router.push("/assets");
    } catch (error) {
      toast.error(formatAppError(error, te as never, "generic"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-[1fr_360px]">
      <div>
        <p className="text-sm text-amber-200">{t("checkout.kicker")}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{t("checkout.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("checkout.body")}
        </p>

        <Card className="mt-8 bg-[#101218]">
          <CardHeader>
            <CardTitle>{t("checkout.billTitle")}</CardTitle>
            <CardDescription>{t("checkout.billDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t("checkout.name")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-muted-foreground">
              {t("checkout.method")}
            </div>
            <Button
              className="h-11 w-full bg-amber-300 text-zinc-950 hover:bg-amber-200"
              disabled={busy}
              onClick={confirm}
            >
              {busy ? <Loader2Icon className="animate-spin" /> : null}
              {t("checkout.pay", { amount: price.billed })}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit bg-[#14120c] ring-1 ring-amber-300/20">
        <CardHeader>
          <CardTitle>{planName}</CardTitle>
          <CardDescription>
            {cycle === "year" ? t("checkout.cycleYear") : t("checkout.cycleMonth")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-3xl font-black">¥{price.billed}</p>
          <p className="text-muted-foreground">
            {t("checkout.equiv", { monthly: price.monthly, credits: plan.credits })}
          </p>
          <ul className="space-y-2 text-muted-foreground">
            {(["f1", "f2", "f3", "f4", "f5"] as const).map((key) => (
              <li key={key}>{t(`plans.${planId}.${key}`)}</li>
            ))}
          </ul>
          <Button variant="ghost" className="px-0" nativeButton={false} render={<Link href="/pricing" />}>
            {t("checkout.back")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  return (
    <Suspense
      fallback={
        <div className="px-4 py-20 text-center text-muted-foreground">{t("preparing")}</div>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}
