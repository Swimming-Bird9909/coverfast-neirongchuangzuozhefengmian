"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLAN_LIST, planPrice } from "@/lib/billing/plans";
import { useAppStore } from "@/lib/store";
import type { BillingCycle, PlanId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PlanGrid({ teaser = false }: { teaser?: boolean }) {
  const [cycle, setCycle] = useState<BillingCycle>("year");
  const { user } = useAppStore();
  const router = useRouter();
  const plans = teaser ? PLAN_LIST : PLAN_LIST;

  return (
    <div>
      <div className="mb-8 flex flex-col items-center gap-3">
        <div
          role="group"
          aria-label="计费周期"
          className="inline-flex items-center rounded-full border border-white/10 bg-white/4 p-1 text-sm"
        >
          <button
            type="button"
            aria-pressed={cycle === "month"}
            onClick={() => setCycle("month")}
            className={cn(
              "min-h-10 min-w-[5.5rem] rounded-full px-4 font-medium transition",
              cycle === "month"
                ? "bg-white text-zinc-950"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            按月
          </button>
          <button
            type="button"
            aria-pressed={cycle === "year"}
            onClick={() => setCycle("year")}
            className={cn(
              "flex min-h-10 min-w-[7.5rem] items-center justify-center gap-2 rounded-full px-4 font-medium transition",
              cycle === "year"
                ? "bg-amber-300 text-zinc-950"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            按年
            <Badge
              className={
                cycle === "year"
                  ? "bg-zinc-950 text-amber-200"
                  : "bg-amber-300 text-zinc-950"
              }
            >
              -30%
            </Badge>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const paid = plan.id !== "free";
          const price = paid
            ? planPrice(plan.id as Exclude<PlanId, "free">, cycle)
            : null;
          const current = user.plan === plan.id;
          const highlight = plan.id === "creator";

          return (
            <Card
              key={plan.id}
              className={
                highlight
                  ? "border-amber-300/40 bg-[#14120c] ring-1 ring-amber-300/30"
                  : "bg-[#101218]"
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {highlight ? <Badge>最受欢迎</Badge> : null}
                </CardTitle>
                <CardDescription>{plan.tagline}</CardDescription>
                <p className="pt-2 text-3xl font-black tracking-tight">
                  {price ? (
                    <>
                      ¥{price.monthly}
                      <span className="text-sm font-medium text-muted-foreground">
                        /月
                      </span>
                    </>
                  ) : (
                    "¥0"
                  )}
                </p>
                {price && cycle === "year" ? (
                  <p className="text-xs text-amber-200/80">
                    年付 ¥{price.billed}，相当于 {price.label}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {paid ? "随时可改年付享 7 折" : "每月自动重置 80 积分"}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 size-4 text-amber-300" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.id === "free" ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/generate")}
                  >
                    {current ? "当前方案" : "免费开始"}
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-amber-300 text-zinc-950 hover:bg-amber-200"
                    onClick={() =>
                      router.push(`/checkout?plan=${plan.id}&cycle=${cycle}`)
                    }
                  >
                    {current ? "管理 / 续费" : `开通${plan.name}`}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
