"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PLANS } from "@/lib/billing/plans";
import { signIn, signOut, useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { MenuIcon, SparklesIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/generate", label: "生成器" },
  { href: "/explore", label: "灵感广场" },
  { href: "/assets", label: "我的作品" },
  { href: "/pricing", label: "定价" },
  { href: "/about", label: "关于" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user } = useAppStore();
  const [loginOpen, setLoginOpen] = useState(false);
  const [nickname, setNickname] = useState(user.nickname);
  const plan = PLANS[user.plan];

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#07080d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-amber-300 to-orange-500 text-[#1a0b04] shadow-[0_0_24px_rgba(251,191,36,0.35)]">
            <ZapIcon className="size-4" />
          </span>
          <span className="text-lg">
            闪封面
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              CoverFast
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground",
                pathname === item.href && "bg-white/8 text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/pricing"
            className="hidden items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-200 sm:inline-flex"
          >
            <SparklesIcon className="size-3.5" />
            {plan.name} · {user.credits} 积分
          </Link>
          {user.signedIn ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => signOut()}
            >
              {user.nickname}
            </Button>
          ) : (
            <Button
              size="sm"
              className="hidden sm:inline-flex bg-amber-300 text-zinc-950 hover:bg-amber-200"
              onClick={() => setLoginOpen(true)}
            >
              登录
            </Button>
          )}

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0b0d14]">
              <SheetHeader>
                <SheetTitle>闪封面</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-1 px-2">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}
                <p className="mt-3 px-3 text-xs text-muted-foreground">
                  {plan.name} · 余额 {user.credits} 积分
                </p>
                {user.signedIn ? (
                  <Button variant="outline" className="mt-2" onClick={() => signOut()}>
                    退出登录
                  </Button>
                ) : (
                  <Button className="mt-2" onClick={() => setLoginOpen(true)}>
                    登录
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>本地登录</DialogTitle>
            <DialogDescription>
              无需短信或第三方账号。登录只把昵称记在这台浏览器里，方便显示积分与会员。免费生成本来就不需要登录。
            </DialogDescription>
          </DialogHeader>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="怎么称呼你"
          />
          <DialogFooter>
            <Button
              className="bg-amber-300 text-zinc-950 hover:bg-amber-200"
              onClick={() => {
                signIn(nickname);
                setLoginOpen(false);
              }}
            >
              进入工作台
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
