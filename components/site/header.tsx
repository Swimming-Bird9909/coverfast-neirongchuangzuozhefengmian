"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PLANS } from "@/lib/billing/plans";
import { signOut, useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { MenuIcon, SparklesIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/generate", label: "生成器" },
  { href: "/explore", label: "灵感广场" },
  { href: "/assets", label: "我的作品" },
  { href: "/pricing", label: "定价" },
  { href: "/about", label: "关于" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppStore();
  const plan = PLANS[user.plan];
  const loginHref = `/login?next=${encodeURIComponent(pathname || "/")}`;

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
            <DropdownMenu>
              <DropdownMenuTrigger
                className="hidden h-8 max-w-40 items-center truncate rounded-lg border border-white/12 px-2.5 text-sm sm:inline-flex"
              >
                {user.nickname}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    {user.nickname}
                    <span className="mt-0.5 block font-normal text-muted-foreground">
                      {user.email || "本地账号"} · {user.credits} 积分
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/assets")}>
                    我的作品
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/pricing")}>
                    {plan.name}套餐
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => signOut()}>退出登录</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className="hidden bg-amber-300 text-zinc-950 hover:bg-amber-200 sm:inline-flex"
              nativeButton={false}
              render={<Link href={loginHref} />}
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
                <Link href="/changelog" className="rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                  更新日志
                </Link>
                <p className="mt-3 px-3 text-xs text-muted-foreground">
                  {user.signedIn ? user.nickname : "未登录"} · {plan.name} · {user.credits} 积分
                </p>
                {user.signedIn ? (
                  <Button variant="outline" className="mt-2" onClick={() => signOut()}>
                    退出登录
                  </Button>
                ) : (
                  <Button
                    className="mt-2"
                    nativeButton={false}
                    render={<Link href={loginHref} />}
                  >
                    登录 / 注册
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
