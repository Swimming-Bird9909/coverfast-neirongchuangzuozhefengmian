"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MockPaymentPort } from "@/lib/billing/mock-payment";
import { PLANS, planPrice } from "@/lib/billing/plans";
import { useAppStore } from "@/lib/store";
import type { BillingCycle, PlanId } from "@/lib/types";
import { Loader2Icon } from "lucide-react";
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

  const planId = (params.get("plan") === "pro" ? "pro" : "creator") as Exclude<
    PlanId,
    "free"
  >;
  const cycle = (params.get("cycle") === "month" ? "month" : "year") as BillingCycle;
  const plan = PLANS[planId];
  const price = useMemo(() => planPrice(planId, cycle), [planId, cycle]);

  async function confirm() {
    setBusy(true);
    try {
      const session = await MockPaymentPort.createCheckout({
        userId: user.id,
        planId,
        cycle,
      });
      await MockPaymentPort.confirm(session.id);
      toast.success(`已开通${plan.name}，积分已到账`);
      router.push("/assets");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "开通失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-[1fr_360px]">
      <div>
        <p className="text-sm text-amber-200">模拟收银台</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">确认开通会员</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          这是支付适配层的第一期实现（MockPaymentPort）。确认后会在本地写入会员状态与积分，不会产生真实扣款。接口形状已按后续微信 / 支付宝 / Stripe 预留。
        </p>

        <Card className="mt-8 bg-[#101218]">
          <CardHeader>
            <CardTitle>账单信息</CardTitle>
            <CardDescription>仅用于显示在本地会员记录中</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>称呼</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-muted-foreground">
              支付方式：模拟支付（后期可替换为微信支付、支付宝或国际卡）。
            </div>
            <Button
              className="h-11 w-full bg-amber-300 text-zinc-950 hover:bg-amber-200"
              disabled={busy}
              onClick={confirm}
            >
              {busy ? <Loader2Icon className="animate-spin" /> : null}
              确认模拟支付 ¥{price.billed}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit bg-[#14120c] ring-1 ring-amber-300/20">
        <CardHeader>
          <CardTitle>{plan.name}</CardTitle>
          <CardDescription>
            {cycle === "year" ? "年付 · 已减 30%" : "月付"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-3xl font-black">¥{price.billed}</p>
          <p className="text-muted-foreground">
            折合 ¥{price.monthly}/月 · 到账 {plan.credits} 积分
          </p>
          <ul className="space-y-2 text-muted-foreground">
            {plan.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <Button variant="ghost" className="px-0" render={<Link href="/pricing" />}>
            返回改套餐
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-20 text-center text-muted-foreground">正在准备订单…</div>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}
