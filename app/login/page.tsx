"use client";

import { AuthForm } from "@/components/site/auth-form";
import { useAppStore } from "@/lib/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") || "/generate";
  const { user } = useAppStore();

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-sm font-medium text-amber-200">本地账号</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">登录或注册</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        不强制登录。没账号也能在首页生成封面；登录后页头会显示账号与积分，下载次数和会员仍按套餐计算。
      </p>
      {user.signedIn ? (
        <p className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm">
          当前已是 {user.nickname}
          {user.email ? `（${user.email}）` : ""} · 余额 {user.credits} 积分。
          也可以
          <Link href="/generate" className="mx-1 underline">
            继续生成
          </Link>
          。
        </p>
      ) : null}
      <div className="mt-8 rounded-2xl border border-white/10 bg-[#101218] p-5">
        <AuthForm next={next} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-20 text-center text-muted-foreground">正在打开登录页…</div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
